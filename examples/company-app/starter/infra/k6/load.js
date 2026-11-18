// Steady background traffic for dashboards, sampling, and flag rollouts.
// Run with: docker compose --profile load up load
import http from "k6/http";
import { check, sleep } from "k6";

const BASE = __ENV.BASE_URL || "http://frontend-proxy:8080";

export const options = {
  vus: Number(__ENV.VUS || 5),
  duration: __ENV.DURATION || "10m",
};

export default function () {
  // Each virtual user acts as a different user, so percentage rollouts
  // see many targeting keys.
  const headers = { "Content-Type": "application/json", "X-User-Id": `user-${__VU}-${__ITER % 50}` };

  check(http.get(`${BASE}/api/employees`, { headers }), { "employees 200": (r) => r.status === 200 });
  check(http.get(`${BASE}/api/projects`, { headers }), { "projects 200": (r) => r.status === 200 });
  http.get(`${BASE}/api/assignments`, { headers }); // 502 until the service exists
  http.get(`${BASE}/api/employees/00000000-0000-4000-8000-000000000000`, { headers }); // a steady trickle of 404s

  if (__ITER % 10 === 0) {
    const email = `load-${__VU}-${__ITER}-${Date.now()}@example.com`;
    const res = http.post(`${BASE}/api/employees`,
      JSON.stringify({ name: "Load Test", email, title: "Tester", department: "QA" }), { headers });
    if (res.status === 201) {
      http.del(`${BASE}/api/employees/${res.json("id")}`, null, { headers });
    }
  }
  sleep(1);
}
