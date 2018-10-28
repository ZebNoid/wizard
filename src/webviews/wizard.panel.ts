'use strict';

import { 
    // WebviewPanel,
    // ExtensionContext
} from 'vscode';
import { BasePanel } from './base.panel';

export class WizardPanel extends BasePanel {

    public static readonly viewType : string = "wizardPanel";
    
    protected readonly html : string = "ui/wizard/wizard.page.html";

    protected readonly title : string = "Wizard";

    // constructor(panel : WebviewPanel, context : ExtensionContext) {
    //     super(panel, context);
    // } 

    protected destroy() {
        WizardPanel._instance = undefined;
    }

    protected _update() {
        super._update();
    }
}

