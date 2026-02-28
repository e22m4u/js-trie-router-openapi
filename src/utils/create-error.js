import {format} from '@e22m4u/js-format';

/**
 * Create error.
 *
 * @param {Function} ctor
 * @param {string} message
 * @param {*} details
 * @param  {*[]} args
 * @returns {object}
 */
export function createError(ctor, message, details, ...args) {
  const error = new ctor(message ? format(message, ...args) : undefined);
  if (details) {
    error.details = details;
  }
  return error;
}
