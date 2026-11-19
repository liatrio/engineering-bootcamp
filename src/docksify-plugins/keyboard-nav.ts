// Left and right arrow keys follow the pagination links, which are absent on
// the first and last page.
document.addEventListener('keydown', (event) => {
  if (document.activeElement?.nodeName === 'INPUT') {
    return;
  }
  const className =
    event.key === 'ArrowLeft'
      ? 'pagination-item--previous'
      : event.key === 'ArrowRight'
        ? 'pagination-item--next'
        : null;
  if (className === null) {
    return;
  }
  const link = document.getElementsByClassName(className)[0]?.firstElementChild;
  if (link instanceof HTMLElement) {
    link.click();
  }
});
