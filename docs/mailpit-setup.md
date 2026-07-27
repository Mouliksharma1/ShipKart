# Local Email Development Setup with Mailpit for ShipKart

This guide documents how to set up **Mailpit**, a zero-cost local SMTP server and web testing interface, for ShipKart notification development.

---

## 1. What is Mailpit?

**Mailpit** is an open-source, ultra-fast, standalone local SMTP email server and web interface. It acts as an email catch-all server during development so that no real emails are delivered to recipients while allowing developers to inspect full HTML/Text email contents, headers, and attachments in real time.

---

## 2. Why is Mailpit used in ShipKart?

- **100% Free & Offline**: Requires no paid subscriptions, API keys, or external internet connections.
- **Zero Configuration**: Supports unauthenticated SMTP out of the box on port `1025`.
- **Developer Safety**: Prevents test emails from accidentally leaking to real customers during local development.
- **Real-Time Web UI**: View sent emails instantly at `http://localhost:8025`.

---

## 3. Installation Methods

### Option A: Docker (Recommended)

Run Mailpit as a background container:

```bash
docker run -d \
  --name mailpit \
  -p 1025:1025 \
  -p 8025:8025 \
  axllent/mailpit
```

---

### Option B: Windows (Standalone Binary or Scoop/Chocolatey)

#### Using Scoop:
```powershell
scoop bucket add extras
scoop install mailpit
mailpit
```

#### Using Direct Binary:
1. Download `mailpit-windows-amd64.zip` from the [Mailpit GitHub Releases](https://github.com/axllent/mailpit/releases).
2. Extract `mailpit.exe` into a folder (e.g. `C:\Tools\mailpit`).
3. Run `mailpit.exe` from PowerShell or Command Prompt.

---

### Option C: macOS (Homebrew)

```bash
brew install mailpit
brew services start mailpit
```

Or run directly in terminal:
```bash
mailpit
```

---

### Option D: Linux (Bash Script / Direct Download)

```bash
sudo bash -c "$(curl -sL https://raw.githubusercontent.com/axllent/mailpit/develop/install.sh)"
mailpit
```

---

## 4. Connection Specifications

- **SMTP Host**: `localhost` (or `127.0.0.1`)
- **SMTP Port**: `1025`
- **Authentication**: None required (leave username and password blank)
- **Security**: Plain TCP / Non-SSL (`secure: false`)
- **Web UI URL**: [http://localhost:8025](http://localhost:8025)

---

## 5. Verifying Mailpit is Running

1. Open your web browser and navigate to `http://localhost:8025`.
2. You should see the Mailpit inbox interface.
3. Test TCP connection on port `1025` via PowerShell:
   ```powershell
   Test-NetConnection -ComputerName localhost -Port 1025
   ```

---

## 6. Common Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **Port 1025 / 8025 already in use** | Another service (e.g., MailHog) is bound to port 1025. | Stop the conflicting process or change `SMTP_PORT` in `.env`. |
| **`DEGRADED` status in Admin Dashboard** | Mailpit process or Docker container is not running. | Start Mailpit using `docker start mailpit` or `mailpit.exe`. |
| **Emails not appearing in Inbox** | `NOTIFICATION_MODE` is not set or `EMAIL_PROVIDER` is set incorrectly. | Ensure `NOTIFICATION_MODE=mock` and `EMAIL_PROVIDER=smtp` in `.env`. |
