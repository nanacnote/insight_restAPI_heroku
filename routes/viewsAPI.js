var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//---------MODEL----------
var Schema = mongoose.Schema;
// Instantiate new schema with type description
var viewsDataSchema = new Schema(
  {
    date: {type: Date},
    category: {type: String},
    stage: {type: String},
    content: {type: String},
    user: {type: String},
    tags: {type: String},
    extra: {type: String},
  }
)
const viewsData = mongoose.model('viewsData', viewsDataSchema);

//-----------ROUTER---------
/* POST team management data */
router.post('/', function(req, res, next) {
    let doc = new viewsData({
        date: req.body.date,
        category: req.body.category,
        stage: req.body.stage,
        content: req.body.content,
        user: req.body.user,
        tags: req.body.tags,
        extra: req.body.extra,
    })
    doc.save(function (err) {
        if (err) {res.send(`Sorry! something went wrong saving to mongodb ${err}`)};
        res.send("Thanks! Added to board for everyone")
    });
});

router.get('/', function(req, res, next) {

    viewsData.find({ })
    .sort("date")
    .exec(function (err, doc) {
        if (err) {res.send(`Sorry! something went wrong saving to mongodb ${err}`)};
        res.send(doc)
    })
});

module.exports = router;
