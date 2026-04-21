export const formatDisplayName = (name = "") => {
  const sanitized = String(name || "").trim();
  if (!sanitized) return "";

  return sanitized
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/([A-Za-z])([0-9])/g, "$1 $2")
    .replace(/([0-9])([A-Za-z])/g, "$1 $2")
    .replace(/\s{2,}/g, " ")
    .trim();
};