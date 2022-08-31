import { Ulasan } from "./ulasan";

export type Transaksi = {
  id: number;
  ongkos: number;
  durasiPerjalanan: number;
  jarakPerjalanan: number;
  tanggal: string;
  ulasan?: Ulasan;
};
