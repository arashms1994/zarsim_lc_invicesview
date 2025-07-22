import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "./base";
import type { ICustomerFactorItem } from "../utils/type";

export async function getAllLCInvoices(): Promise<ICustomerFactorItem[]> {
  const listTitle = "customer_factor";
  let items: ICustomerFactorItem[] = [];

  let nextUrl:
    | string
    | null = `${BASE_URL}/_api/web/lists/getbytitle('${listTitle}')/items?$top=100&$filter=substringof('lc', type_factor)&$orderby=Title desc`;

  while (nextUrl) {
    const res: Response = await fetch(nextUrl, {
      method: "GET",
      headers: {
        Accept: "application/json;odata=verbose",
      },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error("خطا در گرفتن آیتم‌ها: " + err);
    }

    const json: { d: { results: ICustomerFactorItem[]; __next?: string } } =
      await res.json();
    const results = json?.d?.results;
    if (!results) throw new Error("ساختار داده‌ی برگشتی نامعتبر است");

    items = [...items, ...results];
    nextUrl = json.d.__next ?? null;
  }

  return items;
}

export function useLCInvoices() {
  return useQuery<ICustomerFactorItem[], Error>({
    queryKey: ["customerFactor"],
    queryFn: () => getAllLCInvoices(),
  });
}
