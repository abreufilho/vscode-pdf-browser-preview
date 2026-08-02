# Security Policy

## Supported Versions

The latest release receives fixes. Older versions do not.

## Reporting a Vulnerability

Report privately through
[GitHub Security Advisories](https://github.com/abreufilho/vscode-pdf-browser-preview/security/advisories/new).
Please do not open a public issue for a vulnerability.

This is a personal project maintained on a best-effort basis. There is no
response time commitment. If a report needs a fix that I cannot make, I will say
so rather than leave it open.

## Scope

The extension renders PDFs the user opens. That content is untrusted, so the
preview:

- serves the webview under a Content Security Policy that reaches no origin
  beyond the webview itself;
- escapes the configuration written into the page, which is the only value the
  host injects into the markup;
- makes no network request, and ships the viewer, its fonts and its character
  maps rather than fetching them.

The policy admits inline scripts, which the vendored pdf.js viewer page carries
as part of its own markup. Serving it under a nonce would mean rewriting a page
this project does not maintain.

Parsing and rendering are delegated to pdf.js. A flaw in how it reads a document
belongs upstream, but report it here as well and I will forward it.
