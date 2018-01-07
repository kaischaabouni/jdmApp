module.exports = {
    parserCode : function(codeDump){
        
        // parser définitions
        let startDefinition = codeDump.indexOf("<def>");
        let endDefinition = codeDump.indexOf("</def>");
        objJSONARetourner.definitions = codeDump.substring(startDefinition + 5, endDefinition);
        codeDump = codeDump.substring(endDefinition);

        // noeuds
        let startNoeuds = codeDump.indexOf("// les noeuds/termes (Entries) : e;eid;'name';type;w;'formated name'");
        let startTypesRelations = codeDump.indexOf("// les types de relations (Relation Types) : rt;rtid;'trname';'trgpname';'rthelp'");
        let codeNoeuds = codeDump.substring(startNoeuds, startTypesRelations);
        codeNoeuds = codeNoeuds.slice(codeNoeuds.indexOf("\n") + 2, -2);
        codeDump = codeDump.substring(startTypesRelations);

        // parser les types de relations
        let startRelationsSortantes = codeDump.indexOf("// les relations sortantes : r;rid;node1;node2;type;w");  
        let codeTypesRelations = codeDump.substring(0, startRelationsSortantes);
        let listeRelations = codeTypesRelations.split('\n');
        let longueurListeRelations = listeRelations.length - 2;

        // type de relations définies
        let listeTypeRelationDefinies = {"3":"Thèmes/Domaines", "5":"Sysonymes et quasi-synonymes", "6":"Génériques", "7":"Contraires", "8":"Spécifiques", "15":"Lieu", "64":"Instance", "777":"Wikipédia"};
        for (let i = 2; i < longueurListeRelations; i++) {
            let typeReltaionCourant = listeRelations[i].split(';');
            let relationID = typeReltaionCourant[1];
            relationID = relationID.substring(1, relationID.length - 1);
            //let trname = typeReltaionCourant[3];
            //trname = trname.substring(1, trname.length - 1);
            //console.log(trname);
            //if(listeTypeRelationDefinies.indexOf(relationID) >= 0){
            if(relationID in listeTypeRelationDefinies){
                if(typeof objJSONARetourner.relations === "undefined"){
                    objJSONARetourner.relations = {};
                }
                objJSONARetourner.relations[relationID] = {"trname" : listeTypeRelationDefinies[relationID], "sortantes" : "", "entrantes" : ""};
            }
        }

        // parser les relations sortantes
        let startRelationsEntrantes = codeDump.indexOf("// les relations entrantes : r;rid;node1;node2;type;w");  
        let codeRelationsSortantes = codeDump.substring(startRelationsSortantes, startRelationsEntrantes);
        codeRelationsSortantes = codeRelationsSortantes.substring(codeRelationsSortantes.indexOf('\n') + 2);
        let positionFinLigne = codeRelationsSortantes.indexOf('\n');
        while(positionFinLigne > 0){
            let relationCourante = codeRelationsSortantes.substring(0, positionFinLigne).split(';');
            if(relationCourante[4] in objJSONARetourner.relations){
                let motCourant = codeNoeuds.substring(codeNoeuds.indexOf("e;" + relationCourante[3] + ";"));
                motCourant = motCourant.substring(motCourant.indexOf(";'") + 2, motCourant.indexOf("';"));
                objJSONARetourner.relations[relationCourante[4]].sortantes = 
                    objJSONARetourner.relations[relationCourante[4]].sortantes + motCourant + ", ";
            }
            codeRelationsSortantes = codeRelationsSortantes.substring(positionFinLigne + 1);
            positionFinLigne = codeRelationsSortantes.indexOf('\n');
        }

        // parser les relations sortantes
        let endRelationsEntrantes = codeDump.indexOf("// END");  
        let codeRelationsEntrtantes = codeDump.substring(startRelationsEntrantes, endRelationsEntrantes);
        codeRelationsEntrtantes = codeRelationsEntrtantes.substring(codeRelationsEntrtantes.indexOf('\n') + 2);
        positionFinLigne = codeRelationsEntrtantes.indexOf('\n');
        while(positionFinLigne > 0){
            relationCourante = codeRelationsEntrtantes.substring(0, positionFinLigne).split(';');
            if(relationCourante[4] in objJSONARetourner.relations){
                let motCourant = codeNoeuds.substring(codeNoeuds.indexOf("e;" + relationCourante[2] + ";"));
                motCourant = motCourant.substring(motCourant.indexOf(";'") + 2, motCourant.indexOf("';"));
                objJSONARetourner.relations[relationCourante[4]].entrantes = 
                    objJSONARetourner.relations[relationCourante[4]].entrantes + motCourant + ", ";
            }
            codeRelationsEntrtantes = codeRelationsEntrtantes.substring(positionFinLigne + 1);
            positionFinLigne = codeRelationsEntrtantes.indexOf('\n');
        }
    }
  };