import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ElectronService, CheckResult } from '../../core/electron.service';

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
  alert?: { level: CheckResult['level']; title: string; message: string };
  private timer?: any;

  constructor(private es: ElectronService) {}

  color(level: CheckResult['level']): string {
    if (level === 'danger') return '#ff6b6b';
    if (level === 'warn')   return '#ffcc66';
    return '#4cd964';
  }

  async onCheck(): Promise<void> {
    if (!this.pwd) { this.alert = undefined; return; }
    const res = await this.es.checkCandidate(this.pwd);
    const title =
      res.level === 'danger' ? 'Highly insecure' :
      res.level === 'warn'   ? 'Weak password'   :
                               'Looks good';
    const message = res.reasons.length ? res.reasons.join(', ') : 'No issues detected.';
    this.alert = { level: res.level, title, message };
  }

  debouncedCheck(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.onCheck(), 180);
  }

  async onSave(): Promise<void> {
    if (!this.pwd) return;
    await this.es.savePassword(this.pwd, this.note || undefined);
    console.log('[renderer] saved password meta');
    this.pwd = '';
    this.note = '';
    this.alert = undefined;
  }
}
