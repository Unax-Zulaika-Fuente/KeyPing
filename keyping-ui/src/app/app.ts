import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MasterLockService, MasterState } from './core/master-lock.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FormsModule, NgIf],
  templateUrl: './app.html'
})
export class AppComponent implements OnInit {
  lockState: MasterState = 'locked';
  masterError: string | null = null;
  masterPassword = '';
  masterPasswordConfirm = '';

  constructor(private master: MasterLockService) {}

  async ngOnInit(): Promise<void> {
    this.lockState = await this.master.init();
    this.master.state$.subscribe(state => (this.lockState = state));
  }

  async onUnlock(): Promise<void> {
    this.masterError = null;
    const ok = await this.master.unlock(this.masterPassword);
    if (!ok) {
      this.masterError = 'Contraseña incorrecta';
      return;
    }
    this.masterPassword = '';
  }

  async onCreateMaster(): Promise<void> {
    this.masterError = null;
    if (this.masterPassword.length < 8) {
      this.masterError = 'Usa al menos 8 caracteres';
      return;
    }
    if (this.masterPassword !== this.masterPasswordConfirm) {
      this.masterError = 'Las contraseñas no coinciden';
      return;
    }
    await this.master.setMaster(this.masterPassword);
    this.masterPassword = '';
    this.masterPasswordConfirm = '';
  }

  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  @HostListener('document:click')
  onUserActivity(): void {
    this.master.touch();
  }
}
