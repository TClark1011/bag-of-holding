import { defaultFieldLength } from "$root/constants";
import * as yup from "yup";

export const descriptionLength = 400;
export const referenceLength = 100;

const itemValidation = yup.object({
	name: yup.string().required().max(defaultFieldLength),
	category: yup.string().max(defaultFieldLength).nullable(),
	description: yup.string().max(descriptionLength).nullable(),
	quantity: yup.number().min(1).required(),
	weight: yup.number().min(0).required(),
	value: yup.number().min(0).required(),
	carriedByCharacterId: yup.string().label("carried by").nullable(),
	referenceLink: yup.string().max(referenceLength).nullable(),
});

export default itemValidation;
