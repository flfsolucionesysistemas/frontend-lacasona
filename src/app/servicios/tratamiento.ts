import {Injectable} from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators'

// import 'rxjs/add/operator/map';
import { Observable, of } from "rxjs";
import {GLOBAL} from './global';
import { from } from 'rxjs';


// import { Usuario } from "../modelos/usuario";

@Injectable()
export class TratamientoService{
    public identity;
    public token;
    public url : string;
    
    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    getTratamientosActivos(activo){
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.get(this.url + 'tratamiento/listarActivos/' + activo, {'headers':headers});
    }

    deleteTratamiento(tratamiento){
        let json = JSON.stringify(tratamiento);
        let params = json;
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.put(this.url + 'tratamiento/update', params, {'headers':headers});
    }

    update(tratamiento){
    
        let json = JSON.stringify(tratamiento);
        let params = json;
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.put(this.url + 'tratamiento/update', params, {'headers':headers});
    }


    add(tratamiento){
        let json = JSON.stringify(tratamiento);
        let params = json;
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.post(this.url + 'tratamiento/add', params, {'headers':headers});
    }
}