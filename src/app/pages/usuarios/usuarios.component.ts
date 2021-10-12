import { Component, OnInit, Input, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { idTokenResult } from '@angular/fire/auth-guard';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { error } from 'protractor';
import { find } from 'rxjs/internal/operators';
import { OrganismosService } from 'src/app/organismos.service';
import { TareasService } from 'src/app/services/tareas.service';
import { UsersService } from 'src/app/users.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  users: any;
  uid: any;
  guardaListado: any;
  guarda_D: any;
  private tareaService : TareasService

  formClaim = new FormGroup({
    admin: new FormControl(false),
    nacional: new FormControl(false),
    regional: new FormControl(false),
    diocesano: new FormControl(false),
    voluntario: new FormControl(false),

  })
  formBuilder: any;

 //  authorities : FormArray;
  constructor(
    public auth: AngularFireAuth,
    public user: UsersService,
    public organismos: OrganismosService
  //  private formBuilder : FormBuilder
  ) 
  { 
    this.user_point();
    this.listado_organismos();
   }
    
    /*
  this.formClaim = formBuilder.group({
      authorities: this.formBuilder.array([])
    });
    this.authorities = this.formClaim.get('authorities') as FormArray;

    this.user_point();
  }*/

  ngOnInit() {}
  

  initFormUser(customClaims:any){

    return new FormGroup({

    admin: new FormControl(customClaims.admin),
    nacional: new FormControl(customClaims.nacional),
    regional: new FormControl(customClaims.regional),
    diocesano: new FormControl(customClaims.diocesano)
  //  voluntario: new FormControl(customClaims.voluntario),

  })

  }



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

          Swal.fire('¡Permisos actualizados!', '', 'success');
        },
          error => {
            Swal.fire('¡Hubo un error!', '', 'success');
          }
        )
      }
      )


  }

  

  guarda_Diocesis(vid:any){

    this.guarda_D = Object.assign(this.formClaim.value, {voluntarioId : vid }); //aca creo campo voluntarioId (ver)
    console.log('datos de diocesis:',this.guarda_D);
 
     this.tareaService.asigna_Diocesis(this.guarda_D).subscribe(response=>{
 
       console.log('registro de diocesis exitoso');
 
     }, (error: any) => { console.log(error)}
 
     
     )}

     
  onCheckChange(event: any) {
    const formArray: FormArray = this.formClaim.get('estructura') as FormArray;


    if (event.target.checked) {

      formArray.push(this.createRegionFormGroup(event.target.value));
    }

    else {

      let i: number = 0;

      formArray.controls.forEach((ctrl: AbstractControl) => {
        if (ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }

        i++;
      });
    }
  }


  onCheckDiocesis(event: any, i: number) {
    const formArrayEstructura: FormArray = this.formClaim.get('estructura') as FormArray;
    const formArrayDiocesis: FormArray = (formArrayEstructura.controls[i] as FormGroup)?.controls?.diocesis as FormArray;

    // debugger

    if (event.target.checked) {

      formArrayDiocesis.push(new FormControl(event.target.value));
    }

    else {

      let i: number = 0;

      formArrayDiocesis.controls.forEach((ctrl: AbstractControl) => {
        if (ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArrayDiocesis.removeAt(i);
          return;
        }

        i++;
      });
    }
  }


  private createRegionFormGroup(value: any): FormGroup {
    return this.formBuilder.group({
      idRegion: value,
      diocesis: new FormArray([])
    });
  }


  listado_organismos() {

    this.organismos.findAllOrganismos().subscribe((response) => {

      this.guardaListado = response;
      console.log('listado de organismos')
      console.log(response);

    })

  }



  eliminar(uid: any) {
    Swal.fire({
      title: '¿Estas seguro que desea eliminar este usuario?',
      text: "¡No podras revertir esto!",
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: `¡Sí, eliminar!`,
      denyButtonText: `Cancelar`,
    }).then((result) => {

      if (result.isConfirmed)

        firebase.auth().currentUser?.getIdTokenResult()
          .then((idTokenResult) => {

            this.user.delete(idTokenResult.token, uid).subscribe(resp => {

              Swal.fire('¡Usuario Eliminado!', '', 'success');
            },
              error => {
                Swal.fire('¡Hubo un error!', '', 'success');
              }
            )
          }
          )
    },
      error => {
        Swal.fire('¡Hubo un error!', '', 'success');

      }

    )}
}