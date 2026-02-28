import addFormats from 'ajv-formats';
import Ajv2020 from 'ajv/dist/2020.js';

/**
 * Create AJV instance.
 * 
 * @param {import('ajv/dist/2020.js').InstanceOptions} options 
 * @returns {import('ajv/dist/2020.js').Ajv2020}
 */
export function createAjv(options = {}) {
  const ajv = new Ajv2020({
    strictTypes: false,
    validateFormats: true,
    allowUnionTypes: true,
    allowMatchingProperties: true,
    ...options,
  });
  addFormats(ajv);
  ajv.addKeyword('discriminator');
  ajv.addKeyword('example');
  ajv.addKeyword('externalDocs');
  ajv.addKeyword('xml');
  ajv.addKeyword('components');
  return ajv;
}
