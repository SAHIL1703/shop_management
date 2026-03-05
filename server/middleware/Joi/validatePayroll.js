import joi from "joi";

const objectId = joi.string().hex().length(24);

const payrollValidateSchema = joi.object({
    shopId : objectId.required(),
    laborId : objectId.required(),

    amount : joi.number().min(0).required(),

    type : joi.string().valid('Salary', 'Advance', 'Bonus', 'Deduction').required(),

    forMonth: joi.date().optional(),
    description: Joi.string().trim().min(3).required(),

    date : joi.date().default(() => new Date())

})

export default payrollValidateSchema;