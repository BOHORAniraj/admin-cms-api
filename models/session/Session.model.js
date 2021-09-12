import SessionSchema from "./Session.schema.js";
import { randomNumberGenerator } from "../../utils/randomGenerator.js";
const pinLength = 6;
export const createUniqueEmailConfirmation = async email => {
    try {
        
        const pin = randomNumberGenerator(pinLength);

        

        if (!pin || !email) {
            return false;
        }
        const newEmailValidation = {
            pin,email,
        }
        const result = await SessionSchema(newEmailValidation).save();
        return result;




        
    } catch (error) {
        throw new Error(error)
        
    }
}