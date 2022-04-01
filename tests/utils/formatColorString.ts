/**
 * Check if a string is a hex color
 * NOTE: Written by Copilot
 *
 * @param color The color to check
 * @returns whether or not `color`
 * contains a hex color
 */
const colorIsHex = (color: string) => {
	const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
	return hexRegex.test(color);
};

/**
 * Convert a string containing an RGB color
 * value to a hexadecimal color value.
 * NOTE: Written by Copilot
 *
 * @param color The rgb color string to be
 * converted
 * @returns The hexadecimal color
 */
const rgbToHex = (color: string) => {
	const rgbRegex = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;
	const matches = rgbRegex.exec(color);

	if (!matches) return color;
	const [, r, g, b] = matches;
	const hex = [r, g, b]
		.map((x) => {
			const hex = Number(x).toString(16);
			return hex.length === 1 ? "0" + hex : hex;
		})
		.join("");
	return "#" + hex.toUpperCase();
};

/**
 * Format a color string to be hex if it
 * isn't already hex. If is already hex,
 * return the color as is.
 *
 * @param color The color to format
 * @returns The formatted color
 */
const formatColorString = (color: string) => {
	const isAlreadyHex = colorIsHex(color);
	const hexColor = isAlreadyHex ? color : rgbToHex(color);
	return hexColor;
};

export default formatColorString;
