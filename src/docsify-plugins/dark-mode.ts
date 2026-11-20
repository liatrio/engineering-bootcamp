import { type DocsifyHook, registerPlugin } from './types';

const STORAGE_KEY = 'dark_mode';
const SWITCH_ID = 'dark_mode_switch';
const DARK_SHEET_ID = 'dark-theme';

// Visitors who never used the switch get their operating system's setting.
function isDark() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === null ? window.matchMedia('(prefers-color-scheme: dark)').matches : stored === 'true';
}

// core-dark.css sets its variables on :root unconditionally, so the sheet is
// switched on and off through its media attribute. css/common.css reads
// `data-theme` for the rules that differ between modes.
function applyTheme(dark: boolean) {
  const sheet = document.getElementById(DARK_SHEET_ID) as HTMLLinkElement;
  sheet.media = dark ? 'all' : 'not all';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
}

// The switch lives in the sidebar, which Docsify re-renders, so listen on the
// document once instead of binding to the switch on every page.
document.addEventListener('change', (event) => {
  const target = event.target as HTMLElement;
  if (target.id !== SWITCH_ID) {
    return;
  }
  const dark = (target as HTMLInputElement).checked;
  applyTheme(dark);
  localStorage.setItem(STORAGE_KEY, dark ? 'true' : 'false');
});

// Apply the saved theme as soon as the bundle runs, before Docsify renders.
applyTheme(isDark());

const darkMode = (hook: DocsifyHook) => {
  hook.doneEach(() => {
    const darkModeSwitch = document.getElementById(SWITCH_ID) as HTMLInputElement | null;
    if (darkModeSwitch) {
      darkModeSwitch.checked = isDark();
    }
  });
};

registerPlugin(darkMode);
