import { NgModule, Component, OnInit, ɵConsole } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from "ngx-toastr";

//SERVICIOS
import { UsuarioService} from "../../servicios/usuario";
import { TipoPersonaService } from "../../servicios/tipos_persona";
import { ProvinciaService} from "../../servicios/provincia";
import { LocalidadService} from "../../servicios/localidad";

//MODELOS
import { Usuario } from "../../modelos/usuario";
import { Tipos_persona } from "../../modelos/tipos_persona";
import { Provincia } from "../../modelos/provincia";
import { Localidad } from "../../modelos/localidad";
//import { copyFileSync } from 'fs';

@Component({
    selector: 'usuario-cmp',
    moduleId: module.id,
    templateUrl: 'usuario.component.html',
    providers:[TipoPersonaService]
})

export class UsuarioComponent implements OnInit{
    public alertMessage;
    public tipoMessage;
    public identity;  
    public token;
    public errorMessage;
    // public matricula = false;
    public localidades : Localidad[];
    public localidadSeleccionada: number;
    public localidad : Localidad;
    public provincias: Provincia[];
    public provinciaSeleccionada: number;
    public provincia:Provincia;

    public usuario:Usuario;
    public usuarios : Usuario[];
    public usuariosAux : Usuario[];

    public tiposPersona : Tipos_persona[];
    public tipo : Tipos_persona;
    tipoSel;
    public tituloModal: string;
    public alta;
    closeResult: string;

    constructor(
        private modalService: NgbModal,
        private toastr: ToastrService,
        private _localidadServicio:LocalidadService,
        private _provinciaSericio:ProvinciaService,
        private _usuarioServicio:UsuarioService,
        private _tiposPersonaServicio: TipoPersonaService
        ){
        this.identity = this._usuarioServicio.getIdentity();
        this.token = this._usuarioServicio.getToken();
        this.usuario = new Usuario(0,2,1,'','','','','','','','',1,'');
    }
    
    
    ngOnInit(){
        this.buscarTiposPersona();
        this.buscarUsuariosActivos();
    }

    buscarTiposPersona(){
        this._tiposPersonaServicio.getTiposPersonaGestionables().toPromise().then((response: any) => {
            if(response == null){
              console.log('error');                    
            }else{
                for (let p of Object.keys(response)) {
                    var wregistro = response[p];
                    this.tiposPersona = wregistro;
                }
            }
          }
        );
        //ORDENO LA LISTA SEGUN EL NOMBRE
        // this.tiposPersona.sort((a, b) => (a.nombre < b.nombre) ? 1 : -1)
    }

    onSeleccionarPorTipoModal(tipo){
        let idTp = tipo.id_tipo_persona;
        this._usuarioServicio.getUsuarioTipo(idTp).toPromise().then((response: any) => {
            if(response == null){
                console.log('error');                    
            }else{
                let lista:any[];
                lista = response;
                for (let p of Object.keys(response)) {
                    var wregistro = response[p];
                    this.usuarios = wregistro;
                    }
                }
            }
        );
    }

    onSeleccionarPorTipo(tipo){
        let idTp = tipo.id_tipo_persona;
        this._usuarioServicio.getUsuarioTipo(idTp).toPromise().then((response: any) => {
            if(response == null){
                console.log('error');                    
            }else{
                // console.log(response);
                // let lista:any[];
                // lista = response;
                this.usuarios = response;
                // for (let p of Object.keys(response)) {
                //     var wregistro = response[p];
                //     this.usuarios = wregistro;
                //     }
                // }
            }
        });
    }

    onSeleccionarTipoUsuario(tipo){
        // if(tipo.nombre=='Profesional'){
        //     this.matricula = true;
        // }
        // else{
        //     this.matricula = false;
        // }
        console.log(tipo);
        this.tipoSel = tipo.id_tipo_persona;
    }

    onConfirmaBorrar(usuario){
        this._usuarioServicio.delete(usuario.id_persona).toPromise().then((data: any) => {
            if(!data){
                this.alertMessage = 'Algo salio mal.';
                this.tipoMessage = "alert alert-warning alert-with-icon",
                this.showNotification();
                this.modalService.dismissAll();        
            }else{
                console.log('res',data);
                this.alertMessage = 'Usuario Eliminado';
                this.tipoMessage = "alert alert-success alert-with-icon",
                this.showNotification();
                this.modalService.dismissAll();
                this.buscarUsuariosActivos();
            }
        });
    }

