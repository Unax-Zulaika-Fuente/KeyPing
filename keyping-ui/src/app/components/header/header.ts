import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'kp-header',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  readonly logoPath = 'assets/logo.png'
}
