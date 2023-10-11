import { App, SuggestModal } from "obsidian";
import { toLanguages } from "src/deepl/toLanguages";

export interface Language {
	code: string;
	name: string;
}

export class TranslateModal extends SuggestModal<Language> {
	languages: Language[] = Object.entries(toLanguages).map(([code, name]) => ({
		code,
		name,
	}));

	constructor(
		app: App,
		placeholder: string,
		public callback: (result: Language) => void
	) {
		super(app);
		this.setPlaceholder(placeholder);
	}

	getSuggestions(query: string): Language[] {
		if (query) {
			return this.languages.filter(
				(language) =>
					language.code.toLowerCase().includes(query.toLowerCase()) ||
					language.name.toLowerCase().includes(query.toLowerCase())
			);
		}

		return this.languages;
	}
	renderSuggestion(language: Language, el: HTMLElement) {
		el.createEl("div", { text: `${language.name} (${language.code})` });
	}
	onChooseSuggestion(language: Language) {
		this.callback(language);
	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}
