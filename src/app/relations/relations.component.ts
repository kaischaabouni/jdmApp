import { Component, OnInit } from '@angular/core';
import { Relation } from './relation';
import { RelationService} from './relation.service';


@Component({
  selector: 'app-relations',
  templateUrl: './relations.component.html',
  styleUrls: ['./relations.component.css'],
  providers: [ RelationService ]
})
export class RelationsComponent implements OnInit {
  relations:Relation[];

  constructor(private _relationService: RelationService) { }

  ngOnInit() {
  /*
  this._relationService.getRelations()
  .subscribe(resRelationData => this.relations = resRelationData);
  */
  }

  rechercherTerme($event, termeRecherche){
    if($event.which === 1){
      this._relationService.getRelations(termeRecherche.value)
      .subscribe(resRelationData => this.relations = resRelationData);
    };
  }
}