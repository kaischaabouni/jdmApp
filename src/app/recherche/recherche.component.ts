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

    definitions: String;
    relations : any;

    constructor(private _rechercheService: RechercheService) { }

    ngOnInit() {
    }

    rechercherTerme($event, termeRecherche) {
        if ($event.which === 1) {
            this._rechercheService.getResultatRecherche(termeRecherche.value)
                .subscribe(resRechercheData => {
                    this.definitions = resRechercheData.definitions;
                    console.log(resRechercheData.relations);
                    console.log("trace:::");
                    this.relations = resRechercheData.relations;
                });
        };
    }

}
