import { D, flow } from "@mobily/ts-belt";
import { z } from "zod";

const isUrl: (p: string) => boolean = flow(
	z.string().url().safeParse,
	D.getUnsafe("success")
);

export default isUrl;
