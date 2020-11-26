import {Injectable} from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators'

// import 'rxjs/add/operator/map';
import { Observable, of } from "rxjs";
import {GLOBAL} from './global';
import { from } from 'rxjs';


import { Usuario } from "../modelos/usuario";

@Injectable()
export class UsuarioService{
    public identity;
    public token;
    public url : string;
    
    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    login(user_to_login, gethash = null){
        if(gethash != null){
            user_to_login.gethash = gethash;
        }
        let json = JSON.stringify(user_to_login);
        let params = json;
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.post(this.url + 'users/login', params, {'headers':headers});
    }

    add(user){
    
        let json = JSON.stringify(user);
        let params = json;
        // console.log('2do',params);
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.post(this.url + 'users/add', params, {'headers':headers});
    }

    update(user){
    
        let json = JSON.stringify(user);
        let params = json;
        // console.log('2do',params);
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.put(this.url + 'users/updateUser', params, {'headers':headers});
    }

    getUsuarioTipo(tipo){
        // let json = JSON.stringify(tipo);
        // let params = json;
        let headers = new HttpHeaders({'Content-Type':'application/json'});
      
        return this._http.get(this.url + 'users/getUserTipo/'+ tipo, {'headers':headers});
    }

    getUsuario(idUsuario){
        let headers = new HttpHeaders({'Content-Type':'application/json'});
        return this._http.get(this.url + 'users/getUserId/'+ idUsuario, {'headers':headers});
    }

    getUsuarios(activo){
        let headers = new HttpHeaders({'Content-Type':'application/json'});
        return this._http.get(this.url + 'users/getUser/'+ activo, {'headers':headers});
    }
    
    delete(idUsuario){
        // let headers = new Headers({
        //     'Content-Type':'application/json',
        //     'Authorization':token
        // });
        let headers = new HttpHeaders({'Content-Type':'application/json'});
        // let options = new RequestOptions({headers:headers});
        return this._http.delete(this.url+'users/deleteUser/' + idUsuario,{'headers':headers});
    }

    //OBTIENE LA SESION GUARDA
    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'));
        if(identity != "undefined"){
            this.identity = identity;
        }else{
            this.identity = null;
        }
        return this.identity;
    }

    //OBTIENE EL TOKEN DEL USUARIO LOGUEADO
    getToken(){
        let token = localStorage.getItem('token');
        
        if(token != "undefined"){
            this.token = token;
        }else{
            this.token = null;
        }
        return this.token;
    }
}