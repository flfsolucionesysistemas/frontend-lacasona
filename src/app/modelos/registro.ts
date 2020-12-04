export class Registro{
	constructor(
		public fecha: Date,
		public id_profesional: number,
		public id_cliente:number,
		public tipo_consulta: string,
		public telefono: string,
		public obra_social:string,
		public numero_afiliado:string,
		public domicilio:string,
		public fecha_nacimiento:Date,
		public edad:number,
		public estado_civil:string,
		public numero_documento:string,
		public ocupacion: string,
		public cgip:string,
		public motivo:string,
		public derivado_por:string,
		public padecimiento:string,
		public antecedentes:string,
		public diagnostico:string,
		public tratamiento:string,
		public farmacologia:string,
		public adminitido:string,
		public derivacion_psicoterapia:string,
	){}
}