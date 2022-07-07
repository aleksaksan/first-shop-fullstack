const uuid = require('uuid');
const path = require('path');
const {Device} = require('../models/models');
const ApiError = require('../error/ApiError');

class DeviceController {
  async create(req, res, next) {
    try {
      const {name, price, brandId, typeId, info} = req.body;
      const {img} = req.files;
      let fileName = uuid.v4() + ".jpg";

      img.mv(path.resolve(__dirname, '..', 'static', fileName));
      // path.resolve() "адаптирует указанный путь для ОС"
      // __dirname - путь до текущей папки
      // '..' вернуться из текущей папки на 1 уровень выше
      //'static' - "войти в папку" static

      //после того как файл перемещён нужно создать объект Device
      const device = await Device.create({name, price, brandId, typeId, img: fileName});
      // rating не указываем, тк он по дефолту = 0
      
      //возвращаем на клиент сам объект
      return  res.json(device); 
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }

  }
  async getAll(req, res) {

  }
  async getOne(req, res) {

  }
}

module.exports = new DeviceController();
