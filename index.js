const fp = require('fastify-plugin');

function paramSchemaValidationPlugin(fastify, options, next) {
  // Check if the plugin should be active based on options
  const isEnabled = options.exposeParamSchemaValidation !== false;

  if (isEnabled) {
    fastify.addHook('onRoute', (routeOptions) => {

      const urlParams = routeOptions.url.match(/:[a-zA-Z0-9_]+/g) || [];
      const cleanUrlParams = urlParams.map(p => p.replace(':', ''));

      if (cleanUrlParams.length === 0) return;

      if (!routeOptions.schema || !routeOptions.schema.params || !routeOptions.schema.params.properties) {
        throw new Error(
          `FST_ERR_SCH_VALIDATION_BUILD: The route '${routeOptions.url}' defines parameters ${JSON.stringify(cleanUrlParams)} but is completely missing a validation schema matching them.`
        );
      }

      // 3. Extract the defined keys from the schema properties
      const schemaParams = Object.keys(routeOptions.schema.params.properties);

      // 4. Verify each URL parameter exists in the schema properties
      for (const param of cleanUrlParams) {
        if (!schemaParams.includes(param)) {
          throw new Error(
            `FST_ERR_SCH_VALIDATION_BUILD: The route '${routeOptions.url}' has a parameter '${param}' that is not defined in the validation schema.`
          );
        }
      }
    });
  }

  next();
}

module.exports = fp(paramSchemaValidationPlugin, {
  fastify: '5.x',
  name: 'fastify-param-schema-validation'
});