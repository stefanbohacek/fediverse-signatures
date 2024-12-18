const toggleDarkMode = (enabled) => {
  if (enabled) {
    document.body.setAttribute("data-bs-theme", "dark");
  } else {
    document.body.setAttribute("data-bs-theme", "light");
  }
};

export default () => {
  if (window.matchMedia) {
    toggleDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      toggleDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    });
};
