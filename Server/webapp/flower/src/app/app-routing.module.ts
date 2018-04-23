import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FlowersComponent } from './flowers/flowers.component';
import { FlowerComponent } from './flower/flower.component';

const routes:Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path:'about', component: AboutComponent },
  { path: 'flower', component: FlowersComponent },
  { path: 'flower/:id', component: FlowerComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {useHash:true}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
  
}
