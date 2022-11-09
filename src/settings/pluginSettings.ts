export interface DeepLPluginSettings {
	apiKey: string;
	fromLanguage: string;
	toLanguage: string;
	showStatusBar: boolean;
	useProAPI: boolean;
	formality: string;
}

export const formalities: Record<string, string> = {
	default: "Default",
	prefer_more: "More formal",
	prefer_less: "Less formal",
};

export const defaultSettings: Partial<DeepLPluginSettings> = {
	apiKey: "",
	fromLanguage: "AUTO",
	toLanguage: "DE",
	showStatusBar: true,
	useProAPI: false,
	formality: "default",
};
