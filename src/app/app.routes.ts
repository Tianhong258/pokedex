import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        loadComponent: () => import('./composants/accueil/accueil.component').then((mod)=> mod.AccueilComponent),
        title: "Accueil"
    },
    {
        path : 'detail/:id',
        loadComponent: ()=> import('./composants/detail/detail.component').then((mod)=>mod.DetailComponent),
        title:"Détail"
    },
    {
        path : 'equipe',
        loadComponent: ()=> import('./composants/equipe/equipe.component').then((mod)=>mod.EquipeComponent),
        title:"Equipe"
    }
];
