import { Component, OnInit, Input, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { idTokenResult } from '@angular/fire/auth-guard';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { error } from 'protractor';
import { find } from 'rxjs/internal/operators';
import { UsersService } from 'src/app/users.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  users : any;
  uid: any;
  
  formClaim = new FormGroup({
    
   admin: new FormControl (false),
   nacional: new FormControl (false),
   regional: new FormControl (false),
   diocesano: new FormControl (false),
   voluntario: new FormControl (false),
   
  })
constructor(
    public auth: AngularFireAuth,
    public user: UsersService

    ) { 

      this.user_point();
    }

  ngOnInit() {

  }

  user_point()
  { 
    firebase.auth().currentUser?.getIdTokenResult()
    .then((idTokenResult)=>{ this.user.findAll(idTokenResult.token).subscribe(
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


  actualizar(uid: any,dato:any){
    
    firebase.auth().currentUser?.getIdTokenResult()
    .then((idTokenResult)=>{

      this.user.setClaims(idTokenResult.token,uid,dato).subscribe(resp => {

        Swal.fire('¡Permisos actualizados!', '','success');
      },
      error => {
        Swal.fire('¡Hubo un error!', '', 'success');
      }
      )}
      )
     
   
  }




  eliminar(uid: any){
    Swal.fire({
      title: '¿Estas seguro que desea eliminar este usuario?',
      text: "¡No podras revertir esto!",
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: `¡Sí, eliminar!`,
      denyButtonText: `Cancelar`,
    }).then((result) => {

      if (result.isConfirmed ) 

      firebase.auth().currentUser?.getIdTokenResult()
    .then((idTokenResult)=>{

      this.user.delete(idTokenResult.token,uid).subscribe(resp => {

        Swal.fire('¡Usuario Eliminado!', '','success');
      },
      error => {
        Swal.fire('¡Hubo un error!', '', 'success');
      }
      )}
      )
        
  },
  error => {
    Swal.fire('¡Hubo un error!', '', 'success');

  }
  
  )
      
  

  }

  

}

