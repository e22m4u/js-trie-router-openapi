import HttpErrors from 'http-errors';
import {createAjv} from './create-ajv.js';
import {Service} from '@e22m4u/js-service';
import {format, InvalidArgumentError} from '@e22m4u/js-format';
import {createError, trieRouterPathToOpenApiPath} from './utils/index.js';
import {tryToParseDataWithMediaType} from './try-to-parse-data-with-media-type.js';

import {
  TrieRouter,
  HttpMethod,
  RouterHookType,
  parseContentType,
  hasRequestBody,
} from '@e22m4u/js-trie-router';

import {
  OADataType,
  OAMediaType,
  OADocumentBuilder,
  escapeJsonPointer,
  OAParameterLocation,
  resolveOAReferenceObject,
} from '@e22m4u/js-openapi';

/**
 * Parameter location to request context property map.
 */
const OA_PARAMETER_LOCATION_TO_REQUEST_CONTEXT_PROPERTY_MAP = {
  [OAParameterLocation.QUERY]: 'query',
  [OAParameterLocation.PATH]: 'params',
  [OAParameterLocation.HEADER]: 'headers',
  [OAParameterLocation.COOKIE]: 'cookies',
};

/**
 * Parameter location to pointer segment map.
 */
const OA_PARAMETER_LOCATION_TO_URI_SEGMENT_MAP = {
  [OAParameterLocation.QUERY]: 'query',
  [OAParameterLocation.PATH]: 'path',
  [OAParameterLocation.HEADER]: 'headers',
  [OAParameterLocation.COOKIE]: 'cookies',
};

/**
 * Not validable media types.
 */
const NOT_VALIDABLE_MEDIA_TYPES = [
  OAMediaType.APPLICATION_OCTET_STREAM,
  OAMediaType.MULTIPART_FORM_DATA,
];

/**
 * Trie router OpenAPI.
 */
export class TrieRouterOpenApi extends Service {
  /**
   * Options.
   */
  _options = {};

  /**
   * Validators.
   */
  _validators = new Map();

  /**
   * Parameters ajv.
   */
  _parametersAjv;

  /**
   * Request body ajv.
   */
  _requestBodyAjv;

  /**
   * Response body ajv.
   */
  _responseBodyAjv;

  /**
   * Constructor.
   *
   * @param {import('@e22m4u/js-service').ServiceContainer} [container]
   * @param {import('./trie-router-openapi.js').TrieRouterOpenApiOptions} [options]
   */
  constructor(container, options = {}) {
    super(container);
    // options
    if (!options || typeof options !== 'object' || Array.isArray(options)) {
      throw new InvalidArgumentError(
        'Parameter "options" must be an Object, but %v was given.',
        options,
      );
    }
    // options.document
    if (options.document !== undefined) {
      if (
        !options.document ||
        typeof options.document !== 'object' ||
        Array.isArray(options.document)
      ) {
        throw new InvalidArgumentError(
          'Option "document" must be an Object, but %v was given.',
          options.document,
        );
      }
    }
    // options.validateRequest
    if (options.validateRequest !== undefined) {
      if (typeof options.validateRequest !== 'boolean') {
        throw new InvalidArgumentError(
          'Option "validateRequest" must be a Boolean, but %v was given.',
          options.validateRequest,
        );
      }
    }
    // options.validateResponse
    if (options.validateResponse !== undefined) {
      if (typeof options.validateResponse !== 'boolean') {
        throw new InvalidArgumentError(
          'Option "validateResponse" must be a Boolean, but %v was given.',
          options.validateResponse,
        );
      }
    }
    // options.parseRequestParameterContent
    if (options.parseRequestParameterContent !== undefined) {
      if (typeof options.parseRequestParameterContent !== 'boolean') {
        throw new InvalidArgumentError(
          'Option "parseRequestParameterContent" must be a Boolean, ' +
            'but %v was given.',
          options.parseRequestParameterContent,
        );
      }
    }
    // options.coerceRequestParameterDataType
    if (options.coerceRequestParameterDataType !== undefined) {
      if (typeof options.coerceRequestParameterDataType !== 'boolean') {
        throw new InvalidArgumentError(
          'Option "coerceRequestParameterDataType" must be a Boolean, ' +
            'but %v was given.',
          options.coerceRequestParameterDataType,
        );
      }
    }
    // options.coerceRequestBodyDataType
    if (options.coerceRequestBodyDataType !== undefined) {
      if (typeof options.coerceRequestBodyDataType !== 'boolean') {
        throw new InvalidArgumentError(
          'Option "coerceRequestBodyDataType" must be a Boolean, ' +
            'but %v was given.',
          options.coerceRequestBodyDataType,
        );
      }
    }
    // options.coerceResponseBodyDataType
    if (options.coerceResponseBodyDataType !== undefined) {
      if (typeof options.coerceResponseBodyDataType !== 'boolean') {
        throw new InvalidArgumentError(
          'Option "coerceResponseBodyDataType" must be a Boolean, ' +
            'but %v was given.',
          options.coerceResponseBodyDataType,
        );
      }
    }
    // options.removeAdditionalRequestData
    if (options.removeAdditionalRequestData !== undefined) {
      if (typeof options.removeAdditionalRequestData !== 'boolean') {
        throw new InvalidArgumentError(
          'Option "removeAdditionalRequestData" must be a Boolean, ' +
            'but %v was given.',
          options.removeAdditionalRequestData,
        );
      }
    }
    // options.removeAdditionalResponseData
    if (options.removeAdditionalResponseData !== undefined) {
      if (typeof options.removeAdditionalResponseData !== 'boolean') {
        throw new InvalidArgumentError(
          'Option "removeAdditionalResponseData" must be a Boolean, ' +
            'but %v was given.',
          options.removeAdditionalResponseData,
        );
      }
    }
    // options.useDefaultValuesInRequestParameters
    if (options.useDefaultValuesInRequestParameters !== undefined) {
      if (typeof options.useDefaultValuesInRequestParameters !== 'boolean') {
        throw new InvalidArgumentError(
          'Option "useDefaultValuesInRequestParameters" must be a Boolean, ' +
            'but %v was given.',
          options.useDefaultValuesInRequestParameters,
        );
      }
    }
    // options.useDefaultValuesInRequestBody
    if (options.useDefaultValuesInRequestBody !== undefined) {
      if (typeof options.useDefaultValuesInRequestBody !== 'boolean') {
        throw new InvalidArgumentError(
          'Option "useDefaultValuesInRequestBody" must be a Boolean, ' +
            'but %v was given.',
          options.useDefaultValuesInRequestBody,
        );
      }
    }
    // options.useDefaultValuesInResponseBody
    if (options.useDefaultValuesInResponseBody !== undefined) {
      if (typeof options.useDefaultValuesInResponseBody !== 'boolean') {
        throw new InvalidArgumentError(
          'Option "useDefaultValuesInResponseBody" must be a Boolean, ' +
            'but %v was given.',
          options.useDefaultValuesInResponseBody,
        );
      }
    }
    this._options = options;
    // если параметр "document" определен, но сборщик уже
    // зарегистрирован, то выбрасывается ошибка, так как
    // сборщик может содержать другой документ
    const isBuilderRegistered = this.hasService(OADocumentBuilder);
    if (options.document && isBuilderRegistered) {
      throw new InvalidArgumentError(
        'Service OADocumentBuilder must not be registered ' +
          'when the option "document" is provided.',
      );
    }
    // если сборщик не зарегистрирован в сервис-контейнере,
    // то выполняется его регистрация, чтобы избежать создания
    // сборщика при каждом запросе
    else if (!isBuilderRegistered) {
      this.useService(OADocumentBuilder, options.document);
    }
    const router = this.getService(TrieRouter);
    // в момент определения маршрута регистрируется
    // операция в сборщике OpenAPI документа
    if (
      !router.hasHook(RouterHookType.ON_DEFINE_ROUTE, onDefineRouteOpenApiHook)
    ) {
      router.addHook(RouterHookType.ON_DEFINE_ROUTE, onDefineRouteOpenApiHook);
    }
    // если требуется проверка данных входящего запроса,
    // то выполняется регистрация "preHandler" хука
    if (
      options.validateRequest &&
      !router.hasHook(RouterHookType.PRE_HANDLER, requestValidationOpenApiHook)
    ) {
      router.addHook(RouterHookType.PRE_HANDLER, requestValidationOpenApiHook);
    }
    // если требуется проверка данных ответа сервера,
    // то выполняется регистрация "postHandler" хука
    if (
      options.validateResponse &&
      !router.hasHook(
        RouterHookType.POST_HANDLER,
        responseValidationOpenApiHook,
      )
    ) {
      router.addHook(
        RouterHookType.POST_HANDLER,
        responseValidationOpenApiHook,
      );
    }
  }

