var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const { string32 } = require('../public/apps/pdf/pdf');

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
    edited: {type: String, default: "original"},
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
    if(req.query.id){
        viewsData.findOne({_id: req.query.id })
        .exec(function (err, doc) {
            if (err) {res.send(`Sorry! something went wrong saving to mongodb ${err}`)};
            res.send(doc?.content)
        })
    } else{
        viewsData.find({ })
        .sort("date")
        .exec(function (err, doc) {
            if (err) {res.send(`Sorry! something went wrong saving to mongodb ${err}`)};
            res.send(doc)
        })
    }
});

router.delete('/', function(req, res, next) {
    // viewsData.deleteOne({_id: req.body.identity }, function (err, doc) {
    //     if (err) {res.send(`Sorry! something went wrong saving to mongodb ${err}`)};
    //     res.send(req.body.identity + " has been marked for deletion in 24 hours");
    // });
});

router.put('/', async function (req, res, next) {
    if(req.body.content){
        let doc = await viewsData.findOneAndUpdate(
            {_id: req.body.identity },
            {content: req.body.content, edited: req.body.edited},
            {new: true}
        )
        res.send("Content update to " + doc.content)
    } else{
        // used to update the status of a delete method which is cron controlled to 
        // take action after 24 hours
        let doc = await viewsData.findOneAndUpdate(
            {_id: req.body.identity },
            {edited: req.body.edited},
            {new: true}
        )
        res.send(doc.edited)
    }
});

module.exports = router;
