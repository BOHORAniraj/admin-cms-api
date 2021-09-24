import bcrypt from "bcrypt";
const saltRounds = 10;

export const hashPassword = plainPass => {
	return bcrypt.hashSync(plainPass, saltRounds);
};

export const comparePassword = (plainPass, hashPassFromDB) => {
	return bcrypt.compareSync(plainPass, hashPassFromDB);
};
