import { Editor, MarkdownView, Plugin } from "obsidian";

export default class MyPlugin extends Plugin {
	async onload() {
		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "deepl-translate",
			name: "Translate",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection("Translation");
			},
		});
	}
}
