# Ship-Check 

A lightweight website security checker that helps developers identify common security configuration issues before deployment.

## What it does

ShipCheck scans a website URL and generates a report containing security findings and suggested fixes.

### Features

- **Website scanning:** Checks common security configurations.
- **HTTPS checks:** Checks HTTPS usage and HTTP Strict Transport Security (HSTS).
- **Security headers:** Checks Content Security Policy (CSP), `X-Content-Type-Options`, and `X-Frame-Options`.
- **Scan reports:** Displays the scan status, HTTP status code, timestamp, and findings.
- **Scan history:** Saves previous scan reports so they can be revisited.
- **Delete history:** Allows saved scan reports to be deleted.
- **URL validation:** Restricts unsafe targets, including localhost addresses, non-standard ports, URL credentials, and hostnames resolving to non-public IP addresses.
- **Request safeguards:** Limits response size and request duration.

## Tech Stack

- TypeScript
- Node.js
- Express
- HTML, CSS, and JavaScript
- `ipaddr.js` for IP address validation
- JSON file-based storage for scan history

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/Omaima-Ameen/Ship-Check.git
cd Ship-Check
```

Install dependencies:

```bash
npm install
```

### Build

Compile the TypeScript source:

```bash
npm run build
```

### Run

Start the server:

```bash
npm start
```

The server uses the configured `PORT` environment variable, with a default port if one is configured in the application.

Open the local server URL in your browser.

## API Routes

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| `/api/scan` | Scan API | Handles website scans |
| `/api/history` | History API | Retrieves saved scan history |
| DELETE | `/api/history/:id` | Deletes a saved scan |

## Scan History Storage

Scan history is stored in a local JSON file named `shipcheck-history.json`. It is not currently a hosted database, and persistence depends on the hosting environment's filesystem.

## Current Scope

ShipCheck checks selected website security configurations. It is not a complete security audit, vulnerability scanner, or guarantee that a website is secure.

## Project

- **Repository:** https://github.com/Omaima-Ameen/Ship-Check

Built as a developer tool project focused on practical website security checks.
