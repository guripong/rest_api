var express = require('express');
var router = express.Router();
const multiparty = require('multiparty');
const request = require('request');
const fs = require('fs');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});



router.post('/', function (req, res, next) {
  console.log('post왔당');


  var fname;
  var form = new multiparty.Form({
    autoFiles: false, // 요청이 들어오면 파일을 자동으로 저장할 것인가
    uploadDir: 'temp/', // 파일이 저장되는 경로(프로젝트 내의 temp 폴더에 저장됩니다.)
  });
  var ct;
  var realpath;

  form.parse(req);
  form.on('field', (name, value) => {
    console.log('name', name);
    console.log('value', value);
    //console.log(`name:`,name,`value`,value);
    if (name == 'fakepath') {
      fakepath = value;
    }
  });
  form.on('file', (name, file) => {
    //console.log('파일 들어옴');
    console.log(`파일:`, file.originalFilename);
    fname = file.originalFilename;
    realpath = file.path;
    //console.log(file.headers['content-type']);
    ct = file.headers['content-type'];

  });

  form.on('part', function (part) {
    console.log('파트 들어옴');
    //console.log(part);
    var size;
    if (part.filename) {
      size = part.byteCount;
      console.log(`size:`, size);

    } else {
      console.log('다시다시');
      part.resume();
    }

  });

  form.on('progress', function (byteRead, byteExpected) {
    //받는도중 계속 호출
    console.log(' Reading total  ' + byteRead + '/' + byteExpected);

  });

  form.on('error', function (err) {
    console.log('Error parsing form: ' + err.stack);
  });

  form.on('close', () => {
    console.log(`close!!!`);
    //const fileName = './resources/ManualTest.wav';
    
    if (fname && realpath) {
      console.log('fname:', fname);
      console.log('realpath:', realpath);
      var formData = {

        media: fs.createReadStream('./' + realpath),
        name: 'soki_jjang',

      };

      request.post({ url: 'http://54.180.21.15:5555', formData: formData }, function optionalCallback(err, httpResponse, body) {
        if (err) {
          return console.error('upload failed:', err);
        }
       

        body=JSON.parse(JSON.stringify(body));

        console.log('stt에서받아옴:', body.results);

        return res.json({
          body: body,
        });
      });
    }
    else {
      console.log('로그찍기용임');
      
      return res.json({
        status: true,
        nothing: "nothing",
      });
    }


  });//form.on close
});
module.exports = router;
