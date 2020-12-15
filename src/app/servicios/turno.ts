import {Injectable} from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators'

// import 'rxjs/add/operator/map';
import { Observable, of } from "rxjs";
import {GLOBAL} from './global';
import { from } from 'rxjs';


import { Turno } from "../modelos/turno";



@Injectable()
export class TurnoService{
    public identity;
    public token;
    public url : string;
    
    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    getTurnos(tipo){
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.get(this.url + 'turno/getTurnosDisponiblesTipo/'+ tipo, {'headers':headers});
    }

    delete(turno){
        let json = JSON.stringify(turno);
        let params = json;
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.put(this.url + 'turno/update', params, {'headers':headers});
    }

    update(turno){
        let json = JSON.stringify(turno);
        let params = json;
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.put(this.url + 'turno/update', params, {'headers':headers});
    }

    add(turno){
        let json = JSON.stringify(turno);
        let params = json;
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.post(this.url + 'turno/add', params, {'headers':headers});
    }
}