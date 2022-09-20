import { url } from 'inspector';
import { text } from 'stream/consumers';
import * as vscode from 'vscode';
// eslint-disable-next-line @typescript-eslint/naming-convention
let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

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


export function deactivate() { }
