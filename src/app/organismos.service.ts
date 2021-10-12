import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrganismosService {

  constructor(public http: HttpClient) { }


  public findAllOrganismos(){
  
     return this.http.get(environment.apiEndpoint + '/organismos');

  }
}


