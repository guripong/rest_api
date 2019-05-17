var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req,res,next){
  console.log('여기:',req.body);
  
  return res.json({'name':'hi'});

});
module.exports = router;
