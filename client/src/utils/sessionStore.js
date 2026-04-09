const readJson = (storage, key) => {
  try {
    const raw = storage?.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const writeJson = (storage, key, value) => {
  try {
    storage?.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.log(err);
  }
};

const removeKey = (storage, key) => {
  try {
    storage?.removeItem(key);
  } catch (err) {
    console.log(err);
  }
};

const getScopedSession = (key) => {
  if (typeof window === "undefined") return null;

  const scopedValue = readJson(window.sessionStorage, key);
  if (scopedValue) return scopedValue;

  const legacyValue = readJson(window.localStorage, key);
  if (legacyValue) {
    writeJson(window.sessionStorage, key, legacyValue);
    removeKey(window.localStorage, key);
  }

  return legacyValue;
};

const setScopedSession = (key, value) => {
  if (typeof window === "undefined") return;

  writeJson(window.sessionStorage, key, value);
  removeKey(window.localStorage, key);
};

const clearScopedSession = (key) => {
  if (typeof window === "undefined") return;

  removeKey(window.sessionStorage, key);
  removeKey(window.localStorage, key);
};

export const getStudentSession = () => getScopedSession("studentProfile");
export const setStudentSessionStorage = (value) =>
  setScopedSession("studentProfile", value);
export const clearStudentSession = () => clearScopedSession("studentProfile");

export const getCompanySession = () => getScopedSession("companySession");
export const setCompanySessionStorage = (value) =>
  setScopedSession("companySession", value);
export const clearCompanySession = () => clearScopedSession("companySession");
