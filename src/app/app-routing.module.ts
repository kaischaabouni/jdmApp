import{ RelationsComponent} from './relations/relations.component';
import{ HomeComponent} from './home/home.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
//{path : '',redirectTo:'/home', pathMatch:'full'},
//{path: 'home', component: HomeComponent},
{path: '',component: RelationsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }