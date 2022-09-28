export type CharacterRemovalItemPassStrategy = {
	type: "item-pass";
	data: {
		toCharacterId: string;
	};
};

export type CharacterRemovalItemDeleteStrategy = {
	type: "item-delete";
};

export type CharacterRemovalItemToNobodyStrategy = {
	type: "item-to-nobody";
};

export type CharacterRemovalStrategy =
	| CharacterRemovalItemPassStrategy
	| CharacterRemovalItemDeleteStrategy
	| CharacterRemovalItemToNobodyStrategy;
