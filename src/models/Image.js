const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const _ = require('underscore');

var ImageModel = {};

const convertId = mongoose.Types.ObjectId;
const setImage = imageURL => _.escape(imageURL).trim();

const ImageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  imageURL: {
    type: String,
    required: true,
    trim: true,
    set: setImage,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    red: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

ImageSchema.statics.toAPI = doc => ({
  name: doc.name,
  imageURL: doc.imageURL,
});

ImageSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return ImageModel.find(search).select('name imageURL').exec(callback);
};

ImageModel = mongoose.model('Img', ImageSchema);

module.exports.ImageModel = ImageModel;
module.exports.ImageSchema = ImageSchema;
