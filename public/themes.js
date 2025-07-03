export function applyTheme(cssFile) {
  let themeLink = document.getElementById('theme-link');
  if (!themeLink) {
    themeLink = document.createElement('link');
    themeLink.rel = 'stylesheet';
    themeLink.id = 'theme-link';
    document.head.appendChild(themeLink);
  }
  themeLink.href = cssFile;
}
