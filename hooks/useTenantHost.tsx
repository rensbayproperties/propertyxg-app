"use client";

import { useEffect, useState } from "react";

export interface TenantHost {
  /** Full hostname including port, e.g. "yolo.lvh.me:3000" */
  host: string;
  /** Hostname without port, e.g. "yolo.lvh.me" */
  hostname: string;
  /** Detected tenant subdomain, e.g. "yolo". Empty for localhost / root domain / www. */
  subdomain: string;
  /** Root domain including port (copy-pasteable), e.g. "lvh.me:3000" */
  rootDomain: string;
  /** "http:" | "https:" */
  protocol: string;
  /** Have we read window.location yet? (false on first server-rendered paint) */
  ready: boolean;
}

const RESERVED_SUBDOMAINS = new Set(["www", "app"]);
const IPV4 = /^\d{1,3}(?:\.\d{1,3}){3}$/;

const detect = (): Omit<TenantHost, "ready"> => {
  if (typeof window === "undefined") {
    return {
      host: "",
      hostname: "",
      subdomain: "",
      rootDomain: "",
      protocol: "https:",
    };
  }

  const { host, hostname, protocol, port } = window.location;
  const parts = hostname.split(".");

  let subdomain = "";
  let rootHostname = hostname;

  const isLocalhost = hostname === "localhost";
  const isIp = IPV4.test(hostname);

  if (isLocalhost || isIp) {
    // No tenant on plain localhost / IP
    subdomain = "";
    rootHostname = hostname;
  } else if (parts.length >= 3 && !RESERVED_SUBDOMAINS.has(parts[0])) {
    // e.g. yolo.lvh.me  -> subdomain "yolo", root "lvh.me"
    // e.g. acme.crmdubai.com -> "acme" + "crmdubai.com"
    subdomain = parts[0];
    rootHostname = parts.slice(1).join(".");
  } else {
    // 2-label domain (lvh.me, example.com) or www.* -> no tenant
    subdomain = "";
    rootHostname = hostname.replace(/^www\./, "");
  }

  const rootDomain = port ? `${rootHostname}:${port}` : rootHostname;

  return { host, hostname, subdomain, rootDomain, protocol };
};

/**
 * Reads the active tenant from the browser URL.
 *
 * The backend already provisions per-subdomain routing, so the dashboard just
 * needs to surface the same value to the user. Use it anywhere we used to
 * fall back to a hardcoded "yourname.crmdubai.com".
 */
export const useTenantHost = (): TenantHost => {
  const [state, setState] = useState<TenantHost>(() => ({
    ...detect(),
    ready: false,
  }));

  useEffect(() => {
    setState({ ...detect(), ready: true });
  }, []);

  return state;
};
