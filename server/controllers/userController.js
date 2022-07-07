const ApiError = require('../error/ApiError');

class UserController {
  async registration(req, res) {
    
  }
  async login(req, res) {

  }
  async check(req, res, next) {
    // const query = req.query;
    // res.json(query.id);  
    const {id} = req.query;
    if (!id) {
      return next(ApiError.badRequest('ID is not specified'));
    }
    res.json(id);  
  }
}

module.exports = new UserController();
