import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UsersService } from 'src/app/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    public auth: AngularFireAuth,
    public routes: Router,
    public users: UsersService,
    public auths: AuthenticationService

  ) { }

  ngOnInit(): void {
  }

   


  
/***************************************/
/*ambas funciones vienen de authentication */
    logout(){
     this.auths.logout();      
   }

  loginWithGoogle(){
    this.auths.loginWithGoogle();
  }
  /***************************************/
  
  registroVoluntarios(){
    this.routes.navigate(['register']);
  }
   
}
