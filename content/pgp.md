---
title: "PGP Key"
date: 2026-08-29
layout: "single"
---

*For encrypted email or to verify anything signed by me.*

---

## Key

- **UID** — `Dinesh <dinesh@mrdee.in>`
- **Fingerprint** — `74D1 401C F5F3 686B 1C0E  9BA3 FFF5 0738 4D08 768B`
- **Type** — ed25519 (sign/certify) + cv25519 (encrypt), expires 2028-08-28
- **Download** — [dinesh-mrdee-in.asc](/pgp/dinesh-mrdee-in.asc)

Verify the fingerprint against this page over TLS before trusting the key — that's most of the point of publishing it here.

## Import

```
curl -s https://mrdee.in/pgp/dinesh-mrdee-in.asc | gpg --import
```

Or fetch it from a keyserver once uploaded:

```
gpg --keyserver hkps://keys.openpgp.org --recv-keys 74D1401CF5F3686B1C0E9BA3FFF507384D08768B
```

## Verify

```
gpg --fingerprint dinesh@mrdee.in
```

Confirm the output matches the fingerprint above.
