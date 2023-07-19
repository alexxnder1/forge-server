export const HEX_COLORS = {
	orange: "#cf830a",
	white: "#ffffff",
	grey: "#808080",
	purple: "#6f2ed1"
}

export function GenerateDoubleArrayColors() {
	var colors: any = [[], []];

	for(let j = 0; j <=1; j++)
		for(let i = 0; i <3; i++)
			colors[j][i] = Math.floor(Math.random() * 256);    

	return colors;
}