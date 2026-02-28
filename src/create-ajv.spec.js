import {expect} from 'chai';
import Ajv2020 from 'ajv/dist/2020.js';
import {createAjv} from './create-ajv.js';
import {OADataType} from '@e22m4u/js-openapi';

describe('createAjv', function () {
  it('should return Ajv2020 instance', function() {
    const res = createAjv();
    expect(res).to.be.instanceOf(Ajv2020);
  });

  it('should allow omit the type keyword', function () {
    createAjv().compile({});
  });

  it('should validate formats', function () {
    const throwable = () =>
      createAjv().compile({
        format: 'unknown',
      });
    expect(throwable).to.throw(
      'unknown format "unknown" ignored in schema at path "#"',
    );
  });

  it('should allow union types', function () {
    const validate = createAjv().compile({
      type: [OADataType.STRING, OADataType.NUMBER],
    });
    const res1 = validate('10');
    const res2 = validate(10);
    const res3 = validate(true);
    expect(res1).to.be.true;
    expect(res2).to.be.true;
    expect(res3).to.be.false;
  });

  it('should allow matching properties', function () {
    const validate = createAjv().compile({
      properties: {foo: {type: OADataType.STRING}},
      patternProperties: {'^num': {type: OADataType.NUMBER}},
    });
    const res1 = validate({foo: 'bar', numProp: 10});
    const res2 = validate({foo: 'bar', numProp: '10'});
    expect(res1).to.be.true;
    expect(res2).to.be.false;
  });

  it('should have built-in formats', function () {
    const validate = createAjv().compile({format: 'email'});
    const res1 = validate('mail@email.com');
    const res2 = validate('mail');
    expect(res1).to.be.true;
    expect(res2).to.be.false;
  });

  it('should allow OpenAPI keywords', function () {
    createAjv().compile({
      example: 'example',
      externalDocs: 'externalDocs',
      xml: 'xml',
      components: 'components',
    });
  });

  it('should validate the data against the schema object', function () {
    const validate = createAjv().compile({type: OADataType.STRING});
    const res1 = validate('10');
    const res2 = validate(10);
    expect(res1).to.be.true;
    expect(res2).to.be.false;
  });

  it('should resolve the component reference', function () {
    const validate = createAjv().compile({
      type: OADataType.OBJECT,
      properties: {
        value: {$ref: '#/components/schemas/mySchema'},
      },
      components: {
        schemas: {
          mySchema: {
            type: OADataType.STRING,
          },
        },
      },
    });
    const res1 = validate({value: '10'});
    const res2 = validate({value: 10});
    expect(res1).to.be.true;
    expect(res2).to.be.false;
  });
});
