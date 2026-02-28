import {InvalidArgumentError} from '@e22m4u/js-format';
import {OAMediaType} from '@e22m4u/js-openapi';

/**
 * Try to parse data with media type.
 *
 * Утилита выбрасывает ошибку только
 * в случае явной ошибки в данных.
 *
 * @param {*} data
 * @param {string} mediaType
 * @param {string} [dataSourceUri]
 * @returns {*}
 */
export function tryToParseDataWithMediaType(
  data,
  mediaType,
  dataSourceUri = undefined,
) {
  if (mediaType === OAMediaType.APPLICATION_JSON) {
    if (typeof data === 'string') {
      let res = data;
      try {
        res = JSON.parse(data);
      } catch {
        if (dataSourceUri !== undefined) {
          throw new InvalidArgumentError(
            'Unable to parse a value at %v as JSON.',
            dataSourceUri,
          );
        } else {
          throw new InvalidArgumentError(
            'Unable to parse a value as JSON.',
          );
        }
      }
      return res;
    }
  }
  return data;
}
