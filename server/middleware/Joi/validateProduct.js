import joi, { required } from "joi";

//This is the ObjectId Validator
const objectId = joi.string().hex().length(24)

const productValidateSchema = joi.object({
    shopId: objectId.required(),

    //Core Deatails
    name: joi.string().trim().min(2).max(200).required(),
    brand: joi.string().trim().allow("", null),
    category: joi.string().trim().allow("", null),

    //The Product Image
    productImage: joi.string().uri().allow("", null),

    //The Variants (Sizes , colors , etc)
    variants: joi.array().items(
        joi.object({
            size: joi.string().allow("", null),
            color: joi.string().allow("", null),
            purchasePrice: joi.number().min(0).default(0),
            sellingPrice: joi.number().min(0).required(),
            stockQuantity: joi.number().min(0).required(),
        })).min(1).required(),

    // Specifications (Map<String, String>)
    specifications: joi.object().pattern(
        joi.string(),
        joi.string()
    ).optional()
})

export default productValidateSchema;