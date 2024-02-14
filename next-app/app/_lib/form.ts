import { FormikErrors } from "formik"
import { ZodSchema } from "zod"

export function validateInputValue<T, E, K extends keyof E>(schema: ZodSchema<T>, value: T, errors: FormikErrors<E>, key: K) {
	const results = schema.safeParse(value)
	if (results.success)
		return
	//@ts-ignore
	errors[key] = fromZodError(results.error).toString()
}
