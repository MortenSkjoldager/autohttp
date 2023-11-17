function generateObjectFromRef(components, ref) {
    const schema = getSchemaByRef(components, ref);
    if (schema) {
      return generateObjectFromSchema(components, schema);
    } else {
      console.error(`Schema with ref "${ref}" not found.`);
      return null;
    }
  }
  
  function getSchemaByRef(components, ref) {
    const lastEntry = ref.split('/').pop();
    return components.schemas[lastEntry];
  }
  
  function generateObjectFromSchema(components, schema) {
    if (schema.type === 'object') {
      const result = {};
      if (schema.properties) {
        for (const [prop, propSchema] of Object.entries(schema.properties)) {
          result[prop] = generateObjectFromSchema(components, propSchema);
        }
      }
      return result;
    } else if (schema.$ref != null) {
        var foundSchema = getSchemaByRef(components, schema.$ref);
        return generateObjectFromSchema(components, foundSchema);
    } else if (schema.type === 'array') {
      return [generateObjectFromSchema(components, schema.items)];
    } else if (schema.enum) {
      return schema.enum[0];
    } else if (schema.format === 'date-time') {
      // Here you may want to use a library like faker to generate a realistic date-time value.
      return new Date().toISOString();
    } else if (schema.type === 'string') {
      return 'Sample String';
    } else if (schema.type === 'integer') {
      return 42; // Adjust the integer value as needed
    } else if (schema.type === 'boolean') {
      return true;
    } else {
      return null;
    }
  }

function verbAcceptsJsonInput(obj) {
    if (
        obj &&
        obj.requestBody &&
        obj.requestBody.content &&
        obj.requestBody.content["application/json"] &&
        obj.requestBody.content["application/json"].schema &&
        obj.requestBody.content["application/json"].schema.$ref
    ) {
        return obj.requestBody.content["application/json"].schema.$ref;
    } else {
    return null;
    }
}

module.exports = { generateObjectFromRef, verbAcceptsJsonInput }