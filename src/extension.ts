// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { text } from 'stream/consumers';
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "googlefontimporter" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('googlefontimporter.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from googleFontImporter!');
	});

	context.subscriptions.push(disposable);


	let insertCommand = vscode.commands.registerCommand('googlefontimporter.testInsert', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			editor.edit(editBuilder => {
				editBuilder.insert(editor.selection.active, "@import url('https://fonts.googleapis.com/css2?family=Roboto');");
			});
		}
	});

	context.subscriptions.push(insertCommand);
}

// this method is called when your extension is deactivated
export function deactivate() { }
