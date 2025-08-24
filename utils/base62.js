const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const base62Encode = (num) => {
	if (num === 0n) return "0";
	let str = "";
	while (num > 0n) {
		str = BASE62[num % 62n] + str;
		num = num / 62n;
	}
	return str;
};
