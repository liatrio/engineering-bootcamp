import Chart from 'chart.js/auto';
import type { TooltipItem } from 'chart.js';
import { WordCloudController, WordElement, WordCloudChart } from 'chartjs-chart-wordcloud';
import { fetchMetadata } from './read-metadata';
import { registerPlugin, type BootcampMetadata, type DocsifyHook, type SectionMetadata } from './types';

Chart.register(WordCloudController, WordElement);

function sectionMinutes(section: SectionMetadata): number {
    const exerciseMinutes = (section.exercises ?? []).reduce((acc, exercise) => acc + (exercise.estMinutes ?? 0), 0);
    return (section.estReadingMinutes ?? 0) + exerciseMinutes;
}

function generateCategoryDoughnutChart(canvasId: string, bootcampMetadata: BootcampMetadata | null) {
    if (bootcampMetadata === null) {
        return;
    }
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d')!;

    const categoryData: Record<string, number> = {};

    for (const section of Object.values(bootcampMetadata)) {
        if (section.category !== undefined && section.estReadingMinutes !== undefined) {
            categoryData[section.category] = (categoryData[section.category] ?? 0) + sectionMinutes(section);
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

    new Chart(ctx, {
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

    const totalMinutes = Object.values(bootcampMetadata).reduce((acc, section) => acc + sectionMinutes(section), 0);
    const totalHours = Math.round(totalMinutes / 60);
    const totalWeeks = Math.ceil(totalHours / 20);

    // The bootcamp targets 6 months.
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

    for (const [path, section] of Object.entries(bootcampMetadata)) {
        const chapter = path.match(chapterRegex)![1];
        chaptersTotalMinutes[chapter] = (chaptersTotalMinutes[chapter] ?? 0) + sectionMinutes(section);
    }

    // Chapter names match the ids of the paragraphs in the table on the _stats page.
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

    const minSize = 15;
    const maxSize = 90;

    for (const doc of Object.values(bootcampMetadata)) {
        for (const exercise of doc.exercises ?? []) {
            for (const technology of exercise.technologies ?? []) {
                techCount[technology] = (techCount[technology] ?? 0) + 1;
            }
        }
    }

    const values = Object.values(techCount);
    const oMin = Math.min(...values);
    const oMax = Math.max(...values);
    for (const [key, value] of Object.entries(techCount)) {
        techCount[key] = (maxSize - minSize) * ((value - oMin) / (oMax - oMin)) + minSize;
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
                // The tooltip would show the normalized size, not a count.
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

let bootcampMetadata: BootcampMetadata | null = null;

const generateCharts = (hook: DocsifyHook) => {
    hook.beforeEach(async (markdown, next) => {
        bootcampMetadata = await fetchMetadata();
        next(markdown);
    });

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
        }
    });
};

registerPlugin(generateCharts);
