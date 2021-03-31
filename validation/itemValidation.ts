import * as yup from "yup";

const itemValidation = yup.object({
	name: yup.string().required(),
	category: yup.string(),
	description: yup.string(),
	quantity: yup.number().min(1).required(),
	weight: yup.number().min(0).required(),
	value: yup.number().min(0).required(),
	carriedBy: yup.string().required(),
	reference: yup.string(),
});

export default itemValidation;
