// global window typings for preload api
export {};

declare global {
  interface Window {
    keyping: {
      checkCandidate(pwd: string): Promise<{ level: 'ok'|'warn'|'danger'; reasons: string[] }>;
    };
  }
}
