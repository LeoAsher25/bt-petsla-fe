export const getLocalStorage = (key: string): any => {
  try {
    return JSON.parse(localStorage.getItem(key) || "");
  } catch {
    return localStorage.getItem(key);
  }
};

export const setLocalStorage = (key: string, value: any): void => {
  if (typeof value === "string") return localStorage.setItem(key, value);
  return localStorage.setItem(key, JSON.stringify(value));
};

export const removeLocalStorage = (key: string): void => {
  return localStorage.removeItem(key);
};
