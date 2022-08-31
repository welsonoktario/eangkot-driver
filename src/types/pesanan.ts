import { Transaksi } from "./transaksi";
import { User } from "./user";

export type Pesanan = {
  id: number;
  jemput: {
    lat: number[];
    long: number[];
  };
  tujuan: {
    lat: number[];
    long: number[];
  };
  penumpang: number;
  status: string;
  tanggal: string;
  user?: User;
  driver?: any;
  transaksi?: Transaksi;
};
