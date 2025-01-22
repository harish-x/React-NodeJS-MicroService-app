import joi,{ObjectSchema} from "joi";

const signupSchema: ObjectSchema = joi.object().keys({
    urername: joi.string().min(4).max(12).required().messages({
        'string.empty': 'Username is required',
        'string.min': 'Username should be at least 4 characters long',
        'string.max': 'Username should not exceed 12 characters',
        'any.required': 'Username is required'
    }),
    email: joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Invalid email format',
        'any.required': 'Email is required'}),
    password: joi.string().min(6).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password should be at least 6 characters long',
        'any.required': 'Password is required'
    }),
    country: joi.string().required().messages({
        'string.empty': 'Country is required',
        'any.required': 'Country is required'
    }),
    profilePicture: joi.string().required().messages({
        'string.empty': 'Profile picture is required',
        'any.required': 'Profile picture is required'
    })
});

export {signupSchema}