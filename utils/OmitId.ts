/**
 * A utility type that omits id fields (named either "id" or "_id") from objects
 */
type OmitId<T> = Omit<T, "_id" | "id">;

export default OmitId;
