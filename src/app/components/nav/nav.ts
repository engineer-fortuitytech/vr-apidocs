import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Theme } from '../../services/theme';

@Component({
  selector: 'app-nav',
  imports: [RouterModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {

  constructor(private themeService: Theme) {}


  toggleTheme() {
    console.log('Toggling theme');
    this.themeService.toggle();
  }


}
