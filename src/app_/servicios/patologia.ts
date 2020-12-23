import {Injectable} from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators'

// import 'rxjs/add/operator/map';
import { Observable, of } from "rxjs";
import {GLOBAL} from './global';
import { from } from 'rxjs';


// import { Patologia} from "../modelos/patologia";

@Injectable()
export class PatologiaService{
    public identity;
    public token;
    public url : string;
    
    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    getPatologiasActivos(activo){
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.get(this.url + 'patologia/listarActivos/' + activo, {'headers':headers});
    }

    deletePatologia(patologia){
        let json = JSON.stringify(patologia);
        let params = json;
        // console.log('2do',params);
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.put(this.url + 'patologia/update', params, {'headers':headers});

        // let headers = new Headers({
        //     'Content-Type':'application/json',
        //     'Authorization':token
        // });
        // let headers = new HttpHeaders({'Content-Type':'application/json'});
        // let options = new RequestOptions({headers:headers});
        // return this._http.put(this.url+'patologia/update/' + idPatologia,{'headers':headers});
    }


    add(patologia){
    
        let json = JSON.stringify(patologia);
        let params = json;
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.post(this.url + 'patologia/add', params, {'headers':headers});
    }

    update(patologia){
    
        let json = JSON.stringify(patologia);
        let params = json;
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.put(this.url + 'patologia/update', params, {'headers':headers});
    }

}