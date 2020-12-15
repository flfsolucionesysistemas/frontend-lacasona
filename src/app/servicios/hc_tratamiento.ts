import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { catchError, retry } from 'rxjs/operators'
// import { Observable, of } from "rxjs";
import {GLOBAL} from './global';
// import { from } from 'rxjs';

@Injectable()
export class Hc_TratamientoService{
    public identity;
    public token;
    public url : string;
    
    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    add(hc_tratamiento){
        let json = JSON.stringify(hc_tratamiento);
        let params = json;
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.post(this.url + 'hc/addHCTratamiento', params, {'headers':headers});
    }

    put(hc_tratamiento){
        let json = JSON.stringify(hc_tratamiento);
        let params = json;
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.put(this.url + 'hc/updateHCTratamiento', params, {'headers':headers});
    }

    getHCTratamientoPorHC(idHC){
        // let json = JSON.stringify(tipo);
        // let params = json;
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.get(this.url + 'hc/getHCTratamientoPorHC/'+ idHC, {'headers':headers});
    }

    getHCTratamientoSinFechaAlta(){
        // let json = JSON.stringify(tipo);
        // let params = json;
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.get(this.url + 'hc/getHCTratamientoSinFechaAlta', {'headers':headers});
    }
}