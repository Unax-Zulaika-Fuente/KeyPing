import { Injectable } from '@angular/core';

export type CheckResult = { level: 'ok'|'warn'|'danger'; reasons: string[] };

@Injectable({ providedIn: 'root' })
export class ElectronService {
  private get api() { return (window as any).keyping as Window['keyping'] | undefined; }
  isElectron(): boolean { return !!this.api; }
  async checkCandidate(pwd: string) {
    if (!this.api) throw new Error('No preload API');   // para forzar uso de backend
    return this.api.checkCandidate(pwd);
  }
}
