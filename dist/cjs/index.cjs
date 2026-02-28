"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var index_exports = {};
__export(index_exports, {
  TrieRouterOpenApi: () => TrieRouterOpenApi
});
module.exports = __toCommonJS(index_exports);
__reExport(index_exports, require("@e22m4u/js-openapi"), module.exports);

// src/trie-router-openapi.js
var import_http_errors = __toESM(require("http-errors"), 1);

// src/create-ajv.js
var import_ajv_formats = __toESM(require("ajv-formats"), 1);
var import__ = __toESM(require("ajv/dist/2020.js"), 1);
function createAjv(options = {}) {
  const ajv = new import__.default({
    strictTypes: false,
    validateFormats: true,
    allowUnionTypes: true,
    allowMatchingProperties: true,
    ...options
  });
  (0, import_ajv_formats.default)(ajv);
  ajv.addKeyword("discriminator");
  ajv.addKeyword("example");
  ajv.addKeyword("externalDocs");
  ajv.addKeyword("xml");
  ajv.addKeyword("components");
  return ajv;
}
__name(createAjv, "createAjv");

// src/trie-router-openapi.js
var import_js_service = require("@e22m4u/js-service");
var import_js_format4 = require("@e22m4u/js-format");

// src/utils/create-error.js
var import_js_format = require("@e22m4u/js-format");
function createError(ctor, message, details, ...args) {
  const error = new ctor(message ? (0, import_js_format.format)(message, ...args) : void 0);
  if (details) {
    error.details = details;
  }
  return error;
}
__name(createError, "createError");

// src/utils/trie-router-path-to-openapi-path.js
var import_js_format2 = require("@e22m4u/js-format");
function trieRouterPathToOpenApiPath(path) {
  if (typeof path !== "string") {
    throw new import_js_format2.InvalidArgumentError(
      'Parameter "path" must be a String, but %v was given.',
      path
    );
  }
  return path.replace(/:([a-zA-Z0-9_]+)/g, "{$1}");
}
__name(trieRouterPathToOpenApiPath, "trieRouterPathToOpenApiPath");

// src/try-to-parse-data-with-media-type.js
var import_js_format3 = require("@e22m4u/js-format");
var import_js_openapi = require("@e22m4u/js-openapi");
function tryToParseDataWithMediaType(data, mediaType, dataSourceUri = void 0) {
  if (mediaType === import_js_openapi.OAMediaType.APPLICATION_JSON) {
    if (typeof data === "string") {
      let res = data;
      try {
        res = JSON.parse(data);
      } catch {
        if (dataSourceUri !== void 0) {
          throw new import_js_format3.InvalidArgumentError(
            "Unable to parse a value at %v as JSON.",
            dataSourceUri
          );
        } else {
          throw new import_js_format3.InvalidArgumentError("Unable to parse a value as JSON.");
        }
      }
      return res;
    }
  }
  return data;
}
__name(tryToParseDataWithMediaType, "tryToParseDataWithMediaType");

