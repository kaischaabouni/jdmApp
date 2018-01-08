var fs = require('fs');

module.exports = {
    writeFile: function (fileName, objJSONARetourner) {
        // Ecrire fichier dans cache
        fs.writeFile("server/cache/dumps/" + fileName + ".json", JSON.stringify(objJSONARetourner), 'utf8', function (err) {
            // Erreur lors de l'ecriture du fichier
            if (err) {
                return console.log(err);
            }
        });

        // Date de validité (7 jours)
        let validityDate = new Date();
        validityDate.setTime(validityDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        fs.writeFile("server/cache/validity/" + fileName + ".txt", validityDate.getTime(), function (err) {
            // Erreur lors de l'ecriture du fichier
            if (err) {
                return console.log(err);
            }
        });
    }
};