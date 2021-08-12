import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VoluntariosService {

  constructor(public http: HttpClient) { }
   //-----------------------------------------Voluntarios---------------------------------//
  
   public create(voluntario:any){
    return this.http.post(environment.apiEndpoint + '/voluntarios/', voluntario); 
  }

  public findAllVoluntarios(){     
     return this.http.get(environment.apiEndpoint + '/voluntarios');
   }

   public findVoluntarios(id:any){     
    return this.http.get(environment.apiEndpoint + '/voluntarios/'+id);
  }

  public deleteVoluntario(id:any){
    return this.http.delete(environment.apiEndpoint + '/voluntarios/'+ id); 
   }

   public editVoluntario(voluntario:any){
    return this.http.put(environment.apiEndpoint + '/voluntarios/',voluntario); 
   }

  /* cuidado con las direcciones. */
}
