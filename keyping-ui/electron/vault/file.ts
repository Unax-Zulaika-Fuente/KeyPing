import { promises as fs } from 'fs';
import * as path from 'path';
import { app } from 'electron';
import { encryptVault, decryptVault } from './crypto';
import { VaultData } from './types';

function vaultPath(): string {
  return path.join(app.getPath('userData'), 'keyping-vault.kp');
}

export async function loadVault(): Promise<VaultData> {
  const file = vaultPath();
  try {
    const buf = await fs.readFile(file);
    const json = await decryptVault(buf);
    return JSON.parse(json) as VaultData;
  } catch (err: any) {
    if (err.code === 'ENOENT') return { entries: [] };
    console.error('[vault] load error:', err);
    return { entries: [] };
  }
}

export async function saveVault(data: VaultData): Promise<void> {
  const file = vaultPath();
  const json = JSON.stringify(data);
  const encrypted = await encryptVault(json);

  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, encrypted);
}

export async function resetVault(): Promise<void> {
  const file = vaultPath();
  try { await fs.unlink(file); } catch {}
}
