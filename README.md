# ShipCheck 🛳

**A lightweight website security checker that helps developers identify common security configuration issues before deployment.**

ShipCheck scans a website's HTTP response and checks for selected security configurations, including HTTPS and important security headers. It generates a report with findings, explanations, and suggested fixes.

## Overview

Before deploying a website, developers need a quick way to inspect whether some basic security configurations are in place.

ShipCheck makes these checks accessible through a simple interface. Enter a website URL, run a scan, and review the results.

 <img width="1536" height="1024" alt="Know Before You Ship" src="https://github.com/user-attachments/assets/625d504b-d88e-4727-b545-f819722d009d" />


## Features

- **URL validation:** Rejects unsupported protocols, embedded credentials, localhost addresses, and non-public IP destinations.
- **Website security checks:** Inspects selected security configurations from HTTP responses.
- **HTTPS detection:** Identifies whether the submitted URL uses HTTPS.
- **Security header checks:** Checks for HSTS, Content Security Policy, X-Content-Type-Options, and X-Frame-Options.
- **Actionable findings:** Displays pass/warning results, explanations, and suggested fixes.
- **Scan history:** Saves previous scan reports and allows users to revisit them.
- **History management:** Retrieve recent scans and delete individual reports.


## Tech Stack

| Technology | Purpose |
|---|---|
| TypeScript | Backend implementation |
| Node.js | Runtime environment |
| Express 5 | HTTP server and API routes |
| HTML, CSS, JavaScript | Frontend |
| ipaddr.js | IP address classification |
| Node.js HTTP/HTTPS modules | Controlled outbound requests |
| JSON file storage | Scan history persistence |

## How It Works

1. A user submits a website URL through the frontend.
2. The backend validates the URL and checks whether the destination is allowed.
3. ShipCheck resolves the hostname and verifies that its IP addresses are publicly routable.
4. A controlled HTTP/HTTPS request retrieves the website's response headers.
5. The scanner evaluates HTTPS usage and selected security headers.
6. The results are returned as a structured scan report.
7. The report is saved to local JSON-based history.

## API Routes

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Checks whether the server is running |
| POST | `/api/scan` | Validates a URL, runs a scan, and saves its report |
| GET | `/api/history` | Retrieves recent scan reports |
| DELETE | `/api/history/:id` | Deletes a saved scan report |

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/Omaima-Ameen/Ship-Check.git
cd Ship-Check/shipcheck
```

Install dependencies:

```bash
npm install
```

### Build

```bash
npm run build
```

### Start the server

```bash
npm start
```

The application runs at:

```text
http://localhost:3000
```

## Scan History Storage

Scan reports are stored in a local JSON file named `shipcheck-history.json`.

The application retains up to 100 reports. Persistence depends on the filesystem available to the running application, so deployments with ephemeral filesystems may not retain history across restarts.

## Project Scope and Limitations

ShipCheck focuses on selected website security configurations. It is not a complete security audit, penetration-testing tool, or vulnerability scanner.

A passing result does not guarantee that a website is secure. It only indicates that the specific checks performed by ShipCheck passed.




## Future Improvements

ShipCheck is an evolving project. Planned improvements include:

- **Stronger SSRF Protection:** Expand protection against advanced SSRF scenarios, including DNS rebinding, IPv4/IPv6 edge cases, and other attempts to reach restricted network destinations.
- **Custom Express Middleware:** Introduce reusable middleware for request validation, centralized error handling, and security-related request processing.
- **Rate Limiting:** Implement API rate limiting to prevent excessive scan requests and reduce potential abuse.
- **PostgreSQL Integration:** Replace local JSON-based scan history storage with PostgreSQL for more reliable and scalable persistence.
- **Automated Testing:** Expand test coverage for URL validation, SSRF protection, scanner behavior, and API endpoints.
- **Enhanced Reports:** Introduce more detailed scan reports and export functionality.
- **Additional Security Checks:** Expand the range of website security configurations evaluated by the scanner.

## Author

Built by **Omaima Ameen** as a developer tool project focused on practical web security checks.

[GitHub Repository](https://github.com/Omaima-Ameen/Ship-Check)
