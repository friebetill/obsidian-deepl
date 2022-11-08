import { describe, expect, it } from "vitest";
import { Processor } from "./processor";

describe("Test link processing", () => {
	describe("Preprocessed text is not equal to input text", () => {
		it("Test with one wiki link", () => {
			const processor = new Processor();
			const text = "[[test.md]]";

			const processedText = processor.preprocess(text);

			expect(text).not.toBe(processedText);
		});

		it("Test with one Markdown link.", () => {
			const processor = new Processor();
			const text = "[test](test.md)";

			const processedText = processor.preprocess(text);

			expect(text).not.toBe(processedText);
		});

		it("Test with two wiki links", () => {
			const processor = new Processor();
			const text = "[[test.md]] [[test2.md]]";

			const processedText = processor.preprocess(text);

			expect(text).not.toBe(processedText);
		});

		it("Test with one Markdown link.", () => {
			const processor = new Processor();
			const text = "[test](test.md) [test](test2.md)";

			const processedText = processor.preprocess(text);

			expect(text).not.toBe(processedText);
		});
	});

	describe("Pre- and postprocessed text equals input text", () => {
		it("Test with one wiki link", () => {
			const processor = new Processor();
			const input = "[[test.md]]";

			const processedText = processor.preprocess(input);
			const postprocessedText = processor.postprocess(processedText);

			expect(input).toBe(postprocessedText);
		});

		it("Test with one Markdown link", () => {
			const processor = new Processor();
			const input = "[test](test.md)";

			const processedText = processor.preprocess(input);
			const postprocessedText = processor.postprocess(processedText);

			expect(input).toBe(postprocessedText);
		});

		it("Test with two wiki links", () => {
			const processor = new Processor();
			const input = "[[test.md]] [[test2.md]]";

			const processedText = processor.preprocess(input);
			const postprocessedText = processor.postprocess(processedText);

			expect(input).toBe(postprocessedText);
		});

		it("Test with two Markdown link", () => {
			const processor = new Processor();
			const input = "[test](test.md) [test](test2.md)";

			const processedText = processor.preprocess(input);
			const postprocessedText = processor.postprocess(processedText);

			expect(input).toBe(postprocessedText);
		});
	});
});
