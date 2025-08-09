export function createData(
  Title: string,
  Customer: string,
  type_factor: string,
  majmoemetraj: string,
  total_mani: string,
  LCNumber: string,
  LCTotal: string
) {
  return {
    Title,
    Customer,
    type_factor,
    majmoemetraj,
    total_mani,
    LCNumber,
    LCTotal,
  };
}