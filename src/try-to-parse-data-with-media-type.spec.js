import {expect} from 'chai';
import {OAMediaType} from '@e22m4u/js-openapi';
import {tryToParseDataWithMediaType} from './try-to-parse-data-with-media-type.js';
import {InvalidArgumentError} from '@e22m4u/js-format';

describe('tryToParseDataWithMediaType', function () {
  it('should return the given data as is when the media type is unknown', function () {
    const data = 'value';
    const res = tryToParseDataWithMediaType(data, 'unknown');
    expect(res).to.be.eq(data);
  });

  describe('application/json', function () {
    it('should parse JSON object', function () {
      const jsonString = '{"foo":"bar"}';
      const res = tryToParseDataWithMediaType(
        jsonString,
        OAMediaType.APPLICATION_JSON,
      );
      expect(res).to.be.eql({foo: 'bar'});
    });

    it('should throw an error for an invalid JSON', function () {
      const invalidJson = '{"foo":"bar"';
      const throwable = () => {
        tryToParseDataWithMediaType(invalidJson, OAMediaType.APPLICATION_JSON);
      };
      expect(throwable).to.throw(
        InvalidArgumentError,
        'Unable to parse a value as JSON.',
      );
    });

    it('should use the parameter "dataSourceUri" in the error message', function () {
      const invalidJson = '{"foo":"bar"';
      const throwable = () => {
        tryToParseDataWithMediaType(
          invalidJson,
          OAMediaType.APPLICATION_JSON,
          '/request/query/param',
        );
      };
      expect(throwable).to.throw(
        InvalidArgumentError,
        'Unable to parse a value at "/request/query/param" as JSON.',
      );
    });
  });
});
