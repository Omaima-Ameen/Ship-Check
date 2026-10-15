import { describe, it} from "node:test";
import assert from "node:assert/strict";
import { validateUrl } from "../scanner/urlValidator.ts";

describe("validateUrl", () => {
 it("accepts a valid HTTPS URL" , () => {
    assert.equal(validateUrl("https://example.com").valid, true);
 });

 it("rejects an invalid URL", () => {
    assert.equal(validateUrl("not-a-url").valid, false);
 });

 it("rejects non-HTTP protocols", () => {
    assert.equal(validateUrl("file:///secret.com").valid, false);
 });

 it("rejects localhost addresses", () => {
    assert.equal(validateUrl("http://localhost:3000").valid, false);
 });

 it("rejects an invalid IPv4 address", () => {
    assert.equal(validateUrl("http://192.168.1.10").valid, false);
 });
 it("rejects ipv6 addresses", () => {
   assert.equal(validateUrl("http://[::1]:3000").valid, false);
 });
 it("rejects a private IPv6 address" , () => {
   assert.equal(validateUrl("http://[fd12:3456::1]:3000").valid, false);
 });

it("rejects an IPv6 link-local address" , () => {
   assert.equal(validateUrl("http://[fe80::1").valid, false);
 });
 it("rejects a link-local IPv4 address", () => {
   assert.equal(validateUrl("http://169.254.10.20").valid, false);
 });
});