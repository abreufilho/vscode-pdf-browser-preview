# PDF Preview

[![CI](https://github.com/abreufilho/vscode-pdf-browser-preview/actions/workflows/ci.yml/badge.svg)](https://github.com/abreufilho/vscode-pdf-browser-preview/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/abreufilho/vscode-pdf-browser-preview?color=blue)](https://github.com/abreufilho/vscode-pdf-browser-preview/releases/latest)
[![License](https://img.shields.io/github/license/abreufilho/vscode-pdf-browser-preview?color=blue)](LICENSE)

Read `.pdf` files inside VS Code instead of switching to another application.
The document opens in a custom editor with the pdf.js viewer: search, outline,
thumbnails, zoom and page navigation.

Rendering happens locally. The viewer, its fonts and its character maps ship
inside the extension, so no document is uploaded and no network request is made.

## Requirements

VS Code 1.80 or later.

## Installation

Download the `.vsix` from the [latest release](https://github.com/abreufilho/vscode-pdf-browser-preview/releases/latest)
and install it:

```bash
code --install-extension pdf-browser-preview-<version>.vsix
```

## Usage

Open a `.pdf` file from the Explorer. VS Code routes it to the preview
automatically. From elsewhere, run **PDF: Open Preview** from the Command
Palette.

Editing the file outside the editor reloads the preview and keeps the scroll
position; deleting it closes the panel. The same document can be open in more
than one editor at a time.

## Features

- Full pdf.js viewer: text search, outline, thumbnails, zoom, rotation and page
  navigation.
- Reloads in place when the file changes on disk, without losing your place.
- Renders documents that rely on CJK character maps or on the standard PDF
  fonts, both of which ship with the extension.

## Privacy

Reading and rendering are local. The extension performs no network requests and
collects no telemetry.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) for the local setup and the checks that
run before a pull request. Participation follows the
[Code of Conduct](CODE_OF_CONDUCT.md). To report a vulnerability, see the
[security policy](SECURITY.md).

## Third-Party

The renderer is [pdf.js](https://github.com/mozilla/pdf.js), vendored under
`src/pdfjs-viewer/`, and the way it is wired into a webview follows
[vscode-pdfviewer](https://github.com/tomoki1207/vscode-pdfviewer). The
substitutes for the standard PDF fonts are the Foxit set from PDFium and
Liberation Sans.

Those are binary and minified files, which carry no licence comment a bundler
could collect, so every licence is reproduced in full in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## License

[MIT](LICENSE) © [Antonio Abreu Filho](https://abreufilho.com.br)
