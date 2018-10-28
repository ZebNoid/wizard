(function() {
    //To access the VS Code API object. This function can only be invoked once per session.
    const vscode = acquireVsCodeApi();

    const counter = document.getElementById('lines-of-code-counter');

    // Check if we have an old state to restore from
    const previousState = vscode.getState();
    let count = previousState ? previousState.count : 0;
    counter.textContent = count;

    setInterval(() => {
        counter.textContent = count++;
        vscode.setState({ count });

        // Alert the extension when our cat introduces a bug
        if (Math.random() < 0.001 * count) {
            vscode.postMessage({
                command: 'alert',
                text: '🐛  on line ' + count
            })
        }

    }, 100);

    // Handle the message inside the webview
    window.addEventListener('message', event => {
        const message = event.data; // The JSON data our extension sent

        switch (message.command) {
            case 'refactor':
                count += 1000;
                counter.textContent = count;
                break;
        }
    });
}());
