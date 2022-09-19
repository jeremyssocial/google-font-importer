// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { url } from 'inspector';
import { text } from 'stream/consumers';
import * as vscode from 'vscode';
// eslint-disable-next-line @typescript-eslint/naming-convention
let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const http = new XMLHttpRequest();

	function checkUrl(url: string) {
		http.open('HEAD', url, false);
		http.send();
		if (http.status === 400) {
			return false;
		}
		return true;
	}

	function addWeights(fontName: string) {
		let useWeights = [];
		let url = "https://fonts.googleapis.com/css?family=" + fontName?.replace(" ", "+");
		for (let weight = 100; weight <= 900; weight += 100) {
			if (checkUrl(url + ":" + weight)) {
				useWeights.push(weight);
			}
			if (checkUrl(url + ":" + weight + "i")) {
				useWeights.push(weight + "i");
			}
		}
		if (useWeights.length !== 0) {
			url = url + ":";
			useWeights.forEach(weight => {
				url = url + weight + ",";
			});
			url = url.slice(0, -1);
		}
		return url;
	}

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


	let insertCommand = vscode.commands.registerCommand('googlefontimporter.importFont', () => {
		vscode.window.showInputBox().then((fontName) => {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				if (fontName) {

					let importUrl = "https://fonts.googleapis.com/css?family=" + fontName.replace(" ", "+");
					if (checkUrl(importUrl)) {
						let url = addWeights(fontName);
						editor.edit(editBuilder => {
							editBuilder.insert(editor.selection.active, "@import url('" + url + "');");
						});
					}
					else {
						vscode.window.showInformationMessage('The requested font families "' + fontName + '" are not available on Google Fonts.');
					}
				}
				else {
					vscode.window.showInformationMessage('Font name can\'t be empty');
				}

			}
		});
	});

	context.subscriptions.push(insertCommand);

}

// this method is called when your extension is deactivated
export function deactivate() { }
