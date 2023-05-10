export interface Supporter {
  id?: string;
  documento: string;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  email: string;
  genero: string;
  fechaNacimiento: string;
  rol: 'seguidor';
}
