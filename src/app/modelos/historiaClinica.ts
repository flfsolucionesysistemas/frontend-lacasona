export class HistoriaClinica{
	constructor(
		public id_historiaClinica: number,
		public id_persona: number,
		public id_tipo_persona: number,
		public id_persona_creacion: number,
		public cgip: string,
		public dni : string,
		public estado: string,
		public id_localidad: number,
		public id_provincia: number,
	){}
}