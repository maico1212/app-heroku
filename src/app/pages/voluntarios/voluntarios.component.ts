import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { VoluntariosService } from 'src/app/services/voluntarios.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DropDownTreeComponent } from '@syncfusion/ej2-angular-dropdowns';
import Swal from 'sweetalert2';
import { TareasService } from 'src/app/services/tareas.service';
import { OrganismosService } from 'src/app/organismos.service';

export interface Data {

  nombre: string,
  apellido: string,
  correo: string,
  dni: string,
  provincia: string,
  ciudad: string
}


@Component({
  selector: 'app-voluntarios',
  templateUrl: './voluntarios.component.html',
  styleUrls: ['./voluntarios.component.css']
})
export class VoluntariosComponent implements OnInit {

  provincias = ['Buenos Aires','CABA','Catamarca','Chaco','Chubut','Córdoba','Corrientes','Entre Rios','Formosa','Jujuy','La Pampa',
  'La Rioja','Mendoza','Misiones','Neuquén','Río Negro','Salta','San Juan','San Luis','Santa Cruz','Santa Fe','Santiago del Estereo','Tucuman'];

  hora = ['Dia', '1hs', '2hs', '3hs', '4hs', '+4hs', 'No Disp.'];
  horas = ['1hs', '2hs', '3hs', '4hs', '+4hs', 'No Disp.'];

  regionBS = ['Avellaneda Lanúns', 'Lomas de Zamora', 'Merlo Moreno', 'Morón', 'Quilmes', 'San Isidro', 'San Justo', 'San Martin', 'San Miguel', 'Zárate Campaña'];
  regionCentro = ['Córdoba', 'Cruz del Eje', 'Deán Funes', 'Río Cuarto', 'San Francisco', 'Villa María'];
  regionCUYO = ['Mendoza', 'San Rafael', 'San Juan', 'San Luis'];
  regionLITORAL = ['Concordia', 'Gualeguaychú', 'Paraná', 'Rafael', 'Rosario', 'San Nicolás', 'Santa Fé', 'Vendo Tuerto'];
  regionNEA = ['Corrientes', 'Formosa', 'Goya', 'Oberá', 'Posadas', 'Puerto Iguazú', 'Reconquista', 'Resistencia', 'San Roque', 'Santo Tomé'];
  regionNOA = ['Añatuya', 'Cafayate', 'Catamarca', 'Concepcion', 'Huamahuaca', 'Jujuy', 'La Rioja', 'Orán', 'Salta', 'San Roque', 'Santiago del Estereo', 'Tucumán'];
  regionPATAGONIA = ['Alto Valle del Río Negro', 'Comodoro Rivadavia', 'Esquel', 'Neuquén', 'Río Gallegos', 'San Carlos de Bariloche', 'Viedma'];
  regionPLATENSE = ['Azul', 'Bahía Blanca', 'Chascomús', 'La Plata', 'Mar del Plata', 'Mercedes Luján', 'Nueve de Julio', 'Santa Rosa'];
  dataSource: MatTableDataSource<Data>;


  region = ['Region Buenos Aires', 'Region NOA', 'Region NEA', 'Region Platense']


  displayedColumns: string[] = ['nombre', 'correo', 'dni', 'provincia', 'ciudad', 'estado', 'accion'];

  editarPreguntas: boolean = false;
  datosEditar: FormGroup;
  Region: FormGroup;
  Organizativa: FormGroup;
  datosTarea: FormGroup;
  bndTarea: boolean = true;
  guardaListado: any;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  bandera: boolean;
  listado_voluntarios: any; //vuelve listado de voluntarios
  listado_voluntariosResult: any;
  listado_Tareas: any[];
  listado_TareasAux: any[];
  datosAsigT: any;
  volunt: any;
  autocompletesService: any;
  unatarea: any;

  estructura: FormArray[];

  constructor(
    public auths: AuthenticationService,
    public auth: AngularFireAuth,
    public voluntariosService: VoluntariosService,
    private formBuilder: FormBuilder,
    private tareaService: TareasService,
    private Organismos: OrganismosService
  ) {
    this.voluntarios_point(); //este me devuelve todo los voluntarios
   // this.ver_tareas();
    this.listado_organismos();
   this.refrescar();

    // this.getOrganismos();


    //  this.cambiarTexto();

    // this.dataSource = new MatTableDataSource(this.listado_voluntarios)

  }

  // public data: string[] = ['Snooker', 'Tennis', 'Cricket', 'Football', 'Rugby'];

