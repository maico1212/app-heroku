import { NgModule } from "@angular/core";
import { AngularFireAuthGuard } from "@angular/fire/auth-guard";
import { Routes, RouterModule } from "@angular/router";
import { FormComponent } from "./components/form/form.component";
import { AuthGuard } from "./guards/auth.guard";

import { LoginComponent } from "./pages/login/login.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { RegisterComponent } from "./pages/register/register.component";
import { VoluntariosComponent } from "./pages/voluntarios/voluntarios.component";

const routes : Routes =  [ 
  {path: 'login', component: LoginComponent},
  {path: 'form', component: FormComponent},
  {path: 'voluntarios', component: VoluntariosComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

  {path: '**' ,pathMatch: 'full', redirectTo: 'login'}

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  
 
  