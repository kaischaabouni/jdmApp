import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class RechercheService {

    private _getUrl = "/api/";

    constructor(private _http: Http) { }

    getResultatRecherche(terme) {
        return this._http.get(this._getUrl + terme).map((response: Response) => response.json());
    }
}
