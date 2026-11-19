/**
 * The main module for generating charts and graphs related to the bootcamp metadata.
 * @module bootcampCharts
 */

import Chart from 'chart.js/auto';
import type { TooltipItem } from 'chart.js';
import { WordCloudController, WordElement, WordCloudChart } from 'chartjs-chart-wordcloud';
import { fetchMetadata } from './read-metadata';
import { registerPlugin, type BootcampMetadata, type DocsifyHook } from './types';

// Register the wordCloud controller, element, and scale with Chart.js.
// Starting in Chart.js 3 iirc they support 'tree shaking' which means
// componenets have to be registered explicitly so bundlers like webpack
// can effectively remove unused controllers when minifying
Chart.register(WordCloudController, WordElement);

/**
 * Generates a doughnut chart displaying the breakdown of time spent on each category of exercises in the bootcamp.
 *
 * @param {string} canvasId - The ID of the canvas element to use for the chart.
 */
function generateCategoryDoughnutChart(canvasId: string, bootcampMetadata: BootcampMetadata | null) {
    if (bootcampMetadata === null) {
        return;
    }
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d')!;

    const categoryData: Record<string, number> = {};

    // Aggrigate all time spent in each category.
    for (const doc of Object.values(bootcampMetadata)) {
        if (doc.category !== undefined && doc.estReadingMinutes !== undefined) {
            // Create bucket for categories and add reading time
            if (doc.category in categoryData) {
                categoryData[doc.category] += doc.estReadingMinutes;
            } else {
                categoryData[doc.category] = doc.estReadingMinutes;
            }

            if (doc.exercises) {
                doc.exercises.forEach(exercise => {
                    if (exercise.estMinutes !== undefined) {
                        categoryData[doc.category!] += exercise.estMinutes;
                    }
                });
            }
        }
    }

    const totalTime = Object.values(categoryData).reduce((acc: number, t) => { return acc + t }, 0);

    const data = {
        labels: Object.keys(categoryData),
        datasets: [{
            label: '',
            data: Object.values(categoryData).map((t) => { return t / totalTime })
        }]
    }

    const options = {
        plugins: {
            title: {
                display: true,
                text: 'Bootcamp Breakdown by Category',
                font: {
                    family: 'Open Sans, sans-serif',
                    size: 30
                }
            },
            tooltip: {
                font: {
                    family: 'Open Sans, sans-serif',
                    size: 30
                },
                callbacks: {
                    label: (toolTip: TooltipItem<'doughnut'>) => {
                        let label = toolTip.dataset.label || '';
                        let value = parseInt(String(Number(toolTip.formattedValue) * 100)) + '%';
                        return `${label}: ${value}`
                    }
                }
            }
        }
    }

    const myChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
}

function bootcampTotals(bootcampMetadata: BootcampMetadata | null) {
    if (bootcampMetadata === null) {
        console.error("Chapter hours cannot be computed bootcampMetadata");
        return;
    }

    let totalMinutes = 0;
    for (const section of Object.values(bootcampMetadata)) {
        totalMinutes += section.estReadingMinutes ?? 0;
        if (section.exercises) {
            totalMinutes += section.exercises.reduce((acc, curTask) => {
                return acc + (curTask.estMinutes ?? 0);
            }, 0);
        }
    }

    // Populate markdown talbe
    const totalHours = Math.round(totalMinutes / 60);
    const totalWeeks = Math.ceil(totalHours / 20);

    // We target a 6 month bootcamp.
    const totalStyle = totalWeeks <= (6 * 4) ? 'green' : 'red'

    const totalHoursElement = document.getElementById('total-hours')!;
    totalHoursElement.style.color = totalStyle;
    totalHoursElement.innerText = String(totalHours);

    const totalWeeksElement = document.getElementById('total-weeks')!;
    totalWeeksElement.style.color = totalStyle;
    totalWeeksElement.innerText = String(totalWeeks);
}

