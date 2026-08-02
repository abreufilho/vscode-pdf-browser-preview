# Changelog

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-02

First public release.

### Added

- Custom editor for `.pdf` files, running the pdf.js viewer with search,
  outline, thumbnails, zoom and page navigation.
- Reload in place when the file changes on disk, keeping the scroll position,
  and close when it is deleted.
- The same document open in more than one editor at a time.
- Character maps and standard PDF fonts bundled, so documents that rely on them
  render without a network request.
