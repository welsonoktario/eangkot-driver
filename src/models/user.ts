import { Pengajuan } from "./pengajuan";

export interface User {
  id: number;
  nama: string;
  noHp: string;
  email?: string;
  secure: boolean;
  pengajuan?: Pengajuan;
}
