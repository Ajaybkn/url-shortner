const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const base62Encode = (num) => {
	if (num === 0) return "0";
	let str = "";
	while (num > 0) {
		str = BASE62[num % 62] + str;
		num = Math.floor(num / 62);
	}
	return str;
};
