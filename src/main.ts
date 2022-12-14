import { Editor, Notice, Plugin } from "obsidian";
import { toLanguages } from "src/deepl/toLanguages";
import { DeepLException } from "./deepl/deeplException";
import { DeepLService } from "./deepl/deeplService";
import {
	DeepLPluginSettings,
	defaultSettings
} from "./settings/pluginSettings";
import { SettingTab } from "./settings/settingTab";
import { addStatusBar } from "./settings/statusbar";

export default class DeepLPlugin extends Plugin {
	public deeplService: DeepLService;
	public settings: DeepLPluginSettings;
	public statusBar: HTMLElement;

	async onload() {
		await this.loadSettings();

		this.deeplService = new DeepLService(this.settings);
		this.addSettingTab(new SettingTab(this));

		addStatusBar(this);

		this.addCommand({
			id: "deepl-translate-selection",
			name: "Translate selection",
			editorCallback: async (editor: Editor) => {
				if (editor.getSelection() === "") {
					return;
				}

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
						console.error(error, error.stack);
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

		if (this.settings.showStatusBar === true) {
			this.statusBar.show();
			this.statusBar.setText(
				`🌐 ${toLanguages[this.settings.toLanguage]}`
			);
		} else {
			this.statusBar.hide();
		}
	}
}
