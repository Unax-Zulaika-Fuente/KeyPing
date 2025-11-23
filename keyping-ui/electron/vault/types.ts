// Tipos para el vault de KeyPing (sin tildes ni enies)

export type VaultEntry = {
  id: string;
  createdAt: number;
  length: number;
  classMask: number;
  hash: string;        // hash sha256 de la password
  normalized?: string; // patron normalizado (para similitud)
  label?: string;      // nombre de la web/app/servicio
  password?: string;   // secreto en claro dentro del vault cifrado
  active?: boolean;    // true = vigente, false = historica / eliminada
  previousId?: string; // id de la entrada anterior (edicion)
};

export type VaultData = {
  entries: VaultEntry[];
};
