import * as vscode from 'vscode';
import { isPdfPath, selectPdfUri } from './lib/pdf';
import { PdfEditorProvider, VIEW_TYPE } from './pdfEditor';

function openPdf(explicitUri: vscode.Uri | undefined): void {
  const activeTabInput = vscode.window.tabGroups.activeTabGroup.activeTab?.input as
    { uri?: vscode.Uri } | undefined;

  const uri = selectPdfUri(
    explicitUri,
    vscode.window.activeTextEditor?.document.uri,
    activeTabInput
  );

  if (!uri || !isPdfPath(uri.path)) {
    void vscode.window.showWarningMessage('Select a PDF file first.');
    return;
  }

  void vscode.commands.executeCommand('vscode.openWith', uri, VIEW_TYPE);
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    PdfEditorProvider.register(context),
    vscode.commands.registerCommand('pdfBrowserPreview.open', (uri?: vscode.Uri) =>
      openPdf(uri)
    )
  );
}

export function deactivate(): void {}
