import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {GLOBAL} from './global';

@Injectable()
export class EvolucionService{
    public identity;
    public token;
    public url : string;
    
    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    add(evolucion){
        let json = JSON.stringify(evolucion);
        let params = json;
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.post(this.url + 'hc/addEvolucion', params, {'headers':headers});
    }
}