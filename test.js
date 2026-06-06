'use strict'

const { test } = require('node:test')
const assert = require('node:assert')
const Fastify = require('fastify')
const plugin = require('./index')

test('fastify-param-schema-validation', async t => {

  await t.test('passes if all route params are defined in schema', async () => {
    const fastify = Fastify()
    // Pass the option directly to the plugin here:
    await fastify.register(plugin, { exposeParamSchemaValidation: true })

    fastify.get('/valid/:id', {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          }
        }
      }
    }, (req, reply) => {
      reply.send('ok')
    })

    await fastify.ready()
    assert.ok(true)
    await fastify.close()
  })

  await t.test('throws if schema is missing route parameter', async () => {
    const fastify = Fastify()
    await fastify.register(plugin, { exposeParamSchemaValidation: true })

    assert.throws(
      () => {
        fastify.get('/broken/:missingId', {
          schema: {
            params: {
              type: 'object',
              properties: {
                wrongName: { type: 'string' }
              }
            }
          }
        }, (req, reply) => {
          reply.send('ok')
        })
      },
      (err) => {
        return err.code === 'FST_ERR_SCH_VALIDATION_BUILD'
      }
    )

    await fastify.close()
  })

  await t.test('supports path parameters with regex parentheses', async () => {
    const fastify = Fastify()
    await fastify.register(plugin, { exposeParamSchemaValidation: true })

    fastify.get('/regex/:id(\\d+)', {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          }
        }
      }
    }, (req, reply) => {
      reply.send('ok')
    })

    await fastify.ready()
    assert.ok(true)
    await fastify.close()
  })
})