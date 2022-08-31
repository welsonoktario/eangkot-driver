import { Trayek } from "./trayek";

type StatusPengajuan = "Pending" | "Diterima" | "Ditolak";

export type Pengajuan = {
  id: number;
  trayek: Trayek;
  status: StatusPengajuan;
  tanggal: string;
  pengajuanDetail?: any;
};
