export class Usuario{
	constructor(
		public id_persona: number,
		public id_tipo_persona: number,
		public id_localidad: number,
		public dni: string,
		public nombre: string,
		public apellido: string,
		public nombre_usuario: string,
		public clave_usuario: string,
		public email: string,
		public telefono: string,
		public estado: string,
		public activo:number,
		public numero_matricula:string,
	){}
}