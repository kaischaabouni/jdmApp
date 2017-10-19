var express = require('express');
var router = express.Router();
//var mongojs = require('mongojs');
//var db= mongojs('mongodb://kais:testtest@ds159274.mlab.com:59274/todos',['todos'])
//var readline = require('readline');
var fs = require('fs');
var request = require("request");

// chercher un mot
router.get('/:terme', function (req, res, next) {

    // Mock objet pour tester réponse
    var objJSONARetourner = {
        "eid": "73068", "terme": "bureau",
        "definitions": ["de1 ha ha", "def2 hi hi"],
        "relations": {
            "rt0": {
                "sortantes": [{ "nom": "chaise", "poids": 45 }, { "nom": "table", "poids": 150 }],
                "entrantes": [{ "nom": "stylo", "poids": 15 }, { "nom": "papier", "poids": -2 }]
            },
            "rt1": {
                "sortantes": [{ "nom": "machin sortant", "poids": 45 }, { "nom": "je ne sais pas", "poids": 150 }],
                "entrantes": [{ "nom": "juste pour tester", "poids": 327 }]
            }
        }
    };

    fs.readFile('server/cache/dumps/' + req.params.terme + '.txt', 'utf8', function (err, data) {

        // Erreur Lecture fichier
        if (err) {

            // Erreur lecture: Fichier n'existe pas en cache
            if (err.code === 'ENOENT') {
                request("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" + req.params.terme + "&rel=",
                    function (error, response, body) {
                        // Réponse
                        res.json(objJSONARetourner);

                        // Ecrire fichier dans cache
                        fs.writeFile("server/cache/dumps/" + req.params.terme + ".txt", data, function (err) {
                            // Erreur lors de l'ecriture du fichier
                            if (err) {
                                return console.log(err);
                            }
                        });
                    }
                );
            } else {
                // Autre erreur lecture fichier
                return console.log(err);
            }
        } else {
            // Fichier Existe
            
            res.json(objJSONARetourner);
        }
    });
});

module.exports = router;