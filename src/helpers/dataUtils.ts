export function decodeHtmlEntity(str: string): string {
  const doc = new DOMParser().parseFromString(str, "text/html");
  return doc.documentElement.textContent || "";
}
