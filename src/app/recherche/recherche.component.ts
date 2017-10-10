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
    rt0: Relation;
    rt1: Relation;

    constructor(private _rechercheService: RechercheService) { }

    ngOnInit() {
    }

    rechercherTerme($event, termeRecherche) {
        if ($event.which === 1) {
            this._rechercheService.getResultatRecherche(termeRecherche.value)
                .subscribe(resRechercheData => {
                    this.definitions = resRechercheData.definitions;
                    this.rt0 = resRechercheData.relations.rt0;
                    this.rt1 = resRechercheData.relations.rt1;
                });
        };
    }

}
