import http from "k6/http";
import { check, sleep } from "k6";

const CHECKOUT_URL = __ENV.CHECKOUT_URL || "http://localhost:8080";
const VUS = parseInt(__ENV.VUS || "20");
const DURATION = __ENV.DURATION || "60s";

export const options = {
  vus: VUS,
  duration: DURATION,
};

export default function () {
  const orderId = `order-${__VU}-${__ITER}`;
  const payload = JSON.stringify({
    order_id: orderId,
    items: [{ sku: "FLASH-ITEM", qty: 1 }],
  });

  const res = http.post(`${CHECKOUT_URL}/checkout`, payload, {
    headers: { "Content-Type": "application/json" },
  });

  check(res, { "status is 202": (r) => r.status === 202 });

  sleep(1);
}
