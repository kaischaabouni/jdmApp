import { Injectable } from '@angular/core';
import { Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class RelationService {
 private _getUrl = "/api";

  constructor(private _http: Http) { }

  getRelations(){
  return this._http.get(this._getUrl)
  .map((response: Response)=> response.json());
  }

}