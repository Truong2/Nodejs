import { StatusCodes } from "http-status-codes";
import Joi from "joi";

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      "string.base": `"title" should be a type of 'string'`,
      "string.empty": `"title" cannot be an empty field`,
      "string.min": `"title" should have a minimum length of 3`,
      "string.max": `"title" should have a minimum length of 50`,
      "any.required": `"title" is a required field`,
    }),
    description: Joi.string().required().min(3).max(256).trim().strict(),
  });

  try {
    console.log(req.body);
    // Kiểm tra dữ liệu FE gửi
    // abortEarly : Trả về nhiều lỗi
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    res.status(StatusCodes.CREATED).json({ message: "post from validation" });
    // next();
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ errors: new Error(error).message });
  }
};

export const boardValidation = {
  createNew,
};

// messages: {
//     'string.alphanum': '{{#label}} must only contain alpha-numeric characters',
//     'string.base': '{{#label}} must be a string',
//     'string.base64': '{{#label}} must be a valid base64 string',
//     'string.creditCard': '{{#label}} must be a credit card',
//     'string.dataUri': '{{#label}} must be a valid dataUri string',
//     'string.domain': '{{#label}} must contain a valid domain name',
//     'string.email': '{{#label}} must be a valid email',
//     'string.empty': '{{#label}} is not allowed to be empty',
//     'string.guid': '{{#label}} must be a valid GUID',
//     'string.hex': '{{#label}} must only contain hexadecimal characters',
//     'string.hexAlign': '{{#label}} hex decoded representation must be byte aligned',
//     'string.hostname': '{{#label}} must be a valid hostname',
//     'string.ip': '{{#label}} must be a valid ip address with a {{#cidr}} CIDR',
//     'string.ipVersion': '{{#label}} must be a valid ip address of one of the following versions {{#version}} with a {{#cidr}} CIDR',
//     'string.isoDate': '{{#label}} must be in iso format',
//     'string.isoDuration': '{{#label}} must be a valid ISO 8601 duration',
//     'string.length': '{{#label}} length must be {{#limit}} characters long',
//     'string.lowercase': '{{#label}} must only contain lowercase characters',
//     'string.max': '{{#label}} length must be less than or equal to {{#limit}} characters long',
//     'string.min': '{{#label}} length must be at least {{#limit}} characters long',
//     'string.normalize': '{{#label}} must be unicode normalized in the {{#form}} form',
//     'string.token': '{{#label}} must only contain alpha-numeric and underscore characters',
//     'string.pattern.base': '{{#label}} with value {:[.]} fails to match the required pattern: {{#regex}}',
//     'string.pattern.name': '{{#label}} with value {:[.]} fails to match the {{#name}} pattern',
//     'string.pattern.invert.base': '{{#label}} with value {:[.]} matches the inverted pattern: {{#regex}}',
//     'string.pattern.invert.name': '{{#label}} with value {:[.]} matches the inverted {{#name}} pattern',
//     'string.trim': '{{#label}} must not have leading or trailing whitespace',
//     'string.uri': '{{#label}} must be a valid uri',
//     'string.uriCustomScheme': '{{#label}} must be a valid uri with a scheme matching the {{#scheme}} pattern',
//     'string.uriRelativeOnly': '{{#label}} must be a valid relative uri',
//     'string.uppercase': '{{#label}} must only contain uppercase characters'
//   }
