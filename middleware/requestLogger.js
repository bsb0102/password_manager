
function requestLogger(req, res, next) {
    // Log request method and URL
    console.log(`[${new Date().toISOString()}] ${req.url}`);
  
    // console.log('Headers:', req.headers);

    if (req.headers) {
        console.log("Request")
        return res.sendStatus(200);
        next();
    } else{
        return res.sendStatus(500);
    }
    next();
  }
  module.exports = requestLogger;
  