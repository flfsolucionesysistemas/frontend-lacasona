export class Turno{
	constructor(
		public id_turno:number,
		public fecha: Date,
		public hora: string,
		public estado:string,
		public observacion:string,
		public id_tipo_turno:number,
		public turno_tratamiento: number,
		public costo_base: number,
	){}
}