import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './pages/chat/chat.component';
import { LoginComponent } from './pages/login/login.component';
import { CouncilorsComponent } from './pages/councilors/councilors.component';
import { EvaluationComponent } from './pages/evaluation/evaluation.component';
import { ManageComponent } from './pages/manage/manage.component';

const routes: Routes = [
  { path: '', redirectTo: '/councilors', pathMatch: 'full' },
  { path: 'chat', component: ChatComponent },
  { path: 'login', component: LoginComponent },
  { path: 'councilors', component: CouncilorsComponent },
  { path: 'evaluation', component: EvaluationComponent },
  { path: 'manage', component: ManageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
