import {Injectable} from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators'

// import 'rxjs/add/operator/map';
import { Observable, of } from "rxjs";
import {GLOBAL} from './global';
import { from } from 'rxjs';


import { Provincia} from "../modelos/provincia";

@Injectable()
export class ProvinciaService{
    public identity;
    public token;
    public url : string;
    
    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    
    getProvincias(){
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.get(this.url + 'global/getProvincias', {'headers':headers});
    }

    updateProvincia(provincia){
        let json = JSON.stringify(provincia);
        let params = json;
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.put(this.url + 'global/updateProvincia', params, {'headers':headers});
    }
}