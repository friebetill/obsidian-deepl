import { request } from "obsidian";
import { Translation } from "src/data/translation";
import { DeepLPluginSettings } from "./../settings/pluginSettings";
import { DeepLException } from "./deeplException";
import { Processor } from "./processor";

const deeplFreeAPI = "https://api-free.deepl.com/v2";
const deeplProAPI = "https://api.deepl.com/v2";

export class DeepLService {
	private settings: DeepLPluginSettings;
	private processor: Processor;

	public constructor(settings: DeepLPluginSettings) {
		this.settings = settings;
		this.processor = new Processor();
	}

	public async translate(
		text: string,
		toLanguage: string,
		fromLanguage?: string
	): Promise<Translation[]> {
		try {
			const preprocessedText = this.processor.preprocess(text);

			const useFromLanguage =
				fromLanguage != null && fromLanguage != "AUTO";

			const api = this.settings.useProAPI ? deeplProAPI : deeplFreeAPI;

			const response = await request({
				url: `${api}/translate`,
				method: "POST",
				contentType: "application/x-www-form-urlencoded",
				body: new URLSearchParams({
					text: preprocessedText,
					target_lang: toLanguage,
					...(useFromLanguage && { source_lang: fromLanguage }),
				}).toString(),
				headers: {
					Authorization: `DeepL-Auth-Key ${this.settings.apiKey}`,
				},
				throw: true,
			});

			const parsedResponse = JSON.parse(response);
			const translations: Translation[] = parsedResponse.translations;

			return translations.map((translation) => {
				return {
					text: this.processor.postprocess(translation.text),
					detected_source_language:
						translation.detected_source_language,
				};
			});
		} catch (error) {
			let statusCode = 500;

			if (error instanceof Error) {
				statusCode =
					Number(error.message.match("[0-9]{3}")?.[0]) ?? statusCode;
			}

			throw DeepLException.createFromStatusCode(statusCode, error);
		}
	}
}
