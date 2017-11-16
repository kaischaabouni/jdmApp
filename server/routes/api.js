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

    // fonction parser cde Dump
    let parserCode = function(codeDump){
        
        // parser définitions
        objJSONARetourner.definitions = codeDump.substring(codeDump.indexOf("<def>") + 5, codeDump.indexOf("</def>"));

        // parser les types de relations
        let startTypesRelations = codeDump.indexOf("// les types de relations (Relation Types) : rt;rtid;'trname';'trgpname';'rthelp'");
        let startRelationsSortantes = codeDump.indexOf("// les relations sortantes : r;rid;node1;node2;type;w");  
        let codeTypesRelations = codeDump.substring(startTypesRelations, startRelationsSortantes);
        let listeRelations = codeTypesRelations.split('\n');
        let longueurListeRelations = listeRelations.length - 2;

        // type de relations définies
        let listeTypeRelationDefinies = 
            ["r_domain", "r_syn", "r_isa", "r_anto", "r_hypo", "r_lieu", "r_instance", "r_wiki"];
        for (let i = 2; i < longueurListeRelations; i++) {
            let relationID = listeRelations[i].split(';')[2];
            relationID = relationID.substring(1, relationID.length - 1);
            let relationName = listeRelations[i].split(';')[3];
            relationName = relationName.substring(1, relationName.length - 1);
            if(listeTypeRelationDefinies.indexOf(relationID) >= 0){
                if(typeof objJSONARetourner.relations === "undefined"){
                    objJSONARetourner.relations = [];
                }
                objJSONARetourner.relations.push({"nom" : relationName, "sortantes" : "machin", "entrantes" : "truc"});
            }
        }

        // parser les relations sortantes
        let startRelationsEntrantes = codeDump.indexOf("// les relations entrantes : r;rid;node1;node2;type;w");  
        let codeRelationsSortantes = codeDump.substring(startRelationsSortantes, startRelationsEntrantes);
        
    }

    objJSONARetourner = {};

    fs.readFile('server/cache/dumps/' + req.params.terme + '.txt', 'utf8', function (err, data) {

        // Erreur Lecture fichier
        if (err) {

            // Erreur lecture: Fichier n'existe pas en cache
            if (err.code === 'ENOENT') {
                request("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" + req.params.terme + "&rel=",
                    function (error, response, body) {

                        if(error){

                            // erreur de connexion
                            //
                        } else {

                            // Connexion réussite
                            var code = body.substring(body.indexOf("<CODE>"));

                            // Parser Code
                            parserCode(code);

                            // Réponse
                            res.json(objJSONARetourner);
                    
                            // Ecrire fichier dans cache
                            fs.writeFile("server/cache/dumps/" + req.params.terme + ".txt", body, function (err) {
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

            // Parser Code
            parserCode(data);

            //
            res.json(objJSONARetourner);
        }
    });
});

module.exports = router;