import { useEffect } from "react";

export interface IdentifiedObject {
	readonly _id: string;
}

export type OmitId<T extends IdentifiedObject> = Omit<T, "_id" | "id">;

export type ReactEffect = Parameters<typeof useEffect>[0];
