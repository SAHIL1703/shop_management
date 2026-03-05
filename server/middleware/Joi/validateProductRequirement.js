import joi from 'joi';

const objectId = joi.string().hex().length(24)

const productRequirementValidateSchema = joi.object({
    shopId: objectId.required(),

    productName: joi.string().trim().min(2).max(200).required(),

    description: joi.string().trim().allow("", null),

    referenceImage: joi.object({
        url: joi.string().uri().allow("", null),
        publicId: joi.string().trim().allow("", null),
    }).optional(),

    quantity: joi.number().min(1).required(),

    customerDetails: joi.object({
        name: joi.string().trim().allow("", null),
        phone: joi.string()
            .pattern(/^[0-9]{10}$/)
            .required()
    }).optional(),

    status: joi.string().valid('Pending', 'Ordered', 'Arrived', 'Fulfilled', 'Cancelled').default("Pending")
})

export default productRequirementValidateSchema;