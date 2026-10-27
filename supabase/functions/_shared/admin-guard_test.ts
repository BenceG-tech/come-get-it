import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { authorize, type GuardDeps } from "./admin-guard.ts";

const SERVICE = "service-role-key-xyz";
const ANON = "anon-public-key";
const deps: GuardDeps = {
  serviceKey: SERVICE,
  verifyCronSecret: async (s) => s === "right-cron-secret",
  getUserId: async (t) => (t === "admin-jwt" ? "u-admin" : t === "user-jwt" ? "u-user" : null), // anon key has no user
  isAdmin: async (id) => id === "u-admin",
};
const req = (h: Record<string, string>) => new Request("http://x", { method: "POST", headers: h });
const status = (r: any) => (r.ok ? 200 : r.status);

Deno.test("missing token -> 401", async () => assertEquals(status(await authorize(req({}), deps)), 401));
Deno.test("invalid token -> 401", async () => assertEquals(status(await authorize(req({ Authorization: "Bearer garbage" }), deps)), 401));
Deno.test("anon public key -> 401", async () => assertEquals(status(await authorize(req({ Authorization: `Bearer ${ANON}` }), deps)), 401));
Deno.test("signed-in non-admin -> 403", async () => assertEquals(status(await authorize(req({ Authorization: "Bearer user-jwt" }), deps)), 403));
Deno.test("admin succeeds with user id", async () => {
  const r: any = await authorize(req({ Authorization: "Bearer admin-jwt" }), deps);
  assertEquals([r.ok, r.kind, r.userId], [true, "admin", "u-admin"]);
});
Deno.test("service role (internal call) succeeds", async () => {
  const r: any = await authorize(req({ Authorization: `Bearer ${SERVICE}` }), deps);
  assertEquals([r.ok, r.kind], [true, "service"]);
});
Deno.test("valid cron secret succeeds", async () => {
  const r: any = await authorize(req({ Authorization: `Bearer ${ANON}`, "x-cron-secret": "right-cron-secret" }), deps);
  assertEquals([r.ok, r.kind], [true, "cron"]);
});
Deno.test("invalid / empty cron secret fails closed even with admin token", async () => {
  assertEquals(status(await authorize(req({ "x-cron-secret": "wrong" }), deps)), 401);
  assertEquals(status(await authorize(req({ "x-cron-secret": "" }), deps)), 401);
  assertEquals(status(await authorize(req({ Authorization: "Bearer admin-jwt", "x-cron-secret": "wrong" }), deps)), 401);
});
Deno.test("dependency errors fail closed", async () => {
  const boom: GuardDeps = { ...deps, getUserId: async () => { throw new Error("down"); } };
  assertEquals(status(await authorize(req({ Authorization: "Bearer admin-jwt" }), boom)), 401);
  const rpcErr: GuardDeps = { ...deps, isAdmin: async () => { throw new Error("rpc"); } };
  assertEquals(status(await authorize(req({ Authorization: "Bearer admin-jwt" }), rpcErr)), 401);
});
