<div align="center">

# 🚀 fastify-param-schema-validation

### ✨ Enforce structural safety in your Fastify routes at boot time ✨

[![NPM Version](https://img.shields.io/npm/v/fastify-param-schema-validation.svg?style=flat-square&color=cb3837)](https://www.npmjs.com/package/fastify-param-schema-validation)
[![Fastify Version](https://img.shields.io/badge/fastify-%5E5.0.0-black?style=flat-square&logo=fastify)](https://www.fastify.io/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](https://opensource.org/licenses/ISC)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](#-contributing)

<p align="center">
  A ultra-lightweight, zero-overhead ecosystem plugin that ensures your URL parameters never drift away from your validation schemas.
</p>

---

[🤔 The Problem](#-the-problem) • [💡 The Solution](#-the-solution) • [🎬 Demo](#-demo) • [📦 Installation](#-installation) • [🚀 Usage](#-usage) • [⚡ Performance](#-performance)

---

</div>

## 🤔 The Problem

When building high-performance REST APIs with Fastify, it is dangerously easy to define a URL parameter in your path string (e.g., `/api/user/:id`) but accidentally forget to map it inside your route's validation `schema`.

```text
       Path definition ──>  /user/:id
                              │
               Missing validation schema mapping!
                              ▼
       Schema definition ─> { params: { wrongName: { type: 'string' } } }
By default, Fastify boots up without complaining, leaving that parameter completely unvalidated at runtime. This can lead to unexpected bugs, unhandled exceptions, or silent security vulnerabilities in production.

💡 The Solution
fastify-param-schema-validation hooks natively into Fastify's initial boot sequence. If a route defines a URL parameter that is missing from its accompanying validation structure, this plugin catches it immediately and crashes the server using a precise, standardized FST_ERR_SCH_VALIDATION_BUILD exception.

🎯 Fail fast during local development and CI pipelines so a broken schema never hits your production environment.

🎬 Demo
When a misconfigured schema is detected, your process terminates immediately with an explicit lifecycle error:

Code snippet
[1;31mError: The route has a parameter 'missingId' that is not defined in the validation schema.[0m
    code: 'FST_ERR_SCH_VALIDATION_BUILD',
    statusCode: 400
📦 Installation
Install the package via your preferred package manager:

Bash
npm install fastify-param-schema-validation
🚀 Usage
Register the plugin and activate it using the exposeParamSchemaValidation: true option. You can apply validation enforcement globally across all routes or selectively on single endpoints.

1. Global Enforcement (Recommended)
This strategy automatically scans every single route instance mounted onto your Fastify tree.

JavaScript
const fastify = require('fastify')({ logger: true })
const paramValidationPlugin = require('fastify-param-schema-validation')

// Register the plugin globally
fastify.register(paramValidationPlugin, {
  exposeParamSchemaValidation: true
})

// ❌ BAD: This will trigger a boot-time crash because ':id' is missing in schema properties
fastify.get('/user/:id', {
  schema: {
    params: {
      type: 'object',
      properties: {
        wrongName: { type: 'string' }
      }
    }
  }
}, async (request, reply) => {
  return { status: 'ok' }
})

// ✅ GOOD: This compiles perfectly
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
2. Route-Level Enforcement
If you need to opt specific routes into validation parsing while keeping others untouched, declare the option directly on individual route contexts.

JavaScript
const fastify = require('fastify')()
fastify.register(require('fastify-param-schema-validation'))

// This specific route will run enforcement checks
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
⚡ Performance
This plugin strictly honors Fastify's primary core principle: Zero Runtime Overhead.

Boot-only Execution: The URL token compilation and matching engine executes entirely inside the synchronous onRoute hook.

0ms Latency Impact: Once the server lifecycle switches to the listening state, the execution pathway is completely bypasses. It adds exactly 0ms of overhead to incoming runtime HTTP requests.

🤝 Contributing
Contributions, feature ideas, and issue tracking are highly encouraged!

Fork the project repository.

Spin up your custom feature branch (git checkout -b feat/AmazingFeature).

Commit your atomic enhancements (git commit -m 'feat: Add some AmazingFeature').

Push up to your fork branch (git push origin feat/AmazingFeature).

File a structured Pull Request.

📝 License
Distributed under the ISC License.