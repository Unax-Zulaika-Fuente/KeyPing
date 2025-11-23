import { contextBridge, ipcRenderer } from 'electron';

console.log('[preload] loaded');

contextBridge.exposeInMainWorld('keyping', {
  ping: () => ipcRenderer.invoke('keyping:ping'),

  checkCandidate: (pwd: string) => {
    console.log('[preload] invoking keyping:check');
    return ipcRenderer.invoke('keyping:check', { pwd });
  },

  savePassword: (pwd: string, note?: string) =>
    ipcRenderer.invoke('keyping:save', { pwd, note }),

  listPasswords: () =>
    ipcRenderer.invoke('keyping:list')
});
