import { Component, OnInit } from '@angular/core';
import { UsuarioService } from "../../servicios/usuario";


@Component({
    selector: 'blog-cmp',
    moduleId: module.id,
    templateUrl: 'blog.component.html',
    providers:[UsuarioService],    
})

export class BlogComponent implements OnInit{
    public identity;  
    public token;

    constructor( 
        private _usuarioServicio:UsuarioService
      ){
        this.identity = this._usuarioServicio.getIdentity();
        this.token = this._usuarioServicio.getToken();
      }
    
    ngOnInit(){
    }
    
    onBlog(){
      window.open('http://lacasonacoop.com/#!/blog/');
    }
  
}
