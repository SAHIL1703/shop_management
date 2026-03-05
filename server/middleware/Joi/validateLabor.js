import Joi from "joi";

const objectId = Joi.string().hex().length(24);

const laborValidateSchema = Joi.object({

  shopId: objectId.required(),

  name: Joi.string().trim().min(2).max(20).required(),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),

  idProof: Joi.object({
    url: Joi.string().uri().required(),

    type: Joi.string()
      .valid("Aadhar", "PAN", "Driving License", "Passport")
      .required(),

    number: Joi.string().min(5).max(30).required()
  }).required(),

  baseSalary: Joi.number().min(0).required(),

  salaryType: Joi.string()
    .valid("Monthly", "Daily")
    .default("Monthly"),

  role: Joi.string()
    .valid("Salesperson", "Helper", "Manager", "Cleaner")
    .default("Helper"),

  isActive: Joi.boolean().default(true),

  joiningDate: Joi.date().default(() => new Date())

});

export default laborValidateSchema;