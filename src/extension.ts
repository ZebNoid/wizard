'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// import * as vscode from 'vscode';
import { 
    ExtensionContext,
    commands,
    window,
    // workspace
} from 'vscode';

import { WizardPanel } from './webviews/wizard.panel';
// import { BasePanel as WizardPanel} from './webviews/base.panel';


export function activate(context: ExtensionContext) {

    // console.log('Congratulations, your extension "wizard" is now active!');
    WizardPanel.registerSerializer(context);


    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let helloCmd = commands.registerCommand('wizard.sayHello', () => {
        WizardPanel.postMessage({ command: 'refactor' });
        window.showInformationMessage('Hello World!');
    });

    let wizardShowCmd = commands.registerCommand('wizard.show', () => {
        // window.showInformationMessage('wizard.show');
        WizardPanel.show(context);
    });

    context.subscriptions.push(helloCmd);
    context.subscriptions.push(wizardShowCmd);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
