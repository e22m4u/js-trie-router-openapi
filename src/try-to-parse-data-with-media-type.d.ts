import {OAMediaType} from '@e22m4u/js-openapi';

/**
 * Try to parse data with media type.
 *
 * @param data
 * @param mediaType
 * @param dataSourceUri
 */
export function tryToParseDataWithMediaType(
  data: unknown,
  mediaType: string,
  dataSourceUri?: string,
): unknown;
