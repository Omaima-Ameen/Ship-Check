
import { lookup } from "node:dns/promises";
import * as http from "node:http";
import * as https from "node:https";
import type { LookupFunction } from "node:net";
import ipaddr from "ipaddr.js";

const TIMEOUT_MS = 8000;
const MAX_RESPONSE_BYTES = 1024 * 1024;

type SafeResponse = {
  statusCode: number;
  headers: http.IncomingHttpHeaders;
};

function isPublicAddress(value: string): boolean {
  if (!ipaddr.isValid(value)) return false;

  let address = ipaddr.parse(value);

  if (
    address.kind() === "ipv6" &&
    (address as ipaddr.IPv6).isIPv4MappedAddress()
  ) {
    address = (address as ipaddr.IPv6).toIPv4Address();
  }

  return address.range() === "unicast";
}

export async function safeRequest(
  input: string
): Promise<SafeResponse> {
  let url: URL;

  try {
    url = new URL(input.trim());
  } catch {
    throw new Error("Please enter a valid URL.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only HTTP and HTTPS URLs are allowed.");
  }

  if (url.username || url.password) {
    throw new Error("URLs containing credentials are not allowed.");
  }

  const hostname = url.hostname
    .replace(/^\[|\]$/g, "")
    .toLowerCase();

  if (
    !hostname ||
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.includes("%")
  ) {
    throw new Error("Local addresses cannot be scanned.");
  }

  const expectedPort = url.protocol === "https:" ? "443" : "80";

  if (url.port && url.port !== expectedPort) {
    throw new Error("Only standard HTTP and HTTPS ports are allowed.");
  }

  let addresses: Array<{ address: string; family: number }>;

  try {
    addresses = ipaddr.isValid(hostname)
      ? [
          {
            address: ipaddr.parse(hostname).toString(),
            family: ipaddr.parse(hostname).kind() === "ipv4" ? 4 : 6,
          },
        ]
      : await lookup(hostname, { all: true, verbatim: true });
  } catch {
    throw new Error("Could not resolve the website hostname.");
  }

  if (
    addresses.length === 0 ||
    addresses.some((entry) => !isPublicAddress(entry.address))
  ) {
    throw new Error("The destination resolves to a non-public IP address.");
  }

  const selected = addresses[0];

  const pinnedLookup = ((
    _hostname: string,
    options: number | { all?: boolean } | undefined,
    callback: (...args: any[]) => void
  ) => {
    const result = {
      address: selected.address,
      family: selected.family,
    };

    if (typeof options === "object" && options?.all) {
      callback(null, [result]);
    } else {
      callback(null, result.address, result.family);
    }
  }) as LookupFunction;

  const transport = url.protocol === "https:" ? https : http;

  return new Promise<SafeResponse>((resolve, reject) => {
    let settled = false;
    let received = 0;

    const finishError = (error: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(totalTimeout);
      reject(error);
    };

    const totalTimeout = setTimeout(() => {
      request.destroy();
      finishError(new Error("Website scan timed out."));
    }, TIMEOUT_MS);

    const request = transport.request(
      {
        protocol: url.protocol,
        hostname,
        port: Number(url.port || expectedPort),
        path: `${url.pathname}${url.search}`,
        method: "GET",
        headers: {
          "User-Agent": "ShipCheck/1.0",
          Accept: "text/html,application/xhtml+xml,*/*;q=0.8",
          Connection: "close",
        },
        lookup: pinnedLookup,
        ...(url.protocol === "https:" && !ipaddr.isValid(hostname)
          ? { servername: hostname }
          : {}),
      },
      (response) => {
        const statusCode = response.statusCode ?? 0;

        if (statusCode >= 300 && statusCode < 400) {
          response.destroy();
          finishError(
            new Error("Redirects are not followed. Scan the destination URL directly.")
          );
          request.destroy();
          return;
        }

        response.on("data", (chunk: Buffer) => {
          received += chunk.length;

          if (received > MAX_RESPONSE_BYTES) {
            finishError(
              new Error("Website response exceeded the 1 MB limit.")
            );
            response.destroy();
            request.destroy();
          }
        });

        response.on("error", (error) => finishError(error));

        response.on("end", () => {
          if (settled) return;

          settled = true;
          clearTimeout(totalTimeout);

          resolve({
            statusCode,
            headers: response.headers,
          });
        });

        response.resume();
      }
    );

    request.setTimeout(TIMEOUT_MS, () => {
      request.destroy(new Error("Website scan timed out."));
    });

    request.on("error", (error) => finishError(error));
    request.end();
  });
}
