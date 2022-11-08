import { request } from "obsidian";
import { Translation } from "src/data/translation";
import { DeepLException } from "./deeplException";
import { Processor } from "./processor";

export class DeepLService {
	private apiKey: string;
	private processor: Processor;

	public constructor(apiKey: string) {
		this.apiKey = apiKey;
		this.processor = new Processor();
	}

	public setApiKey(apiKey: string) {
		this.apiKey = apiKey;
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

			const response = await request({
				url: "https://api-free.deepl.com/v2/translate",
				method: "POST",
				contentType: "application/x-www-form-urlencoded",
				body: new URLSearchParams({
					text: preprocessedText,
					target_lang: toLanguage,
					...(useFromLanguage && { source_lang: fromLanguage }),
				}).toString(),
				headers: { Authorization: `DeepL-Auth-Key ${this.apiKey}` },
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
				// Fails if message contains more than one three character number
				const statusCodeRegExp = new RegExp("[0-9][0-9][0-9]");

				statusCode =
					Number(statusCodeRegExp.exec(error.message)?.[0]) ??
					statusCode;
			}

			throw DeepLException.createFromStatusCode(statusCode, error);
		}
	}
}
