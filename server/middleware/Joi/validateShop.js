import Joi from "joi";

const shopValidateSchema = Joi.object({
  // 1. Business Information
  shopName: Joi.string().trim().min(2).max(100).required(),
  shopType: Joi.string().trim().allow("", null),
  address: Joi.string().trim().allow("", null),
  shopImage: Joi.string().uri().allow("", null),

  // 2. Owner Authentication Details
  ownerName: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).max(20).required(),
  isActive: Joi.boolean().default(true)
});

export default shopValidateSchema;