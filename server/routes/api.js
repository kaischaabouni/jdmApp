var express = require('express');
var router = express.Router();
var parser = require('../utils/parser');

const utf8 = require('utf8');

//var mongojs = require('mongojs');
//var db= mongojs('mongodb://kais:testtest@ds159274.mlab.com:59274/todos',['todos'])
//var readline = require('readline');

var fs = require('fs');
var request = require("request");

// chercher un mot
router.get('/:terme', function (req, res, next) {

    objJSONARetourner = {};

    fs.readFile('server/cache/validity/' + req.params.terme + '.txt', 'utf8', function (err, data) {

        // Erreur Lecture fichier
        if (err) {

            // Erreur lecture: Fichier n'existe pas en cache
            if (err.code === 'ENOENT') {
                request("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" + req.params.terme + "&rel=",
                    function (error, response, body) {

                        if (error) {
                            // erreur de connexion

                        } else {

                            // Connexion réussite
                            var code = body.substring(body.indexOf("<CODE>"));

                            // Parser Code
                            parser.parserCode(code);

                            // Réponse
                            res.json(objJSONARetourner);

                            // Ecrire fichier dans cache
                            fs.writeFile("server/cache/dumps/" + req.params.terme + ".json", JSON.stringify(objJSONARetourner), 'utf8', function (err) {
                                // Erreur lors de l'ecriture du fichier
                                if (err) {
                                    return console.log(err);
                                }
                            });

                            // Date de validité (7 jours)
                            let validityDate = new Date();
                            validityDate.setDate(validityDate.getDate() + 7);
                            fs.writeFile("server/cache/validity/" + req.params.terme + ".txt", validityDate.getTime(), function (err) {
                                // Erreur lors de l'ecriture du fichier
                                if (err) {
                                    return console.log(err);
                                }
                            });
                        }
                    }
                );
            } else {
                // Autre erreur lecture fichier
                return console.log(err);
            }
        } else {

            // Fichier Existe
            if(Date.now() > data){
                console.log("oui");
            }
            fs.readFile('server/cache/dumps/' + req.params.terme + '.json', 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(data);
                }
            });
        }
    });
});

module.exports = router;