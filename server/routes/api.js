var express= require('express');
var router = express.Router();
//var mongojs = require('mongojs');
//var db= mongojs('mongodb://kais:testtest@ds159274.mlab.com:59274/todos',['todos'])
var readline = require('readline');
var fs = require('fs');
var request = require("request");

// chercher un mot
router.get('/:terme', function(req, res, next){
  var obj = [{"_id":req.params.terme,"text":req.params.terme,"isCompleted":false},{"_id":"59d28b71734d1d42e49ebc64","isCompleted":true,"text":"go to work"},{"_id":"59d28bba734d1d42e49ebc8a","text":"go food shopping","isCompleted":false},{"_id":"59d38b766cface1b98541960","text":"Machin","isCompleted":false}];
  
  // Pb -> lire et ecrire en meme temps
  fs.readFile('server/cache/dumps/' + req.params.terme + '.txt', 'utf8', function (err,data) {
    
    // Erreur Lecture fichier
    if (err) {
     
      // Erreur lecture: Fichier n'existe pas en cache
      if(err.code === 'ENOENT'){

        request("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" + req.params.terme + "&rel=", 
          function(error, response, body) {
            obj.push({"_id": "sfff" ,"text": body, "isCompleted":false}) ;            
            res.json(obj);

            // Ecrire fichier dans cache
            fs.writeFile("server/cache/dumps/" + req.params.terme + ".txt", data, function(err){
              // Erreur lors de l'ecriture du fichier
              if(err){
                return console.log(err);
              }
            });
          }
        );
      } else {
        // Autre erreur lecture fichier
        return console.log(err);        
      }
    } else  {
      // Fichier Existe
      obj.push({"_id": "sfff" ,"text": data, "isCompleted":false}) ;
      res.json(obj);
    }
  });
});
  
module.exports = router;