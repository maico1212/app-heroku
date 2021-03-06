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
  
  users: any;
  uid: any;

  formClaim = new FormGroup({
    admin: new FormControl(false),
    nacional: new FormControl(false),
    regional: new FormControl(false),
    diocesano: new FormControl(false),
    voluntario: new FormControl(false),

  })

 //  authorities : FormArray;
  constructor(
    public auth: AngularFireAuth,
    public user: UsersService,
  //  private formBuilder : FormBuilder
  ) { this.user_point(); }
    
    /*
  this.formClaim = formBuilder.group({
      authorities: this.formBuilder.array([])
    });
    this.authorities = this.formClaim.get('authorities') as FormArray;

    this.user_point();
  }*/

  ngOnInit() {}
  
/*
  initFormUser(customClaims:any){

    return new FormGroup({

    admin: new FormControl(customClaims.admin),
    nacional: new FormControl(customClaims.nacional),
    regional: new FormControl(customClaims.regional),
    diocesano: new FormControl(customClaims.diocesano),
    voluntario: new FormControl(customClaims.voluntario),

  })

  }
*/


  user_point(){
    firebase.auth().currentUser?.getIdTokenResult()
      .then((idTokenResult) => {
        this.user.findAll(idTokenResult.token).subscribe(
          (responseUser: any) => {

             this.users = responseUser;
            // this.users.forEach( (user:any) => { 
            //    console.log(user);
            //   this.authorities.push(this.initFormUser(user.customClaims))
              
            // });

          }
        ),
        (error: any) => {
          console.log(error);
          /*siempre crear error, para el endpoint */
        }
      })

  }


  actualizar(uid: any, dato: any) {

    firebase.auth().currentUser?.getIdTokenResult()
      .then((idTokenResult) => {

        this.user.setClaims(idTokenResult.token, uid, dato).subscribe(resp => {

          Swal.fire('??Permisos actualizados!', '', 'success');
        },
          error => {
            Swal.fire('??Hubo un error!', '', 'success');
          }
        )
      }
      )


  }




  eliminar(uid: any) {
    Swal.fire({
      title: '??Estas seguro que desea eliminar este usuario?',
      text: "??No podras revertir esto!",
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: `??S??, eliminar!`,
      denyButtonText: `Cancelar`,
    }).then((result) => {

      if (result.isConfirmed)

        firebase.auth().currentUser?.getIdTokenResult()
          .then((idTokenResult) => {

            this.user.delete(idTokenResult.token, uid).subscribe(resp => {

              Swal.fire('??Usuario Eliminado!', '', 'success');
            },
              error => {
                Swal.fire('??Hubo un error!', '', 'success');
              }
            )
          }
          )

    },
      error => {
        Swal.fire('??Hubo un error!', '', 'success');

      }

    )

  }


}