  /*
    DropDownTreeComponent: any;
    organismos:any = [];
    public fieldsTree: Object;
    arregloOrganismos: any ;
  
  async getOrganismos() {
  
      this.Organismos.findAllOrganismos().subscribe(response=>{
         // this.arregloOrganismos= response;
          try {
            this.organismos =  response;
            console.log('el this.organismos tiene valor:')
            console.log(this.organismos);
  
            this.organismos.expanded = true;
            this.fieldsTree = { dataSource: [this.organismos], value: 'id', text: 'name', child: 'children' }
  
          } catch (error) {
            console.error(error);
          }
      },(error: any) => {
        console.log(error)
      }); 
    }
   */



  /*
    ngAfterViewInit() {
      //this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } */



  datosf: any;
  ngOnInit(): void {

    this.Organizativa = this.formBuilder.group({

      diocesisId: ['', Validators.required]


    });

    this.datosEditar = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', Validators.required],
      dni: ['', Validators.required],
      nacimiento: ['', Validators.required],
      telefono: ['', Validators.required],
      ocupacion: ['', Validators.required],
      provincia: ['', Validators.required],
      residencia: ['', Validators.required],
      movilidad: ['', Validators.required],
      direccion: ['', Validators.required],
      //movimiento: ['', Validators.required],
      agrupacion: ['', Validators.required],
      experiencia: ['', Validators.required],
      riesgo: ['', Validators.required],
      cobertura: ['', Validators.required],
      pertenece: ['', Validators.required],
      enfermedad: ['', Validators.required],
      estructura: ['', Validators.required],
      lunes: ['', Validators.required],
      martes: ['', Validators.required],
      miercoles: ['', Validators.required],
      jueves: ['', Validators.required],
      viernes: ['', Validators.required],
      sabado: ['', Validators.required],
      domingo: ['', Validators.required]

    });


    this.datosTarea = this.formBuilder.group({

      tareaId: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required]

    })


    this.voluntariosService.findAllVoluntarios().subscribe((response: any) => {


      this.listado_voluntarios = response;

      this.dataSource = new MatTableDataSource<Data>(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      //this.listado_voluntariosResult= this.listado_voluntarios;



      // console.log(response);
      /*response= this.voluntariosService.findAllVoluntarios();*/

    });


  }

  guarda_D: any;

  guarda_Diocesis(vid: any) {

    this.guarda_D = Object.assign(this.Organizativa.value, { voluntarioId: vid }); //aca creo campo voluntarioId (ver)
    console.log('datos de diocesis:', this.guarda_D);

    this.tareaService.asigna_Diocesis(this.guarda_D).subscribe(response => {
      
      this.voluntarios_point(); 
      this.volunt.diocesis=response; //ahi es cuando guarda la diosesis en el objeto completo de voluntario.
      Swal.fire('¡Diocesis Asignada Correctamente!', '', 'success');
      

    }, (error: any) => {
      console.log(error)

      Swal.fire('¡Hubo un Error!', '', 'success');

    }

    )
  }


  filtrarTarea(idD: number) {

    this.listado_Tareas = this.listado_Tareas.filter((t: any) => t.diocesisId === idD)

  }


  onCheckChange(event: any) {
    const formArray: FormArray = this.datosTarea.get('estructura') as FormArray;


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
    const formArrayEstructura: FormArray = this.datosTarea.get('estructura') as FormArray;
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


  createRegionFormGroup(value: any): FormGroup {
    return this.formBuilder.group({
      idRegion: value,
      diocesis: new FormArray([])
    });
  }


  listado_organismos() {

    this.Organismos.findAllOrganismos().subscribe((response) => {

      this.guardaListado = response;
      console.log('listado de organismos')
      console.log(response);

    })

  }



  applyFilter(event: Event) {
    const filterVlue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterVlue.trim().toLocaleLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /*
    banderas: any = true;
    habilita(valor: any) {
  
      console.log(valor.target.value);
      if (valor.target.value == true) {
  
        this.banderas = true;
  
      } else {
        this.banderas = null;
      }
  
    }*/

  voluntarios_point() {
    this.voluntariosService.findAllVoluntarios().subscribe((response: any) => {

      this.listado_voluntarios = response;

      console.log('LISTA VOLUNTARIOS:');
      console.log(this.listado_voluntarios);
     
      /*TABLA ANGULAR MATERIAL*/
    //  this.dataSource = new MatTableDataSource<Data>(response);
     // this.dataSource.paginator = this.paginator;
      this.listado_voluntariosResult= this.listado_voluntarios;

      // console.log(response);
  //  response= this.voluntariosService.findAllVoluntarios(); //???

    });

  }

  ver_voluntario(voluntario: any) {

    this.voluntariosService.findVoluntario(voluntario.id).subscribe((response) => {

      this.volunt = response;

      // console.log(response);

    });


  }

/*
  ver_tareas() {

    this.tareaService.findAllTareas().subscribe((response: any) => {

      console.log(response)


      this.listado_Tareas = response;
      this.listado_TareasAux = response;
      console.log('el listado de tareas de voluntarios es:')
      console.log(this.listado_Tareas);

    }, (error: any) => {
      console.log(error);
      //siempre crear error, para el endpoint 
    });

  }*/

  findTareas(){
    this.tareaService.findTareabydiocesis(this.volunt.id).subscribe((response:any)=>{
      this.listado_Tareas= response;

    })
  }



  ver_tarea(idtarea: any) {

    this.tareaService.findTarea(idtarea).subscribe((response) => {

      this.unatarea = response;
      this.datosTarea.patchValue(this.unatarea);
      this.datosTarea.disable();
      console.log('tarea elegida para mostrar:');
      console.log(this.unatarea);
    })

  }

  disponibilidad(idvoluntario: any) {

    console.log('el id del voluntario es:', idvoluntario)

  }


  asig_Tarea(value: any, idv: any) {

   

    console.log('el id del voluntario es:');
    console.log(idv);

    console.log('datos de asignacion de tarea');
  //debugger
    this.datosAsigT = Object.assign(value, { voluntarioId: idv });//asigno datos del formulario
    console.log(this.datosAsigT);


    this.tareaService.asigna_Tarea(this.datosAsigT).subscribe(response => {

      console.log(response);

    })

  }



  cambios: any;
  enviarCambios(idd: any) {
    console.log('el id a editar es');
    console.log(idd);


    this.cambios = Object.assign(this.datosEditar);

    this.voluntariosService.editVoluntario(this.cambios, this.cambios.id).subscribe((response) => {

      console.log('los datos han sido actualizados');
      console.log(response);
    })

  }



  datos: any;

  moda_editar(voluntario: any) {
    this.voluntariosService.findVoluntario(voluntario.id).subscribe((response) => {
      this.datos = response;
      this.datosEditar.patchValue({
        nombre: this.datos.nombre,
        apellido: this.datos.apellido,
        email: this.datos.email,
        dni: this.datos.dni,
        nacimiento: this.datos.nacimiento,
        ocupacion: this.datos.ocupacion,
        telefono: this.datos.telefono,
        provincia: this.datos.provincia,
        residencia: this.datos.residencia,
        agrupacion: this.datos.agrupacion,
        direccion: this.datos.direccion,
        experiencia: this.datos.experiencia,
        movimiento: this.datos.movimiento,
        riesgo: this.datos.riesgo,
        enfermedad: this.datos.enfermedad,
        movilidad: this.datos.movilidad,
        cobertura: this.datos.cobertura,

        /*DIAS DE DISPONIBILIDAD*/
        lunes: this.datos.lunes,
        martes: this.datos.martes,
        miercoles: this.datos.miercoles,
        jueves: this.datos.jueves,
        viernes: this.datos.viernes,
        sabado: this.datos.sabado,
        domingo: this.datos.domingo
      });

      console.log(this.datos.movimiento)
      console.log(this.datos.riesgo)
    })

  }


  editar_Voluntario(id: any) {

    this.voluntariosService.editVoluntario(id, this.datosEditar.value).subscribe(resp => {
     this.voluntarios_point();
      Swal.fire('¡Los cambios se realizaron correctamente!', '', 'success');
 
      console.log("Json: " + this.datosEditar.value);
      console.log(resp);

    }, error => { console.log(error) }
    );


  }

  refrescar(){
    this.voluntarios_point();
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
          this.voluntarios_point();
          Swal.fire('¡Voluntario Eliminado', '', 'success');


        },
          error => {
            this.voluntarios_point();
            Swal.fire('¡Hubo un error!', '', 'error');
          })
    },

    )
  }

  cambiarTexto(banderita: any) {

    console.log('estoy adentro de cambiar texto');

    console.log(banderita);
    console.log(banderita.target.value);

    if (banderita.target.value === 'valorRamon') {
      this.bndTarea = true;

    }
    else {
      this.bndTarea = false;
    }




  }

}

