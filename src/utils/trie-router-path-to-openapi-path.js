import {InvalidArgumentError} from '@e22m4u/js-format';

/**
 * Замена формата пути TrieRouter на OpenAPI.
 * Пример: "/users/:id" => "/users/{id}"
 *
 * @param {string} path
 * @returns {string}
 */
export function trieRouterPathToOpenApiPath(path) {
  if (typeof path !== 'string') {
    throw new InvalidArgumentError(
      'Parameter "path" must be a String, but %v was given.',
      path,
    );
  }
  return path.replace(/:([a-zA-Z0-9_]+)/g, '{$1}');
}
