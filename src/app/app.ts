import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { Nav } from './components/nav/nav';


// === CONFIG ===

const APPETITE_OPENAPI_URL = 'https://appetitecheck-uat.fortuitytech.com/';
const OPENAPI_URL =
  //(window as any).APPETITE_OPENAPI_URL ||
  'https://appetitecheck-uat.fortuitytech.com';

// Optional health endpoint (e.g. '/health')
const HEALTHCHECK_PATH: string | null =
  (window as any).APPETITE_HEALTH_PATH || null;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Nav],
  templateUrl: './app.html'
})
export class AppComponent implements OnInit {
  title = 'Appetite Check API';

  loading = true;
  loadError: string | null = null;

  constructor(private http: HttpClient,
              private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    
  }

  // --- Status helpers ---

}
