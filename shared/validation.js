import joi from 'joi';

export const signupValidation = (data) => {
    const schema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(8).required(),
        confirmpassword: joi.string()
    })
    return schema.validate(data)
}
export const signinValidation = (data) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(8).required(),
    })
    return schema.validate(data)
};