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
  label?: string;
};

type KeypingApi = {
  checkCandidate(pwd: string): Promise<CheckResult>;
  savePassword(pwd: string, label?: string): Promise<PasswordMeta>;
  listPasswords(): Promise<PasswordMeta[]>;
  copyPassword(id: string): Promise<boolean>;
  deletePassword(id: string): Promise<boolean>;
  updatePassword(id: string, pwd: string): Promise<PasswordMeta>;
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

  async savePassword(pwd: string, label?: string): Promise<PasswordMeta> {
    if (!this.api) throw new Error('No preload API available');
    return this.api.savePassword(pwd, label);
  }

  async listPasswords(): Promise<PasswordMeta[]> {
    if (!this.api) throw new Error('No preload API available');
    return this.api.listPasswords();
  }

  async copyPassword(id: string): Promise<void> {
    if (!this.api) throw new Error('No preload API available');
    await this.api.copyPassword(id);
  }

  async deletePassword(id: string): Promise<void> {
    if (!this.api) throw new Error('No preload API available');
    await this.api.deletePassword(id);
  }

  async updatePassword(id: string, pwd: string): Promise<PasswordMeta> {
    if (!this.api) throw new Error('No preload API available');
    return this.api.updatePassword(id, pwd);
  }
}
