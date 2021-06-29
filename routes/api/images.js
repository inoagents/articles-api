const router = require('express').Router();
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const auth = require('../auth');

router.post('/image', auth.required, function (req, res, next) {
  const form = formidable({
    multiples: true,
    maxFileSize: 10 * 1024 * 1024,
    maxFields: 10,
    maxFieldsSize: 10 * 1024 * 1024,
    uploadDir: path.join(path.dirname(require.main.filename), '/files'),
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    if (files.image.size === 0) {
      res.send({ imageBase: '' });
      fs.unlink(files.image.path, (error) => {
        if (error) throw error;
      });
    } else {
      res.send({ imageBase: path.parse(files.image.path).base });
    }
  });
});

module.exports = router;
