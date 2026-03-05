import joi from "joi";

const objectId = joi.string().hex().length(24);

const saleEntryValidateSchema = joi.object({
    shopId: objectId.required(),

    productId: objectId.required(),

    variantId: objectId.optional(),

    variantName: joi.when("variantId", {
        is: joi.exist(),
        then: joi.string().trim().min(1).required(),
        otherwise: joi.string().trim().allow("", null)
    }),

    quantity: joi.integer().min(1).required(),

    totalPrice: joi.number().positive().min(0).required(),

    salespersonId: objectId.optional(),

    date: joi.date().default(() => new Date()),

});

export default saleEntryValidateSchema;