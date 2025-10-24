import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

type Entry = { id: string; createdAt: number; length: number; classMask: number; note?: string; };

@Component({
  selector: 'app-passwords',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './passwords.html',
  styleUrls: ['./passwords.scss']
})
export class PasswordsComponent {
  entries: Entry[] = [
    { id: '1', createdAt: Date.now() - 86400000, length: 12, classMask: 1|2|4|8, note: 'email' },
    { id: '2', createdAt: Date.now() - 4200000,  length: 16, classMask: 1|4|8 }
  ];

  maskToChips(mask: number): string[] {
    const chips: string[] = [];
    if (mask & 1) chips.push('a-z');
    if (mask & 2) chips.push('A-Z');
    if (mask & 4) chips.push('0-9');
    if (mask & 8) chips.push('sym');
    if (mask & 16) chips.push('space');
    return chips;
  }
  fmtDate(ts: number): string { return new Date(ts).toLocaleString(); }
}
