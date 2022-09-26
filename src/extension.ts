import { url } from 'inspector';
import { text } from 'stream/consumers';
import * as vscode from 'vscode';
import axios from 'axios';
import { ConsoleReporter } from '@vscode/test-electron';

export async function activate(context: vscode.ExtensionContext) {
  let jsonLocation: string = vscode.workspace.getConfiguration('google-font-importer')['json-url'];
  let fontsLocation: string = vscode.workspace.getConfiguration('google-font-importer')['import-url'];
  let sliceJsonStringStart: number = vscode.workspace.getConfiguration('google-font-importer')['slice-json-string-start'];

  let jsonData: string | object = (await axios.get(jsonLocation)).data;
  //if the data from your url is not in json format, you can use the JSON.parse() function to convert it to json
  let fontJson = typeof jsonData === 'string' ? JSON.parse(jsonData.slice(sliceJsonStringStart || 0)) : jsonData;
  let fontObjects = {};
  //@ts-ignore
  fontJson.forEach((item) => {
    let variants: string[] = [];
    //@ts-ignore
    item.variants.forEach((variant) => {
      if (variant === 'italic') {
        variants.push('400i');
      } else if (variant.endsWith('italic')) {
        variants.push(variant.slice(0, -5));
      } else if (variant === 'regular') {
        variants.push('400');
      } else {
        variants.push(variant);
      }
    });
    //@ts-ignore
    fontObjects[item.id] = [item.family.replace(' ', '+'), variants];
  });

  let importFontCommand = vscode.commands.registerCommand('google-font-importer.importFont', () => {
    vscode.window.showInputBox().then((fontName) => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        if (fontName) {
          //@ts-ignore
          let fontObject = fontObjects[fontName.toLowerCase().replace(' ', '-')];
          if (fontObject) {
            let url = fontsLocation + fontObject[0] + ':' + fontObject[1].join(',');
            //@ts-ignore
            editor.edit((editBuilder) => {
              editBuilder.insert(editor.selection.active, "@import url('" + url + "');");
            });
          } else {
            vscode.window.showInformationMessage('The requested font families "' + fontName + '" are not available on Google Fonts.');
          }
        } else {
          vscode.window.showInformationMessage("Font name can't be empty");
        }
      }
    });
  });

  context.subscriptions.push(importFontCommand);
}

export function deactivate() {}
