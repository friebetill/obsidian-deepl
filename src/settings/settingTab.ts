import { PluginSettingTab, Setting } from "obsidian";
import { toLanguages } from "src/deepl/toLanguages";
import DeepLPlugin from "../main";
import { fromLanguages } from "./../deepl/fromLanguages";
import { formalities } from "./pluginSettings";

export class SettingTab extends PluginSettingTab {
	private plugin: DeepLPlugin;

	constructor(plugin: DeepLPlugin) {
		super(plugin.app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h3", {
			text: "Obsidian DeepL - Settings",
		});

		containerEl.createEl("h4", {
			text: "Commands",
		});

		new Setting(containerEl)
			.setName("Translate selection")
			.setDesc(
				'Translates the selected text from the "From language" to the "To language".'
			);

		new Setting(containerEl)
			.setName("Translate selection: to language")
			.setDesc(
				"The target language can be selected by suggestion modal. The target language can be selected by suggestion modal. The selection will be replaced by the translation."
			);

		new Setting(containerEl)
			.setName("Translate selection: From a language to another")
			.setDesc(
				"The source and target languages can be selected by suggestion modal. The target language can be selected by suggestion modal. The selection will be replaced by the translation."
			);

		new Setting(containerEl)
			.setName("Translate selection: To language and append to selection")
			.setDesc(
				"The target language can be selected by suggestion modal. The translation will be appended to the selection."
			);

		containerEl.createEl("h4", {
			text: "Language settings",
		});

		new Setting(containerEl)
			.setName("From language")
			.setDesc("The language from which to translate.")
			.addDropdown((dropdown) =>
				dropdown
					.addOptions(fromLanguages)
					.setValue(this.plugin.settings.fromLanguage)
					.onChange(async (value) => {
						this.plugin.settings.fromLanguage = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("To language")
			.setDesc("The language to translate into.")
			.addDropdown((dropdown) =>
				dropdown
					.addOptions(toLanguages)
					.setValue(this.plugin.settings.toLanguage)
					.onChange(async (value) => {
						this.plugin.settings.toLanguage = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Formality")
			.setDesc(
				"Sets whether the translated text should lean towards formal or informal language."
			)
			.addDropdown((dropdown) =>
				dropdown
					.addOptions(formalities)
					.setValue(this.plugin.settings.formality)
					.onChange(async (value) => {
						this.plugin.settings.formality = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Show setting in status bar")
			.setDesc('Select the "To language" in the status bar.')
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.showStatusBar)
					.onChange(async (value) => {
						this.plugin.settings.showStatusBar = value;
						await this.plugin.saveSettings();
					})
			);

		containerEl.createEl("h4", {
			text: "Authentication settings",
		});

		new Setting(containerEl)
			.setName("DeepL API Key")
			.setDesc("Get one for free at https://deepl.com/pro.")
			.addText((text) =>
				text
					.setPlaceholder("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xx")
					.setValue(this.plugin.settings.apiKey)
					.onChange(async (value) => {
						this.plugin.settings.apiKey = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Use DeepL Pro API")
			.setDesc("Whether to use the DeepL Pro API or the DeepL Free API.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.useProAPI)
					.onChange(async (value) => {
						this.plugin.settings.useProAPI = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
