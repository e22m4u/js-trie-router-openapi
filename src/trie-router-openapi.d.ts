import {Ajv2020} from 'ajv/dist/2020.js';
import {Service, ServiceContainer} from '@e22m4u/js-service';
import {OADocumentInput, OAOperationObject} from '@e22m4u/js-openapi';

/**
 * Расширение интерфейса RouteMeta.
 */
declare module '@e22m4u/js-trie-router' {
  export interface RouteMeta {
    openApi?: OAOperationObject | boolean;
  }
}

/**
 * Trie Router OpenApi options.
 */
export type TrieRouterOpenApiOption = {
  document?: OADocumentInput;
  validateRequest?: boolean;
  validateResponse?: boolean;
  parseRequestParameterContent?: boolean;
  coerceRequestParameterDataType?: boolean;
  coerceRequestBodyDataType?: boolean;
  coerceResponseBodyDataType?: boolean;
  removeAdditionalRequestData?: boolean;
  removeAdditionalResponseData?: boolean;
  useDefaultValuesInRequestParameters?: boolean;
  useDefaultValuesInRequestBody?: boolean;
  useDefaultValuesInResponseBody?: boolean;
};

/**
 * Trie router OpenAPI.
 */
export class TrieRouterOpenApi extends Service {
  /**
   * Constructor.
   *
   * @param container
   * @param options
   */
  constructor(container: ServiceContainer, options?: TrieRouterOpenApiOption);

  /**
   * Get options.
   */
  getOptions(): TrieRouterOpenApiOption;

  /**
   * Get compiled Ajv validator.
   *
   * @param key
   * @param validator
   */
  setCompiledAjvValidator(key: string, validator: Function): this;

  /**
   * Has compiled Ajv validator.
   *
   * @param key
   */
  hasCompiledAjvValidator(key: string): boolean;

  /**
   * Get compiled Ajv validator.
   *
   * @param key
   */
  getCompiledAjvValidator(key: string): Function;

  /**
   * Get parameters Ajv instance.
   */
  getParametersAjvInstance(): Ajv2020;

  /**
   * Get request body Ajv instance.
   */
  getRequestBodyAjvInstance(): Ajv2020;

  /**
   * Get response body Ajv instance.
   */
  getResponseBodyAjvInstance(): Ajv2020;
}
