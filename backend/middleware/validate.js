import { ApiError } from '../utils/apiError.js'

export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  })

  if (!result.success) {
    return next(new ApiError(422, 'Validation failed', result.error.flatten()))
  }

  req.body = result.data.body ?? req.body
  req.query = result.data.query ?? req.query
  req.params = result.data.params ?? req.params
  next()
}
