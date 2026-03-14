import Joi from "joi";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const shopValidateSchema = Joi.object({
  
  userId : objectId.required(),

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

  isActive: Joi.boolean().default(true)
});

// SHOP VALIDATION
export const validateShop = (req, res, next) => {
  const { error, value } = shopValidateSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  req.body = value;
  next();
};