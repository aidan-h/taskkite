import { z } from "zod";

export const nameSchema = z.string().min(1).max(20).trim();
export const descriptionSchema = z.string().max(200).trim();
