import Joi from "joi";

// MongoDB ObjectId
const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

// REGISTER SCHEMA
const registerSchema = Joi.object({
  shopId: objectId,

  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),

  email: Joi.string()
    .email()
    .lowercase()
    .required(),

  password: Joi.string()
    .min(6)
    .max(100)
    .required(),

  role: Joi.string()
    .valid("Owner", "Manager", "Salesperson")
    .default("Owner"),

  isActive: Joi.boolean().default(true),
});

// LOGIN SCHEMA
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .required(),

  password: Joi.string()
    .min(6)
    .max(100)
    .required(),
});

const updateSchema = Joi.object({

  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),

  email : Joi.string()
    .email()
    .lowercase()
    .required(),

  role: Joi.string()
    .valid("Owner", "Manager", "Salesperson")
    .default("Owner"),
  
})


// REGISTER VALIDATION
export const validateRegister = (req, res, next) => {
  const { error, value } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  req.body = value;
  next();
};

// LOGIN VALIDATION
export const validateLogin = (req, res, next) => {
  console.log("validateRegister middleware running");
  const { error, value } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  req.body = value;
  next();
};

// UPDATE VALIDATION
export const validateUpdateUser = (req, res, next) => {
  const { error, value } = updateSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  req.body = value;
  next();
};