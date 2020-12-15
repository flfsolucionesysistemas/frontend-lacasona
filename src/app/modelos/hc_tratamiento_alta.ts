export class Hc_Tratamiento_alta{
	constructor(
		public id_hc_tratamiento:number,
		public id_hc:number,
		public id_tratamiento:number,
		// public fecha_inicio: string,
		public fecha_alta:string,
		public consideraciones_alta:string,
		public motivo_alta:string,
	){}
}