// global window typings for preload api
export {};

declare global {
  interface Window {
    keyping?: {
      checkCandidate(pwd: string): Promise<{ level: 'ok' | 'warn' | 'danger'; reasons: string[] }>;
      savePassword(
        pwd: string,
        label?: string,
        loginUrl?: string,
        passwordChangeUrl?: string,
        username?: string,
        email?: string,
        folder?: string,
        twoFactorEnabled?: boolean
      ): Promise<{
        id: string; createdAt: number; length: number; classMask: number;
        label?: string; loginUrl?: string; passwordChangeUrl?: string; username?: string; email?: string; folder?: string;
      }>;
      listPasswords(): Promise<Array<{
        id: string; createdAt: number; length: number; classMask: number;
        label?: string; loginUrl?: string; passwordChangeUrl?: string; username?: string; email?: string; folder?: string;
      }>>;
      ping?(): Promise<string>;
    };
  }
}
