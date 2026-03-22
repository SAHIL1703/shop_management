import Joi from "joi";

// Reusable custom validation for MongoDB ObjectIds
const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/, "MongoDB ObjectId");

const shopValidateSchema = Joi.object({
  
  userId: objectId.required(),

  shopName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  shopType: Joi.string()
    .trim()
    .allow("", null),

  address: Joi.string()
    .trim()
    .allow("", null),

  shopImage: Joi.string()
    .uri()
    .allow("", null),

  isActive: Joi.boolean().default(true),

  // NEW: Validate salespersons as an array of ObjectIds
  salespersons: Joi.array()
    .items(objectId)
    .default([]) 
});

// SHOP VALIDATION MIDDLEWARE
export const validateShop = (req, res, next) => {
  // Using abortEarly: false will check all fields and return all errors at once, rather than stopping at the first one
  const { error, value } = shopValidateSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      // We map through the details to send back a clean string of all validation errors
      message: error.details.map(err => err.message).join(', '),
    });
  }

  req.body = value;
  next();
};