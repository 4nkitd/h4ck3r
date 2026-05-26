# Security Policy

## Intended use

`h4ck3r` is an educational toolkit aimed at developers, security researchers, and authorized penetration testers. The bundled payload libraries (SQLi, XSS, LFI, reverse shells) are provided for use against systems you own or have explicit, written permission to test.

**Unauthorized use against third-party systems is illegal in most jurisdictions and not endorsed by this project.**

## Supported versions

| Version | Supported |
| --- | --- |
| 0.2.x   | yes |
| < 0.2.0 | no  |

Only the latest minor version receives security fixes.

## Reporting a vulnerability

If you discover a security vulnerability **in the extension itself** (not in the payloads it ships), please do not open a public issue.

Instead, report it privately:

- Open a [private security advisory](https://github.com/4nkitd/h4ck3r/security/advisories/new) on GitHub, **or**
- Email the maintainer: see the email associated with the latest commit (`git log -1 --format='%ae'`)

Please include:

1. A description of the issue and its impact
2. Steps to reproduce
3. Affected version(s)
4. Any suggested fix or mitigation

You can expect:

- Acknowledgement within 7 days
- A status update within 14 days
- Coordinated disclosure once a fix ships in the next release

## Scope

In scope:

- The extension's own code (background service worker, content scripts, side panel UI, options page)
- The build pipeline and published store artifacts
- Insecure permissions or unsafe handling of user data

Out of scope:

- Payload effectiveness against third-party targets
- Issues caused by user misuse of the toolkit
- Issues in upstream dependencies (please report those upstream and reference here)

## Responsible disclosure

We follow a 90-day disclosure timeline by default. We will work with reporters who need a longer window when warranted (e.g., coordinated upstream fixes).
