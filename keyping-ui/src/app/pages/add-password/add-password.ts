import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ElectronService } from '../../core/electron.service';

type Alert = { level: 'ok'|'warn'|'danger'; title: string; message: string; };

@Component({
  selector: 'app-add-password',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './add-password.html',
  styleUrls: ['./add-password.scss']
})
export class AddPasswordComponent {
  pwd = '';
  note = '';
  alert?: Alert;

  constructor(private es: ElectronService) {}

  async onCheck(): Promise<void> {
    if (!this.pwd) { this.alert = undefined; return; }
    const res = await this.es.checkCandidate(this.pwd);
    const title = res.level === 'danger' ? 'Highly insecure'
                : res.level === 'warn'   ? 'Weak password'
                : 'Looks good';
    const message = res.reasons.length ? res.reasons.join(', ') : 'No issues detected.';
    this.alert = { level: res.level, title, message };
  }

  // evita que se llame onCheck() en cada tecla, espera 180ms sin escribir
  private timer?: any;
  debouncedCheck() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.onCheck(), 180);
  }

  onSave(): void {
    console.log('Saving (mock):', { pwd: this.pwd, note: this.note });
    this.pwd = ''; this.note = ''; this.alert = undefined;
  }

  color(level: Alert['level']) {
    return level === 'danger' ? 'var(--danger)' : level === 'warn' ? 'var(--warn)' : 'var(--ok)';
  }
}
