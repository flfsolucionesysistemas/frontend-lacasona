import { NgModule, Component, OnInit, ɵConsole } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from "ngx-toastr";


//MODELOS
import { Usuario } from "../../../modelos/usuario";
import { HistoriaClinica } from "../../../modelos/historiaClinica";
import { Registro } from "../../../modelos/registro";

//SERVICIOS
import { UsuarioService } from "../../../servicios/usuario";
import { HistoriaClinicaService } from "../../../servicios/historia_clinica"; 
import { ConsultaService } from "../../../servicios/consulta";
import { LocalidadService } from "../../../servicios/localidad";

@Component({
    selector: 'creaEntrevista-cmp',
    moduleId: module.id,
    templateUrl: 'creaEntrevista.component.html',
    providers:[UsuarioService,LocalidadService,HistoriaClinicaService,ConsultaService ]
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
    public telefonoPaciente;
    public cgip;
    public idProvincia;
    public hc : HistoriaClinica;

    //BANDERA PARA MOSTRAR O NO LOS CARDS HC Y TRATAMIENTO
    public historiaClinicaCreada;
    public fecha : Date = new Date();

    public registro:Registro;

    constructor(
        private toastr: ToastrService,
        private modalService: NgbModal,
        private _router: Router,
        private _route: ActivatedRoute,
        private _usuarioServicio: UsuarioService,
        private _historiaClinica:HistoriaClinicaService,
        private _consultaServicio:ConsultaService,
        private _localidadServicio:LocalidadService
      ){
        this.identity = this._usuarioServicio.getIdentity();
        this.token = this._usuarioServicio.getToken();
        this.usuario = new Usuario(0,2,1,'','','','','','','','',1,'');

        this.hc = new HistoriaClinica(0,0,0,0,'','','',0,0,);
        this.historiaClinicaCreada = false;
        let hoy = new Date();
        this.registro = new Registro(hoy,0,0,'','','','','',hoy,0,'','','','','','','','','','','','','');
    }

    ngOnInit(){
        // RECIBO EL ID DEL USUARIO PARA CREAR LA H.C. Y CONVERTRLO EN CLIENTE/PACIENTE
        this._route.params.subscribe((params: Params) => this.usuarioParametro = params['idUsuario']);
        this.buscarUsuario(this.usuarioParametro);     
        //console.log(this.usuario[0]);
    }

    generaCGIP(){
        
        let dniLeng = this.registro.numero_documento.length;
        // this.cgip = this.usuario[0].id_localidad + '-' + 
        //             this.registro.numero_documento.substr(dniLeng-3) + '-' +
        //             this.usuario[0].id_persona;


        this.cgip = this.idProvincia + '-' +
                    this.usuario[0].id_localidad + '-' + 
                    this.registro.numero_documento.substr(dniLeng-3) + '-' +
                    this.usuario[0].id_persona;
    }


    buscarIdProvincia(idLocalidad){

        this._localidadServicio.getIdProvinciaPorIdLocalidad(idLocalidad).toPromise().then((response: any) => {
            if(response == null){
              console.log('error');                    
            }else{
                // this.idProvincia = response.body.id_provincia;
                let resp = response.body;
                this.idProvincia = resp[0].id_provincia;
                // console.log(this.idProvincia);
            }
          }
        );
    }

    buscarUsuario(idUsuario){
        this._usuarioServicio.getUsuario(idUsuario).toPromise().then((response: any) => {
            if(response == null){
              console.log('error');                    
            }else{
                this.usuario = response;
                // console.log(response);
                this.nombrePaciente = this.usuario[0].nombre;
                this.apellidoPaciente = this.usuario[0].apellido;
                this.telefonoPaciente = this.usuario[0].telefono;
                let idusuario=this.usuario[0].id_persona;
                let id_localidad=this.usuario[0].id_localidad;
                
                //FALTA BUSCAR EL ID PROVINCIA
                this.hc = new HistoriaClinica(0,idusuario,1,this.identity.id_persona,'','','',id_localidad,1);
                this.buscarIdProvincia(id_localidad);

            }
          }
        );
    }

    calculaEdad(){
        var timeDiff = Math.abs(Date.now() - new Date(this.registro.fecha_nacimiento).getTime());
        this.registro.edad = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    }

    onCreaHc(admitido){
        if(admitido == 1){
            this.hc.cgip = this.cgip;
            this.hc.dni = this.registro.numero_documento;
            this.hc.estado = 'admitido';
            this.registro.cgip = this.cgip;
            this.registro.id_cliente = this.usuario[0].id_persona;
            this.registro.id_profesional = this.identity.id_persona;
            this.registro.telefono = this.usuario[0].telefono;
            this.registro.adminitido = 'SI';

            this._historiaClinica.add(this.hc).toPromise().
                then((data:any) => {
                    if (data.affectedRows > 0){
                        let idHC = data.insertId;
                        this.hc = new HistoriaClinica(0,0,0,0,'','','',0,0,);
                        this._consultaServicio.creaPdfYEnviaMail(this.registro).toPromise().
                            then((data:any) => {
                                this.alertMessage =  data.mensaje;
                                this.tipoMessage = "alert alert-success alert-with-icon",
                                this.showNotification();
                                this._router.navigate(['/creaTratamiento', idHC]);
                            }
                        );
                    }
                }   
            );
        }else{
            this.registro.id_cliente = this.usuario[0].id_persona;
            this.registro.id_profesional = this.identity.id_persona;
            this.registro.telefono = this.usuario[0].telefono;
            this.registro.adminitido = 'NO';
            
            this._consultaServicio.creaPdfYEnviaMail(this.registro).toPromise().
                then((data1:any) => {
                    var usuarioMod = new Usuario(this.usuario[0].id_persona,
                        this.usuario[0].id_tipo_persona,this.usuario[0].id_localidad,this.usuario[0].dni,
                        this.usuario[0].nombre,this.usuario[0].apellido,'','',
                        this.usuario[0].email, this.usuario[0].telefono,'no admitido', 0,'');

                    // usuarioMod.estado = 'no admitido';
                    // usuarioMod.activo = 0;
                    console.log(usuarioMod);
                    this._usuarioServicio.update(usuarioMod).toPromise().
                    then((data:any) => {
                        if(!data){
                            //VER BIEN ESTE TEMA, LA DEVOLCUION DE ERRORES, 
                            //CORREO REPETIDOS ETC.
                            this.alertMessage = 'Algo salio mal.';
                            this.tipoMessage = "alert alert-warning alert-with-icon",
                            this.showNotification();
                            this.modalService.dismissAll();
                          }
                          else{
                            this.alertMessage = data1.mensaje;
                            this.tipoMessage = "alert alert-success alert-with-icon",
                            this.showNotification();
                            this._router.navigate(['']);
                          }
                    });
                }
            );
        }
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
