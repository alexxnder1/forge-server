export const HEX_COLORS = {
	orange: "#cf830a",
	white: "#ffffff"
}

export function GenerateDoubleArrayColors() {
	var colors: any = [[], []];

	for(let j = 0; j <=1; j++)
		for(let i = 0; i <3; i++)
			colors[j][i] = Math.floor(Math.random() * 256);    

	return colors;
}