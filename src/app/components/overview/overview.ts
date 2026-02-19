import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { exampleService } from '../../services/example';



@Component({
  selector: 'app-overview',
  imports: [RouterModule],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
})
export class Overview implements OnInit {

  constructor(private cdr: ChangeDetectorRef) {}

  authHeaderExample = 'Authorization: Bearer <YOUR_API_KEY>';

  occupancyRequestSample = exampleService.getSampleRequest('occupancy.search').code;
  appetiteCheckSample = exampleService.getSampleRequest('appetite.check').code;
  bopQuoteSample = exampleService.getSampleRequest('bop.create.quote').code;
  cppQuoteSample = exampleService.getSampleRequest('cpp.create.quote').code;
  
  ngOnInit(): void {
    // Initialization logic if needed
    this.cdr.detectChanges();
  }

}
