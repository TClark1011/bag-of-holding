import { InventoryMemberFields } from "$sheets/types";
import { generateMember } from "$sheets/utils";

export const averageMembersFixture: InventoryMemberFields[] = [
	"Vincent",
	"Archie",
	"Sen",
	"Seath",
].map(generateMember);
