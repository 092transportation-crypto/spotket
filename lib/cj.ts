import axios from "axios";

/**
 * CJDropshipping API 2.0 client. The access token is cached in module scope
 * because CJ rate-limits getAccessToken to once per ~5 minutes; Fluid compute
 * keeps instances warm so the cache is usually hit.
 */
const BASE = "https://developers.cjdropshipping.com/api2.0/v1";

let cached: { token: string; expiresAt: number } | null = null;

export async function getCjToken(): Promise<string> {
  const email = process.env.CJ_EMAIL;
  // CJ's "password" field expects an API key generated in the CJ dashboard
  // (My CJ -> Authorization -> API), not the account login password.
  const password = process.env.CJ_API_KEY || process.env.CJ_PASSWORD;
  if (!email || !password) throw new Error("CJ_EMAIL and CJ_API_KEY (or CJ_PASSWORD) are not set");

  if (cached && Date.now() < cached.expiresAt) return cached.token;

  const { data } = await axios.post(
    `${BASE}/authentication/getAccessToken`,
    { email, password },
    { timeout: 30000 },
  );
  if (!data?.result || !data?.data?.accessToken) {
    throw new Error(
      `CJ auth failed: ${data?.message ?? "unknown error"} — make sure CJ_API_KEY holds an API key from CJ dashboard -> My CJ -> Authorization, not your login password.`,
    );
  }
  // Token is valid ~15 days; refresh well before that.
  cached = { token: data.data.accessToken, expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7 };
  return cached.token;
}

async function cj<T = Record<string, unknown>>(
  method: "get" | "post",
  path: string,
  payload?: Record<string, unknown>,
): Promise<T> {
  const token = await getCjToken();
  const { data } = await axios.request({
    method,
    url: `${BASE}${path}`,
    headers: { "CJ-Access-Token": token, "Content-Type": "application/json" },
    ...(method === "get" ? { params: payload } : { data: payload }),
    timeout: 45000,
  });
  if (!data?.result) {
    throw new Error(`CJ ${path} failed: ${data?.message ?? "unknown error"}`);
  }
  return data.data as T;
}

export type CjSearchItem = {
  pid: string;
  productNameEn: string;
  productImage: string;
  sellPrice: string;
  categoryName?: string;
};

export async function searchCjProducts(query: string, page = 1) {
  return cj<{ list: CjSearchItem[]; total: number }>("get", "/product/list", {
    productNameEn: query,
    pageNum: page,
    pageSize: 20,
  });
}

export async function getCjProduct(pid: string) {
  return cj<{
    pid: string;
    productNameEn: string;
    productImage: string;
    description?: string;
    categoryName?: string;
    variants?: { vid: string; variantNameEn?: string; variantSellPrice?: number; variantImage?: string }[];
  }>("get", "/product/query", { pid });
}

export type CjOrderItem = { vid: string; quantity: number };

export async function createCjOrder(input: {
  orderNumber: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  countryCode: string;
  items: CjOrderItem[];
}) {
  return cj<{ orderId: string }>("post", "/shopping/order/createOrderV2", {
    orderNumber: input.orderNumber,
    shippingCountryCode: input.countryCode,
    shippingProvince: input.state,
    shippingCity: input.city,
    shippingAddress: input.street,
    shippingCustomerName: input.name,
    shippingZip: input.zip,
    shippingPhone: input.phone,
    logisticName: "CJPacket Ordinary",
    fromCountryCode: "CN",
    payType: 2,
    products: input.items,
  });
}

export async function getCjOrder(orderId: string) {
  return cj<{
    orderId: string;
    orderNum?: string;
    orderStatus?: string;
    trackNumber?: string;
    createDate?: string;
  }>("get", "/shopping/order/getOrderDetail", { orderId });
}

export async function listCjOrders(page = 1) {
  return cj<{ list: { orderId: string; orderNum?: string; orderStatus?: string; trackNumber?: string }[] }>(
    "get",
    "/shopping/order/list",
    { pageNum: page, pageSize: 50 },
  );
}

export async function getCjTracking(trackNumber: string) {
  return cj<
    { trackingNumber?: string; deliveryTime?: string; trackingStatus?: string }[] | Record<string, unknown>
  >("get", "/logistic/trackInfo", { trackNumber });
}
