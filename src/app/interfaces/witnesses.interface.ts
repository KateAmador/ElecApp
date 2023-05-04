export default interface Witness {
  id?: string;
  documento: string;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  uid?: string;
  email: string;
  mesa: string;
  puesto: string;
  contraseña: string;
  fechaNacimiento: string;
  rol: 'testigo;'
}
