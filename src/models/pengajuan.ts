import { Trayek } from "./trayek";

type StatusPengajuan = "Pending" | "Diterima" | "Ditolak";

export interface Pengajuan {
  id: number;
  trayek: Trayek;
  status: StatusPengajuan;
  tanggal: string;
  pengajuanDetail?: any;
}
