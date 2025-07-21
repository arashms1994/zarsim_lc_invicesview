export interface ITabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface ICustomerFactorItem {
  ID: number;
  Title: string;
  CodeID: number;
  Customer: string;
  Date: string;
  LCEnding: string | null;
  LCNumber: string | null;
  LCTotal: string | null;
  mabnavalue: string | null;
  majmoemetraj: string | null;
  tarikheblagh: string | null;
  tarikhgoshayesh: string | null;
  tarikhmabnavalue: string | null;
  total_SUM: string | null;
  type_factor: string;
}

