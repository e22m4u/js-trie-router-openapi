import {Service} from '@e22m4u/js-service';
import {OADocumentBuilder} from '@e22m4u/js-openapi';
import {InvalidArgumentError} from '@e22m4u/js-format';
import {trieRouterPathToOpenApiPath} from './utils/index.js';
import {RouterHookType, RouterHookRegistry} from '@e22m4u/js-trie-router';

/**
 * Trie router OpenAPI.
 */
export class TrieRouterOpenApi extends Service {
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
    const hookRegistry = this.getService(RouterHookRegistry);
    // в момент определения маршрута регистрируется
    // операция в сборщике OpenAPI документа
    if (
      !hookRegistry.hasHook(
        RouterHookType.ON_DEFINE_ROUTE,
        onDefineRouteOpenApiHook,
      )
    ) {
      hookRegistry.addHook(
        RouterHookType.ON_DEFINE_ROUTE,
        onDefineRouteOpenApiHook,
      );
    }
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
  // проверка базовых параметров маршута выполняется
  // в момент создания экземпляра Route, но данный
  // хук вызывается перед его созданием
  if (
    typeof routeDef.method !== 'string' ||
    typeof routeDef.path !== 'string'
  ) {
    return;
  }
  const builder = container.get(OADocumentBuilder);
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
