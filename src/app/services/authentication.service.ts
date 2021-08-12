import { Injectable, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { UsersService } from '../users.service';
import Swal from 'sweetalert2'
import { idTokenResult } from '@angular/fire/auth-guard';

const swal = require('sweetalert');

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {


  @Input() action: string | undefined;

  constructor(
    public auth: AngularFireAuth,
    private routes: Router,
    public usersService: UsersService


  ) {
    this.auth.authState.subscribe(userResponse => {
      if (userResponse) {
        localStorage.setItem('caritas-user', JSON.stringify(userResponse));

      } else {
        localStorage.setItem('caritas-user', '');
      }

    })
  }

  isUserLoggedIn() {

    return JSON.parse(localStorage.getItem('caritas-user') || '{}')
  }

  userHaveClaims() {
    return JSON.parse(localStorage.getItem('caritas-user-claims') || '{}');
  }

  userHaveClaim(claim: string) {
    return JSON.parse(localStorage.getItem('caritas-user-claims') || '{}')[claim] === true;
  }



  getHomeByClain() {
    let claims = JSON.parse(localStorage.getItem('caritas-user-claims') || '{}');
    if (claims["admin"])
      return ['profile'];

    if (claims["coordinador-nacional"] || claims["coordinador-regional"])
      return ['home'];

    if (claims["diocesano"])
      return ['purchases', 'list'];

    if (claims["storeroom"])
      return ['requisitions', 'list'];


    else {
      return ['login'];
    }

  }

  /*
    logout() {
      this.auth.signOut();
    }
*/

  ngOnInit(): void {
    console.log(this.action)
  }


  /*
   loginWithGoogle(){
     
     this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
     .then((result)=>{
      
      this.routes.navigate(['profile']);
       console.log(result ) 
       })
       
       .catch((error)=>{console.log(error)
       
     })
   }
  */





async loginWithGoogle() {
    console.log('bienvenido estimad@');


    return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(
        (userResponse: any) => {

          firebase.auth().currentUser?.getIdTokenResult()
          .then((idTokenResult) =>{
            this.usersService.find(idTokenResult.token, userResponse.user.uid).subscribe(

              (user: any) => {

                /*ALERTA */
                const Toast = Swal.mixin({
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                  didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                  }
                })
  
                Toast.fire({
                  icon: 'success',
                  title: 'Accedido exitosamente'
                })
                /*FIN ALERTA */
                this.routes.navigate(['profile']);
  
                if (user.custom_claims && JSON.stringify(user.custom_claims) != '{}')
                  localStorage.setItem('caritas-user-claims', JSON.stringify(user.custom_claims));
                else
                  localStorage.setItem('caritas-user-claims', '');
  
                this.usersService.findAll(idTokenResult.token).subscribe(
                  (responseUser: any) => {
                    console.log(responseUser);
                  }
                )
                if (!this.userHaveClaims()) {
                  swal('Esperando autorización', 'Un administrador le asignará los permisos correspondientes para poder ingresar al sistema', 'info');
  
                }
  
              }
              
            )
          console.log(idTokenResult.token)
          }).catch(function(error){
            console.log(error)

          })
          
        }
      )
      .catch(
        (error: any) => {
          swal('Error de autenticacion!', 'Ocurrió un error al iniciar sesion.', 'error');
          console.log(error);
        }

      );

  }



  async logout() {
    return await this.auth.signOut().then(
      () => {
        localStorage.removeItem('caritas-user')
        localStorage.removeItem('caritas-user-claims')
        this.routes.navigate(['login']);
      }
    );
  }



}
