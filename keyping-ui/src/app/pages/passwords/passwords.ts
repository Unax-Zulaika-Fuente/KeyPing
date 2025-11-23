import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElectronService, PasswordMeta } from '../../core/electron.service';

@Component({
  selector: 'app-passwords',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './passwords.html',
  styleUrls: ['./passwords.scss']
})
export class PasswordsComponent implements OnInit {

  loading = true;
  entries: PasswordMeta[] = [];

  // estado copia
  copyingId: string | null = null;
  copySecondsLeft = 0;
  private copyTimer: any;

  // estado edicion simple
  editingId: string | null = null;
  newPwd = '';

  constructor(private es: ElectronService) {}

  async ngOnInit(): Promise<void> {
    await this.loadEntries();
  }

  async loadEntries(): Promise<void> {
    this.loading = true;
    try {
      this.entries = await this.es.listPasswords();
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

  // --- COPIAR ---

  async onCopy(entry: PasswordMeta): Promise<void> {
    try {
      await this.es.copyPassword(entry.id);
      this.copyingId = entry.id;
      this.copySecondsLeft = 20;
      clearInterval(this.copyTimer);
      this.copyTimer = setInterval(() => {
        this.copySecondsLeft--;
        if (this.copySecondsLeft <= 0) {
          clearInterval(this.copyTimer);
          this.copyingId = null;
        }
      }, 1000);
    } catch (err) {
      console.error('[renderer] copy error', err);
    }
  }

  // --- ELIMINAR ---

  async onDelete(entry: PasswordMeta): Promise<void> {
    const ok = confirm('Delete this password from the active list? (Historical pattern is kept)');
    if (!ok) return;
    await this.es.deletePassword(entry.id);
    await this.loadEntries();
  }

  // --- EDITAR ---

  startEdit(entry: PasswordMeta): void {
    this.editingId = entry.id;
    this.newPwd = '';
  }

  cancelEdit(): void {
    this.editingId = null;
    this.newPwd = '';
  }

  async confirmEdit(entry: PasswordMeta): Promise<void> {
    if (!this.newPwd) return;
    await this.es.updatePassword(entry.id, this.newPwd);
    this.editingId = null;
    this.newPwd = '';
    await this.loadEntries();
  }
}
