
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { safeRequest } from "../scanner/safeRequest";

describe("safeRequest security checks", () => {
  it("rejects localhost", async () => {
    await assert.rejects(
      safeRequest("http://localhost:3000"),
      /Local addresses cannot be scanned/
    );
  });

  it("rejects private IPv4 addresses", async () => {
    await assert.rejects(
      safeRequest("http://192.168.1.10"),
      /non-public IP address/
    );
  });

  it("rejects IPv6 loopback", async () => {
    await assert.rejects(
      safeRequest("http://[::1]"),
      /non-public IP address/
    );
  });

  it("rejects private IPv6 addresses", async () => {
    await assert.rejects(
      safeRequest("http://[fd12:3456::1]"),
      /non-public IP address/
    );
  });

  it("rejects unsupported protocols", async () => {
    await assert.rejects(
      safeRequest("file:///secret.txt"),
      /Only HTTP and HTTPS URLs are allowed/
    );
  });

  it("rejects URLs containing credentials", async () => {
    await assert.rejects(
      safeRequest("https://user:password@example.com"),
      /URLs containing credentials are not allowed/
    );
  });

  it("rejects non-standard ports", async () => {
    await assert.rejects(
      safeRequest("http://example.com:8080"),
      /Only standard HTTP and HTTPS ports are allowed/
    );
  });
});
