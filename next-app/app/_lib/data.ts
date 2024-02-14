export const MIN_NAME_LENGTH = 2;
export const MAX_NAME_LENGTH = 20;

export function validateName(name: string): string | undefined {
	if (name.length < MIN_NAME_LENGTH)
		return "Must be at least " + MIN_NAME_LENGTH + " characters long";
	if (name.length > MAX_NAME_LENGTH)
		return "Must be at least " + MIN_NAME_LENGTH + " characters long";
	if (name.trim() != name)
		return "Must not have any leading or trailing whitespace"
}
