const models = require('../models');

const Img = models.Img;

const makerPage = (req, res) => {
  Img.ImageModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), images: docs });
  });
};

const viewImage = (req, res) => {
  // For some reason the queries add a / to the end of name and imageURL, this removes it
  const name = req.query.name.slice(0, -1);
  const imageURL = req.query.imageURL.slice(0, -1);

  return res.render('image', { csrfToken: req.csrfToken(), image: { name, imageURL } });
};

const makeImage = (req, res) => {
  if (!req.body.name || !req.body.imageURL) {
    return res.status(400).json({ error: 'Name and an image are required' });
  }

  if (req.body.name.includes(' ')) {
    return res.status(400).json({ error: 'No spaces allowed in the name' });
  }

  if (!req.body.imageURL.match(/\.(jpeg|jpg|png)$/)) {
    return res.status(400).json({ error: 'Invalid URL, please enter an image' });
  }

  const imageData = {
    name: req.body.name,
    imageURL: req.body.imageURL,
    owner: req.session.account._id,
  };

  const newImage = new Img.ImageModel(imageData);

  return newImage.save((err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ redirect: '/maker' });
  });
};

module.exports.makerPage = makerPage;
module.exports.make = makeImage;
module.exports.viewImage = viewImage;
