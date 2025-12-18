import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './layout/sidebar/sidebar';
import { Header } from './layout/header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
    imports: [
    RouterOutlet,
    Sidebar,
    Header
  ]
})
export class App {
  blurActive = false;

  // protected readonly title = signal('smartbudget');
}
