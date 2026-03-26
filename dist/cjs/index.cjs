"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var index_exports = {};
__export(index_exports, {
  TrieRouterOpenApi: () => TrieRouterOpenApi
});
module.exports = __toCommonJS(index_exports);
__reExport(index_exports, require("@e22m4u/js-openapi"), module.exports);

// src/trie-router-openapi.js
var import_js_service = require("@e22m4u/js-service");
var import_js_openapi = require("@e22m4u/js-openapi");
var import_js_format2 = require("@e22m4u/js-format");

// src/utils/trie-router-path-to-openapi-path.js
var import_js_format = require("@e22m4u/js-format");
function trieRouterPathToOpenApiPath(path) {
  if (typeof path !== "string") {
    throw new import_js_format.InvalidArgumentError(
      'Parameter "path" must be a String, but %v was given.',
      path
    );
  }
  return path.replace(/:([a-zA-Z0-9_]+)/g, "{$1}");
}
__name(trieRouterPathToOpenApiPath, "trieRouterPathToOpenApiPath");

// src/trie-router-openapi.js
var import_js_trie_router = require("@e22m4u/js-trie-router");
var TrieRouterOpenApi = class extends import_js_service.Service {
  static {
    __name(this, "TrieRouterOpenApi");
  }
  /**
   * Options.
   */
  _options = {};
  /**
   * Constructor.
   *
   * @param {import('@e22m4u/js-service').ServiceContainer} [container]
   * @param {import('./trie-router-openapi.js').TrieRouterOpenApiOptions} [options]
   */
  constructor(container, options = {}) {
    super(container);
    if (!options || typeof options !== "object" || Array.isArray(options)) {
      throw new import_js_format2.InvalidArgumentError(
        'Parameter "options" must be an Object, but %v was given.',
        options
      );
    }
    if (options.document !== void 0) {
      if (!options.document || typeof options.document !== "object" || Array.isArray(options.document)) {
        throw new import_js_format2.InvalidArgumentError(
          'Option "document" must be an Object, but %v was given.',
          options.document
        );
      }
    }
    this._options = options;
    const isBuilderRegistered = this.hasService(import_js_openapi.OADocumentBuilder);
    if (options.document && isBuilderRegistered) {
      throw new import_js_format2.InvalidArgumentError(
        'Service OADocumentBuilder must not be registered when the option "document" is provided.'
      );
    } else if (!isBuilderRegistered) {
      this.useService(import_js_openapi.OADocumentBuilder, options.document);
    }
    const hookRegistry = this.getService(import_js_trie_router.RouterHookRegistry);
    if (!hookRegistry.hasHook(
      import_js_trie_router.RouterHookType.ON_DEFINE_ROUTE,
      onDefineRouteOpenApiHook
    )) {
      hookRegistry.addHook(
        import_js_trie_router.RouterHookType.ON_DEFINE_ROUTE,
        onDefineRouteOpenApiHook
      );
    }
  }
};
function onDefineRouteOpenApiHook(routeDef, container) {
  if (!routeDef || typeof routeDef !== "object" || !routeDef.meta || typeof routeDef.meta !== "object" || routeDef.meta.openApi === void 0 || routeDef.meta.openApi === false) {
    return;
  }
  if (typeof routeDef.method !== "string" || typeof routeDef.path !== "string") {
    return;
  }
  const builder = container.get(import_js_openapi.OADocumentBuilder);
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
  } else {
    throw new import_js_format2.InvalidArgumentError(
      'Metadata key "openApi" must be a Boolean or an Object, but %v was given.',
      routeDef.meta.openApi
    );
  }
}
__name(onDefineRouteOpenApiHook, "onDefineRouteOpenApiHook");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TrieRouterOpenApi,
  ...require("@e22m4u/js-openapi")
});
