import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { VoluntariosService } from 'src/app/services/voluntarios.service';

@Component({
  selector: 'app-voluntarios',
  templateUrl: './voluntarios.component.html',
  styleUrls: ['./voluntarios.component.css']
})
export class VoluntariosComponent implements OnInit {

  json: any;
  constructor(
    public auths: AuthenticationService,
    public auth: AngularFireAuth,
    public voluntariosService: VoluntariosService

  ) {
    this.voluntarios_point();
   }

  ngOnInit(): void {
  }
   
  
   voluntarios_point(){
     this.voluntariosService.findAllVoluntarios().subscribe((response)=>{
  
       this.json=response;
       
      console.log(response);
     /*response= this.voluntariosService.findAllVoluntarios();*/
     
     });

}
}
