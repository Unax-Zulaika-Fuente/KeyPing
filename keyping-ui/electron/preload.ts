import { contextBridge, ipcRenderer } from 'electron';

console.log('[preload] loaded');

contextBridge.exposeInMainWorld('keyping', {
  ping: () => ipcRenderer.invoke('keyping:ping'),

  checkCandidate: (pwd: string) => {
    console.log('[preload] invoking keyping:check');
    return ipcRenderer.invoke('keyping:check', { pwd });
  },

  savePassword: (pwd: string, label?: string) =>
    ipcRenderer.invoke('keyping:save', { pwd, label }),

  listPasswords: () =>
    ipcRenderer.invoke('keyping:list'),

  copyPassword: (id: string) =>
    ipcRenderer.invoke('keyping:copy', { id }),

  deletePassword: (id: string) =>
    ipcRenderer.invoke('keyping:delete', { id }),

  updatePassword: (id: string, pwd: string) =>
    ipcRenderer.invoke('keyping:update', { id, pwd })
});
