function errorHandler(err, req, res, next) {
  console.error(err.stack); // Log the error for debugging purposes
  console.log(err)
  // Handle different types of errors and respond accordingly
  if (err instanceof SomeCustomError) {
    return res.status(400).json({ error: 'Bad request' });
  } else {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = errorHandler;
