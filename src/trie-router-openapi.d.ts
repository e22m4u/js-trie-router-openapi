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
}
