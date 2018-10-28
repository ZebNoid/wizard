'use strict';

import { 
    ExtensionContext,
    ViewColumn,
    Uri,
    WebviewPanel,
    window,
    workspace
} from 'vscode';

export const assetsRoot = "assets";

export class BasePanel {

    public static readonly viewType : string = "basePanel";

    protected readonly html : string = "ui/wizard/base.page.html";

    protected readonly title : string = "Base Panel";

    protected static _instance? : BasePanel;

    protected readonly _panel : WebviewPanel;

    protected readonly _context : ExtensionContext;

    constructor(panel : WebviewPanel, context : ExtensionContext) {
        // console.log("create");

        this._panel = panel;
        this._context = context;

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => this.dispose(), null, this._context.subscriptions);

        // Update the content based on view changes
        this._panel.onDidChangeViewState(e => {
            //  console.log("onDidChangeViewState");
            if (this._panel.visible) {
                this._update();
            }
        }, null, this._context.subscriptions);

        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(this.receiveMessage, null, this._context.subscriptions);

        
        // Set the webview's initial html content 
        this._update();
        // const timeout = setTimeout(() => {
        //     // panel.dispose();
        //     this._update();
        //     clearTimeout(timeout);
        //     console.log("timer", timeout);
        // }, 100);
    }

    protected destroy() {
        BasePanel._instance = undefined;
    }

    protected static create(panel : WebviewPanel, context : ExtensionContext) : any {
        return new this(panel, context);
    }

    protected _update() {
        const resource = Uri.file(this.path(`${assetsRoot}/${this.html}`));
        // .with({ scheme: 'vscode-resource' });
        
        workspace.openTextDocument(resource).then((doc) => {
            console.log(`path: ${resource.path}`);

            this._panel.title = this.title;
            this._panel.webview.html = doc.getText();
        }, (err) => {
            console.error(err);
        });
    }

    public dispose() {
        this._panel.dispose();

        this.destroy();

        console.log("onDidDispose");
    }

    protected receiveMessage(message : any) {
        switch (message.command) {
            case 'alert':
                // window.showErrorMessage(message.text);
                return;
        }
    }

    public static postMessage(message : any) {
        // Send a message to the webview webview.
        // You can send any JSON serializable data.
        if (this._instance) {
            this._instance._panel.webview.postMessage(message);
        }
    }

    public static show(context : ExtensionContext) {
        const viewColumn = window.activeTextEditor ? window.activeTextEditor.viewColumn : undefined;

        // If we already have a panel, show it.
        if (this._instance && this._instance._panel) {
            // console.log("show: reveal", this._instance);
            this._instance._panel.reveal(viewColumn);
            return;
        }
        // console.log("show: create");

        // Otherwise, create a new panel.
        const panel = window.createWebviewPanel(
            this.viewType, 
            "", 
            viewColumn || ViewColumn.One, 
            {
                retainContextWhenHidden: true,
                // Enable javascript in the webview
                enableScripts: true,
                // And restriction the webview to only loading content from our extension's `media` directory.
                localResourceRoots: [
                    Uri.file(this.path(context, assetsRoot))
                ]
            }
        );
        this.revive(panel, context);
    }

    public static revive(panel : WebviewPanel, context : ExtensionContext) {
        this._instance = this.create(panel, context);
    }

    public static path(context : ExtensionContext, path : string) {
        return context.asAbsolutePath(path);
    }

    public path(path : string) {
        return this._context.asAbsolutePath(path);
    }

    public static registerSerializer(context : ExtensionContext) {
        if (window.registerWebviewPanelSerializer) {
            const that = this;

            window.registerWebviewPanelSerializer(this.viewType, {
                async deserializeWebviewPanel(webviewPanel: WebviewPanel, state: any) {
                    // console.log('Got state:', state);
                    that.revive(webviewPanel, context);
                }
            });
        }
    }

}