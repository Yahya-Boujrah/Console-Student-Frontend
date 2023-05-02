import { Component, Input } from '@angular/core';
import { Demande } from 'src/app/interfaces/Demande.interface';
import { DemandeService } from 'src/app/services/Demande.service';
import { faFilePen , faTrash} from '@fortawesome/free-solid-svg-icons';
import { CustomResponse } from 'src/app/interfaces/Custom-response';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';


@Component({
  selector: 'app-list-service',
  templateUrl: './list-service.component.html',
  styleUrls: ['./list-service.component.css'],
  providers: [DemandeService]
})
export class ListServiceComponent {
  @Input() myDemand!:string;
  @Input() myDate!:string;

  faFilePen = faFilePen;
  faTrash = faTrash;
  demandeResponse !: CustomResponse;

  private dataSubject = new BehaviorSubject<any>(null);

  constructor(private demandeService:DemandeService){}

  ngOnInit(): void {
    this.demandeService.demandes$.subscribe( (response) => {
        this.dataSubject.next(response); 
        this.demandeResponse = { ...response , data: { demandes: response.data.demandes?.reverse() } } ;
    });

  }

  onSelectYear(data:string){
    this.myDate = data;
  }


  onDemandAdded(demande: Demande){
        this.demandeService.saveDemande$(demande).subscribe(response => {
          this.dataSubject.next(
            {...response, data: {demandes: [response.data.demande, ...this.dataSubject.value.data.demandes ]}}
          )
          this.demandeResponse = this.dataSubject.value;
        });
       
  }

  filterDemande(type : string){
    this.demandeService.filterDemande$(type, this.dataSubject.value).subscribe(response => {
      this.demandeResponse = response;
    });
  }

}
