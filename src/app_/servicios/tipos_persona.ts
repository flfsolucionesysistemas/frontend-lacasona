import {Injectable} from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators'

// import 'rxjs/add/operator/map';
import { Observable, of } from "rxjs";
import {GLOBAL} from './global';
import { from } from 'rxjs';


//import { Tipos_persona} from "../modelos/tipos_persona";

@Injectable()
export class TipoPersonaService{
    public identity;
    public token;
    public url : string;
    
    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    getTiposPersona(){
        // let json = JSON.stringify(idProvincia);
        // let params = json;
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.get(this.url + 'tipos_persona/getTiposPersona', {'headers':headers});
    }

    getTiposPersonaGestionables(){
        // let json = JSON.stringify(idProvincia);
        // let params = json;
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.get(this.url + 'tipos_persona/getTiposPersonaGestionables', {'headers':headers});
    }
}