import joi from "joi";

const objectId = joi.string().hex().length(24);

// 1. Validation for individual items in the cart
const saleItemValidateSchema = joi.object({
    productId: objectId.required(),
    
    variantId: objectId.optional(),
    
    variantName: joi.when("variantId", {
        is: joi.exist(),
        then: joi.string().trim().min(1).required(),
        otherwise: joi.string().trim().allow("", null)
    }),
    
    // Corrected to number().integer()
    quantity: joi.number().integer().min(1).required(),
    
    pricePerUnit: joi.number().min(0).required(),
    
    subTotal: joi.number().min(0).required()
});

// 2. Validation for the main checkout receipt
const saleEntryValidateSchema = joi.object({
    shopId: objectId.required(),

    // NEW: Validating the array of items
    items: joi.array().items(saleItemValidateSchema).min(1).required(),

    // NEW: Replaced totalPrice with grandTotal
    grandTotal: joi.number().min(0).required(),

    salespersonId: objectId.optional(),

    date: joi.date().default(() => new Date()),
});

export const validateSaleEntry = (req, res, next) => {
  const { error, value } = saleEntryValidateSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  req.body = value;
  next();
};