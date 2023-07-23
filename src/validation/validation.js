import { ResponseError } from "../errors/response-error.js";

const validation = (schema, request) => {
  const result = schema.validate(request, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (result.error) {
    throw new ResponseError(400, result.error.details[0].message);
  } else {
    return result.value;
  }
};

export { validation };
