import {Injectable} from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators'

// import 'rxjs/add/operator/map';
import { Observable, of } from "rxjs";
import {GLOBAL} from './global';
import { from } from 'rxjs';


import { Localidad} from "../modelos/localidad";

@Injectable()
export class LocalidadService{
    public identity;
    public token;
    public url : string;
    
    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    getLocalidadesPorProvincia(idProvincia){
        let json = JSON.stringify(idProvincia);
        let params = json;
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.get(this.url + 'global/getLocalidadesPorProvincia/'+ params, {'headers':headers});
    }

    getIdProvinciaPorIdLocalidad(idLocalidad){
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.get(this.url + 'global/getIdProvincias/' + idLocalidad, {'headers':headers});
    }
}