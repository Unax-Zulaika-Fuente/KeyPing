import { Injectable } from '@angular/core';

export type CheckLevel = 'ok' | 'warn' | 'danger';

export type CheckResult = {
  level: CheckLevel;
  reasons: string[];
};

export type PasswordMeta = {
  id: string;
  createdAt: number;
  length: number;
  classMask: number;
  note?: string;
};

type KeypingApi = {
  checkCandidate(pwd: string): Promise<CheckResult>;
  savePassword(pwd: string, note?: string): Promise<PasswordMeta>;
  listPasswords(): Promise<PasswordMeta[]>;
  ping?(): Promise<string>;
};

@Injectable({ providedIn: 'root' })
export class ElectronService {
  private get api(): KeypingApi | undefined {
    return (window as any).keyping as KeypingApi | undefined;
  }

  isElectron(): boolean {
    return !!this.api;
  }

  async checkCandidate(pwd: string): Promise<CheckResult> {
    if (!this.api) throw new Error('No preload API available');
    return this.api.checkCandidate(pwd);
  }

  async savePassword(pwd: string, note?: string): Promise<PasswordMeta> {
    if (!this.api) throw new Error('No preload API available');
    return this.api.savePassword(pwd, note);
  }

  async listPasswords(): Promise<PasswordMeta[]> {
    if (!this.api) throw new Error('No preload API available');
    return this.api.listPasswords();
  }
}
