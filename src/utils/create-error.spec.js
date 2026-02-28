import {expect} from 'chai';
import {createError} from './create-error.js';

describe('createError', function () {
  it('should return an instance of the given constructor', function () {
    const res = createError(Error);
    expect(res).to.be.instanceOf(Error);
  });

  it('should pass the parameter "message" to the constructor', function () {
    const res = createError(Error, 'message');
    expect(res.message).to.be.eq('message');
  });

  it('should interpolate the given message with arguments', function () {
    const res = createError(
      Error,
      '%l and %v',
      undefined,
      ['foo', 'bar'],
      'baz',
    );
    expect(res.message).to.be.eq('"foo", "bar" and "baz"');
  });

  it('should set the parameter "details" to the property "details"', function () {
    const res = createError(Error, undefined, {foo: 'bar'});
    expect(res.details).to.be.eql({foo: 'bar'});
  });
});
