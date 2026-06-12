<div align="center">

  <img src="https://via.placeholder.com/120/000000/FFFFFF?text=F/P" alt="Fastify Param Schema Validation Logo" width="100" height="100" style="border-radius: 20px;" />

  # 🚀 fastify-param-schema-validation
  **Boot-time structural integrity for Fastify route parameters.**

  <br />

  ![NPM Version](https://img.shields.io/npm/v/fastify-param-schema-validation?style=for-the-badge&color=black)
  ![Fastify Ecosystem](https://img.shields.io/badge/Fastify-Plugin-202020?style=for-the-badge&logo=fastify)
  ![Overhead](https://img.shields.io/badge/Runtime_Overhead-0ms-success?style=for-the-badge)
  ![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)

  <br />

  <img src="https://via.placeholder.com/800x300/1E1E1E/FF5555?text=[+INSERT+TERMINAL+CRASH+GIF+HERE+]" alt="Failing Fast Demo" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />

</div>

---

> **TL;DR:** An ecosystem plugin that hooks into Fastify's boot sequence to guarantee your URL path parameters are perfectly mapped to your validation schemas. Fail fast in CI so unvalidated data never breaches your production endpoints.

---

## 🛑 The Engineering Constraint
When architecting high-performance REST APIs with Fastify, parameter drift is a common and dangerous vulnerability.

If a developer defines a URL parameter in the path (`/api/user/:id`) but neglects to map it inside the route's validation schema, Fastify will boot without warnings. This leaves the parameter entirely unvalidated at runtime, exposing the system to unexpected bugs, unhandled exceptions, and potential injection vectors.

```text
       Path definition ──>  /user/:id
                              │     [!] Missing validation mapping
                              ▼
       Schema definition ─> { params: { wrongName: { type: 'string' } } }

```

## 🛡️ The Solution: Boot-Time Enforcement

`fastify-param-schema-validation` eliminates this drift by analyzing your route structures during the initial server lifecycle.

If a route defines a URL parameter that is absent from its JSON schema, the plugin catches the discrepancy immediately and safely terminates the process using a standardized `FST_ERR_SCH_VALIDATION_BUILD` exception.

---

## 📦 Installation

Leverage your preferred package manager to integrate the plugin:

```bash
npm install fastify-param-schema-validation

```

*(Also available via `yarn add` or `pnpm install`)*

---

## ⚙️ Architecture & Implementation

You can enforce schema strictness globally across the entire application tree, or orchestrate it precisely on a per-route basis.

### 1. Global Enforcement (Recommended)

This approach mounts the validation hook natively into Fastify's core, scanning every registered route instance automatically.

```javascript
const fastify = require('fastify')({ logger: true })
const paramValidationPlugin = require('fastify-param-schema-validation')

// Anchor the plugin to the global context
fastify.register(paramValidationPlugin, {
  exposeParamSchemaValidation: true
})

// ❌ REJECTED: Triggers boot-time crash (':id' is missing from schema)
fastify.get('/user/:id', {
  schema: {
    params: {
      type: 'object',
      properties: {
        wrongName: { type: 'string' } // Drift detected
      }
    }
  }
}, async (request, reply) => {
  return { status: 'ok' }
})

// ✅ VERIFIED: Compiles seamlessly into the routing tree
fastify.get('/post/:postId', {
  schema: {
    params: {
      type: 'object',
      properties: {
        postId: { type: 'string' }
      }
    }
  }
}, async (request, reply) => {
  return { status: 'ok' }
})

fastify.listen({ port: 3000 })

```

### 2. Route-Level Execution

For legacy systems migrating to strict schemas, you can isolate enforcement to specific high-security endpoints without impacting the rest of the application.

```javascript
const fastify = require('fastify')()
fastify.register(require('fastify-param-schema-validation'))

// Validation is isolated to this specific execution context
fastify.get('/secure/:token', {
  exposeParamSchemaValidation: true,
  schema: {
    params: {
      type: 'object',
      properties: {
        token: { type: 'string' }
      }
    }
  }
}, async (request, reply) => {
  return { status: 'secure' }
})

```

---

## ⚡ Performance Profiling

This system was engineered to strictly honor Fastify's primary design principle: **Zero Runtime Overhead**.

| Execution Phase | Impact | Technical Context |
| --- | --- | --- |
| **Boot Lifecycle** | ~1-3ms | URL token compilation and matching engine executes entirely inside the synchronous `onRoute` hook. |
| **Runtime HTTP** | **0ms** | Once the server state switches to `listening`, the validation pathway is entirely bypassed. |

---

## 🤝 Contributing

Contributions, architectural improvements, and bug fixes are highly encouraged.

1. Fork the repository.
2. Spin up your custom feature branch (`git checkout -b feat/EnforcementUpgrade`).
3. Commit your atomic enhancements (`git commit -m 'feat: Optimize token regex parser'`).
4. Push to your branch (`git push origin feat/EnforcementUpgrade`).
5. Open a structured Pull Request.

---