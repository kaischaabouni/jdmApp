import { Component, OnInit } from '@angular/core';
import { RechercheService } from './recherche.service';
import { Relation } from '../modeles/relation';

@Component({
    selector: 'app-recherche',
    templateUrl: './recherche.component.html',
    styleUrls: ['./recherche.component.css'],
    providers: [RechercheService]
})

export class RechercheComponent implements OnInit {

    definitions: String[];
    rt0 = {sortantes : "", entrantes: ""};
    rt1 = {sortantes : "", entrantes: ""};

    constructor(private _rechercheService: RechercheService) { }

    ngOnInit() {
    }

    rechercherTerme($event, termeRecherche) {
        if ($event.which === 1) {
            this._rechercheService.getResultatRecherche(termeRecherche.value)
                .subscribe(resRechercheData => {
                    this.definitions = resRechercheData.definitions;

                    // rt0
                    for(let association of resRechercheData.relations.rt0.sortantes){
                        this.rt0.sortantes = this.rt0.sortantes + association.nom + "; ";
                    }
                    for(let association of resRechercheData.relations.rt0.entrantes){
                        this.rt0.entrantes = this.rt0.entrantes + association.nom + "; ";
                    }

                    // rt1
                    for(let association of resRechercheData.relations.rt1.sortantes){
                        this.rt1.sortantes = this.rt0.sortantes + association.nom + "; ";
                    }
                    for(let association of resRechercheData.relations.rt1.entrantes){
                        this.rt1.entrantes = this.rt0.entrantes + association.nom + "; ";
                    }
                });
        };
    }

}
