
import ipaddr from "ipaddr.js";

export type UrlValidationResult = {
  valid: boolean;
  url?: URL;
  error?: string;
};

export function validateUrl(input: string): UrlValidationResult {
  let url: URL;

  try {
    url = new URL(input.trim());
  } catch {
    return { valid: false, error: "Please enter a valid URL." };
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { valid: false, error: "Only HTTP and HTTPS URLs are allowed." };
  }

  if (url.username || url.password) {
    return { valid: false, error: "URLs containing credentials are not allowed." };
  }

  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");

  if (
    !hostname ||
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local")
  ) {
    return { valid: false, error: "Local addresses cannot be scanned." };
  }

  //if the ip address is an IP literal, classify its address range
  if(ipaddr.isValid(hostname)){
    const address = ipaddr.parse(hostname);

    // IPv4-mapped IPv6 addresses must be checked as IPv4 too.

    const normalized = 
    address.kind() === "ipv6" && 
    (address as ipaddr.IPv6).isIPv4MappedAddress()
    ?  (address as ipaddr.IPv6).toIPv4Address()
    : address;

  if (normalized.range() !== "unicast") {
    return {
        valid: false,
        error: "Private or special-purpose IP addresses cannot be scanned."
    };
  }
  }
   return {
    valid: true,
    url
   };
}