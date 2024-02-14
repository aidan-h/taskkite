import { ZodSchema } from "zod";
import { fromZodError } from "zod-validation-error";

export function validateInputValue<T>(
	schema: ZodSchema<T>,
	value: T,
) {
	const results = schema.safeParse(value);
	if (results.success) return;
	return fromZodError(results.error).toString();
}