    onBorrar(eliminarModal,usuario){
        this.tituloModal = 'Eliminar Usuario';
        this.usuario = this.usuarios.find(i => i.id_persona === usuario.id_persona);    
        this.modalService.open(eliminarModal).result.then( 
            (result) => {
                this.closeResult = `Closed with: ${result}`;
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }

    onEditar(modalAltaEdicion, usuario){
        this.usuario = this.usuarios.find(i => i.id_persona === usuario.id_persona);    
        this.buscarProvincias();

        this.localidadSeleccionada = this.usuario.id_localidad;

        this._localidadServicio.getIdProvinciaPorIdLocalidad(this.localidadSeleccionada).toPromise().
            then((response : any) =>{
                if(response == null){
                    console.log('error');
                }else{
                    this.provinciaSeleccionada = response.body[0].id_provincia;
                    this.provincia = this.provincias.find(i => i.id_provincia === this.provinciaSeleccionada);    

                    this._localidadServicio.getLocalidadesPorProvincia(this.provincia.id_provincia).toPromise()
                        .then((response: any) => {
                            if(response == null){
                                console.log('error');                    
                            }else{
                                this.localidades = response.body;
                                this.localidad = this.localidades.find(i => i.id_localidad === this.localidadSeleccionada);
                            }
                        }
                    );

                    this.tipo = this.tiposPersona.find(i => i.id_tipo_persona === this.usuario.id_tipo_persona);

                    this.alta = false;
                    this.tituloModal = 'Modificar Usuario';
                    
                    this.modalService.open(modalAltaEdicion).result.then( 
                        (result) => {
                            this.closeResult = `Closed with: ${result}`;
                        },
                        (reason) => {
                            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                        }
                    );
                }
            });
    }

    onNuevoUsuario(modalAltaEdicion){
        this.buscarProvincias();
        this.usuario = new Usuario(0,0,0,'','','','','','','','',1,'');
        this.alta = true;
        this.tituloModal = 'Crear Usuario';
        this.modalService.open(modalAltaEdicion).result.then( 
            (result) => {
                this.closeResult = `Closed with: ${result}`;
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }

    buscarUsuariosActivos(){
        let activo = 'activos';
        this._usuarioServicio.getUsuarios(activo).toPromise().then((response: any) => {
            if(response == null){
              console.log('error');                    
            }else{
                // console.log(response.body);
                this.usuarios = response.body;
         
                // for (let p of Object.keys(response.body)) {
                //     var wregistro = response.body[p];
                //     this.usuariosAux = wregistro;
                // }
                // var list = [];
                // var len  = this.tiposPersona.length;
                // for (var j = 0, len2 = this.usuariosAux.length; j < len2; j++){
                //     for (var i = 0, len = len ; i < len; i++){
                //         if(this.usuariosAux[j].id_tipo_persona === this.tiposPersona[i].id_tipo_persona){
                //             list.push(this.usuariosAux[j]); 
                //         }
                //     }
                // } 

                // this.usuarios = list;
                //ORDENO LA LISTA SEGUN EL NOMBRE
                // this.usuarios.sort((a, b) => (a.apellido < b.apellido) ? 1 : -1)
            }
          }
        );
    }

    /*PARA SABER COMO SALIO DEL MODAL */
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {            
            return 'by clicking on a backdrop';

        } else {            
            return `with: ${reason}`;
        }
    }

    onAccion(){
        
        this.usuario.id_localidad = this.localidadSeleccionada; 
        this.usuario.id_tipo_persona = this.tipoSel;
        this.usuario.nombre_usuario = this.usuario.dni;
        this.usuario.clave_usuario = this.usuario.dni;
        console.log(this.usuario);
        if(this.alta){
            this._usuarioServicio.add(this.usuario).toPromise().
            then((data:any) => {
                if(!data){
                  console.log('error');    
                  //VER BIEN ESTE TEMA, LA DEVOLCUION DE ERRORES, 
                  //CORREO REPETIDOS ETC.
                  this.alertMessage = 'Algo salio mal.';
                  this.tipoMessage = "alert alert-warning alert-with-icon",
                  this.showNotification();
                  this.modalService.dismissAll();
                }
                // console.log('res',data);
                this.alertMessage = 'Usuario creado';
                this.tipoMessage = "alert alert-success alert-with-icon",
                this.showNotification();
                this.modalService.dismissAll();
                this.buscarUsuariosActivos();
              }
            );
        }else{
            // console.log('usuario antes de editar',this.usuario);
            this._usuarioServicio.update(this.usuario).toPromise().
            then((data:any) => {
                if(!data){
                  //VER BIEN ESTE TEMA, LA DEVOLCUION DE ERRORES, 
                  //CORREO REPETIDOS ETC.
                  this.alertMessage = 'Algo salio mal.';
                  this.tipoMessage = "alert alert-warning alert-with-icon",
                  this.showNotification();
                  this.modalService.dismissAll();
                }
                console.log('response',data);
                this.alertMessage = 'Usuario modificado';
                this.tipoMessage = "alert alert-success alert-with-icon",
                this.showNotification();
                this.modalService.dismissAll();
                this.buscarUsuariosActivos();
              }
            );
        }
    }


    buscarProvincias(){
        this._provinciaSericio.getProvincias().toPromise().then((response: any) => {
          if(response == null){
            console.log('error');                    
          }else{
            let lista:any[];
            lista = response;
            for (let p of Object.keys(lista)) {
              var wregistro = lista[p];
              this.provincias = wregistro;
            }
            //SELECCION EL PRIMERO POR DEFECTO
            this.provinciaSeleccionada = this.provincias[0].id_provincia;
          }
        });
    }
      
    onSeleccionLocalidad(localidad){
        // console.log('localidad',localidad);
        let id_localidad = localidad.id_localidad;
        this.localidadSeleccionada = id_localidad; 
        // console.log('id localidad',this.localidadSeleccionada);
    }
    
      //SEGUN LA PROVINCIA ELEGIDA BUSCO LAS CIUDADES
    onSeleccionProvivincia(provincia){
        this.provinciaSeleccionada = provincia.id_provincia;
    
        this._localidadServicio.getLocalidadesPorProvincia(provincia.id_provincia).toPromise().then((response: any) => {
          if(response == null){
            console.log('error');                    
          }else{
            let lista:any[];
            lista = response;
            for (let p of Object.keys(lista)) {
              var wregistro = lista[p];
              this.localidades = wregistro;
            }
            //SELECCION EL PRIMERO POR DEFECTO
            this.localidadSeleccionada = this.localidades[0].id_localidad;
          }
        });
    }
    
    // NOTIFICACION
    showNotification() {
    this.toastr.success(
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">'
        + this.alertMessage + '</span>',
        "",
        {
        timeOut: 3000,
        closeButton: true,
        enableHtml: true,
        toastClass: this.tipoMessage,
        positionClass: "toast-top-center"
        }
    );
  }

}
