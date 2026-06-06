'use strict'

const fp = require('fastify-plugin')

function plugin (fastify, options, next) {
  fastify.addHook('onRoute', function (routeOptions) {
    // Check if enabled via plugin options OR locally on the route itself
    const isFeatureEnabled = options.exposeParamSchemaValidation === true ||
                             routeOptions.exposeParamSchemaValidation === true

    if (isFeatureEnabled && routeOptions.schema && routeOptions.schema.params && routeOptions.schema.params.properties) {
      const pathParams = []
      const routeUrl = routeOptions.url || routeOptions.path || ''
      const segments = routeUrl.split('/')

      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i]
        if (segment.charCodeAt(0) === 58 && segment.length > 1) {
          const parenIdx = segment.indexOf('(')
          const paramName = parenIdx !== -1 ? segment.slice(1, parenIdx) : segment.slice(1)
          pathParams.push(paramName)
        }
      }

      const schemaParams = Object.keys(routeOptions.schema.params.properties)

      for (const pathParam of pathParams) {
        if (!schemaParams.includes(pathParam)) {
          const error = new Error(`The route has a parameter '${pathParam}' that is not defined in the validation schema.`)
          error.code = 'FST_ERR_SCH_VALIDATION_BUILD'
          error.statusCode = 400
          throw error
        }
      }
    }
  })

  next()
}

module.exports = fp(plugin, {
  fastify: '5.x',
  name: 'fastify-param-schema-validation'
})