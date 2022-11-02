import { defaultFromLanguage } from "src/deepl/fromLanguages";
import { defaultToLanguage } from "src/deepl/toLanguages";

export interface DeepLPluginSettings {
	apiKey: string;
	fromLanguage: string;
	toLanguage: string;
}

export const defaultSettings: Partial<DeepLPluginSettings> = {
	apiKey: "",
	fromLanguage: defaultFromLanguage,
	toLanguage: defaultToLanguage,
};
