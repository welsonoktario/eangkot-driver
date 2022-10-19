import { User } from "./user";

export type Pesanan = {
  id: number;
  jemput: {
    lat: [number, number];
    long: [number, number];
  };
  tujuan: {
    lat: [number, number];
    long: [number, number];
  };
  penumpang: number;
  status: string;
  tanggal: string;
  user?: User;
};
