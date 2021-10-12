import { Component, OnInit, ViewChild } from '@angular/core';
import { DropDownTreeComponent } from '@syncfusion/ej2-angular-dropdowns';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {
  autocompletesService: any;
 
  constructor() { }

  ngOnInit(): void {
  }

  @ViewChild('dropdownTree') dropdownTree: DropDownTreeComponent;
  organismos : any = [];
  public fieldsTree: Object;
 
 async getOrganismos() {
     try {
       this.organismos = await this.autocompletesService.getOrganismos();
       this.organismos[0].expanded = true;
       this.fieldsTree = { dataSource: [this.organismos[0]], value: 'id', text: 'name', child: 'children' }
     } catch (error) {
       console.error('Error Trying Get Organismo');
     }
   }

  

}
