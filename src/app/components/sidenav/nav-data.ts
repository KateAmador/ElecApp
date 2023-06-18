import { INavbarData } from "./helper";

export const navbarData: INavbarData[] = [
  {
    routeLink: 'inicio',
    icon: 'bi bi-house',
    label: 'Inicio'
  },
  {
    routeLink: 'candidato',
    icon: 'bi bi-person-badge',
    label: 'Candidato'
  },
  {
    routeLink: 'campaña',
    icon: 'bi bi-clipboard2-data',
    label: 'Campaña',
    items: [
      {
        routeLink: 'campaña/lideres',
        label: 'Lideres'
      },
      {
        routeLink: 'campaña/seguidores',
        label: 'Seguidores'
      }
    ]
  },
  {
    routeLink: 'elecciones',
    icon: 'bi bi-file-text',
    label: 'Elecciones',
    items: [
      {
        routeLink: 'elecciones/testigos',
        label: 'Testigos'
      },
      {
        routeLink: 'elecciones/puestos',
        label: 'Puestos'
      },
      {
        routeLink: 'elecciones/reportes',
        label: 'Reportes'
      },
      {
        routeLink: 'elecciones/reportesOsdo',
        label: 'Reportes Consolidado'
      }
    ]
  }
];
