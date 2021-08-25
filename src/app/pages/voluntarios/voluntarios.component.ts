import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { VoluntariosService } from 'src/app/services/voluntarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-voluntarios',
  templateUrl: './voluntarios.component.html',
  styleUrls: ['./voluntarios.component.css']
})
export class VoluntariosComponent implements OnInit {
  personalDetails: FormGroup;
  personal_step = false;

  bandera: boolean;
  json: any;
  volunt: any = null;
  
  constructor(
    public auths: AuthenticationService,
    public auth: AngularFireAuth,
    public voluntariosService: VoluntariosService,
    private formBuilder: FormBuilder
    

  ) {
    this.voluntarios_point(); //este me devuelve todo los voluntarios


    this.voluntar(this.volunt); //este me devuelve 1 solo voluntario con su id correspondiente

    
   
  }
  datosf: any;
  ngOnInit(): void {

  
    this.personalDetails = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', Validators.required],
      dni: ['',Validators.required],
      nacimiento: ['', Validators.required],
      telefono: ['', Validators.required]

      
  });
 

  }


  voluntarios_point() {
    this.voluntariosService.findAllVoluntarios().subscribe((response) => {

      this.json = response;

      
      
      console.log(response);
      /*response= this.voluntariosService.findAllVoluntarios();*/

    });

  }


   voluntar(idd : any){

    this.voluntariosService.findVoluntarios(idd).subscribe((response) => {

      this.volunt = response;
      
      console.log(response);

    });


  }

  enviar(){

  }

  datos: any;

  editar(){
    
    this.datos = Object.assign(this.personalDetails.value);
  
  
    console.log(this.datos);
    
     
    

  }

  
  

  eliminarVoluntario(uid: any) {
    Swal.fire({
      title: '¿Estas seguro que desea eliminar este usuario?',
      text: "¡No podras revertir esto!",
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: `¡Sí, eliminar!`,
      denyButtonText: `Cancelar`,
    }).then((result) => {

      if (result.isConfirmed)

        this.voluntariosService.deleteVoluntario(uid).subscribe(resp => {
          Swal.fire('¡Voluntario Eliminado','','success');

        },
        error => {
          Swal.fire('¡Hubo un error!', '', 'error');
        })
    },
      
    )}
}

