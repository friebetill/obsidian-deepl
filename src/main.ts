import { Editor, Menu, MenuItem, Notice, Plugin } from "obsidian";
import { toLanguages } from "src/deepl/toLanguages";
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
	private statusBar: HTMLElement;

	async onload() {
		await this.loadSettings();

		this.deeplService = new DeepLService(this.settings.apiKey);
		this.addSettingTab(new SettingTab(this));

		this.addStatusBar();

		this.addCommand({
			id: "deepl-translate",
			name: "Translate",
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

	addStatusBar() {
		this.statusBar = this.addStatusBarItem();

		if (this.settings.showStatusBar === false) {
			this.statusBar.hide();
		}

		this.statusBar.addClass("statusbar-deepl");
		this.statusBar.addClass("mod-clickable");

		const toLanguage = toLanguages[this.settings.toLanguage];

		this.statusBar.createEl("span", { text: `🌐 ${toLanguage}` });

		this.statusBar.onClickEvent(this.handleStatusBarClick.bind(this));
	}

	async handleStatusBarClick(mouseEvent: MouseEvent) {
		const menu = new Menu();

		// Remove current language from list
		const filteredToLanguages = Object.entries(toLanguages).filter(
			([key]) => key !== this.settings.toLanguage
		);

		for (const [key, value] of filteredToLanguages) {
			menu.addItem(
				function (item: MenuItem) {
					return item.setTitle(value).onClick(async () => {
						this.settings.toLanguage = key;
						await this.saveSettings();
					});
				}
					// Bind to access this https://bit.ly/3WpEXbs
					.bind(this)
			);
		}

		menu.showAtMouseEvent(mouseEvent);
	}
}
