import { NgModule, Component, OnInit, ɵConsole } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from "ngx-toastr";


//MODELOS
import { Usuario } from "../../../modelos/usuario";
import { Hc_Tratamiento } from "../../../modelos/hc_tratamiento";
import { Tratamiento } from "../../../modelos/tratamiento";
import { Registro } from "../../../modelos/registro";

//SERVICIOS
import { UsuarioService } from "../../../servicios/usuario";
// import { HistoriaClinicaService } from "../../../servicios/historia_clinica"; 
import { TratamientoService} from '../../../servicios/tratamiento';
import { Hc_TratamientoService } from "../../../servicios/hc_tratamiento";

@Component({
    selector: 'creaTratamiento-cmp',
    moduleId: module.id,
    templateUrl: 'creaTratamiento.component.html',
    providers:[UsuarioService,Hc_TratamientoService,TratamientoService ]
})

export class CreaTratamientoComponent implements OnInit{
    public idHcParametro;

    public alertMessage;
    public tipoMessage;
    public identity;  
    public token;
    public errorMessage;

    public usuario:Usuario;

    public tratamiento : Tratamiento;
    public tratamientos : Tratamiento[];

    public hc_tratamiento : Hc_Tratamiento;

    constructor(
        private toastr: ToastrService,
        private modalService: NgbModal,
        private _router: Router,
        private _route: ActivatedRoute,
        private _usuarioServicio: UsuarioService,
        private _hc_tratamientoServicio:Hc_TratamientoService,
        private _tratamientoServicio:TratamientoService
      ){

        this.identity = this._usuarioServicio.getIdentity();
        this.token = this._usuarioServicio.getToken();

        this.usuario = new Usuario(0,2,1,'','','','','','','','',1,'');
        // this.tratamiento = new Tratamiento(0,'-',0,0,0,'-','-','-','-',1);
        this.tratamiento = new Tratamiento(0,'',0,0,0,'','','','',1,0);
    }

    ngOnInit(){
        // RECIBO EL ID DEL USUARIO PARA CREAR LA H.C. Y CONVERTRLO EN CLIENTE/PACIENTE
        this._route.params.subscribe((params: Params) => this.idHcParametro = params['idHC']);
        // this.buscarUsuario(this.idHcParametro);        
        // console.log(this.idHcParametro);
        this.buscarTratamientosActivos();
    }

    buscarTratamientosActivos(){
        this._tratamientoServicio.getTratamientosActivos(1).toPromise().then((response:any) => {
            if (response){
                console.log(response.lista_tratamientos);
                this.tratamientos = response.lista_tratamientos;
            }
        });
    }

    onRelacionar(){
        let myDate = new Date();
        let hoy = myDate.getFullYear() + "-" + (myDate.getMonth()+1) + "-" + myDate.getDate();

        this.hc_tratamiento = new Hc_Tratamiento(this.idHcParametro,this.tratamiento.id_tratamiento,hoy);

        console.log(this.hc_tratamiento);
        this._hc_tratamientoServicio.add(this.hc_tratamiento).toPromise().
            then((data:any)=>{
                if(data != null){
                    this.alertMessage = data.mensaje;
                    this.tipoMessage = "alert alert-success alert-with-icon",
                    this.showNotification();
                    this._router.navigate(['/paciente']);
                }
        })
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
