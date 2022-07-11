const jwt = require('jsonwebtoken');


//декодируем token и проверяем на валиность
module.exports = function (req, res, next) {
  if (req.method === 'OPTIONS') 
    next();
  
  try {
    const token = req.headers.authorization.split(' ')[1] //Bearer asdadbsg
    if (!token) {
      return res.status(401).json({message: "Unauthorized"});
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (e) {
      res.status(401).json({message: "Unauthorized"});
  }
}