import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ROUTESAdmin } from '../../sidebar/sidebar.component';
import { ROUTESPaciente } from '../../sidebar/sidebar.component';
import { ROUTESProfesional } from '../../sidebar/sidebar.component';
import { ROUTESSuper } from '../../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { Location} from '@angular/common';

//SERVICIOS
import { UsuarioService} from "../../servicios/usuario";

// MODELOS
import { Usuario } from "../../modelos/usuario";

@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html',
    providers: [UsuarioService], 
})

export class NavbarComponent implements OnInit{
    public identity;  
    public token;
    public usuario: Usuario;

    private listTitles: any[];
    location: Location;
    private nativeElement: Node;
    private toggleButton;
    private sidebarVisible: boolean;

    public isCollapsed = true;
    @ViewChild("navbar-cmp", {static: false}) button;

    constructor(location:Location, 
        private renderer : Renderer2, 
        private _router: Router,
        private element : ElementRef, 
        private router: Router, 
        private _usuarioServicio:UsuarioService) {
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
        this.identity = this._usuarioServicio.getIdentity();
        this.token = this._usuarioServicio.getToken();
        this.usuario = this.identity;
    
      }

    ngOnInit(){
      
      /*SEGUN EL TIPO DE USUARIO CARGA UN MENU U OTRO */
        switch(this.identity.id_tipo_persona){
          case 1:{
              this.listTitles = ROUTESAdmin.filter(listTitle => listTitle);
              break;
          }
          case 2:{
              this.listTitles = ROUTESProfesional.filter(listTitle => listTitle);
              break;
          }
          case 3  :{
              this.listTitles = ROUTESPaciente.filter(listTitle => listTitle);
              break;
          }
          case 4  :{
            this.listTitles = ROUTESSuper.filter(listTitle => listTitle);
            break;
          }
          case 5  :{
              this.listTitles = ROUTESSuper.filter(listTitle => listTitle);
              break;
          }
        }

        // this.listTitles = ROUTES.filter(listTitle => listTitle);
        var navbar : HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        this.router.events.subscribe((event) => {
          this.sidebarClose();
       });

      
    }
    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 1 );
      }
      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      // return 'Dashboard';
    }
    sidebarToggle() {
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
      }
      sidebarOpen() {
          const toggleButton = this.toggleButton;
          const html = document.getElementsByTagName('html')[0];
          const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
          setTimeout(function(){
              toggleButton.classList.add('toggled');
          }, 500);

          html.classList.add('nav-open');
          if (window.innerWidth < 991) {
            mainPanel.style.position = 'fixed';
          }
          this.sidebarVisible = true;
      };
      sidebarClose() {
          const html = document.getElementsByTagName('html')[0];
          const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
          if (window.innerWidth < 991) {
            setTimeout(function(){
              mainPanel.style.position = '';
            }, 500);
          }
          this.toggleButton.classList.remove('toggled');
          this.sidebarVisible = false;
          html.classList.remove('nav-open');
      };
      collapse(){
        this.isCollapsed = !this.isCollapsed;
        const navbar = document.getElementsByTagName('nav')[0];
        console.log(navbar);
        if (!this.isCollapsed) {
          navbar.classList.remove('navbar-transparent');
          navbar.classList.add('bg-white');
        }else{
          navbar.classList.add('navbar-transparent');
          navbar.classList.remove('bg-white');
        }

      }
  
  logout(){
    
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear;
    this.identity = null;    
    this.token = null;    
    // this._router.navigate(['/']);
    location.reload();    
  }
}
