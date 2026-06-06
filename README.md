<div align="center">

# 🚀 fastify-param-schema-validation

[![NPM Version](https://img.shields.io/npm/v/fastify-param-schema-validation.svg?style=flat-square)](https://www.npmjs.com/package/fastify-param-schema-validation)
[![Fastify Version](https://img.shields.io/badge/fastify-%5E5.0.0-black?style=flat-square)](https://www.fastify.io/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](https://opensource.org/licenses/ISC)

**A lightweight, zero-overhead Fastify plugin that strictly enforces parameter definitions in your route validation schemas.**

---

</div>

## 🤔 The Problem

When building APIs with Fastify, it is dangerously easy to define a URL parameter in your path (e.g., `/user/:id`) but forget to include it in your route's validation `schema`.

By default, Fastify will boot up just fine, but your application will silently lack validation for that parameter, potentially opening you up to bugs or security vulnerabilities.

## 💡 The Solution

`fastify-param-schema-validation` hooks into Fastify's boot sequence. If a route has a URL parameter that is **missing** from its validation schema, this plugin catches it instantly and crashes the server with a descriptive `FST_ERR_SCH_VALIDATION_BUILD` error.

**Fail fast in development, so you never deploy a broken schema to production.**

---

## 🎬 Demo

```text
Error: The route has a parameter 'missingId' that is not defined in the validation schema.
    code: 'FST_ERR_SCH_VALIDATION_BUILD',
    statusCode: 400
📦 Installation
Bash
npm install fastify-param-schema-validation
🚀 Usage
Register the plugin and pass the exposeParamSchemaValidation: true option. You can enable this globally for all routes, or locally per-route.

1. Global Enforcement (Recommended)
This will check every single route registered to your Fastify instance.

JavaScript
const fastify = require('fastify')({ logger: true })
const paramValidationPlugin = require('fastify-param-schema-validation')

// Register globally
fastify.register(paramValidationPlugin, {
  exposeParamSchemaValidation: true
})

// ❌ BAD: Server will crash on boot because ':id' is missing from schema.params
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

// ✅ GOOD: Server boots normally
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
If you only want to enforce strict parameter checks on specific routes, omit the option during registration and add it directly to the route options.

JavaScript
fastify.register(require('fastify-param-schema-validation'))

// This specific route is now protected
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
}, async (req, reply) => { /* ... */ })
⚡ Performance
This plugin was designed with Fastify's core philosophy in mind: Zero Overhead.

The validation logic runs entirely inside the synchronous onRoute hook. This means it only executes once during the initial server boot sequence. It does not run during HTTP requests, adding exactly 0ms of overhead to your API response times.

🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

Fork the project.

Create your feature branch (git checkout -b feat/AmazingFeature).

Commit your changes (git commit -m 'feat: Add some AmazingFeature').

Push to the branch (git push origin feat/AmazingFeature).

Open a Pull Request.

📝 License
This project is ISC licensed.