  /**
   * Get options.
   *
   * @returns {import('./trie-router-openapi.js').TrieRouterOpenApiOption}
   */
  getOptions() {
    return this._options;
  }

  /**
   * Get compiled Ajv validator.
   *
   * @param {string} key
   * @param {Function} validator
   * @returns {this}
   */
  setCompiledAjvValidator(key, validator) {
    if (!key || typeof key !== 'string') {
      throw new InvalidArgumentError(
        'Parameter "key" must be a non-empty String, but %v was given.',
        key,
      );
    }
    if (typeof validator !== 'function') {
      throw new InvalidArgumentError(
        'Parameter "validator" must be a Function, but %v was given.',
        validator,
      );
    }
    this._validators.set(key, validator);
    return this;
  }

  /**
   * Has compiled Ajv validator.
   *
   * @param {string} key
   * @returns {boolean}
   */
  hasCompiledAjvValidator(key) {
    if (!key || typeof key !== 'string') {
      throw new InvalidArgumentError(
        'Parameter "key" must be a non-empty String, but %v was given.',
        key,
      );
    }
    const validator = this._validators.get(key);
    return Boolean(validator);
  }

  /**
   * Get compiled Ajv validator.
   *
   * @param {string} key
   * @returns {Function}
   */
  getCompiledAjvValidator(key) {
    if (!key || typeof key !== 'string') {
      throw new InvalidArgumentError(
        'Parameter "key" must be a non-empty String, but %v was given.',
        key,
      );
    }
    const validator = this._validators.get(key);
    if (!validator) {
      throw new InvalidArgumentError('Ajv validator %v does not exist.', key);
    }
    return validator;
  }

  /**
   * Get parameters Ajv instance.
   *
   * @returns {Function}
   */
  getParametersAjvInstance() {
    if (this._parametersAjv) {
      return this._parametersAjv;
    }
    this._parametersAjv = createAjv({
      coerceTypes: this._options.coerceRequestParameterDataType,
      removeAdditional: this._options.removeAdditionalRequestData,
      useDefaults: this._options.useDefaultValuesInRequestParameters,
    });
    return this._parametersAjv;
  }

  /**
   * Get request body Ajv instance.
   *
   * @returns {Function}
   */
  getRequestBodyAjvInstance() {
    if (this._requestBodyAjv) {
      return this._requestBodyAjv;
    }
    this._requestBodyAjv = createAjv({
      coerceTypes: this._options.coerceRequestBodyDataType,
      removeAdditional: this._options.removeAdditionalRequestData,
      useDefaults: this._options.useDefaultValuesInRequestBody,
    });
    return this._requestBodyAjv;
  }

  /**
   * Get response body Ajv instance.
   *
   * @returns {Function}
   */
  getResponseBodyAjvInstance() {
    if (this._responseBodyAjv) {
      return this._responseBodyAjv;
    }
    this._responseBodyAjv = createAjv({
      coerceTypes: this._options.coerceResponseBodyDataType,
      removeAdditional: this._options.removeAdditionalResponseData,
      useDefaults: this._options.useDefaultValuesInResponseBody,
    });
    return this._responseBodyAjv;
  }
}

/**
 * On define route.
 *
 * @param {import('@e22m4u/js-trie-router').RouteDefinition} routeDef
 * @param {import('@e22m4u/js-service').ServiceContainer} container
 */
