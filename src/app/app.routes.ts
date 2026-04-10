import { Routes } from '@angular/router';
import { Overview } from './components/overview/overview';
import { Docs } from './components/docs/docs';
import { Scenarios } from './components/scenario/scenario';
import { Cpp } from './components/cpp/cpp';
import { Bop } from './components/bop/bop';
import { Risk } from './components/risk/risk';

export const routes: Routes = [
    { path: '', component: Overview },
    { path: 'docs', component: Docs },
    { path: 'scenarios', component: Scenarios },
    { path: 'cpp', component: Cpp },
    { path: 'bop', component: Bop },
    { path: 'risk', component: Risk },
    { path: '**', redirectTo: '' }
];
