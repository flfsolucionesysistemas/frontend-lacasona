import { NgModule, Component, OnInit, ɵConsole } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from "ngx-toastr";


//MODELOS
import { Usuario } from "../../../modelos/usuario";
import { Patologia} from "../../../modelos/patologia";
import { HistoriaClinica } from "../../../modelos/historiaClinica";
import { Tratamiento } from "../../../modelos/tratamiento";

//SERVICIOS
import { UsuarioService } from "../../../servicios/usuario";
import { PatologiaService } from "../../../servicios/patologia";
import { HistoriaClinicaService } from "../../../servicios/historia_clinica"; 
import { TratamientoService} from '../../../servicios/tratamiento';

@Component({
    selector: 'creaEntrevista-cmp',
    moduleId: module.id,
    templateUrl: 'creaEntrevista.component.html',
    providers:[UsuarioService,PatologiaService,HistoriaClinicaService,TratamientoService ]
})

export class CreaEntrevistaComponent implements OnInit{
    public usuarioParametro;
    public alertMessage;
    public tipoMessage;
    public identity;  
    public token;
    public errorMessage;

    public usuario:Usuario;
    public nombrePaciente;
    public apellidoPaciente;
    public emailPaciente;
    public telefonoPaciente;

    public patologias : Patologia[];
    public descripcionPatologia ;
    public idPatologia;
    public hc : HistoriaClinica;

    public tratamiento : Tratamiento;
    //BANDERA PARA MOSTRAR O NO LOS CARDS HC Y TRATAMIENTO
    public historiaClinicaCreada;
    
    constructor(
        private toastr: ToastrService,
        private modalService: NgbModal,
        private _router: Router,
        private _route: ActivatedRoute,
        private _patologiaServicio: PatologiaService,
        private _usuarioServicio: UsuarioService,
        private _historiaClinica:HistoriaClinicaService,
        private _tratamientoServicio:TratamientoService
      ){
        this.identity = this._usuarioServicio.getIdentity();
        this.token = this._usuarioServicio.getToken();
        this.usuario = new Usuario(0,2,1,'','','','','','','','',1);
        this.hc = new HistoriaClinica(0,0,0,0,'','',0,0,);
        this.tratamiento = new Tratamiento(0,0,0,'',0,'');
        this.historiaClinicaCreada = false;
    }

    ngOnInit(){
        // RECIBO EL ID DEL USUARIO PARA CREAR LA H.C. Y CONVERTRLO EN CLIENTE/PACIENTE
        this._route.params.subscribe((params: Params) => this.usuarioParametro = params['idUsuario']);
        this.buscarUsuario(this.usuarioParametro);        
        this.buscarPatologiasActivas();
    }

    buscarPatologiasActivas(){
        let activo = 1;
        this._patologiaServicio.getPatologiasActivos(activo).toPromise().then((response: any) => {
            if(response == null){
              console.log('error');                    
            }else{
                this.patologias = response.lista_patologia;
            }
          }
        );  
    }

    onSeleccionarPatologia(patologia){
        // console.log(patologia);
        this.descripcionPatologia = patologia.descripcion;
        this.idPatologia = patologia.id_patologia;
        // console.log(this.idPatologia);
    }

    buscarUsuario(idUsuario){
        this._usuarioServicio.getUsuario(idUsuario).toPromise().then((response: any) => {
            if(response == null){
              console.log('error');                    
            }else{
                
                this.usuario = response.body;

                this.nombrePaciente = this.usuario[0].nombre;
                this.apellidoPaciente = this.usuario[0].apellido;
                this.telefonoPaciente = this.usuario[0].telefono;
                this.emailPaciente = this.usuario[0].email;

                this.hc = new HistoriaClinica(0,
                                                this.usuario[0].id_persona,
                                                0,
                                                this.identity.id_persona,
                                                '',
                                                'ACEPTADO',
                                                this.usuario[0].id_localidad,
                                                1);
                
                // console.log('usuario', this.usuario[0]);
                // console.log('hc', this.hc);
            }
          }
        );
    }

    onCrearHC(){
        this._historiaClinica.add(this.hc).toPromise().
            then((data:any) => {
                if(!data){
                    console.log('error');    
                    //VER BIEN ESTE TEMA, LA DEVOLCUION DE ERRORES, 
                    //CORREO REPETIDOS ETC.                
                    this.alertMessage = 'Algo salio mal.';
                    this.tipoMessage = "alert alert-warning alert-with-icon",
                    this.showNotification();
                }
                    this.historiaClinicaCreada = true;
                    let dato = data.result.insertId;
                    // console.log(dato);
                    this.alertMessage = 'História Clínica creada con éxito, continuar con el tratamiento.';
                    this.tipoMessage = "alert alert-success alert-with-icon",
                    this.showNotification();

                    this.tratamiento.id_historia_clinica = dato;
                }
            ); 

        this.hc = new HistoriaClinica(0,0,0,0,'','',0,0,);
    }

    onCreaTratamiento(){
        this.tratamiento.id_patologia = this.idPatologia;
        console.log(this.tratamiento);
        this._tratamientoServicio.add(this.tratamiento).toPromise().
            then((data:any) => {
                if(!data){
                    console.log('error');    
                    this.alertMessage = 'Algo salio mal.';
                    this.tipoMessage = "alert alert-warning alert-with-icon",
                    this.showNotification();

                    //SINO PUDO CREAR EL TRATAMIENTO, BORRAR LA HC
                }
                    this.alertMessage = 'Tratamiento creado con éxito.';
                    this.tipoMessage = "alert alert-success alert-with-icon",
                    this.showNotification();
                    this._router.navigate(['/entrevista']);
                }
            ); 
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
