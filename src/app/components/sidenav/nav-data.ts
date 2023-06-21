import { INavbarData } from "./helper";

export const navbarData: INavbarData[] = [
  {
    routeLink: 'inicio',
    icon: 'bi bi-house',
    label: 'Inicio',
    requiredRole: ['lider', 'testigo', 'admin']
  },
  {
    routeLink: 'candidato',
    icon: 'bi bi-person-badge',
    label: 'Candidato',
    requiredRole: ['lider', 'testigo', 'admin']
  },
  {
    routeLink: 'campaña',
    icon: 'bi bi-clipboard2-data',
    label: 'Campaña',
    requiredRole: ['lider', 'admin'],
    items: [
      {
        routeLink: 'campaña/lideres',
        label: 'Lideres',
        requiredRole: ['admin']
      },
      {
        routeLink: 'campaña/seguidores',
        label: 'Seguidores',
        requiredRole: ['lider', 'admin']
      }
    ]
  },
  {
    routeLink: 'elecciones',
    icon: 'bi bi-file-text',
    label: 'Elecciones',
    requiredRole: ['testigo', 'admin'],
    items: [
      {
        routeLink: 'elecciones/testigos',
        label: 'Testigos',
        requiredRole: ['admin']
      },
      {
        routeLink: 'elecciones/puestos',
        label: 'Puestos',
        requiredRole: ['admin']
      },
      {
        routeLink: 'elecciones/reportes',
        label: 'Reportes',
        requiredRole: ['testigo', 'admin']
      }
    ]
  }
];

