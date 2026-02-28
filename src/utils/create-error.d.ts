import {Constructor} from '../types.js';

/**
 * Create error.
 *
 * @param ctor
 * @param message
 * @param details
 * @param args
 */
export function createError<T>(
  ctor: Constructor<T>,
  message: string,
  details?: object,
  ...args: any[]
): T;
