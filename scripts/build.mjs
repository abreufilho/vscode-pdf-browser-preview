// Assembles what ships in the VSIX:
//   extension.js          bundled host code
//   dist/pdfjs-viewer/    the vendored pdf.js viewer, copied as it is
import { cp, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');

await rm(dist, { recursive: true, force: true });
await rm(resolve(root, 'extension.js'), { force: true });

// Host: runs in the extension process, with vscode provided by the editor.
await build({
  entryPoints: [resolve(root, 'src/extension.ts')],
  outfile: resolve(root, 'extension.js'),
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'cjs',
  external: ['vscode'],
  legalComments: 'eof',
});

// The viewer is a prebuilt application, loaded by the webview as a page. It is
// copied rather than bundled, so upgrading it means replacing the tree.
await cp(resolve(root, 'src/pdfjs-viewer'), resolve(dist, 'pdfjs-viewer'), { recursive: true });

console.log('build: extension.js, dist/pdfjs-viewer');
