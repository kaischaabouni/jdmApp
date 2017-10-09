var express= require('express');
var router = express.Router();
//var mongojs = require('mongojs');
//var db= mongojs('mongodb://kais:testtest@ds159274.mlab.com:59274/todos',['todos'])
var readline = require('readline');
var fs = require('fs');
var request = require("request");

// chercher un mot
router.get('/:terme', function(req, res, next){
  
  fs.readFile('server/cache/dumps/' + req.params.terme + '.txt', 'utf8', function (err,data) {
    
    // Erreur Lecture fichier
    if (err) {
     
      // Erreur lecture: Fichier n'existe pas en cache
      if(err.code === 'ENOENT'){

        request("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" + req.params.terme + "&rel=", 
          function(error, response, body) {
            //obj.push({"_id": "sfff" ,"text": body, "isCompleted":false}) ;            
            //res.json(obj);

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
      //obj.push({"_id": "sfff" ,"text": data, "isCompleted":false}) ;
      var objJSONARetourner = {"eid": "73068", "terme" : "bureau", "defintions": ["de1 ha ha", "def2 hi hi"], 
                  "rt11" : {"sortantes" : ["chaise", "table"], "entrantes" : ["stylo", "papier"]},
                  "rt18" :{"sortantes" : ["machin sortant", "je ne sais pas"], "entrantes" : ["juste pour tester"]}
      };
      res.json(objJSONARetourner);
    }
  });
});
  
module.exports = router;