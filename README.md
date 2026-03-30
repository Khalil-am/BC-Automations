# BC Automations

> **Business Consulting automation templates** — user manuals, test cases, notifications, dashboards, and more. Built by the Master Team.

Live site: [bc-automations.click](https://www.bc-automations.click)

---

## What Is This?

BC Automations is a collection of **AI-powered automation templates** for business consultants working with enterprise project management platforms (PPlus, SPlus, Diwan). Each template is a tested, ready-to-use prompt that turns hours of manual work into minutes of AI-driven output.

### Available Automations

| Category | Platforms | What It Does |
|---|---|---|
| **User Manuals** | PPlus, SPlus, Diwan | Generate complete user manuals from live systems or BRDs |
| **Test Cases** | PPlus, SPlus, Diwan | Generate UAT test case workbooks from configuration manuals |
| **Notification Templates** | PPlus, SPlus, Diwan | Extract and generate bilingual notification templates |
| **Dashboard Building** | PPlus | Replicate executive dashboards across instances using AI |
| **Group Permissions** | PPlus | Automate permission mapping from Excel matrices via API |
| **Migration Sheets** | SPlus | Generate migration workbooks from live system inspection |

---

## PPlus MCP Server

For PPlus-specific automations (dashboards, permissions, instance configs), we maintain a **Model Context Protocol (MCP) server** that gives Claude Code 8 specialized tools for instant access to PPlus knowledge.

### Related Repositories

| Repository | Description |
|---|---|
| [MasterteamSA/PPlus-Agent](https://github.com/MasterteamSA/PPlus-Agent) | PPlus Knowledge MCP Server — 8 tools for Claude Code |
| [MasterteamSA/pplus-knowledge](https://github.com/MasterteamSA/pplus-knowledge) | PPlus v4 Knowledge Base — 44+ structured knowledge chunks |

### Quick Setup

```bash
# 1. Clone and build the MCP server
git clone https://github.com/MasterteamSA/PPlus-Agent.git
cd PPlus-Agent && npm install && npm run build

# 2. Clone the knowledge base
git clone https://github.com/MasterteamSA/pplus-knowledge.git

# 3. Configure Claude Code (~/.mcp.json)
# 4. Restart Claude Code
```

For the complete step-by-step setup guide (including Node.js, Git, and Claude Code installation), see:
**[Getting Started: PPlus MCP Setup Guide](https://www.bc-automations.click/blog/getting-started-pplus-mcp)**

---

## Running the Website Locally

### Prerequisites

- Node.js 18+
- pnpm

### Development

```bash
# Clone the repository
git clone https://github.com/MasterteamSA/BC-Automations.git
cd BC-Automations

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The site will be available at `http://localhost:3000`.

### Production Build

```bash
pnpm build
pnpm start
```

---

## Adding Blog Posts

Create a new `.mdx` file in `blog/content/`:

```mdx
---
title: "Your Post Title"
description: "Brief description of the automation"
date: "2026-03-30"
tags: ["PPlus", "Dashboard", "MCP"]
author: "Khalil Abu Mushref"
pinned: false
---

Your content here...
```

### Frontmatter Fields

| Field | Required | Description |
|---|---|---|
| `title` | Yes | Post title |
| `description` | Yes | Short description shown on cards |
| `date` | Yes | Publication date (YYYY-MM-DD) |
| `tags` | No | Array of tags for filtering |
| `author` | No | Author name (must match `lib/authors.ts`) |
| `pinned` | No | Set to `true` to pin to top of homepage |
| `featured` | No | Mark as featured |
| `thumbnail` | No | Image URL for post card and OG image |
| `readTime` | No | Estimated read time (e.g., "8 min read") |

### Available Tags

**Platform tags:** `PPlus`, `SPlus`, `Diwan`

**Feature tags:** `Dashboard`, `MCP`, `Getting Started`, `User Manuals`, `Test Cases`, `Notifications`, `Group Permissions`, `Migration Sheet`

---

## Tech Stack

- **Next.js 15** — React framework with App Router
- **Fumadocs MDX** — MDX content management
- **Tailwind CSS v4** — Styling
- **TypeScript** — Type safety
- **Vercel** — Hosting and deployment

---

## License

Internal — (c) 2026 Master Team. All rights reserved.
