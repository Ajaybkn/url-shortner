import FlakeId from "flake-idgen";

// FlakeId generator with custom epoch
const flake = new FlakeId({ epoch: 1300000000000 });

export const generateSnowflakeId = () => {
	const idBuffer = flake.next(); // returns Buffer
	let idNum = 0n;
	for (let i = 0; i < idBuffer.length; i++) {
		idNum = (idNum << 8n) + BigInt(idBuffer[i]);
	}
	return idNum; // BigInt
};