export function onDefineRouteOpenApiHook(routeDef, container) {
  if (
    !routeDef ||
    typeof routeDef !== 'object' ||
    !routeDef.meta ||
    typeof routeDef.meta !== 'object' ||
    routeDef.meta.openApi === undefined ||
    routeDef.meta.openApi === false
  ) {
    return;
  }
  const inst = container.get(TrieRouterOpenApi);
  const builder = container.get(OADocumentBuilder);
  const options = inst.getOptions();
  // замена формата пути TrieRouter на OpenAPI
  // пример: "/users/:id" => "/users/{id}"
  const oaOperationPath = trieRouterPathToOpenApiPath(routeDef.path);
  // TrieRouter использует верхний регистр в названии методов,
  // но сборщик OpenAPI ожидает методы в нижнем регистре
  // пример: "POST" => "post"
  const oaOperationMethod = routeDef.method.toLowerCase();
  // если метаданные определены, и являются логическим
  // значением true, то операция добавляется в документ
  if (routeDef.meta.openApi === true) {
    builder.defineOperation({
      path: oaOperationPath,
      method: oaOperationMethod,
    });
  }
  // если метаданные являются определением операции,
  // то данный объект добавляется в документ
  else if (
    routeDef.meta.openApi &&
    typeof routeDef.meta.openApi === 'object' &&
    !Array.isArray(routeDef.meta.openApi)
  ) {
    builder.defineOperation({
      path: oaOperationPath,
      method: oaOperationMethod,
      operation: routeDef.meta.openApi,
    });
    const oaDocumentObject = builder.getDocumentObjectRef();
    // если требуется проверять данные запроса,
    // то компилируются валидаторы согласно
    // определению операции
    if (options.validateRequest === true) {
      // parameters
      if (routeDef.meta.openApi.parameters !== undefined) {
        const oaParameters = routeDef.meta.openApi.parameters;
        // так как определение операции проверяется сборщиком,
        // проверка ключевого слова "parameters" пропускается
        // const oaParametersUri = '/meta/openApi/parameters';
        // if (!Array.isArray(oaParameters)) {
        //   throw new InvalidArgumentError(
        //     'OpenAPI keyword "parameters" at %v must be an Array, ' +
        //       'but %v was given.',
        //     '/meta/openApi',
        //     oaParameters,
        //   );
        // }
        // создание нового или извлечение существующего
        // экземпляра Ajv для компиляции валидаторов
        // параметров запроса
        const ajv = inst.getParametersAjvInstance();
        // parameters[i]
        for (let index = 0, l = oaParameters.length; index < l; index++) {
          let oaParameterObject = oaParameters[index];
          // так как определение операции проверяется сборщиком,
          // проверка объекта параметра пропускается
          // let oaParameterObjectUri = `${oaParametersUri}/${index}`;
          // if (
          //   !oaParameterObject ||
          //   typeof oaParameterObject !== 'object' ||
          //   Array.isArray(oaParameterObject)
          // ) {
          //   throw new InvalidArgumentError(
          //     'Parameter Object at %v must be an Object, but %v was given.',
          //     oaParameterObjectUri,
          //     oaParameterObject,
          //   );
          // }
          // parameters[i].$ref
          if (oaParameterObject.$ref !== undefined) {
            // следующая строка закомментирована, так как проверка
            // объекта параметра и объекта содержания пропускается
            // oaParameterObjectUri = oaParameterObject.$ref;
            oaParameterObject = resolveOAReferenceObject(oaParameterObject, {
              rootDocument: oaDocumentObject,
            });
          }
          // parameters[i].schema
          if (oaParameterObject.schema !== undefined) {
            // "/get/~1path/parameters/0"
            const validatorKey = [
              '/' + oaOperationMethod,
              '/' + escapeJsonPointer(oaOperationPath),
              '/parameters',
              '/' + index,
            ].join('');
            const validator = ajv.compile({
              type: OADataType.OBJECT,
              properties: {value: oaParameterObject.schema},
              components: oaDocumentObject.components,
            });
            inst.setCompiledAjvValidator(validatorKey, validator);
            // если методом маршрута является GET,
            // то добавляется дополнительный ключ
            // для метода HEAD с тем же валидатором
            if (routeDef.method === HttpMethod.GET) {
              // "/head/~1path/parameters/0"
              const validatorKeyForHeadMethod = [
                '/head',
                '/' + escapeJsonPointer(oaOperationPath),
                '/parameters',
                '/' + index,
              ].join('');
              inst.setCompiledAjvValidator(
                validatorKeyForHeadMethod,
                validator,
              );
            }
          }
          // parameters[i].content
          if (oaParameterObject.content !== undefined) {
            const oaContentObject = oaParameterObject.content;
            // так как определение операции проверяется сборщиком,
            // проверка объекта содержания пропускается
            // const oaContentObjectUri = `${oaParameterObjectUri}/content`;
            // if (
            //   !oaContentObject ||
            //   typeof oaContentObject !== 'object' ||
            //   Array.isArray(oaContentObject)
            // ) {
            //   throw new InvalidArgumentError(
            //     'OpenAPI keyword "content" at %v must be an Object, ' +
            //       'but %v was given.',
            //     oaParameterObjectUri,
            //     oaContentObject,
            //   );
            // }
            // parameters[i].content[mediaType]
            for (const oaMediaType of Object.keys(oaContentObject)) {
              // если проверка данных для текущего медиа-типа
              // не выполняется, то медиа-тип пропускается
              if (NOT_VALIDABLE_MEDIA_TYPES.includes(oaMediaType)) {
                continue;
              }
              const oaMediaTypeObject = oaContentObject[oaMediaType];
              const escapedMediaType = escapeJsonPointer(oaMediaType);
              // так как определение операции проверяется сборщиком,
              // проверка объекта медиа-типа пропускается
              // const oaMediaTypeObjectUri = `${oaContentObjectUri}/${escapedMediaType}`;
              // if (
              //   !oaMediaTypeObject ||
              //   typeof oaMediaTypeObject !== 'object' ||
              //   Array.isArray(oaMediaTypeObject)
              // ) {
              //   throw new InvalidArgumentError(
              //     'Media Type Object at %v must be an Object, ' +
              //       'but %v was given.',
              //     oaMediaTypeObjectUri,
              //     oaMediaTypeObject,
              //   );
              // }
              // parameters[i].content[mediaType]schema
              if (oaMediaTypeObject.schema !== undefined) {
                // "/get/~1path/parameters/0/text~1plain"
                const validatorKey = [
                  '/' + oaOperationMethod,
                  '/' + escapeJsonPointer(oaOperationPath),
                  '/parameters',
                  '/' + index,
                  '/' + escapedMediaType,
                ].join('');
                const validator = ajv.compile({
                  type: OADataType.OBJECT,
                  properties: {value: oaMediaTypeObject.schema},
                  components: oaDocumentObject.components,
                });
                inst.setCompiledAjvValidator(validatorKey, validator);
                // если методом маршрута является GET,
                // то добавляется дополнительный ключ
                // для метода HEAD с тем же валидатором
                if (routeDef.method === HttpMethod.GET) {
                  // "/head/~1path/parameters/0/text~1plain"
                  const validatorKeyForHeadMethod = [
                    '/head',
                    '/' + escapeJsonPointer(oaOperationPath),
                    '/parameters',
                    '/' + index,
                    '/' + escapedMediaType,
                  ].join('');
                  inst.setCompiledAjvValidator(
                    validatorKeyForHeadMethod,
                    validator,
                  );
                }
              }
            }
          }
        }
      }
      // requestBody
      if (routeDef.meta.openApi.requestBody !== undefined) {
        let oaRequestBodyObject = routeDef.meta.openApi.requestBody;
        // так как определение операции проверяется сборщиком,
        // проверка объекта тела запроса пропускается
        // let oaRequestBodyObjectUri = '/meta/openApi/requestBody';
        // if (
        //   !oaRequestBodyObject ||
        //   typeof oaRequestBodyObject !== 'object' ||
        //   Array.isArray(oaRequestBodyObject)
        // ) {
        //   throw new InvalidArgumentError(
        //     'OpenAPI keyword "requestBody" at %v must be an Object, ' +
        //       'but %v was given.',
        //     '/meta/openApi',
        //     oaRequestBodyObject,
        //   );
        // }
        // создание нового или извлечение существующего
        // экземпляра Ajv для компиляции валидаторов
        // тела запроса
        const ajv = inst.getRequestBodyAjvInstance();
        // requestBody.$ref
        if (oaRequestBodyObject.$ref !== undefined) {
          // следующая строка закомментирована, так как проверка
          // объекта тела запроса и объекта содержания пропускается
          // oaRequestBodyObjectUri = oaRequestBodyObject.$ref;
          oaRequestBodyObject = resolveOAReferenceObject(oaRequestBodyObject, {
            rootDocument: oaDocumentObject,
          });
        }
        // requestBody.content
        const oaContentObject = oaRequestBodyObject.content;
        // так как определение операции проверяется сборщиком,
        // проверка объекта содержания пропускается
        // const oaContentObjectUri = `${oaRequestBodyObjectUri}/content`;
        // if (
        //   !oaContentObject ||
        //   typeof oaContentObject !== 'object' ||
        //   Array.isArray(oaContentObject)
        // ) {
        //   throw new InvalidArgumentError(
        //     'OpenAPI keyword "content" at %v must be an Object, ' +
        //       'but %v was given.',
        //     oaRequestBodyObjectUri,
        //     oaContentObject,
        //   );
        // }
        // requestBody.content[mediaType]
        for (const oaMediaType of Object.keys(oaContentObject)) {
          // если проверка данных для текущего медиа-типа
          // не выполняется, то медиа-тип пропускается
          if (NOT_VALIDABLE_MEDIA_TYPES.includes(oaMediaType)) {
            continue;
          }
          const oaMediaTypeObject = oaContentObject[oaMediaType];
          const escapedMediaType = escapeJsonPointer(oaMediaType);
          // так как определение операции проверяется сборщиком,
          // проверка объект медиа-типа пропускается
          // const oaMediaTypeObjectUri = `${oaContentObjectUri}/${escapedMediaType}`;
          // if (
          //   !oaMediaTypeObject ||
          //   typeof oaMediaTypeObject !== 'object' ||
          //   Array.isArray(oaMediaTypeObject)
          // ) {
          //   throw new InvalidArgumentError(
          //     'Media Type Object at %v must be an Object, but %v was given.',
          //     oaMediaTypeObjectUri,
          //     oaMediaTypeObject,
          //   );
          // }
          // requestBody.content[mediaType]schema
          if (oaMediaTypeObject.schema !== undefined) {
            // "/get/~1path/requestBody/text~1plain"
            const validatorKey = [
              '/' + oaOperationMethod,
              '/' + escapeJsonPointer(oaOperationPath),
              '/requestBody',
              '/' + escapedMediaType,
            ].join('');
            const validator = ajv.compile({
              type: OADataType.OBJECT,
              properties: {value: oaMediaTypeObject.schema},
              components: oaDocumentObject.components,
            });
            inst.setCompiledAjvValidator(validatorKey, validator);
            // если методом маршрута является GET,
            // то добавляется дополнительный ключ
            // для метода HEAD с тем же валидатором
            if (routeDef.method === HttpMethod.GET) {
              // "/head/~1path/requestBody/text~1plain"
              const validatorKeyForHeadMethod = [
                '/head',
                '/' + escapeJsonPointer(oaOperationPath),
                '/requestBody',
                '/' + escapedMediaType,
              ].join('');
              inst.setCompiledAjvValidator(
                validatorKeyForHeadMethod,
                validator,
              );
            }
          }
        }
      }
    }
    // если требуется проверять данные ответа,
    // то компилируются валидаторы согласно
    // определению операции
    if (options.validateResponse === true) {
      // responses
      if (routeDef.meta.openApi.responses !== undefined) {
        const oaResponses = routeDef.meta.openApi.responses;
        // так как определение операции проверяется сборщиком,
        // проверка ключевого слова "responses" пропускается
        // const oaResponsesUri = '/meta/openApi/responses';
        // if (
        //   !oaResponses ||
        //   typeof oaResponses !== 'object' ||
        //   Array.isArray(oaResponses)
        // ) {
        //   throw new InvalidArgumentError(
        //     'OpenAPI keyword "responses" at %v must be an Object, ' +
        //       'but %v was given.',
        //     '/meta/openApi',
        //     oaResponses,
        //   );
        // }
        // создание нового или извлечение существующего
        // экземпляра Ajv для компиляции валидаторов
        // тела ответа
        const ajv = inst.getResponseBodyAjvInstance();
        // responses[statusCode]
        for (const oaStatusCodeKey of Object.keys(oaResponses)) {
          let oaResponseObject = oaResponses[oaStatusCodeKey];
          // так как определение операции проверяется сборщиком,
          // проверка объекта ответа пропускается
          // let oaResponseObjectUri = `${oaResponsesUri}/${oaStatusCodeKey}`;
          // if (
          //   !oaResponseObject ||
          //   typeof oaResponseObject !== 'object' ||
          //   Array.isArray(oaResponseObject)
          // ) {
          //   throw new InvalidArgumentError(
          //     'Response Object at %v must be an Object, but %v was given.',
          //     oaResponseObjectUri,
          //     oaResponseObject,
          //   );
          // }
          // responses[statusCode].$ref
          if (oaResponseObject.$ref !== undefined) {
            // следующая строка закомментирована, так как проверка
            // объекта ответа и объекта содержания пропускается
            // oaResponseObjectUri = oaResponseObject.$ref;
            oaResponseObject = resolveOAReferenceObject(oaResponseObject, {
              rootDocument: oaDocumentObject,
            });
          }
          // responses[statusCode].content
          if (oaResponseObject.content !== undefined) {
            let oaContentObject = oaResponseObject.content;
            // так как определение операции проверяется сборщиком,
            // проверка объекта содержания пропускается
            // let oaContentObjectUri = `${oaResponseObjectUri}/content`;
            // if (
            //   !oaContentObject ||
            //   typeof oaContentObject !== 'object' ||
            //   Array.isArray(oaContentObject)
            // ) {
            //   throw new InvalidArgumentError(
            //     'OpenAPI keyword "content" at %v must be an Object, ' +
            //       'but %v was given.',
            //     oaResponseObjectUri,
            //     oaContentObject,
            //   );
            // }
            // responses[statusCode].content[mediaType]
            for (const oaMediaType of Object.keys(oaContentObject)) {
              // если проверка данных для текущего медиа-типа
              // не выполняется, то медиа-тип пропускается
              if (NOT_VALIDABLE_MEDIA_TYPES.includes(oaMediaType)) {
                continue;
              }
              const oaMediaTypeObject = oaContentObject[oaMediaType];
              const escapedMediaType = escapeJsonPointer(oaMediaType);
              // так как определение операции проверяется сборщиком,
              // проверка объекта медиа-типа пропускается
              // const oaMediaTypeObjectUri = `${oaContentObjectUri}/${escapedMediaType}`;
              // if (
              //   !oaMediaTypeObject ||
              //   typeof oaMediaTypeObject !== 'object' ||
              //   Array.isArray(oaMediaTypeObject)
              // ) {
              //   throw new InvalidArgumentError(
              //     'Media Type Object at %v must be an Object, ' +
              //       'but %v was given.',
              //     oaMediaTypeObjectUri,
              //     oaMediaTypeObject,
              //   );
              // }
              // responses[statusCode].content[mediaType].schema
              if (oaMediaTypeObject.schema !== undefined) {
                // "/get/~1path/responses/200/text~1plain"
                const validatorKey = [
                  '/' + oaOperationMethod,
                  '/' + escapeJsonPointer(oaOperationPath),
                  '/responses',
                  '/' + oaStatusCodeKey,
                  '/' + escapedMediaType,
                ].join('');
                const validator = ajv.compile({
                  type: OADataType.OBJECT,
                  properties: {value: oaMediaTypeObject.schema},
                  components: oaDocumentObject.components,
                });
                inst.setCompiledAjvValidator(validatorKey, validator);
                // если методом маршрута является GET,
                // то добавляется дополнительный ключ
                // для метода HEAD с тем же валидатором
                if (routeDef.method === HttpMethod.GET) {
                  // "/head/~1path/responses/200/text~1plain"
                  const validatorKeyForHeadMethod = [
                    '/head',
                    '/' + escapeJsonPointer(oaOperationPath),
                    '/responses',
                    '/' + oaStatusCodeKey,
                    '/' + escapedMediaType,
                  ].join('');
                  inst.setCompiledAjvValidator(
                    validatorKeyForHeadMethod,
                    validator,
                  );
                }
              }
            }
          }
        }
      }
    }
  }
  // если метаданные определены, но не являются объектом
  // или логическим значением, то выбрасывается ошибка
  else {
    throw new InvalidArgumentError(
      'Metadata key "openApi" must be a Boolean or an Object, ' +
        'but %v was given.',
      routeDef.meta.openApi,
    );
  }
}

