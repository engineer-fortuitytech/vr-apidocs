import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-overview',
  imports: [RouterModule],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
})
export class Overview implements OnInit {

  constructor(private cdr: ChangeDetectorRef) {}

  authHeaderExample = 'Authorization: Bearer <YOUR_API_KEY>';

  requestExample = `POST /api/appetite/check
Content-Type: application/json

{
  "userId": "123",
  "timeOfDay": "lunch",
  "diet": "vegetarian",
  "preferences": ["spicy", "high-protein"]
}`;
  ngOnInit(): void {
    // Initialization logic if needed
    this.cdr.detectChanges();
  }

}
