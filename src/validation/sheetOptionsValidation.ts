import { defaultFieldLength } from "../constants/validationConstants";
import * as yup from "yup";

const sheetOptionsValidation = yup.object({
	name: yup.string().required().max(defaultFieldLength),
	members: yup.array().of(
		yup.object({
			id: yup.string(),
			name: yup
				.string()
				.required("Members cannot have blank names")
				.max(defaultFieldLength),
			carryCapacity: yup.number(),
		})
	),
});

export default sheetOptionsValidation;
