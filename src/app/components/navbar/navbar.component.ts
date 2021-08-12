import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UsersService } from 'src/app/users.service';
import firebase from 'firebase/app';
import { idTokenResult } from '@angular/fire/auth-guard';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
 
  users : any;
  constructor(
    public auths: AuthenticationService,
    public auth: AngularFireAuth,
    public user: UsersService,
    public routes: Router

  ) {
    this.user_point();
   }

  ngOnInit(): void {
  }

  user_point()
  { 
    firebase.auth().currentUser?.getIdTokenResult()
    .then((idTokenResult)=>{ 
      
      this.user.findAll(idTokenResult.token).subscribe(
      (responseUser: any) =>
     {
      
       this.users= responseUser;
      
    }
    ),
      ( error: any) => {
      console.log(error);
      /*siempre crear error, para el endpoint */
    }})
   
  }

  listaVoluntarios(){
    this.routes.navigate(['voluntarios']);
  }
   



  logout(){
    this.auths.logout();      
  }

}