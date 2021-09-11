import bcrypt from 'bcrypt'
const saltRounds = 10;

export const hashPassword = plainPass => {
    return bcrypt.hashSync(plainPass, saltRounds);
}
// export const comparePassword = (plainPass,hashpassfromDB) => {
//     return bcrypt.compareSync(plainPass,hashpassfromDB)
// }