import { DeepLErrorCodes } from "./deeplErrorCodes";

export class DeepLException extends Error {
	public readonly code: DeepLErrorCodes;

	constructor(code: DeepLErrorCodes) {
		super();
		this.code = code;
	}

	public static createFromStatusCode(
		statusCode: number,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		originalError: any
	) {
		const exception = new DeepLException(statusCode);
		exception.name = DeepLException.name;
		switch (statusCode) {
			case DeepLErrorCodes.FORBIDDEN:
				exception.message =
					"Authentication failed. Please check your DeepL API key in the settings. Make sure you use the correct API free or pro.";
				break;

			case DeepLErrorCodes.PAYLOAD_TOO_LARGE:
				exception.message = "Please try again with a shorter text";
				break;

			case DeepLErrorCodes.TOO_MANY_REQUEST:
				exception.message =
					"You have done too many translations recently. Please try again later.";
				break;

			case DeepLErrorCodes.QUOTA_EXCEEDED:
				exception.message =
					"The translation limit of your account has been reached. Consider upgrading your subscription.";
				break;

			default:
				exception.message =
					"An unknown error occured. See console for more details.";
				console.error(originalError, originalError.stack);
				break;
		}
		return exception;
	}
}
