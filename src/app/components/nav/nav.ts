import { Component, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Theme } from '../../services/theme';

@Component({
  selector: 'app-nav',
  imports: [CommonModule,RouterModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {

  constructor(private themeService: Theme,
              private cdr: ChangeDetectorRef
  ) {}

  mobileOpen = false;



  toggleMobile() {
    this.mobileOpen = !this.mobileOpen;
    this.cdr.detectChanges();
  }

  closeMobile() {
    this.mobileOpen = false;
    this.cdr.detectChanges();
  }


  toggleTheme() {
    this.themeService.toggle();
  }


}
