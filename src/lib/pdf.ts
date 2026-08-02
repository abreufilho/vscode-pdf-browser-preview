/** Whether a path names a PDF, whatever case the extension is written in. */
export function isPdfPath(path: unknown): boolean {
  return typeof path === 'string' && path.toLowerCase().endsWith('.pdf');
}

/** Escapes a value written into an HTML attribute. */
export function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * The directory of a URI path, kept with its trailing slash. URI paths always
 * use forward slashes, so this holds on every platform.
 */
export function dirnamePath(path: string): string {
  return path.replace(/\/[^/]*$/, '/');
}

/**
 * Picks the document to open. A command carries its URI when invoked from the
 * Explorer, and falls back to whatever the editor or the active tab holds.
 */
export function selectPdfUri<T>(
  explicitUri: T | undefined,
  activeEditorUri: T | undefined,
  activeTabInput: { uri?: T } | undefined
): T | undefined {
  return explicitUri ?? activeEditorUri ?? activeTabInput?.uri;
}