// src/trie-router-openapi.js
var import_js_trie_router = require("@e22m4u/js-trie-router");
var import_js_openapi2 = require("@e22m4u/js-openapi");
var OA_PARAMETER_LOCATION_TO_REQUEST_CONTEXT_PROPERTY_MAP = {
  [import_js_openapi2.OAParameterLocation.QUERY]: "query",
  [import_js_openapi2.OAParameterLocation.PATH]: "params",
  [import_js_openapi2.OAParameterLocation.HEADER]: "headers",
  [import_js_openapi2.OAParameterLocation.COOKIE]: "cookies"
};
var OA_PARAMETER_LOCATION_TO_URI_SEGMENT_MAP = {
  [import_js_openapi2.OAParameterLocation.QUERY]: "query",
  [import_js_openapi2.OAParameterLocation.PATH]: "path",
  [import_js_openapi2.OAParameterLocation.HEADER]: "headers",
  [import_js_openapi2.OAParameterLocation.COOKIE]: "cookies"
};
var NOT_VALIDABLE_MEDIA_TYPES = [
  import_js_openapi2.OAMediaType.APPLICATION_OCTET_STREAM,
  import_js_openapi2.OAMediaType.MULTIPART_FORM_DATA
];
var _TrieRouterOpenApi = class _TrieRouterOpenApi extends import_js_service.Service {
  /**
   * Options.
   */
  _options = {};
  /**
   * Validators.
   */
  _validators = /* @__PURE__ */ new Map();
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
    if (!options || typeof options !== "object" || Array.isArray(options)) {
      throw new import_js_format4.InvalidArgumentError(
        'Parameter "options" must be an Object, but %v was given.',
        options
      );
    }
    if (options.document !== void 0) {
      if (!options.document || typeof options.document !== "object" || Array.isArray(options.document)) {
        throw new import_js_format4.InvalidArgumentError(
          'Option "document" must be an Object, but %v was given.',
          options.document
        );
      }
    }
    if (options.validateRequest !== void 0) {
      if (typeof options.validateRequest !== "boolean") {
        throw new import_js_format4.InvalidArgumentError(
          'Option "validateRequest" must be a Boolean, but %v was given.',
          options.validateRequest
        );
      }
    }
    if (options.validateResponse !== void 0) {
      if (typeof options.validateResponse !== "boolean") {
        throw new import_js_format4.InvalidArgumentError(
          'Option "validateResponse" must be a Boolean, but %v was given.',
          options.validateResponse
        );
      }
    }
    if (options.parseRequestParameterContent !== void 0) {
      if (typeof options.parseRequestParameterContent !== "boolean") {
        throw new import_js_format4.InvalidArgumentError(
          'Option "parseRequestParameterContent" must be a Boolean, but %v was given.',
          options.parseRequestParameterContent
        );
      }
    }
    if (options.coerceRequestParameterDataType !== void 0) {
      if (typeof options.coerceRequestParameterDataType !== "boolean") {
        throw new import_js_format4.InvalidArgumentError(
          'Option "coerceRequestParameterDataType" must be a Boolean, but %v was given.',
          options.coerceRequestParameterDataType
        );
      }
    }
    if (options.coerceRequestBodyDataType !== void 0) {
      if (typeof options.coerceRequestBodyDataType !== "boolean") {
        throw new import_js_format4.InvalidArgumentError(
          'Option "coerceRequestBodyDataType" must be a Boolean, but %v was given.',
          options.coerceRequestBodyDataType
        );
      }
    }
    if (options.coerceResponseBodyDataType !== void 0) {
      if (typeof options.coerceResponseBodyDataType !== "boolean") {
        throw new import_js_format4.InvalidArgumentError(
          'Option "coerceResponseBodyDataType" must be a Boolean, but %v was given.',
          options.coerceResponseBodyDataType
        );
      }
    }
    if (options.removeAdditionalRequestData !== void 0) {
      if (typeof options.removeAdditionalRequestData !== "boolean") {
        throw new import_js_format4.InvalidArgumentError(
          'Option "removeAdditionalRequestData" must be a Boolean, but %v was given.',
          options.removeAdditionalRequestData
        );
      }
    }
    if (options.removeAdditionalResponseData !== void 0) {
      if (typeof options.removeAdditionalResponseData !== "boolean") {
        throw new import_js_format4.InvalidArgumentError(
          'Option "removeAdditionalResponseData" must be a Boolean, but %v was given.',
          options.removeAdditionalResponseData
        );
      }
    }
    if (options.useDefaultValuesInRequestParameters !== void 0) {
      if (typeof options.useDefaultValuesInRequestParameters !== "boolean") {
        throw new import_js_format4.InvalidArgumentError(
          'Option "useDefaultValuesInRequestParameters" must be a Boolean, but %v was given.',
          options.useDefaultValuesInRequestParameters
        );
      }
    }
    if (options.useDefaultValuesInRequestBody !== void 0) {
      if (typeof options.useDefaultValuesInRequestBody !== "boolean") {
        throw new import_js_format4.InvalidArgumentError(
          'Option "useDefaultValuesInRequestBody" must be a Boolean, but %v was given.',
          options.useDefaultValuesInRequestBody
        );
      }
    }
    if (options.useDefaultValuesInResponseBody !== void 0) {
      if (typeof options.useDefaultValuesInResponseBody !== "boolean") {
        throw new import_js_format4.InvalidArgumentError(
          'Option "useDefaultValuesInResponseBody" must be a Boolean, but %v was given.',
          options.useDefaultValuesInResponseBody
        );
      }
    }
    this._options = options;
    const isBuilderRegistered = this.hasService(import_js_openapi2.OADocumentBuilder);
    if (options.document && isBuilderRegistered) {
      throw new import_js_format4.InvalidArgumentError(
        'Service OADocumentBuilder must not be registered when the option "document" is provided.'
      );
    } else if (!isBuilderRegistered) {
      this.useService(import_js_openapi2.OADocumentBuilder, options.document);
    }
    const router = this.getService(import_js_trie_router.TrieRouter);
    if (!router.hasHook(import_js_trie_router.RouterHookType.ON_DEFINE_ROUTE, onDefineRouteOpenApiHook)) {
      router.addHook(import_js_trie_router.RouterHookType.ON_DEFINE_ROUTE, onDefineRouteOpenApiHook);
    }
    if (options.validateRequest && !router.hasHook(import_js_trie_router.RouterHookType.PRE_HANDLER, requestValidationOpenApiHook)) {
      router.addHook(import_js_trie_router.RouterHookType.PRE_HANDLER, requestValidationOpenApiHook);
    }
    if (options.validateResponse && !router.hasHook(
      import_js_trie_router.RouterHookType.POST_HANDLER,
      responseValidationOpenApiHook
    )) {
      router.addHook(
        import_js_trie_router.RouterHookType.POST_HANDLER,
        responseValidationOpenApiHook
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
    if (!key || typeof key !== "string") {
      throw new import_js_format4.InvalidArgumentError(
        'Parameter "key" must be a non-empty String, but %v was given.',
        key
      );
    }
    if (typeof validator !== "function") {
      throw new import_js_format4.InvalidArgumentError(
        'Parameter "validator" must be a Function, but %v was given.',
        validator
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
    if (!key || typeof key !== "string") {
      throw new import_js_format4.InvalidArgumentError(
        'Parameter "key" must be a non-empty String, but %v was given.',
        key
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
    if (!key || typeof key !== "string") {
      throw new import_js_format4.InvalidArgumentError(
        'Parameter "key" must be a non-empty String, but %v was given.',
        key
      );
    }
    const validator = this._validators.get(key);
    if (!validator) {
      throw new import_js_format4.InvalidArgumentError("Ajv validator %v does not exist.", key);
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
      useDefaults: this._options.useDefaultValuesInRequestParameters
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
      useDefaults: this._options.useDefaultValuesInRequestBody
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
      useDefaults: this._options.useDefaultValuesInResponseBody
    });
    return this._responseBodyAjv;
  }
};
__name(_TrieRouterOpenApi, "TrieRouterOpenApi");
var TrieRouterOpenApi = _TrieRouterOpenApi;
function onDefineRouteOpenApiHook(routeDef, container) {
  if (!routeDef || typeof routeDef !== "object" || !routeDef.meta || typeof routeDef.meta !== "object" || routeDef.meta.openApi === void 0 || routeDef.meta.openApi === false) {
    return;
  }
  const inst = container.get(TrieRouterOpenApi);
  const builder = container.get(import_js_openapi2.OADocumentBuilder);
  const options = inst.getOptions();
  const oaOperationPath = trieRouterPathToOpenApiPath(routeDef.path);
  const oaOperationMethod = routeDef.method.toLowerCase();
  if (routeDef.meta.openApi === true) {
    builder.defineOperation({
      path: oaOperationPath,
      method: oaOperationMethod
    });
  } else if (routeDef.meta.openApi && typeof routeDef.meta.openApi === "object" && !Array.isArray(routeDef.meta.openApi)) {
    builder.defineOperation({
      path: oaOperationPath,
      method: oaOperationMethod,
      operation: routeDef.meta.openApi
    });
    const oaDocumentObject = builder.getDocumentObjectRef();
    if (options.validateRequest === true) {
      if (routeDef.meta.openApi.parameters !== void 0) {
        const oaParameters = routeDef.meta.openApi.parameters;
        const ajv = inst.getParametersAjvInstance();
        for (let index = 0, l = oaParameters.length; index < l; index++) {
          let oaParameterObject = oaParameters[index];
          if (oaParameterObject.$ref !== void 0) {
            oaParameterObject = (0, import_js_openapi2.resolveOAReferenceObject)(oaParameterObject, {
              rootDocument: oaDocumentObject
            });
          }
          if (oaParameterObject.schema !== void 0) {
            const validatorKey = [
              "/" + oaOperationMethod,
              "/" + (0, import_js_openapi2.escapeJsonPointer)(oaOperationPath),
              "/parameters",
              "/" + index
            ].join("");
            const validator = ajv.compile({
              type: import_js_openapi2.OADataType.OBJECT,
              properties: { value: oaParameterObject.schema },
              components: oaDocumentObject.components
            });
            inst.setCompiledAjvValidator(validatorKey, validator);
            if (routeDef.method === import_js_trie_router.HttpMethod.GET) {
              const validatorKeyForHeadMethod = [
                "/head",
                "/" + (0, import_js_openapi2.escapeJsonPointer)(oaOperationPath),
                "/parameters",
                "/" + index
              ].join("");
              inst.setCompiledAjvValidator(
                validatorKeyForHeadMethod,
                validator
              );
            }
          }
          if (oaParameterObject.content !== void 0) {
            const oaContentObject = oaParameterObject.content;
            for (const oaMediaType of Object.keys(oaContentObject)) {
              if (NOT_VALIDABLE_MEDIA_TYPES.includes(oaMediaType)) {
                continue;
              }
              const oaMediaTypeObject = oaContentObject[oaMediaType];
              const escapedMediaType = (0, import_js_openapi2.escapeJsonPointer)(oaMediaType);
              if (oaMediaTypeObject.schema !== void 0) {
                const validatorKey = [
                  "/" + oaOperationMethod,
                  "/" + (0, import_js_openapi2.escapeJsonPointer)(oaOperationPath),
                  "/parameters",
                  "/" + index,
                  "/" + escapedMediaType
                ].join("");
                const validator = ajv.compile({
                  type: import_js_openapi2.OADataType.OBJECT,
                  properties: { value: oaMediaTypeObject.schema },
                  components: oaDocumentObject.components
                });
                inst.setCompiledAjvValidator(validatorKey, validator);
                if (routeDef.method === import_js_trie_router.HttpMethod.GET) {
                  const validatorKeyForHeadMethod = [
                    "/head",
                    "/" + (0, import_js_openapi2.escapeJsonPointer)(oaOperationPath),
                    "/parameters",
                    "/" + index,
                    "/" + escapedMediaType
                  ].join("");
                  inst.setCompiledAjvValidator(
                    validatorKeyForHeadMethod,
                    validator
                  );
                }
              }
            }
          }
        }
      }
      if (routeDef.meta.openApi.requestBody !== void 0) {
        let oaRequestBodyObject = routeDef.meta.openApi.requestBody;
        const ajv = inst.getRequestBodyAjvInstance();
        if (oaRequestBodyObject.$ref !== void 0) {
          oaRequestBodyObject = (0, import_js_openapi2.resolveOAReferenceObject)(oaRequestBodyObject, {
            rootDocument: oaDocumentObject
          });
        }
        const oaContentObject = oaRequestBodyObject.content;
        for (const oaMediaType of Object.keys(oaContentObject)) {
          if (NOT_VALIDABLE_MEDIA_TYPES.includes(oaMediaType)) {
            continue;
          }
          const oaMediaTypeObject = oaContentObject[oaMediaType];
          const escapedMediaType = (0, import_js_openapi2.escapeJsonPointer)(oaMediaType);
          if (oaMediaTypeObject.schema !== void 0) {
            const validatorKey = [
              "/" + oaOperationMethod,
              "/" + (0, import_js_openapi2.escapeJsonPointer)(oaOperationPath),
              "/requestBody",
              "/" + escapedMediaType
            ].join("");
            const validator = ajv.compile({
              type: import_js_openapi2.OADataType.OBJECT,
              properties: { value: oaMediaTypeObject.schema },
              components: oaDocumentObject.components
            });
            inst.setCompiledAjvValidator(validatorKey, validator);
            if (routeDef.method === import_js_trie_router.HttpMethod.GET) {
              const validatorKeyForHeadMethod = [
                "/head",
                "/" + (0, import_js_openapi2.escapeJsonPointer)(oaOperationPath),
                "/requestBody",
                "/" + escapedMediaType
              ].join("");
              inst.setCompiledAjvValidator(
                validatorKeyForHeadMethod,
                validator
              );
            }
          }
        }
      }
    }
    if (options.validateResponse === true) {
      if (routeDef.meta.openApi.responses !== void 0) {
        const oaResponses = routeDef.meta.openApi.responses;
        const ajv = inst.getResponseBodyAjvInstance();
        for (const oaStatusCodeKey of Object.keys(oaResponses)) {
          let oaResponseObject = oaResponses[oaStatusCodeKey];
          if (oaResponseObject.$ref !== void 0) {
            oaResponseObject = (0, import_js_openapi2.resolveOAReferenceObject)(oaResponseObject, {
              rootDocument: oaDocumentObject
            });
          }
          if (oaResponseObject.content !== void 0) {
            let oaContentObject = oaResponseObject.content;
            for (const oaMediaType of Object.keys(oaContentObject)) {
              if (NOT_VALIDABLE_MEDIA_TYPES.includes(oaMediaType)) {
                continue;
              }
              const oaMediaTypeObject = oaContentObject[oaMediaType];
              const escapedMediaType = (0, import_js_openapi2.escapeJsonPointer)(oaMediaType);
              if (oaMediaTypeObject.schema !== void 0) {
                const validatorKey = [
                  "/" + oaOperationMethod,
                  "/" + (0, import_js_openapi2.escapeJsonPointer)(oaOperationPath),
                  "/responses",
                  "/" + oaStatusCodeKey,
                  "/" + escapedMediaType
                ].join("");
                const validator = ajv.compile({
                  type: import_js_openapi2.OADataType.OBJECT,
                  properties: { value: oaMediaTypeObject.schema },
                  components: oaDocumentObject.components
                });
                inst.setCompiledAjvValidator(validatorKey, validator);
                if (routeDef.method === import_js_trie_router.HttpMethod.GET) {
                  const validatorKeyForHeadMethod = [
                    "/head",
                    "/" + (0, import_js_openapi2.escapeJsonPointer)(oaOperationPath),
                    "/responses",
                    "/" + oaStatusCodeKey,
                    "/" + escapedMediaType
                  ].join("");
                  inst.setCompiledAjvValidator(
                    validatorKeyForHeadMethod,
                    validator
                  );
                }
              }
            }
          }
        }
      }
    }
  } else {
    throw new import_js_format4.InvalidArgumentError(
      'Metadata key "openApi" must be a Boolean or an Object, but %v was given.',
      routeDef.meta.openApi
    );
  }
}
__name(onDefineRouteOpenApiHook, "onDefineRouteOpenApiHook");
function requestValidationOpenApiHook(ctx) {
  const oaOperationObject = (ctx.meta || {}).openApi;
  if (!oaOperationObject || oaOperationObject === true) {
    return;
  }
  const inst = ctx.container.get(TrieRouterOpenApi);
  const builder = ctx.container.get(import_js_openapi2.OADocumentBuilder);
  const options = inst.getOptions();
  const oaDocumentObject = builder.getDocumentObjectRef();
  const oaOperationPath = trieRouterPathToOpenApiPath(ctx.route.path);
  const oaOperationMethod = ctx.method.toLowerCase();
  if (oaOperationObject.parameters !== void 0) {
    const oaParameters = oaOperationObject.parameters;
    for (let index = 0, l = oaParameters.length; index < l; index++) {
      let oaParameterObject = oaParameters[index];
      let oaParameterObjectUri = `/meta/openApi/parameters/${index}`;
      if (oaParameterObject.$ref !== void 0) {
        oaParameterObjectUri = oaParameterObject.$ref;
        oaParameterObject = (0, import_js_openapi2.resolveOAReferenceObject)(oaParameterObject, {
          rootDocument: oaDocumentObject
        });
      }
      const oaParamIn = oaParameterObject.in;
      const paramName = oaParamIn === "header" ? oaParameterObject.name.toLowerCase() : oaParameterObject.name;
      const ctxPropName = OA_PARAMETER_LOCATION_TO_REQUEST_CONTEXT_PROPERTY_MAP[oaParamIn];
      if (ctxPropName === void 0) {
        throw new import_js_format4.InvalidArgumentError(
          "Parameter location %v at %v is not supported.",
          oaParameterObject.in,
          oaParameterObjectUri
        );
      }
      const paramValue = ctx[ctxPropName][paramName];
      if (oaParameterObject.required === true && paramValue === void 0) {
        throw createError(
          import_http_errors.default.BadRequest,
          'Value at "/request/%s/%s" is required.',
          void 0,
          OA_PARAMETER_LOCATION_TO_URI_SEGMENT_MAP[oaParamIn],
          (0, import_js_openapi2.escapeJsonPointer)(paramName)
        );
      }
      if (oaParameterObject.schema !== void 0) {
        const validatorKey = [
          "/" + oaOperationMethod,
          "/" + (0, import_js_openapi2.escapeJsonPointer)(oaOperationPath),
          "/parameters",
          "/" + index
        ].join("");
        const validate = inst.getCompiledAjvValidator(validatorKey);
        const valueContainer = { value: paramValue };
        const isValid = validate(valueContainer);
        if (!isValid) {
          const error = validate.errors[0];
          const instancePath = error.instancePath.replace("/value", "");
          throw createError(
            import_http_errors.default.BadRequest,
            'Value at "/request/%s/%s%s" %s.',
            void 0,
            OA_PARAMETER_LOCATION_TO_URI_SEGMENT_MAP[oaParamIn],
            (0, import_js_openapi2.escapeJsonPointer)(paramName),
            instancePath,
            error.message.replace(/'/g, '"')
          );
        }
        if (options.coerceRequestParameterDataType || options.useDefaultValuesInRequestParameters) {
          ctx[ctxPropName][paramName] = valueContainer.value;
        }
      }
      if (oaParameterObject.content !== void 0) {
        const oaContentObject = oaParameterObject.content;
        const oaContentObjectUri = `${oaParameterObjectUri}/content`;
        const oaMediaType = Object.keys(oaContentObject)[0];
        if (!oaMediaType) {
          throw new import_js_format4.InvalidArgumentError(
            "Media type is required at %v, but %v was given.",
            oaContentObjectUri,
            oaMediaType
          );
        }
        if (!NOT_VALIDABLE_MEDIA_TYPES.includes(oaMediaType)) {
          const oaMediaTypeObject = oaContentObject[oaMediaType];
          const escapedMediaType = (0, import_js_openapi2.escapeJsonPointer)(oaMediaType);
          if (oaMediaTypeObject.schema !== void 0) {
            const validatorKey = [
              "/" + oaOperationMethod,
              "/" + (0, import_js_openapi2.escapeJsonPointer)(oaOperationPath),
              "/parameters",
              "/" + index,
              "/" + escapedMediaType
            ].join("");
            let parsedValue = paramValue;
            const paramUriForHuman = (0, import_js_format4.format)(
              "/request/%s/%s",
              OA_PARAMETER_LOCATION_TO_URI_SEGMENT_MAP[oaParamIn],
              (0, import_js_openapi2.escapeJsonPointer)(paramName)
            );
            try {
              parsedValue = tryToParseDataWithMediaType(
                paramValue,
                oaMediaType,
                paramUriForHuman
              );
            } catch (error) {
              throw createError(import_http_errors.default.BadRequest, error.message);
            }
            const validate = inst.getCompiledAjvValidator(validatorKey);
            const valueContainer = { value: parsedValue };
            const isValid = validate(valueContainer);
            if (!isValid) {
              const error = validate.errors[0];
              const instancePath = error.instancePath.replace("/value", "");
              throw createError(
                import_http_errors.default.BadRequest,
                'Value at "%s%s" %s.',
                void 0,
                paramUriForHuman,
                instancePath,
                error.message.replace(/'/g, '"')
              );
            }
            if (options.parseRequestParameterContent || options.coerceRequestParameterDataType || options.removeAdditionalRequestData || options.useDefaultValuesInRequestParameters) {
              ctx[ctxPropName][paramName] = valueContainer.value;
            }
          }
        }
      }
    }
  }
  if (oaOperationObject.requestBody !== void 0) {
    let oaRequestBodyObject = oaOperationObject.requestBody;
    if (oaRequestBodyObject.$ref !== void 0) {
      oaRequestBodyObject = (0, import_js_openapi2.resolveOAReferenceObject)(oaRequestBodyObject, {
        rootDocument: oaDocumentObject
      });
    }
    const requestContentType = ctx.headers["content-type"];
    const hasBody = (0, import_js_trie_router.hasRequestBody)(ctx.request);
    if (oaRequestBodyObject.required === true && (!hasBody || !requestContentType)) {
      throw createError(
        import_http_errors.default.BadRequest,
        'Request body is required with the "Content-Type" header.'
      );
    }
    if (hasBody) {
      const oaContentObject = oaRequestBodyObject.content;
      const oaMediaTypes = Object.keys(oaContentObject);
      if (oaMediaTypes.length > 0) {
        if (!requestContentType) {
          throw createError(
            import_http_errors.default.BadRequest,
            'Request header "Content-Type" is required.'
          );
        }
        const { mediaType } = (0, import_js_trie_router.parseContentType)(String(requestContentType));
        if (!mediaType) {
          throw createError(
            import_http_errors.default.BadRequest,
            'Unable to parse "Content-Type" header.'
          );
        }
        if (oaContentObject[mediaType] === void 0) {
          throw createError(
            import_http_errors.default.BadRequest,
            "Media type %v is not supported by the request body specification.",
            void 0,
            mediaType.slice(0, 50)
          );
        }
        if (!NOT_VALIDABLE_MEDIA_TYPES.includes(mediaType)) {
          if (ctx.body === void 0) {
            throw createError(
              import_http_errors.default.BadRequest,
              "Media type %v is not supported.",
              void 0,
              mediaType.slice(0, 50)
            );
          }
          const oaMediaTypeObject = oaContentObject[mediaType];
          if (oaMediaTypeObject.schema !== void 0) {
            const validatorKey = [
              "/" + oaOperationMethod,
              "/" + (0, import_js_openapi2.escapeJsonPointer)(oaOperationPath),
              "/requestBody",
              "/" + (0, import_js_openapi2.escapeJsonPointer)(mediaType)
            ].join("");
            const validate = inst.getCompiledAjvValidator(validatorKey);
            const valueContainer = { value: ctx.body };
            const isValid = validate(valueContainer);
            if (!isValid) {
              const error = validate.errors[0];
              const instancePath = error.instancePath.replace("/value", "");
              throw createError(
                import_http_errors.default.BadRequest,
                "Value at %v %s.",
                void 0,
                `/request/body${instancePath}`,
                error.message.replace(/'/g, '"')
              );
            }
            if (options.coerceRequestBodyDataType || options.removeAdditionalRequestData || options.useDefaultValuesInRequestBody) {
              ctx.body = valueContainer.value;
            }
          }
        }
      }
    }
  }
}
__name(requestValidationOpenApiHook, "requestValidationOpenApiHook");
function responseValidationOpenApiHook(ctx, data) {
  const oaOperationObject = (ctx.meta || {}).openApi;
  if (!oaOperationObject || oaOperationObject === true) {
    return;
  }
  const inst = ctx.container.get(TrieRouterOpenApi);
  const builder = ctx.container.get(import_js_openapi2.OADocumentBuilder);
  const options = inst.getOptions();
  const oaDocumentObject = builder.getDocumentObjectRef();
  const oaOperationPath = trieRouterPathToOpenApiPath(ctx.route.path);
  const oaOperationMethod = ctx.method.toLowerCase();
  if (oaOperationObject.responses !== void 0) {
    const oaResponsesObject = oaOperationObject.responses;
    const responseStatusCode = ctx.response.statusCode;
    let oaStatusCodeKey;
    let oaResponseObject;
    if (responseStatusCode !== void 0) {
      oaStatusCodeKey = String(responseStatusCode);
      oaResponseObject = oaResponsesObject[oaStatusCodeKey];
      if (oaResponseObject === void 0 && oaResponsesObject.default !== void 0) {
        oaStatusCodeKey = "default";
        oaResponseObject = oaResponsesObject.default;
      }
    } else if (oaResponsesObject["200"] !== void 0) {
      oaStatusCodeKey = "200";
      oaResponseObject = oaResponsesObject["200"];
    } else if (oaResponsesObject.default !== void 0) {
      oaStatusCodeKey = "default";
      oaResponseObject = oaResponsesObject.default;
    }
    if (oaResponseObject === void 0) {
      throw new import_js_format4.InvalidArgumentError(
        "Status code %v is missing for the OpenAPI response definition.",
        responseStatusCode || 200
      );
    }
    if (oaResponseObject.$ref !== void 0) {
      oaResponseObject = (0, import_js_openapi2.resolveOAReferenceObject)(oaResponseObject, {
        rootDocument: oaDocumentObject
      });
    }
    if (oaResponseObject.content !== void 0) {
      let oaContentObject = oaResponseObject.content;
      let responseContentType = ctx.response.getHeader("content-type");
      let responseMediaType = void 0;
      if (responseContentType !== void 0) {
        const { mediaType } = (0, import_js_trie_router.parseContentType)(String(responseContentType));
        if (!mediaType) {
          throw createError(
            import_http_errors.default.InternalServerError,
            'Response header "Content-Type" has an invalid content.'
          );
        }
        responseMediaType = mediaType;
      } else if (data != null) {
        switch (typeof data) {
          case "object":
          case "boolean":
          case "number":
            responseMediaType = Buffer.isBuffer(data) ? "application/octet-stream" : "application/json";
            break;
          default:
            responseMediaType = "text/plain";
            break;
        }
      }
      if (!responseMediaType && data == null) {
        throw new import_js_format4.InvalidArgumentError("Response body is missing.");
      }
      const oaMediaTypes = Object.keys(oaContentObject);
      if (oaMediaTypes.includes(responseMediaType)) {
        if (!NOT_VALIDABLE_MEDIA_TYPES.includes(responseMediaType)) {
          const oaMediaTypeObject = oaContentObject[responseMediaType];
          const escapedMediaType = (0, import_js_openapi2.escapeJsonPointer)(responseMediaType);
          if (oaMediaTypeObject.schema !== void 0) {
            const validatorKey = [
              "/" + oaOperationMethod,
              "/" + (0, import_js_openapi2.escapeJsonPointer)(oaOperationPath),
              "/responses",
              "/" + oaStatusCodeKey,
              "/" + escapedMediaType
            ].join("");
            let parsedValue = data;
            try {
              parsedValue = tryToParseDataWithMediaType(
                data,
                responseMediaType,
                "/response/body"
              );
            } catch (error) {
              throw createError(import_http_errors.default.InternalServerError, error.message);
            }
            const validate = inst.getCompiledAjvValidator(validatorKey);
            const valueContainer = { value: parsedValue };
            const isValid = validate(valueContainer);
            if (!isValid) {
              const error = validate.errors[0];
              const instancePath = error.instancePath.replace("/value", "");
              throw createError(
                import_http_errors.default.InternalServerError,
                "Value at %v %s.",
                void 0,
                `/response/body${instancePath}`,
                error.message.replace(/'/g, '"')
              );
            }
            if (options.coerceResponseBodyDataType || options.removeAdditionalResponseData || options.useDefaultValuesInResponseBody) {
              data = valueContainer.value;
            }
          }
        }
      } else if (oaMediaTypes.length) {
        throw new import_js_format4.InvalidArgumentError(
          "Media type %v is missing for the OpenAPI response definition.",
          responseMediaType
        );
      }
    }
  }
  return data;
}
__name(responseValidationOpenApiHook, "responseValidationOpenApiHook");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TrieRouterOpenApi,
  ...require("@e22m4u/js-openapi")
});
