import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  isAdmin: boolean;

  constructor( public http: HttpClient ) { }
  //--------------------------Users-----------------------------------//
  public findAll(token:string){
   const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: token
    })
  };
    return this.http.get(environment.apiEndpoint + '/users');

  }
  public find(token:string,uid:string){ //no es necesario poner el mismo nombre:NOTA IMPORTANTE
    return this.http.get(environment.apiEndpoint + '/users/' + uid); 
  }

  public setClaims(token:string,uid:string, claims:any){
   
   return this.http.put(environment.apiEndpoint + '/users/claims/' + uid, claims); // MANDAR ID USUARIO, ID REGION
  }

  public delete(token:string,uid:string){

    return this.http.delete(environment.apiEndpoint + '/users/' + uid); 
   }



}