/**
 * Pre-handler hook.
 *
 * @param {import('@e22m4u/js-trie-router').RequestContext} ctx
 * @returns {*}
 */
export function requestValidationOpenApiHook(ctx) {
  // если метаданные операции не определены или являются
  // логическим значением, то проверка данных пропускается
  const oaOperationObject = (ctx.meta || {}).openApi;
  if (!oaOperationObject || oaOperationObject === true) {
    return;
  }
  // так как метаданные проверяются в момент
  // определения маршрута, проверка метаданных
  // пропускается
  // // если метаданные определены, но не являются
  // // объектом, то выбрасывается ошибка
  // if (
  //   typeof oaOperationObject !== 'object' ||
  //   Array.isArray(oaOperationObject)
  // ) {
  //   throw new InvalidArgumentError(
  //     'Metadata key "openApi" must be an Object, but %v was given.',
  //     oaOperationObject,
  //   );
  // }
  // извлечение сервисов из контекста запроса,
  // настроек расширения и валидаторов данных
  const inst = ctx.container.get(TrieRouterOpenApi);
  const builder = ctx.container.get(OADocumentBuilder);
  const options = inst.getOptions();
  const oaDocumentObject = builder.getDocumentObjectRef();
  // замена формата пути TrieRouter на OpenAPI
  // пример: "/users/:id" => "/users/{id}"
  const oaOperationPath = trieRouterPathToOpenApiPath(ctx.route.path);
  // TrieRouter использует верхний регистр в названии методов,
  // но сборщик OpenAPI ожидает методы в нижнем регистре
  // пример: "POST" => "post"
  const oaOperationMethod = ctx.method.toLowerCase();
  // если определены параметры операции,
  // то выполняется проверка параметров
  if (oaOperationObject.parameters !== undefined) {
    // так как объект операции проверяется в момент
    // определения маршрута, проверка ключевого
    // слова "parameters" пропускается
    // // если массив параметров не является
    // // массивом, то выбрасывается ошибка
    // if (!Array.isArray(oaOperationObject.parameters)) {
    //   throw new InvalidArgumentError(
    //     'OpenAPI keyword "parameters" at %v must be an Array, ' +
    //       'but %v was given.',
    //     '/meta/openApi',
    //     oaOperationObject.parameters,
    //   );
    // }
    // parameters[i]
    const oaParameters = oaOperationObject.parameters;
    for (let index = 0, l = oaParameters.length; index < l; index++) {
      let oaParameterObject = oaParameters[index];
      let oaParameterObjectUri = `/meta/openApi/parameters/${index}`;
      // так как объект операции проверяется в момент
      // определения маршрута, проверка объекта
      // параметра пропускается
      // // если объект параметра не является
      // // объектом, то выбрасывается ошибка
      // if (
      //   !oaParameterObject ||
      //   typeof oaParameterObject !== 'object' ||
      //   Array.isArray(oaParameterObject)
      // ) {
      //   throw new InvalidArgumentError(
      //     'Parameter Object at %v must be an Object, but %v was given.',
      //     oaParameterObjectUri,
      //     oaParameterObject,
      //   );
      // }
      // parameters[i].$ref
      if (oaParameterObject.$ref !== undefined) {
        oaParameterObjectUri = oaParameterObject.$ref;
        oaParameterObject = resolveOAReferenceObject(oaParameterObject, {
          rootDocument: oaDocumentObject,
        });
      }
      // так как объект операции проверяется в момент
      // определения маршрута, проверка имени параметра
      // пропускается
      // // если имя параметра не определено,
      // // то выбрасывается ошибка
      // if (
      //   !oaParameterObject.name ||
      //   typeof oaParameterObject.name !== 'string'
      // ) {
      //   throw new InvalidArgumentError(
      //     'OpenAPI keyword "name" at %v must be a non-empty String, ' +
      //       'but %v was given.',
      //     oaParameterObjectUri,
      //     oaParameterObject.name,
      //   );
      // }
      // так как объект операции проверяется в момент
      // определения маршрута, проверка источника
      // параметра пропускается
      // // если источник параметра не определен,
      // // то выбрасывается ошибка
      // if (!oaParameterObject.in) {
      //   throw new InvalidArgumentError(
      //     'OpenAPI keyword "in" at %v is required, but %v was given.',
      //     oaParameterObjectUri,
      //     oaParameterObject.in,
      //   );
      // }
      const oaParamIn = oaParameterObject.in;
      // в спецификации имя параметра может быть определено
      // в любом регистре, поэтому название заголовков
      // приводится к нижнему регистру принудительно
      const paramName =
        oaParamIn === 'header'
          ? oaParameterObject.name.toLowerCase()
          : oaParameterObject.name;
      // если источник данных не поддерживается,
      // то выбрасывается ошибка
      const ctxPropName =
        OA_PARAMETER_LOCATION_TO_REQUEST_CONTEXT_PROPERTY_MAP[oaParamIn];
      if (ctxPropName === undefined) {
        throw new InvalidArgumentError(
          'Parameter location %v at %v is not supported.',
          oaParameterObject.in,
          oaParameterObjectUri,
        );
      }
      // так как объект операции проверяется в момент
      // определения маршрута, проверка ключевого
      // слова "required" пропускается
      // // если ключевое слово "required" определено,
      // // но содержит значение, отличное от undefined,
      // // то выбрасывается ошибка
      // if (
      //   oaParameterObject.required !== undefined &&
      //   typeof oaParameterObject.required !== 'boolean'
      // ) {
      //   throw new InvalidArgumentError(
      //     'OpenAPI keyword "required" at %v must be a Boolean, ' +
      //       'but %v was given.',
      //     oaParameterObjectUri,
      //     oaParameterObject.required,
      //   );
      // }
      // если параметр является обязательным, но значение
      // не определено, то выбрасывается ошибка
      const paramValue = ctx[ctxPropName][paramName];
      if (oaParameterObject.required === true && paramValue === undefined) {
        throw createError(
          HttpErrors.BadRequest,
          'Value at "/request/%s/%s" is required.',
          undefined,
          OA_PARAMETER_LOCATION_TO_URI_SEGMENT_MAP[oaParamIn],
          escapeJsonPointer(paramName),
        );
      }
      // parameters[i].schema
      if (oaParameterObject.schema !== undefined) {
        // "/get/~1path/parameters/0"
        const validatorKey = [
          '/' + oaOperationMethod,
          '/' + escapeJsonPointer(oaOperationPath),
          '/parameters',
          '/' + index,
        ].join('');
        // при неудачной проверке значения
        // параметра выбрасывается ошибка
        const validate = inst.getCompiledAjvValidator(validatorKey);
        const valueContainer = {value: paramValue};
        const isValid = validate(valueContainer);
        if (!isValid) {
          const error = validate.errors[0];
          const instancePath = error.instancePath.replace('/value', '');
          throw createError(
            HttpErrors.BadRequest,
            'Value at "/request/%s/%s%s" %s.',
            undefined,
            OA_PARAMETER_LOCATION_TO_URI_SEGMENT_MAP[oaParamIn],
            escapeJsonPointer(paramName),
            instancePath,
            error.message.replace(/'/g, '"'),
          );
        }
        // в случае приведения типов выполняется
        // переопределение значения текущего параметра
        if (
          options.coerceRequestParameterDataType ||
          options.useDefaultValuesInRequestParameters
        ) {
          ctx[ctxPropName][paramName] = valueContainer.value;
        }
      }
      // parameters[i].content
      if (oaParameterObject.content !== undefined) {
        const oaContentObject = oaParameterObject.content;
        const oaContentObjectUri = `${oaParameterObjectUri}/content`;
        // так как объект операции проверяется в момент
        // определения маршрута, проверка объекта
        // содержания пропускается
        // // если объект содержания не является
        // // объектом, то выбрасывается ошибка
        // if (
        //   !oaContentObject ||
        //   typeof oaContentObject !== 'object' ||
        //   Array.isArray(oaContentObject)
        // ) {
        //   throw new InvalidArgumentError(
        //     'OpenAPI keyword "content" at %v must be an Object, ' +
        //       'but %v was given.',
        //     oaParameterObjectUri,
        //     oaContentObject,
        //   );
        // }
        // так как на данном этапе неизвестно какой из медиа-типов
        // является подходящим для значения параметра, для проверки
        // будет использован первый обнаруженный тип
        const oaMediaType = Object.keys(oaContentObject)[0];
        if (!oaMediaType) {
          throw new InvalidArgumentError(
            'Media type is required at %v, but %v was given.',
            oaContentObjectUri,
            oaMediaType,
          );
        }
        // если медиа-тип не исключен для проверки данных,
        // то проверка выполняется согласно спецификации
        if (!NOT_VALIDABLE_MEDIA_TYPES.includes(oaMediaType)) {
          // если объект медиа-типа не является
          // объектом, то выбрасывается ошибка
          const oaMediaTypeObject = oaContentObject[oaMediaType];
          const escapedMediaType = escapeJsonPointer(oaMediaType);
          // так как объект операции проверяется в момент
          // определения маршрута, проверка объекта
          // медиа-типа пропускается
          // const oaMediaTypeObjectUri = `${oaContentObjectUri}/${escapedMediaType}`;
          // if (
          //   !oaMediaTypeObject ||
          //   typeof oaMediaTypeObject !== 'object' ||
          //   Array.isArray(oaMediaTypeObject)
          // ) {
          //   throw new InvalidArgumentError(
          //     'Media Type Object at %v must be an Object, but %v was given.',
          //     oaMediaTypeObjectUri,
          //     oaMediaTypeObject,
          //   );
          // }
          // parameters[i].content[mediaType].schema
          if (oaMediaTypeObject.schema !== undefined) {
            // "/get/~1path/parameters/0/text~1plain"
            const validatorKey = [
              '/' + oaOperationMethod,
              '/' + escapeJsonPointer(oaOperationPath),
              '/parameters',
              '/' + index,
              '/' + escapedMediaType,
            ].join('');
            // перед проверкой значения параметра выполняется
            // попытка разбора данных согласно медиа-типу
            let parsedValue = paramValue;
            const paramUriForHuman = format(
              '/request/%s/%s',
              OA_PARAMETER_LOCATION_TO_URI_SEGMENT_MAP[oaParamIn],
              escapeJsonPointer(paramName),
            );
            try {
              parsedValue = tryToParseDataWithMediaType(
                paramValue,
                oaMediaType,
                paramUriForHuman,
              );
            } catch (error) {
              throw createError(
                HttpErrors.BadRequest,
                error.message,
              );
            }
            // при неудачной проверке значения
            // параметра выбрасывается ошибка
            const validate = inst.getCompiledAjvValidator(validatorKey);
            const valueContainer = {value: parsedValue};
            const isValid = validate(valueContainer);
            if (!isValid) {
              const error = validate.errors[0];
              const instancePath = error.instancePath.replace('/value', '');
              throw createError(
                HttpErrors.BadRequest,
                'Value at "%s%s" %s.',
                undefined,
                paramUriForHuman,
                instancePath,
                error.message.replace(/'/g, '"'),
              );
            }
            // если выполняется модификация параметров запроса,
            // то параметр переопределяется новым значением
            if (
              options.parseRequestParameterContent ||
              options.coerceRequestParameterDataType ||
              options.removeAdditionalRequestData ||
              options.useDefaultValuesInRequestParameters
            ) {
              ctx[ctxPropName][paramName] = valueContainer.value;
            }
          }
        }
      }
    }
  }
  // если указано определение тела запроса,
  // то выполняется проверка данных
  if (oaOperationObject.requestBody !== undefined) {
    // если определение тела запроса не является
    // объектом, то выбрасывается ошибка
    let oaRequestBodyObject = oaOperationObject.requestBody;
    // так как объект операции проверяется в момент
    // определения маршрута, проверка объекта
    // тела запроса пропускается
    // let oaRequestBodyObjectUri = '/meta/openApi/requestBody';
    // if (
    //   !oaRequestBodyObject ||
    //   typeof oaRequestBodyObject !== 'object' ||
    //   Array.isArray(oaRequestBodyObject)
    // ) {
    //   throw new InvalidArgumentError(
    //     'OpenAPI keyword "requestBody" at %v must be an Object, ' +
    //       'but %v was given.',
    //     '/meta/openApi',
    //     oaRequestBodyObject,
    //   );
    // }
    // если объект тела запроса является ссылкой,
    // то выполняется извлечение целевого объекта
    if (oaRequestBodyObject.$ref !== undefined) {
      // следующая строка закомментирована, так как проверка
      // объекта тела запроса и объекта содержания пропускается
      // oaRequestBodyObjectUri = oaRequestBodyObject.$ref;
      oaRequestBodyObject = resolveOAReferenceObject(oaRequestBodyObject, {
        rootDocument: oaDocumentObject,
      });
    }
    // так как объект операции проверяется в момент
    // определения маршрута, проверка ключевого
    // слова "required" пропускается
    // // если ключевое слово "required" определено,
    // // но содержит значение, отличное от undefined,
    // // то выбрасывается ошибка
    // if (
    //   oaRequestBodyObject.required !== undefined &&
    //   typeof oaRequestBodyObject.required !== 'boolean'
    // ) {
    //   throw new InvalidArgumentError(
    //     'OpenAPI keyword "required" at %v must be a Boolean, ' +
    //       'but %v was given.',
    //     oaRequestBodyObjectUri,
    //     oaRequestBodyObject.required,
    //   );
    // }
    // если тело запроса является обязательным,
    // но заголовок "content-type" не определен,
    // или тело запроса не было передано,
    // то выбрасывается ошибка
    const requestContentType = ctx.headers['content-type'];
    const hasBody = hasRequestBody(ctx.request);
    if (
      oaRequestBodyObject.required === true &&
      (!hasBody || !requestContentType)
    ) {
      throw createError(
        HttpErrors.BadRequest,
        'Request body is required with the "Content-Type" header.',
      );
    }
    // если тело запроса определено, то выполняется
    // проверка соответствующим валидатором
    if (hasBody) {
      // если объект содержания не является
      // объектом, то выбрасывается ошибка
      const oaContentObject = oaRequestBodyObject.content;
      // так как объект операции проверяется в момент
      // определения маршрута, проверка объекта
      // содержания пропускается
      // const oaContentObjectUri = `${oaRequestBodyObjectUri}/content`;
      // if (
      //   !oaContentObject ||
      //   typeof oaContentObject !== 'object' ||
      //   Array.isArray(oaContentObject)
      // ) {
      //   throw new InvalidArgumentError(
      //     'OpenAPI keyword "content" at %v must be an Object, but %v was given.',
      //     oaRequestBodyObjectUri,
      //     oaContentObject,
      //   );
      // }
      // если объект содержания имеет хотя бы один
      // медиа-тип, то выполняется проверка данных
      const oaMediaTypes = Object.keys(oaContentObject);
      if (oaMediaTypes.length > 0) {
        // наличие тела в контексте запроса гарантирует наличие заголовка
        // "content-type" самим маршрутизатором, так как при отсутствии
        // данного заголовка тело не извлекается из потока и не передается
        // в контексте запроса, но на всякий случай проверка наличия
        // заголовка все же выполняется
        if (!requestContentType) {
          throw createError(
            HttpErrors.BadRequest,
            'Request header "Content-Type" is required.',
          );
        }
        // если заголовок "content-type" разобрать
        // не удалось, то выбрасывается ошибка
        const {mediaType} = parseContentType(String(requestContentType));
        if (!mediaType) {
          throw createError(
            HttpErrors.BadRequest,
            'Unable to parse "Content-Type" header.',
          );
        }
        // если принимаемый тип данных отсутствует
        // в спецификации, то выбрасывается ошибка
        if (oaContentObject[mediaType] === undefined) {
          throw createError(
            HttpErrors.BadRequest,
            'Media type %v is not supported by the request body specification.',
            undefined,
            mediaType.slice(0, 50),
          );
        }
        // если медиа-тип не исключен для проверки данных,
        // то проверка выполняется согласно спецификации
        if (!NOT_VALIDABLE_MEDIA_TYPES.includes(mediaType)) {
          // если маршрутизатору не удалось разобрать
          // тело запроса, то выбрасывается ошибка
          if (ctx.body === undefined) {
            throw createError(
              HttpErrors.BadRequest,
              'Media type %v is not supported.',
              undefined,
              mediaType.slice(0, 50),
            );
          }
          // если определение меда-типа не является
          // объектом, то выбрасывается ошибка
          const oaMediaTypeObject = oaContentObject[mediaType];
          // так как объект операции проверяется в момент
          // определения маршрута, проверка объекта
          // медиа-типа пропускается
          // const escapedMediaType = escapeJsonPointer(mediaType);
          // const oaMediaTypeObjectUri = `${oaContentObjectUri}/${escapedMediaType}`;
          // if (
          //   !oaMediaTypeObject ||
          //   typeof oaMediaTypeObject !== 'object' ||
          //   Array.isArray(oaMediaTypeObject)
          // ) {
          //   throw new InvalidArgumentError(
          //     'Media Type Object at %v must be an Object, but %v was given.',
          //     oaMediaTypeObjectUri,
          //     oaMediaTypeObject,
          //   );
          // }
          // если объект медиа-данных содержит схему,
          // то выполняется проверка валидатором
          if (oaMediaTypeObject.schema !== undefined) {
            // "/get/~1path/requestBody/text~1plain"
            const validatorKey = [
              '/' + oaOperationMethod,
              '/' + escapeJsonPointer(oaOperationPath),
              '/requestBody',
              '/' + escapeJsonPointer(mediaType),
            ].join('');
            // при неудачной проверке тела
            // запроса выбрасывается ошибка
            const validate = inst.getCompiledAjvValidator(validatorKey);
            const valueContainer = {value: ctx.body};
            const isValid = validate(valueContainer);
            if (!isValid) {
              const error = validate.errors[0];
              const instancePath = error.instancePath.replace('/value', '');
              throw createError(
                HttpErrors.BadRequest,
                'Value at %v %s.',
                undefined,
                `/request/body${instancePath}`,
                error.message.replace(/'/g, '"'),
              );
            }
            // если выполняется модификация тела запроса,
            // то данные переопределяются новым значением
            if (
              options.coerceRequestBodyDataType ||
              options.removeAdditionalRequestData ||
              options.useDefaultValuesInRequestBody
            ) {
              ctx.body = valueContainer.value;
            }
          }
        }
      }
    }
  }
}

/**
 * Post handler hook.
 *
 * @type {import('@e22m4u/js-trie-router').responseValidationHook}
 */
export function responseValidationOpenApiHook(ctx, data) {
  // если метаданные операции не определены или являются
  // логическим значением, то проверка данных пропускается
  const oaOperationObject = (ctx.meta || {}).openApi;
  if (!oaOperationObject || oaOperationObject === true) {
    return;
  }
  // так как метаданные проверяются в момент
  // определения маршрута, проверка метаданных
  // пропускается
  // // если метаданные определены, но не являются
  // // объектом, то выбрасывается ошибка
  // if (
  //   typeof oaOperationObject !== 'object' ||
  //   Array.isArray(oaOperationObject)
  // ) {
  //   throw new InvalidArgumentError(
  //     'Metadata key "openApi" must be an Object, but %v was given.',
  //     oaOperationObject,
  //   );
  // }
  // извлечение сервисов из контекста запроса,
  // настроек расширения и валидаторов данных
  const inst = ctx.container.get(TrieRouterOpenApi);
  const builder = ctx.container.get(OADocumentBuilder);
  const options = inst.getOptions();
  const oaDocumentObject = builder.getDocumentObjectRef();
  // замена формата пути TrieRouter на OpenAPI
  // пример: "/users/:id" => "/users/{id}"
  const oaOperationPath = trieRouterPathToOpenApiPath(ctx.route.path);
  // TrieRouter использует верхний регистр в названии методов,
  // но сборщик OpenAPI ожидает методы в нижнем регистре
  // пример: "POST" => "post"
  const oaOperationMethod = ctx.method.toLowerCase();
  // если спецификация ответов определена, то выполняется
  // поиск определения соответствующего статус-кода
  if (oaOperationObject.responses !== undefined) {
    // если определение ответов не является
    // объектом, то выбрасывается ошибка
    const oaResponsesObject = oaOperationObject.responses;
    // так как объект операции проверяется в момент
    // определения маршрута, проверка объекта
    // ответов пропускается
    // const oaResponsesObjectUri = '/meta/openApi/responses';
    // if (
    //   !oaResponsesObject ||
    //   typeof oaResponsesObject !== 'object' ||
    //   Array.isArray(oaResponsesObject)
    // ) {
    //   throw new InvalidArgumentError(
    //     'OpenAPI keyword "responses" must be an Object, but %v was given.',
    //     oaResponsesObject,
    //   );
    // }
    // если определен пользовательский код ответа,
    // то выполняется поиск соответствующего определения
    const responseStatusCode = ctx.response.statusCode;
    let oaStatusCodeKey;
    let oaResponseObject;
    // следующая строка закомментирована, так как проверка
    // объекта запросов и объекта содержания пропускается
    // let oaResponseObjectUri;
    if (responseStatusCode !== undefined) {
      oaStatusCodeKey = String(responseStatusCode);
      oaResponseObject = oaResponsesObject[oaStatusCodeKey];
      // следующая строка закомментирована, так как проверка
      // объекта запросов и объекта содержания пропускается
      // oaResponseObjectUri = `${oaResponsesObjectUri}/${oaStatusCodeKey}`;
      // если определение ответа для пользовательского
      // статуса не найдено, но определен ключ "default",
      // то используется определение ответа по умолчанию
      if (
        oaResponseObject === undefined &&
        oaResponsesObject.default !== undefined
      ) {
        oaStatusCodeKey = 'default';
        oaResponseObject = oaResponsesObject.default;
        // следующая строка закомментирована, так как проверка
        // объекта запросов и объекта содержания пропускается
        // oaResponseObjectUri = `${oaResponsesObjectUri}/default`;
      }
    }
    // если пользовательский код ответа не определен,
    // то используется код 200 или ключ "default"
    else if (oaResponsesObject['200'] !== undefined) {
      oaStatusCodeKey = '200';
      oaResponseObject = oaResponsesObject['200'];
      // следующая строка закомментирована, так как проверка
      // объекта запросов и объекта содержания пропускается
      // oaResponseObjectUri = `${oaResponsesObjectUri}/200`;
    } else if (oaResponsesObject.default !== undefined) {
      oaStatusCodeKey = 'default';
      oaResponseObject = oaResponsesObject.default;
      // следующая строка закомментирована, так как проверка
      // объекта запросов и объекта содержания пропускается
      // oaResponseObjectUri = `${oaResponsesObjectUri}/default`;
    }
    // если на данном этапе спецификация ответа
    // не определена, то выбрасывается ошибка
    if (oaResponseObject === undefined) {
      throw new InvalidArgumentError(
        'Status code %v is missing for the OpenAPI response definition.',
        responseStatusCode || 200,
      );
    }
    // так как объект операции проверяется в момент
    // определения маршрута, проверка объекта
    // ответа пропускается
    // // если определение ответа не является
    // // объектом, то выбрасывается ошибка
    // if (
    //   !oaResponseObject ||
    //   typeof oaResponseObject !== 'object' ||
    //   Array.isArray(oaResponseObject)
    // ) {
    //   throw new InvalidArgumentError(
    //     'Response definition at %v must be an Object, but %v was given.',
    //     oaResponseObjectUri,
    //     oaResponseObject,
    //   );
    // }
    // если определение ответа является ссылкой,
    // то выполняется извлечение целевого определения
    if (oaResponseObject.$ref !== undefined) {
      // следующая строка закомментирована, так как проверка
      // объекта запросов и объекта содержания пропускается
      // oaResponseObjectUri = oaResponseObject.$ref;
      oaResponseObject = resolveOAReferenceObject(oaResponseObject, {
        rootDocument: oaDocumentObject,
      });
    }
    // если определение ответа имеет объект содержания,
    // то выполняется поиск схемы для проверки данных
    if (oaResponseObject.content !== undefined) {
      let oaContentObject = oaResponseObject.content;
      // так как объект операции проверяется в момент
      // определения маршрута, проверка объекта
      // содержания пропускается
      // let oaContentObjectUri = `${oaResponseObjectUri}/content`;
      // if (
      //   !oaContentObject ||
      //   typeof oaContentObject !== 'object' ||
      //   Array.isArray(oaContentObject)
      // ) {
      //   throw new InvalidArgumentError(
      //     'OpenAPI keyword "content" at %v must be an Object, ' +
      //       'but %v was given.',
      //     oaResponseObjectUri,
      //     oaContentObject,
      //   );
      // }
      // если заголовок "content-type" был установлен
      // в обработчике маршрута, то выполняется
      // его разбор для извлечения медиа-типа
      let responseContentType = ctx.response.getHeader('content-type');
      let responseMediaType = undefined;
      if (responseContentType !== undefined) {
        const {mediaType} = parseContentType(String(responseContentType));
        // если не удалось разобрать заголовок
        // "content-type", то выбрасывается ошибка
        if (!mediaType) {
          throw createError(
            HttpErrors.InternalServerError,
            'Response header "Content-Type" has an invalid content.',
          );
        }
        responseMediaType = mediaType;
      }
      // так как в обработчике запроса редко устанавливается
      // заголовок "content-type", предусмотрено автоматическое
      // определение на основе данных
      else if (data != null) {
        switch (typeof data) {
          case 'object':
          case 'boolean':
          case 'number':
            responseMediaType = Buffer.isBuffer(data)
              ? 'application/octet-stream'
              : 'application/json';
            break;
          default:
            responseMediaType = 'text/plain';
            break;
        }
      }
      // если на данном этапе медиа-тип не определен, а данные
      // ответа являются undefined или null, то в этом случае
      // выбрасывается ошибка отсутствия тела ответа,
      // что противоречит спецификации, так как объект
      // содержания не может быть определен без медиа-типа
      if (!responseMediaType && data == null) {
        // если ошибка не содержит "statusCode", то маршрутизатор
        // использует код 500 по умолчанию, что позволяет в данном
        // случае использовать InvalidArgumentError
        throw new InvalidArgumentError('Response body is missing.');
      }
      // если медиа-тип найден в определении содержания,
      // то выполняется поиск схемы и проверка данных
      const oaMediaTypes = Object.keys(oaContentObject);
      if (oaMediaTypes.includes(responseMediaType)) {
        // если медиа-тип не исключен для проверки данных,
        // то проверка выполняется согласно спецификации
        if (!NOT_VALIDABLE_MEDIA_TYPES.includes(responseMediaType)) {
          // если определение медиа-типа не является
          // объектом, то выбрасывается ошибка
          const oaMediaTypeObject = oaContentObject[responseMediaType];
          const escapedMediaType = escapeJsonPointer(responseMediaType);
          // так как объект операции проверяется в момент
          // определения маршрута, проверка объекта
          // медиа-типа пропускается
          // const oaMediaTypeObjectUri = `${oaContentObjectUri}/${escapedMediaType}`;
          // if (
          //   !oaMediaTypeObject ||
          //   typeof oaMediaTypeObject !== 'object' ||
          //   Array.isArray(oaMediaTypeObject)
          // ) {
          //   throw new InvalidArgumentError(
          //     'Media Type Object at %v must be an Object, but %v was given.',
          //     oaMediaTypeObjectUri,
          //     oaMediaTypeObject,
          //   );
          // }
          // если объект медиа-типа содержит определение
          // схемы, то выполняется проверка данных ответа
          if (oaMediaTypeObject.schema !== undefined) {
            // "/get/~1path/responses/200/text~1plain"
            const validatorKey = [
              '/' + oaOperationMethod,
              '/' + escapeJsonPointer(oaOperationPath),
              '/responses',
              '/' + oaStatusCodeKey,
              '/' + escapedMediaType,
            ].join('');
            // перед проверкой тела ответа выполняется
            // попытка разбора данных согласно медиа-типу
            let parsedValue = data;
            try {
              parsedValue = tryToParseDataWithMediaType(
                data,
                responseMediaType,
                '/response/body'
              );
            } catch (error) {
              throw createError(
                HttpErrors.InternalServerError,
                error.message
              );
            }
            // при неудачной проверке тела
            // ответа выбрасывается ошибка
            const validate = inst.getCompiledAjvValidator(validatorKey);
            const valueContainer = {value: parsedValue};
            const isValid = validate(valueContainer);
            if (!isValid) {
              const error = validate.errors[0];
              const instancePath = error.instancePath.replace('/value', '');
              throw createError(
                HttpErrors.InternalServerError,
                'Value at %v %s.',
                undefined,
                `/response/body${instancePath}`,
                error.message.replace(/'/g, '"'),
              );
            }
            // если выполняется модификация тела ответа,
            // то данные переопределяются новым значением
            if (
              options.coerceResponseBodyDataType ||
              options.removeAdditionalResponseData ||
              options.useDefaultValuesInResponseBody
            ) {
              data = valueContainer.value;
            }
          }
        }
      }
      // если объект содержания имеет медиа типы,
      // но ни один из них не соответствует ответу,
      // то выбрасывается ошибка
      else if (oaMediaTypes.length) {
        throw new InvalidArgumentError(
          'Media type %v is missing for the OpenAPI response definition.',
          responseMediaType,
        );
      }
    }
  }
  return data;
}
