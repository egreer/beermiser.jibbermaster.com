export type Brew = {
  id: string;
  name: string;
  alcohol: string;
  alcohol_unit: string;
  sizes: Size[];
};

export type Size = {
  id: string;
  volume: string;
  volume_unit: string;
  price: string;
  calculation?: number | null;
  apv_calculation?: number | null;
  ppv_calculation?: number | null;
};
