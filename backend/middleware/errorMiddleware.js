export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`)
  error.statusCode = 404
  next(error)
}

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500
  const message = err.code === 11000 ? 'Duplicate record already exists' : err.message

  res.status(statusCode).json({
    success: false,
    message,
    details: err.details,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  })
}
