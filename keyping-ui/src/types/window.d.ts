// global window typings for preload api
export {};

declare global {
  interface Window {
    keyping?: {
      checkCandidate(pwd: string): Promise<{ level: 'ok' | 'warn' | 'danger'; reasons: string[] }>;
      savePassword(pwd: string, note?: string): Promise<{
        id: string; createdAt: number; length: number; classMask: number; note?: string;
      }>;
      listPasswords(): Promise<Array<{
        id: string; createdAt: number; length: number; classMask: number; note?: string;
      }>>;
      ping?(): Promise<string>;
    };
  }
}
