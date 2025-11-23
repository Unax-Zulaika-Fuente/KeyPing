// Sin tildes ni enies para evitar problemas de encoding

export type VaultEntry = {
  id: string;
  createdAt: number;
  length: number;
  classMask: number;
  hash: string;     // hash sha256 no reversible
  note?: string;
};

export type VaultData = {
  entries: VaultEntry[];
};
