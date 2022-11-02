import { request } from "obsidian";
import { Translation } from "src/data/translation";
import { DeepLException } from "./deeplException";

export class DeepLService {
	private apiKey: string;

	public constructor(apiKey: string) {
		this.apiKey = apiKey;
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
			const useFromLanguage =
				fromLanguage != null && fromLanguage != "AUTO";

			const response = await request({
				url: "https://api-free.deepl.com/v2/translate",
				method: "POST",
				contentType: "application/x-www-form-urlencoded",
				body: new URLSearchParams({
					text: text,
					target_lang: toLanguage,
					...(useFromLanguage && { source_lang: fromLanguage }),
				}).toString(),
				headers: { Authorization: `DeepL-Auth-Key ${this.apiKey}` },
				throw: true,
			});

			const parsedResponse = JSON.parse(response);
			const translations: Translation[] = parsedResponse.translations;
			return translations;
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
