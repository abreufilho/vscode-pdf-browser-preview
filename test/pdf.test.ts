import assert from 'node:assert/strict';
import test from 'node:test';
import { dirnamePath, escapeAttribute, isPdfPath, selectPdfUri } from '../src/lib/pdf';

test('recognises a pdf path whatever case the extension is in', () => {
  assert.equal(isPdfPath('/tmp/report.PDF'), true);
  assert.equal(isPdfPath('/tmp/report.pdf'), true);
  assert.equal(isPdfPath('/tmp/report.txt'), false);
  assert.equal(isPdfPath(undefined), false);
});

test('escapes the characters that would break out of an attribute', () => {
  assert.equal(escapeAttribute('a&"<b>'), 'a&amp;&quot;&lt;b&gt;');
});

test('takes the directory of a path, keeping its trailing slash', () => {
  assert.equal(dirnamePath('/tmp/reports/file.pdf'), '/tmp/reports/');
  assert.equal(dirnamePath('/file.pdf'), '/');
});

test('takes the directory of a name that carries no extension', () => {
  assert.equal(dirnamePath('/tmp/reports/README'), '/tmp/reports/');
});

test('prefers the explicit uri, then the editor, then the active tab', () => {
  const explicit = { path: '/tmp/explicit.pdf' };
  const editor = { path: '/tmp/editor.pdf' };
  const tab = { path: '/tmp/tab.pdf' };

  assert.equal(selectPdfUri(explicit, editor, { uri: tab }), explicit);
  assert.equal(selectPdfUri(undefined, editor, { uri: tab }), editor);
  assert.equal(selectPdfUri(undefined, undefined, { uri: tab }), tab);
  assert.equal(selectPdfUri(undefined, undefined, undefined), undefined);
});
