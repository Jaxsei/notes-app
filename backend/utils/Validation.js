function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ApiError(StatusCode.BAD_REQUEST, result.error.format());
  }
  return result.data;
}

export default validate;
