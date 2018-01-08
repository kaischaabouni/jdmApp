var express = require('express');
var router = express.Router();
var parser = require('../utils/parser');
var writer = require('../utils/writer');

const utf8 = require('utf8');
var schedule = require('node-schedule');

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
                            let code = body.substring(body.indexOf("<CODE>"));

                            // Parser Code
                            parser.parserCode(code);

                            // Réponse
                            res.json(objJSONARetourner);

                            // Ecrire fichier dans cache
                            writer.writeFile(req.params.terme, objJSONARetourner);
                        }
                    }
                );
            } else {
                // Autre erreur lecture fichier
                return console.log(err);
            }
        } else {

            // Fichier Existe

            let date = new Date();
            if (date > data) {

                // schedule job à 3:00 du jour suivant
                date.setHours(3);
                date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
                schedule.scheduleJob(date, function () {
                    request("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" + req.params.terme + "&rel=",
                        function (error, response, body) {

                            if (error) {
                                // erreur de connexion

                            } else {

                                // Connexion réussite
                                let code = body.substring(body.indexOf("<CODE>"));
                                parser.parserCode(code);
                                writer.writeFile(req.params.terme, objJSONARetourner);
                            }
                        }
                    );
                });
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