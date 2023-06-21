export const withStoppedPropagation =
	<SpecificEvent extends { stopPropagation: () => void }>(
		handler: (event: SpecificEvent) => void
	) =>
	(event: SpecificEvent) => {
		event.stopPropagation();
		handler(event);
	};
