import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'kp-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {}
