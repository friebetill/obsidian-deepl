export class Processor {
	private uniqueIDToLinkText: Record<string, string> = {};

	preprocess(text: string) {
		let processedString = text;

		processedString = this.preprocessLinks(processedString);

		return processedString;
	}

	postprocess(text: string) {
		let processedString = text;

		processedString = this.postprocessLinks(processedString);

		return processedString;
	}

	// Handle all links, see https://bit.ly/3EbQB2C
	private preprocessLinks(text: string) {
		let processedText = text;
		this.uniqueIDToLinkText = {};

		// Find all Wikilinks, e.g. [[My Link]]
		const wikiLinkMatches = processedText.matchAll(/\[\[([^\]]+)\]\]/g);

		// Find all Markdown-style links, e.g. [My Link](My Link.md)
		const markdownLinkMatches = processedText.matchAll(
			/(?:__|[*#])|\[.*?\]\((.*?)\)/g
		);

		const matches = [
			...(wikiLinkMatches || []),
			...(markdownLinkMatches || []),
		];

		for (const match of matches) {
			const uniqueString = this.generateUniqueString();
			this.uniqueIDToLinkText[uniqueString] = match[1];
			console.log(this.uniqueIDToLinkText);

			processedText = processedText.replace(match[1], uniqueString);
		}

		return processedText;
	}

	private postprocessLinks(text: string) {
		let processedText = text;

		for (const [uniqueString, linkText] of Object.entries(
			this.uniqueIDToLinkText
		)) {
			processedText = processedText.replace(uniqueString, linkText);
		}

		return processedText;
	}

	private generateUniqueString(): string {
		let uniqueString = "";
		const length = 16;
		const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		for (let i = 0; i < length; i++) {
			uniqueString += characters.charAt(
				Math.floor(Math.random() * characters.length)
			);
		}

		if (uniqueString in this.uniqueIDToLinkText) {
			return this.generateUniqueString();
		}
		return uniqueString;
	}
}