function populateChapterHours(bootcampMetadata: BootcampMetadata | null) {
    if (bootcampMetadata === null) {
        console.error("Chapter hours cannot be computed bootcampMetadata");
        return;
    }
    const chapterRegex = /docs\/(.+)\/\d.+/;
    const chaptersTotalMinutes: Record<string, number> = {};


    for (let [k, v] of Object.entries(bootcampMetadata)) {

        // Aggrigate the total time for this section of the bootcamp
        let sectionTotalMinutes = v['estReadingMinutes'] || 0;
        // Add exercise estimates to section total time
        if (v.exercises) {
            sectionTotalMinutes += v.exercises.reduce((acc, currentValue) => {
                return acc + (currentValue.estMinutes ?? 0);
            }, 0);
        }

        // Extract the chapter we are looping through
        const match = k.match(chapterRegex);
        const chapter = match![1];

        // Aggrigate total minutes of a chapter
        if (chapter in chaptersTotalMinutes) {
            chaptersTotalMinutes[chapter] += sectionTotalMinutes;
        } else {
            chaptersTotalMinutes[chapter] = sectionTotalMinutes;
        }
    }

    // At this point we have a dictionary of chapter names (that is assmed to match id's of the inner paragraphs of the markdown table on the _stats page)
    // and the total number of minutes of exercises and reading in that chapter. Next we will populate the markdown table with hours.
    for (const [k, v] of Object.entries(chaptersTotalMinutes)) {
        const hours = Math.round(v / 60);
        document.getElementById(k)!.innerText = String(hours);
        document.getElementById(`${k}-weeks`)!.innerText = String(Math.ceil(hours / 20));
    }
}

function generateWordCloud(canvasId: string, bootcampMetadata: BootcampMetadata | null) {
    if (bootcampMetadata === null) {
        return;
    }
    const techCount: Record<string, number> = {};

    // max and min display sizes for each entry of the wordcloud
    const minSize = 15;
    const maxSize = 90;

    for (const doc of Object.values(bootcampMetadata)) {
        // Currently we only support exercise level technologies
        // So if we dont have exercises move on
        if (!doc.exercises) {
            continue;
        }
        for (const exercise of doc.exercises) {
            if (!exercise.technologies) {
                continue;
            }

            for (const technology of exercise.technologies) {
                techCount[technology] = technology in techCount ? techCount[technology] + 1 : 1;
            }
        }
    }

    // normalize all our points to fit the given range
    const values = Object.values(techCount);
    const oMin = Math.min(...values); // original min
    const oMax = Math.max(...values); // original max
    for (const [key, value] of Object.entries(techCount)) {
        const x = value;
        // apply formula to normalize each value
        techCount[key] = (maxSize - minSize) * ((x - oMin)/(oMax - oMin)) + minSize;
    }

    const data = {
        labels: Object.keys(techCount),
        datasets: [
            {
                data: Object.values(techCount)
            }
        ]
    }

    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

    canvas.width = 400;
    canvas.height = 500;
    const ctx = canvas.getContext('2d')!;
    new WordCloudChart(ctx, {
        data: data,
        options: {
            color: "#24ae1dff",
            plugins: {
                // disabling tooltip-- it displayed the arbitrary number associated with
                // each entry's size
                tooltip: {
                    enabled: false
                },
                legend: {
                    display: false
                }
            }
        },
    });
}

// This should be filled by the before each hook
let bootcampMetadata: BootcampMetadata | null = null;


// Register chart generate on root document only after HTML has been appended to the DOM
// Docsify custom plugin boilerplate found https://docsify.js.org/#/write-a-plugin?id=template
(async function () {
    const generateCharts = (hook: DocsifyHook) => {

        // Invoked on each page load before new markdown is transformed to HTML.
        hook.beforeEach(async function (markdown, next) {
            // This could add a request to every page if bootcampMetadata is not found in local storage
            // might want to target just pages that will need this object but as a first pass doing it
            // everywhere
            try {
                bootcampMetadata = await fetchMetadata();
            } catch (error) {
                console.error(error);
            } finally {
                next(markdown);
            }
        });

        // Invoked on each page load before new markdown is transformed to HTML.
        hook.doneEach(() => {
            switch (window.location.hash) {
                case '#/':
                    generateCategoryDoughnutChart('category-doughnut-canvas', bootcampMetadata);
                    generateWordCloud('technology-word-cloud', bootcampMetadata);
                    break;
                case '#/_stats':
                    populateChapterHours(bootcampMetadata);
                    bootcampTotals(bootcampMetadata);
                    break;
                default:
                    break;
            }
        });
    };

    // Add plugin to docsify's plugin array
    registerPlugin(generateCharts);
})();
