import { readFileSync } from 'node:fs';
import * as vscode from 'vscode';
import { dirnamePath, escapeAttribute } from './lib/pdf';

export const VIEW_TYPE = 'pdf-browser-preview.editor';

/** How the viewer opens a document, before the user changes anything. */
const DEFAULTS = {
  cursor: 'select',
  scale: 'auto',
  sidebar: false,
  scrollMode: 'vertical',
  spreadMode: 'none',
};

export class PdfEditorProvider implements vscode.CustomReadonlyEditorProvider {
  constructor(private readonly extensionUri: vscode.Uri) {}

  openCustomDocument(uri: vscode.Uri): vscode.CustomDocument {
    return { uri, dispose: () => undefined };
  }

  resolveCustomEditor(
    document: vscode.CustomDocument,
    webviewPanel: vscode.WebviewPanel
  ): void {
    this.watchSource(document.uri, webviewPanel);

    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        document.uri.with({ path: dirnamePath(document.uri.path) }),
        vscode.Uri.joinPath(this.extensionUri, 'dist'),
      ],
    };
    webviewPanel.webview.html = this.viewerHtml(webviewPanel.webview, document.uri);
  }

  private watchSource(uri: vscode.Uri, webviewPanel: vscode.WebviewPanel): void {
    if (uri.scheme !== 'file') return;

    const pattern = new vscode.RelativePattern(
      uri.with({ path: dirnamePath(uri.path) }),
      uri.path.split('/').pop() ?? ''
    );
    const watcher = vscode.workspace.createFileSystemWatcher(pattern);

    watcher.onDidChange(() => void webviewPanel.webview.postMessage({ type: 'reload' }));
    watcher.onDidDelete(() => webviewPanel.dispose());
    webviewPanel.onDidDispose(() => watcher.dispose());
  }

  private resource(webview: vscode.Webview, ...segments: string[]): string {
    return webview
      .asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'dist', 'pdfjs-viewer', ...segments))
      .toString();
  }

  /**
   * Rewrites the vendored viewer page so its assets resolve through the webview
   * and the document to open travels in a config attribute. The page is patched
   * rather than rewritten, so upgrading pdf.js stays a matter of replacing the
   * vendored tree.
   */
  private viewerHtml(webview: vscode.Webview, uri: vscode.Uri): string {
    const source = webview.cspSource;
    const config = {
      cMapUrl: `${this.resource(webview, 'web', 'cmaps')}/`,
      standardFontDataUrl: `${this.resource(webview, 'web', 'standard_fonts')}/`,
      path: webview.asWebviewUri(uri).toString(),
      defaults: DEFAULTS,
    };

    // The vendored viewer carries inline scripts of its own, which is why
    // script-src admits them; no origin beyond the webview is reachable.
    const csp = [
      "default-src 'none'",
      `connect-src ${source}`,
      `script-src 'unsafe-inline' ${source}`,
      `worker-src ${source} blob:`,
      `style-src 'unsafe-inline' ${source}`,
      `img-src blob: data: ${source}`,
      `font-src ${source} data:`,
    ].join('; ');

    const page = vscode.Uri.joinPath(
      this.extensionUri,
      'dist',
      'pdfjs-viewer',
      'web',
      'viewer.html'
    ).fsPath;

    return readFileSync(page, 'utf8')
      .replace(
        '<title>PDF.js viewer</title>',
        `<meta http-equiv="Content-Security-Policy" content="${csp};">
    <meta id="pdf-preview-config" data-config="${escapeAttribute(JSON.stringify(config))}">
    <title>PDF.js viewer</title>`
      )
      .replace(
        '<link rel="stylesheet" href="viewer.css">',
        `<link rel="stylesheet" href="${this.resource(webview, 'web', 'viewer.css')}">
    <link rel="stylesheet" href="${this.resource(webview, 'pdf.css')}">`
      )
      .replace(
        '<link rel="resource" type="application/l10n" href="locale/locale.properties">',
        `<link rel="resource" type="application/l10n" href="${this.resource(webview, 'web', 'locale', 'locale.properties')}">`
      )
      .replace(
        '<script src="../build/pdf.js"></script>',
        `<script src="${this.resource(webview, 'build', 'pdf.js')}"></script>
    <script src="${this.resource(webview, 'build', 'pdf.worker.js')}"></script>`
      )
      .replace(
        '<script src="viewer.js"></script>',
        `<script src="${this.resource(webview, 'web', 'viewer.js')}"></script>
    <script src="${this.resource(webview, 'main.js')}"></script>`
      );
  }

  static register(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.window.registerCustomEditorProvider(
      VIEW_TYPE,
      new PdfEditorProvider(context.extensionUri),
      {
        supportsMultipleEditorsPerDocument: true,
        webviewOptions: { retainContextWhenHidden: true },
      }
    );
  }
}
