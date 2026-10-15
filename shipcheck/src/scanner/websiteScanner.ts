
import { validateUrl } from "./urlValidator";
import { safeRequest } from "./safeRequest";

export type ScanFinding = {
  id: string;
  title: string;
  status: "pass" | "warning";
  details: string;
  fix: string;
};

export type ScanReport = {
  url: string;
  statusCode: number;
  scannedAt: string;
  findings: ScanFinding[];
};

export async function scanWebsite(
  input: string
): Promise<ScanReport> {
  const validation = validateUrl(input);

  if (!validation.valid || !validation.url) {
    throw new Error(validation.error ?? "Invalid URL.");
  }

  const url = validation.url;
  const response = await safeRequest(url.toString());
  const headers = response.headers;

  const findings: ScanFinding[] = [
    {
      id: "https",
      title: "HTTPS",
      status: url.protocol === "https:" ? "pass" : "warning",
      details:
        url.protocol === "https:"
          ? "The submitted URL uses HTTPS."
          : "The submitted URL uses HTTP, not HTTPS.",
      fix: "Use HTTPS with a valid TLS certificate.",
    },
  ];

  const securityHeaders = [
    {
      name: "strict-transport-security",
      title: "HTTP Strict Transport Security",
      fix: "Configure Strict-Transport-Security on HTTPS responses.",
    },
    {
      name: "content-security-policy",
      title: "Content Security Policy",
      fix: "Configure a Content-Security-Policy suited to your site.",
    },
    {
      name: "x-content-type-options",
      title: "Content Type Options",
      fix: "Set X-Content-Type-Options: nosniff.",
    },
    {
      name: "x-frame-options",
      title: "Frame Protection",
      fix: "Configure CSP frame-ancestors or X-Frame-Options.",
    },
  ];

  for (const header of securityHeaders) {
    const present = Boolean(headers[header.name]);

    findings.push({
      id: header.name,
      title: header.title,
      status: present ? "pass" : "warning",
      details: present
        ? `The ${header.name} response header is present.`
        : `The ${header.name} response header was not found.`,
      fix: header.fix,
    });
  }

  return {
    url: url.toString(),
    statusCode: response.statusCode,
    scannedAt: new Date().toISOString(),
    findings,
  };
}
