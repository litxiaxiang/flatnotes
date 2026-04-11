export function getToastOptions(description, title, severity) {
  return {
    summary: title,
    detail: description,
    severity: severity,
    closable: false,
    life: 5000,
  };
}

const themeModeStorageKey = "themeMode";
const darkThemeStorageKey = "darkTheme";
const darkThemeMediaQuery = "(prefers-color-scheme: dark)";
const lightThemeColor = "#F8A66B";
const darkThemeColor = "#22262C";

export const themeModes = {
  system: "system",
  light: "light",
  dark: "dark",
};

function updateThemeColor(isDarkTheme) {
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  if (themeColorMeta) {
    themeColorMeta.setAttribute(
      "content",
      isDarkTheme ? darkThemeColor : lightThemeColor,
    );
  }
}

function applyTheme(isDarkTheme) {
  document.body.classList.toggle("dark", isDarkTheme);
  updateThemeColor(isDarkTheme);
}

function persistThemeMode(themeMode) {
  if (themeMode === themeModes.system) {
    localStorage.removeItem(themeModeStorageKey);
  } else {
    localStorage.setItem(themeModeStorageKey, themeMode);
  }

  localStorage.removeItem(darkThemeStorageKey);
}

function getStoredThemeMode() {
  const storedThemeMode = localStorage.getItem(themeModeStorageKey);

  if (Object.values(themeModes).includes(storedThemeMode)) {
    return storedThemeMode;
  }

  const legacyDarkTheme = localStorage.getItem(darkThemeStorageKey);

  if (legacyDarkTheme === "true") {
    return themeModes.dark;
  }

  if (legacyDarkTheme === "false") {
    return themeModes.light;
  }

  return null;
}

function isSystemDarkTheme() {
  return window.matchMedia(darkThemeMediaQuery).matches;
}

export function getThemeMode() {
  return getStoredThemeMode() ?? themeModes.system;
}

export function setThemeMode(themeMode) {
  persistThemeMode(themeMode);

  if (themeMode === themeModes.dark) {
    applyTheme(true);
  } else if (themeMode === themeModes.light) {
    applyTheme(false);
  } else {
    applyTheme(isSystemDarkTheme());
  }
}

export function setDarkThemeOn(save = true) {
  if (save) {
    persistThemeMode(themeModes.dark);
  }

  applyTheme(true);
}

export function setDarkThemeOff(save = true) {
  if (save) {
    persistThemeMode(themeModes.light);
  }

  applyTheme(false);
}

export function setSystemTheme(save = true) {
  if (save) {
    persistThemeMode(themeModes.system);
  }

  applyTheme(isSystemDarkTheme());
}

export function toggleTheme() {
  (getThemeMode() === themeModes.dark ||
    (getThemeMode() === themeModes.system && isSystemDarkTheme()))
    ? setDarkThemeOff()
    : setDarkThemeOn();
}

export function loadTheme() {
  const themeMode = getThemeMode();

  if (themeMode === themeModes.dark) {
    setDarkThemeOn();
  } else if (themeMode === themeModes.light) {
    setDarkThemeOff();
  } else {
    setSystemTheme(false);
  }

  const mediaQueryList = window.matchMedia(darkThemeMediaQuery);
  const syncWithSystemTheme = (event) => {
    if (getThemeMode() === themeModes.system) {
      applyTheme(event.matches);
    }
  };

  if (typeof mediaQueryList.addEventListener === "function") {
    mediaQueryList.addEventListener("change", syncWithSystemTheme);
    return () => mediaQueryList.removeEventListener("change", syncWithSystemTheme);
  }

  mediaQueryList.addListener(syncWithSystemTheme);
  return () => mediaQueryList.removeListener(syncWithSystemTheme);
}
