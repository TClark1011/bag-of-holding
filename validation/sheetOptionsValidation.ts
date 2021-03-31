import * as yup from "yup";

const sheetOptionsValidation = yup.object({
	name: yup.string().required(),
	members: yup
		.array()
		.of(yup.string().required("Members cannot have blank names")),
});

export default sheetOptionsValidation;
