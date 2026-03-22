import joi from "joi";

const objectId = joi.string().hex().length(24);

const feedbackValidateSchema = joi.object({
    shopId: objectId.required(),

    salespersonId: objectId.required(),
    rating: joi.number().integer().min(1).max(5).required(),
    customerPhone: joi.string()
        .pattern(/^[0-9]{10}$/)
        .allow("", null)
        .optional(),
    date: joi.date().default(() => new Date()),
})

export const validateFeedback = (req, res, next) => {
  const { error, value } = feedbackValidateSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  req.body = value;
  next();
};