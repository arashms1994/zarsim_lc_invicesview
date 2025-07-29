import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "./base";
import type { ICustomerFactorItem } from "../utils/type";

declare const _spPageContextInfo: { webAbsoluteUrl: string };

export async function getCurrentUser(): Promise<string> {
  const response = await fetch(
    `${_spPageContextInfo.webAbsoluteUrl}/_api/web/currentuser`,
    {
      headers: { Accept: "application/json;odata=verbose" },
      credentials: "same-origin",
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  const rawLoginName = data.d.LoginName;

  return rawLoginName;
}

export async function getAllLCInvoices(): Promise<ICustomerFactorItem[]> {
  const listTitle = "customer_factor";
  let items: ICustomerFactorItem[] = [];

  let nextUrl:
    | string
    | null = `${BASE_URL}/_api/web/lists/getbytitle('${listTitle}')/items?$top=100&$filter=substringof('lc', type_factor) and substringof('تایید', ApproveManagerFactor)&$orderby=Title desc`;
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
  return useQuery({
    queryKey: ["customerFactor"],
    queryFn: getAllLCInvoices,
    refetchInterval: 3000,
  });
}
