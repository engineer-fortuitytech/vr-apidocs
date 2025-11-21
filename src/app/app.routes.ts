import { Routes } from '@angular/router';
import { Overview } from './components/overview/overview';
import { Docs } from './components/docs/docs';
import { Scenarios } from './components/scenario/scenario';

export const routes: Routes = [
    {path: '', component: Overview},
    { path: 'docs', component: Docs },
    {path: 'scenarios', component: Scenarios},
    { path: '**', redirectTo: '' }
];
