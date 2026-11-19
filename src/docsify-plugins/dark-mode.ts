import { registerPlugin, type DocsifyHook } from './types';

const STORAGE_KEY = 'dark_mode';
const SWITCH_ID = 'dark_mode_switch';

function applyTheme(dark: boolean) {
  (document.getElementById('light-theme') as HTMLLinkElement).disabled = dark;
  (document.getElementById('dark-theme') as HTMLLinkElement).disabled = !dark;
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

const darkMode = (hook: DocsifyHook) => {
  hook.doneEach(() => {
    const dark = localStorage.getItem(STORAGE_KEY) === 'true';
    const darkModeSwitch = document.getElementById(SWITCH_ID) as HTMLInputElement | null;
    if (darkModeSwitch) {
      darkModeSwitch.checked = dark;
    }
    applyTheme(dark);
  });
};

registerPlugin(darkMode);
