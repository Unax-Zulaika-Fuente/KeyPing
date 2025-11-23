import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ElectronService, PasswordMeta } from '../../core/electron.service';

@Component({
  selector: 'app-passwords',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './passwords.html',
  styleUrls: ['./passwords.scss']
})
export class PasswordsComponent implements OnInit {
  entries: PasswordMeta[] = [];
  loading = true;

  constructor(private es: ElectronService) {}

  async ngOnInit(): Promise<void> {
    try {
      this.entries = await this.es.listPasswords();
    } catch (err) {
      console.error('[renderer] listPasswords error', err);
      this.entries = [];
    } finally {
      this.loading = false;
    }
  }

  maskToChips(mask: number): string[] {
    const chips: string[] = [];
    if (mask & 1) chips.push('a-z');
    if (mask & 2) chips.push('A-Z');
    if (mask & 4) chips.push('0-9');
    if (mask & 8) chips.push('sym');
    return chips;
  }

  fmtDate(ts: number): string {
    return new Date(ts).toLocaleString();
  }
}
