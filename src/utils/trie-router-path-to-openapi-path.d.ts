/**
 * Замена формата пути TrieRouter на OpenAPI.
 * Пример: "/users/:id" => "/users/{id}"
 *
 * @param path
 */
export function trieRouterPathToOpenApiPath(path: string): string;
