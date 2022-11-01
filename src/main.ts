import { Editor, MarkdownView, Plugin } from "obsidian";

export default class DeepLPlugin extends Plugin {
	async onload() {
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
