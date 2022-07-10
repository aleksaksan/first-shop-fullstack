const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const {User, Basket} = require('../models/models');
const jwt = require('jsonwebtoken');

const generateJwt = (id, email, role) => {
  return jwt.sign({
      id, email, role},
      process.env.SECRET_KEY,
      {expiresIn: '24h'}
      );
};

class UserController {
  async registration(req, res, next) {
    const {email, password, role} = req.body;
    if (!email || !password)
      return next(ApiError.badRequest('bad password or e-mail'));

    const candidate = await User.findOne({where: {email}});
    if (candidate)
      return next(ApiError.badRequest('user already exists'));

    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({email, role, password: hashPassword});
    const basket = await Basket.create({userId: user.id});

    const token = generateJwt(user.id, user.email, user.role);
    
    return res.json({token});
  }
  async login(req, res, next) {
    const {email, password} = req.body;
    const user = await User.findOne({where: {email}});
    if (!user)
      return next(ApiError.badRequest(`user with email: ${email} not found`));

    let comparedPassword = bcrypt.compareSync(password, user.password);
    if (!comparedPassword)
      return next(ApiError.internal('incorrect password'));
    
    const token = generateJwt(user.id, user.email, user.role);
    return res.json({token});
  }
  async check(req, res, next) {
    // const query = req.query;
    // res.json(query.id);
    // ///////////////////////////
    // const {id} = req.query;
    // if (!id) {
    //   return next(ApiError.badRequest('ID is not specified'));
    // }
    // res.json(id);  
  }
}

module.exports = new UserController();
