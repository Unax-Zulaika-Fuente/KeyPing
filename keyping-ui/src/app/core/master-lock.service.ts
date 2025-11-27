import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type MasterState = 'unset' | 'locked' | 'unlocked';

type StoredMaster = {
  salt: string; // base64
  check: string; // base64 de iv + cipher
  iterations: number;
};

@Injectable({ providedIn: 'root' })
export class MasterLockService {
  readonly state$ = new BehaviorSubject<MasterState>('locked');

  private masterKey: CryptoKey | null = null;
  private inactivityTimer: any;

  private readonly masterStorageKey = 'keyping.master.v1';
  private readonly vaultStorageKey = 'keyping.vault.enc.v1';
  private readonly inactivityMs = 5 * 60 * 1000; // 5 minutos
  private readonly verificationText = 'keyping-master-check';

  async init(): Promise<MasterState> {
    const stored = this.loadStoredMaster();
    const nextState: MasterState = stored ? 'locked' : 'unset';
    this.state$.next(nextState);
    return nextState;
  }

  lock(): void {
    this.masterKey = null;
    clearTimeout(this.inactivityTimer);
    this.inactivityTimer = null;
    if (this.state$.value !== 'unset') {
      this.state$.next('locked');
    }
  }

  touch(): void {
    if (this.state$.value !== 'unlocked') return;
    clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => this.lock(), this.inactivityMs);
  }

  async setMaster(password: string): Promise<void> {
    const salt = this.randomBytes(16);
    const key = await this.deriveKey(password, this.toArrayBuffer(salt), 150_000);
    const check = await this.encryptText(key, this.verificationText);

    const payload: StoredMaster = {
      salt: this.toB64(salt),
      check,
      iterations: 150_000
    };
    localStorage.setItem(this.masterStorageKey, JSON.stringify(payload));

    this.masterKey = key;
    this.state$.next('unlocked');
    this.touch();
  }

  async unlock(password: string): Promise<boolean> {
    const stored = this.loadStoredMaster();
    if (!stored) return false;

    try {
      const salt = this.fromB64(stored.salt);
      const key = await this.deriveKey(password, this.toArrayBuffer(salt), stored.iterations || 150_000);
      const plain = await this.decryptText(key, stored.check);
      if (plain !== this.verificationText) return false;

      this.masterKey = key;
      this.state$.next('unlocked');
      this.touch();
      return true;
    } catch (err) {
      console.warn('[master] unlock failed', err);
      return false;
    }
  }

  async persistVault(data: unknown): Promise<void> {
    if (!this.masterKey) return;
    try {
      const json = JSON.stringify(data ?? null);
      const cipher = await this.encryptText(this.masterKey, json);
      localStorage.setItem(this.vaultStorageKey, cipher);
    } catch (err) {
      console.warn('[master] unable to persist vault cache', err);
    }
  }

  async loadCachedVault<T = any>(): Promise<T | null> {
    if (!this.masterKey) return null;
    try {
      const cipher = localStorage.getItem(this.vaultStorageKey);
      if (!cipher) return null;
      const json = await this.decryptText(this.masterKey, cipher);
      return JSON.parse(json) as T;
    } catch (err) {
      console.warn('[master] unable to load vault cache', err);
      return null;
    }
  }

  private loadStoredMaster(): StoredMaster | null {
    try {
      const raw = localStorage.getItem(this.masterStorageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (typeof parsed?.salt === 'string' && typeof parsed?.check === 'string') {
        return {
          salt: parsed.salt,
          check: parsed.check,
          iterations: parsed.iterations || 150_000
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  private async deriveKey(password: string, salt: ArrayBuffer, iterations: number): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const baseKey = await crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations,
        hash: 'SHA-256'
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  private async encryptText(key: CryptoKey, text: string): Promise<string> {
    const enc = new TextEncoder();
    const iv = this.randomBytes(12);
    const cipherBuf = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: this.toArrayBuffer(iv) },
      key,
      enc.encode(text)
    );
    const combined = new Uint8Array(iv.byteLength + cipherBuf.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(cipherBuf), iv.byteLength);
    return this.toB64(combined);
  }

  private async decryptText(key: CryptoKey, b64: string): Promise<string> {
    const data = this.fromB64(b64);
    const iv = data.subarray(0, 12);
    const cipher = data.subarray(12);
    const plainBuf = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: this.toArrayBuffer(iv) },
      key,
      this.toArrayBuffer(cipher)
    );
    return new TextDecoder().decode(plainBuf);
  }

  private toB64(u8: Uint8Array): string {
    let s = '';
    u8.forEach(b => (s += String.fromCharCode(b)));
    return btoa(s);
  }

  private fromB64(b64: string): Uint8Array {
    const s = atob(b64);
    const u8 = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) {
      u8[i] = s.charCodeAt(i);
    }
    return u8;
  }

  private randomBytes(len: number): Uint8Array {
    const arr = new Uint8Array(len);
    crypto.getRandomValues(arr);
    return arr;
  }

  private toArrayBuffer(u8: Uint8Array): ArrayBuffer {
    // Copia a un ArrayBuffer real (evita SharedArrayBuffer)
    const copy = new Uint8Array(u8.byteLength);
    copy.set(new Uint8Array(u8.buffer, u8.byteOffset, u8.byteLength));
    return copy.buffer;
  }
}
