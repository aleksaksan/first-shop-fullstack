const uuid = require('uuid');
const path = require('path');
const {Device, DeviceInfo} = require('../models/models');
const ApiError = require('../error/ApiError');

class DeviceController {
  async create(req, res, next) {
    try {
      const {name, price, brandId, typeId, info} = req.body;
      let {img} = req.files;
      let fileName = uuid.v4() + ".jpg";

      img.mv(path.resolve(__dirname, '..', 'static', fileName));
      // path.resolve() "адаптирует указанный путь для ОС"
      // __dirname - путь до текущей папки
      // '..' вернуться из текущей папки на 1 уровень выше
      //'static' - "войти в папку" static

      //после того как файл перемещён нужно создать объект Device
      const device = await Device.create({name, price, brandId, typeId, img: fileName});
      // rating не указываем, тк он по дефолту = 0

      if (info) {
        info = JSON.parse(info);
        info.ForEach(i => {
          DeviceInfo.create({
            title: i.title,
            description: i.description,
            deviceId: device.id
          })
        });
      };
      
      //возвращаем на клиент сам объект
      return  res.json(device); 
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }

  }
  async getAll(req, res) {
    let {brandId, typeId, limit, page} = req.query;
    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;
    let devices;
    if (!brandId && !typeId)
      devices = await Device.findAndCountAll({limit, offset});
    if (brandId && !typeId)
      devices = await Device.findAndCountAll({where: {brandId}, limit, offset});
    if (!brandId && typeId)
      devices = await Device.findAndCountAll({where: {typeId}, limit, offset}); 
    if (brandId && typeId)
      devices = await Device.findAndCountAll({where:{ brandId, typeId}, limit, offset});
    return res.json(devices);
  }
  async getOne(req, res) {
    const {id} = req.params;
    const device = await Device.findOne(
      {where: {id},
      include: [{model: DeviceInfo, as: 'info'}]
      },
    );
    return res.json(device);
  }
}

module.exports = new DeviceController();
