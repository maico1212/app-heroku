import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TareasService {
  

  constructor(public http: HttpClient) { }

 
 
  public create_Tarea(tarea:any){
    return this.http.post(environment.apiEndpoint + '/tareas/', tarea); 
  }



  asigna_Diocesis(params:any){
   
     return this.http.post(environment.apiEndpoint + '/voluntarios/asignard', params);


  }


   asigna_Tarea(params : any){

  ///tareas/tareas/:vid
    return this.http.post(environment.apiEndpoint + '/voluntarios/asignart', params);

  }

  findTareabydiocesis(id: any){
    return this.http.get(environment.apiEndpoint + '/tareas/pordiocesis/' + id);
  }

  public findAllTareas(){     
     return this.http.get(environment.apiEndpoint + '/tareas');
   }

   public findTarea(id:any){     
    return this.http.get(environment.apiEndpoint + '/tareas/'+id);
  }

  public deleteTarea(id:any){
    return this.http.delete(environment.apiEndpoint + '/tareas/'+ id); 
   }

   public editTarea( id:any, tarea:any){
    return this.http.put(environment.apiEndpoint + '/tareas/'+ id, tarea); 
   }
}
