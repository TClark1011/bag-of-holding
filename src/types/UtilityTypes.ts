export interface IdentifiedObject {
	readonly _id: string;
}

export type OmitId<T> = Omit<T, "_id" | "id">;
