import joi from "joi";

const signinSchema: joi.ObjectSchema = joi.object().keys({
 
    password: joi.string().min(6).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password should be at least 6 characters long',
        'any.required': 'Password is required'
    }),
    username: joi.alternatives().conditional(joi.string().email(),{
        then: joi.string().email().required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Invalid email format',
            'any.required': 'Email is required'
        }),
        otherwise: joi.string().required().messages({
            'string.empty': 'Username is required',
            'any.required': 'Username is required',
            'string.min': 'Username should be at least 4 characters long',
            'string.max': 'Username should not exceed 12 characters'
        })
    })
})

export {signinSchema as loginSchema}