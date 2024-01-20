const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

function activate(context) {
    let disposable = vscode.workspace.onDidChangeConfiguration(async (e) => {
        try {
            if (e.affectsConfiguration("daisyui.useClass")) {
                const isClass = vscode.workspace
                    .getConfiguration()
                    .get("daisyui.useClass");

                // Load existing snippets
                const snippetsPath = path.join(
                    context.extensionPath,
                    "./snippets/snippets.code-snippets"
                );
                const snippets = JSON.parse(
                    fs.readFileSync(snippetsPath, "utf8")
                );

                for (const snippetName in snippets) {
                    snippets[snippetName].body = snippets[snippetName].body.map(
                        (line) => {
                            // If isClass is true, replace 'className' with 'class'
                            // If isClass is false, replace 'class' with 'className'
                            return isClass
                                ? line.replace(/className=/g, "class=")
                                : line.replace(/class=/g, "className=");
                        }
                    );
                }

                // Save back the modified snippets
                fs.writeFileSync(
                    snippetsPath,
                    JSON.stringify(snippets, null, 4),
                    "utf8"
                );
                vscode.window.showInformationMessage(
                    `Snippets updated: attributes switched to '${
                        useHtmlClass ? "class" : "className"
                    }'.`
                );
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error.message}`);
        }
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
