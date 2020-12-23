import {Injectable} from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators'

import { Observable, of } from "rxjs";
import {GLOBAL} from './global';
import { from } from 'rxjs';

@Injectable()
export class HistoriaClinicaService{
    public identity;
    public token;
    public url : string;
    
    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    add(historiaClinica){
        let json = JSON.stringify(historiaClinica);
        let params = json;
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.post(this.url + 'hc/addHC', params, {'headers':headers});
    }
    
    getHCPorPersona(idPersona){
        // let json = JSON.stringify(tipo);
        // let params = json;
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.get(this.url + 'hc/getHCPorPersona/'+ idPersona, {'headers':headers});
    }

    getSolicitudResumenHC(idPersona){
        // let json = JSON.stringify(tipo);
        // let params = json;
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.get(this.url + 'global/solicitaHC/'+ idPersona, {'headers':headers});
    }
}