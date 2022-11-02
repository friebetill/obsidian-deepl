import { Editor, Notice, Plugin } from "obsidian";
import { DeepLException } from "./deepl/deeplException";
import { DeepLService } from "./deepl/deeplService";
import {
	DeepLPluginSettings,
	defaultSettings,
} from "./settings/pluginSettings";
import { SettingTab } from "./settings/settingTab";

export default class DeepLPlugin extends Plugin {
	public deeplService: DeepLService;
	public settings: DeepLPluginSettings;

	async onload() {
		await this.loadSettings();

		this.deeplService = new DeepLService(this.settings.apiKey);
		this.addSettingTab(new SettingTab(this));

		this.addCommand({
			id: "deepl-translate",
			name: "Translate",
			editorCallback: async (editor: Editor) => {
				try {
					const translation = await this.deeplService.translate(
						editor.getSelection(),
						this.settings.toLanguage,
						this.settings.fromLanguage
					);
					editor.replaceSelection(translation[0].text);
				} catch (error) {
					if (error instanceof DeepLException) {
						new Notice(error.message);
					} else {
						new Notice(
							"An unknown error occured. See console for details."
						);
					}
				}
			},
		});
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			defaultSettings,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
