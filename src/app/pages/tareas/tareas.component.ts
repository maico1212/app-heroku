import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DropDownTreeComponent } from '@syncfusion/ej2-angular-dropdowns';
import { OrganismosService } from 'src/app/organismos.service';
import { TareasService } from 'src/app/services/tareas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent implements OnInit {

 // Regiones = ['Buenos Aires', 'Region Centro', 'Region Cuyo', 'Region Litoral', 'Region NEA', 'Region NOA', 'Region Patagonia', 'Region Platense', 'Desarrollo Institucional', 'Desarrollo de Infancia y Educacion', 'Relaciones Institucionales'];

 // Diocesis = ['Avellaneda Lanús', 'Buenos Aires', 'Lomas de Zamora', 'Merlo Moreno', 'Morón', 'Quilmes', 'San Isidro', 'San Justo', 'San Martin', 'San Miguel', 'Zárate Campana'];

 modalida = ['Virtual','Territorial'];

  unatarea: any;
  datosTarea: FormGroup;
  listado_Tareas: any;
  nueva_Tarea: any;
  guardaListado: any;

  constructor(


    private formBuilder: FormBuilder,
    public tareasService: TareasService,
    public organismos: OrganismosService


  ) {
    this.ver_tareas();
    this.listado_organismos();


  }


  ngOnInit(): void {

    this.datosTarea = this.formBuilder.group({

      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      modalidad: ['', Validators.required],
      area: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      estructura: new FormArray([])


    })
  }

  onCheckChange(event: any,j: number) {
   const formArray: FormArray = this.datosTarea.get('estructura') as FormArray;
    if (event.target.checked) {
      formArray.push(this.createRegionFormGroup(event.target.value));
      this.guardaListado.children[j].selected = true;
    }
    else {
      let i: number = 0;
      this.guardaListado.children[j].selected = false;
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

  crearTarea(){

  this.unatarea = null;
  this.datosTarea.reset();


  }


  onCheckDiocesis(event: any, i: number) {
    console.log(i);
    const formArrayEstructura: FormArray = this.datosTarea.get('estructura') as FormArray;

    const formArrayDiocesis: FormArray = (formArrayEstructura.controls[i] as FormGroup)?.controls?.diocesis as FormArray;

    // debugger

    if (event.target.checked) {
     
      formArrayDiocesis.push(new FormControl(event.target.value));
      console.log(formArrayDiocesis);
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


  /*
  setObjectData(organismoRespository : any){

    var root: any[] = [];

    organismoRespository.forEach( (node:any) => { 

    if (!node.parentId){return root.push(node)}; 
    const parentIndex = organismoRespository.findIndex((el:any) => el.id === node.parentId); 

    if (!organismoRespository[parentIndex].children) 
    { 
        return organismoRespository[parentIndex].children = [node];
    } 

    organismoRespository[parentIndex].children.push (node);
    });
    return root;
}*/


  eliminarTarea(uid: any) {
    Swal.fire({
      title: '¿Estas seguro que desea eliminar esta Tarea?',
      text: "¡No podras revertir esto!",
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: `¡Sí, eliminar!`,
      denyButtonText: `Cancelar`,
    }).then((result) => {

      if (result.isConfirmed)

        this.tareasService.deleteTarea(uid).subscribe(resp => {
       //   this.voluntarios_point();
          Swal.fire('¡Tarea Eliminada!', '', 'success');


        },
          error => {
       //     this.voluntarios_point();
            Swal.fire('¡Hubo un error!', '', 'error');
          })
    },

    )
  }


  isEnable(regionid : number){

     console.log( this.datosTarea.value.estructura.find((r:any) => r == regionid));
   return this.datosTarea.value.estructura.find((r:any) => r == regionid) //va al formulario de estructura y busca la region que esta seteado.
  
  }


  ver_tareas() {

    this.tareasService.findAllTareas().subscribe((response: any) => {

      console.log(response)

      this.listado_Tareas = response;

    }, (error: any) => {
      console.log(error);
      /*siempre crear error, para el endpoint */
    }

    );

  }

  ver_tarea(idtarea: any) {

    this.tareasService.findTarea(idtarea).subscribe((response) => {

      this.unatarea = response;
      console.log('la tarea individual es:')
      console.log(this.unatarea);
      this.datosTarea.patchValue({
        nombre:this.unatarea.nombre,
        descripcion:this.unatarea.descripcion,
        modalidad: this.unatarea.modalidad,
        area:this.unatarea.area,
        fechaInicio:this.unatarea.fechaInicio,
        fechaFin:this.unatarea.fechaFin,
        estructura:this.unatarea.estructura




      });
     // this.datosTarea.controls.modalidad.patchValue(this.unatarea.movilidad);
      //this.datosTarea.controls.estructura.patchValue(this.unatarea.estructura);
      this.datosTarea.disable();
      console.log('tarea elegida para mostrar:');
      console.log(this.unatarea);
      
    })

  }


  editar_tarea(idt:any){

    this.tareasService.editTarea(idt,this.datosTarea.value).subscribe(response => {

      Swal.fire('¡Los cambios se realizaron correctamente!', '', 'success');
      console.log("Json: " + this.datosTarea.value);
      console.log(response);
    },error =>{console.log(error)});

  }

  habilita() {
    this.datosTarea.enable();
  }



  crear_tarea() {

    this.nueva_Tarea = Object.assign(this.datosTarea.value);
    console.log(this.nueva_Tarea);

    this.tareasService.create_Tarea(this.nueva_Tarea).subscribe((response) => {

      Swal.fire('¡La tarea fue creada exitosamente!', '', 'success');
      response = this.nueva_Tarea;
    }, error => {

      Swal.fire('¡Error al crear tarea!', '', 'success');
      Swal.fire(error.message.details, '', 'error');
    });



  }



  listado_organismos() {

    this.organismos.findAllOrganismos().subscribe((response) => {

      this.guardaListado = response;
      console.log('listado de organismos')
      console.log(response);

    })

  }





}
