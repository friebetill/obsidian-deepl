import { Menu, MenuItem } from "obsidian";
import { toLanguages } from "src/deepl/toLanguages";
import DeepLPlugin from "src/main";

export function addStatusBar(plugin: DeepLPlugin) {
	plugin.statusBar = plugin.addStatusBarItem();

	if (plugin.settings.showStatusBar === false) {
		plugin.statusBar.hide();
	}

	plugin.statusBar.addClass("statusbar-deepl");
	plugin.statusBar.addClass("mod-clickable");

	const toLanguage = toLanguages[plugin.settings.toLanguage];

	plugin.statusBar.createEl("span", { text: `🌐 ${toLanguage}` });

	plugin.statusBar.onClickEvent((e) => handleStatusBarClick(e, plugin));
}

function handleStatusBarClick(mouseEvent: MouseEvent, plugin: DeepLPlugin) {
	const menu = new Menu();

	// Remove current language from list
	const filteredToLanguages = Object.entries(toLanguages).filter(
		([key]) => key !== plugin.settings.toLanguage
	);

	for (const [key, value] of filteredToLanguages) {
		menu.addItem(function (item: MenuItem) {
			return item.setTitle(value).onClick(async () => {
				plugin.settings.toLanguage = key;
				await plugin.saveSettings();
			});
		});
	}

	menu.showAtMouseEvent(mouseEvent);
}
