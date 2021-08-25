import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import Swal from 'sweetalert2';
import { VoluntariosService } from 'src/app/services/voluntarios.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    }
  ]
 
})
export class RegisterComponent implements OnInit {
  
  public authorities: FormArray;

  personalDetails: FormGroup;
  addressDetails: FormGroup;
  empleadoDetails: FormGroup;
  preguntasDetails: FormGroup;
  educationalDetails: FormGroup;
  
  personal_step = false;
  address_step = false;
  empleado_step = false;
  preguntas_step = false;
  education_step = false;
  step = 1;


  constructor(
    
    public voluntariosService: VoluntariosService,
    
    private formBuilder: FormBuilder
    
    
    ) {

    

     }


  ngOnInit() {
        this.personalDetails = this.formBuilder.group({
            nombre: ['', Validators.required],
            apellido: ['', Validators.required],
            email: ['', Validators.required],
            dni: ['',Validators.required],
            nacimiento: ['', Validators.required],
            telefono: ['', Validators.required]

        });
        this.addressDetails = this.formBuilder.group({
            provincia: ['', Validators.required],
            residencia: ['', Validators.required],
            direccion: ['',Validators.required],
            ocupacion: ['', Validators.required]
        });

         
      this.preguntasDetails = this.formBuilder.group({
        riesgo: ['', Validators.required],
        movimiento: ['', Validators.required],
         agrupacion: ['', Validators.required],
        enfermedad: ['',Validators.required],
        cobertura: ['',Validators.required]
    }); 
         this.empleadoDetails = this.formBuilder.group({
          experiencia: ['', Validators.required],
          movilidad: ['', Validators.required]
       
      });
      
        this.educationalDetails = this.formBuilder.group({
            lunes: ['', Validators.required],
            martes: ['', Validators.required],
            miercoles: ['', Validators.required],
            jueves: ['', Validators.required],
            viernes: ['', Validators.required],
            sabado: ['', Validators.required],
            domingo: ['', Validators.required],

        });
       
  }
  get personal() {  return this.personalDetails.controls; }
  get address() { return this.addressDetails.controls; }
  get education() { return this.educationalDetails.controls; }
   get empleado() { return this.empleadoDetails.controls;}
   get preguntas(){ return this.empleadoDetails.controls;}
  
 
  
  next(){
    if(this.step==1){
          this.personal_step = true;
          if (this.personalDetails.invalid) { return  }
          this.step++;
    }
    if(this.step==2){
        this.address_step = true;
        if (this.addressDetails.invalid) { return }
            this.step++;
    }
    if(this.step==3){
      this.empleado_step = true;
      if (this.preguntasDetails.invalid) { return }
          this.step++;
  }
  if(this.step==4){
    this.empleado_step = true;
    if (this.empleadoDetails.invalid) { return }
        this.step++;
}
  }
  previous(){
    this.step--
    if(this.step==1){
      this.personal_step = false;
    }
    if(this.step==2){
      this.education_step = false;
    }
    if(this.step==3){
      this.preguntas_step = false;
    }
    if(this.step==4){
      this.empleado_step = false;
    }
  }

  submit(){
    if(this.step==5){
      this.education_step = false;
      if (this.educationalDetails.invalid) { return }
    }
  }


   datos: any;

  enviar(){

    this.datos = Object.assign(this.personalDetails.value,this.addressDetails.value,this.preguntasDetails.value,this.empleadoDetails.value,this.educationalDetails.value);
  
  
    console.log(this.datos);
    
     
    this.voluntariosService.create(this.datos).subscribe((response)=>{
      Swal.fire('¡Gracias por inscribirte, en breve te mandaremos más información a tu email!', '','success');

      response= this.datos;
    },error=>{
    
      Swal.fire(error.message.details,'','error');


    });

  }
}

  /*
  isLinear = false;
  firstFormGroup!:FormGroup ;
 
  constructor(private _formBuilder: FormBuilder) {}


  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      name: ['', Validators.required],
      apellido: ['', Validators.required],
      documento: ['', Validators.required],
      telefono:['', Validators.required],
      calendario:['',Validators.required],
      email:['',Validators.required],
      provincia:['', Validators.required],
      riesgo:['', Validators.required],
      pertenece:['',Validators.required],
      salud:['',Validators.required],
      cobertura:['', Validators.required],
      experiencia:['', Validators.required],
      movilidad:['', Validators.required],
      localidad:['', Validators.required],
      direccion:['', Validators.required],
      ocupacion:['', Validators.required],
      hobby:['', Validators.required]
      

    });

  
  }

  enviar(){
    console.log(this.firstFormGroup.value);
  }
    
*/

