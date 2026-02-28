import {expect} from 'chai';
import Ajv2020 from 'ajv/dist/2020.js';
import {format} from '@e22m4u/js-format';
import {ServiceContainer} from '@e22m4u/js-service';

import {
  HttpMethod,
  TrieRouter,
  RouterHookType,
  createRequestMock,
  createResponseMock,
} from '@e22m4u/js-trie-router';

import {
  OADataType,
  OAMediaType,
  OADocumentBuilder,
  OAParameterLocation,
  OADocumentObjectValidationError,
} from '@e22m4u/js-openapi';

import {
  TrieRouterOpenApi,
  onDefineRouteOpenApiHook,
  requestValidationOpenApiHook,
  responseValidationOpenApiHook,
} from './trie-router-openapi.js';

describe('TrieRouterOpenApi', function () {
  describe('constructor', function () {
    it('should pass the parameter "container" to the super class', function () {
      const container = new ServiceContainer();
      const S = new TrieRouterOpenApi(container);
      expect(S.container).to.be.eq(container);
    });

    it('should require the parameter "options" to be an Object', function () {
      const throwable = v => () => {
        const container = new ServiceContainer();
        new TrieRouterOpenApi(container, v);
      };
      const error = s =>
        format('Parameter "options" must be an Object, but %s was given.', s);
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(null)).to.throw(error('null'));
      throwable({})();
      throwable(undefined)();
    });

    it('should require the option "document" to be an Object', function () {
      const throwable = v => () => {
        const container = new ServiceContainer();
        new TrieRouterOpenApi(container, {document: v});
      };
      const error = s =>
        format('Option "document" must be an Object, but %s was given.', s);
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(null)).to.throw(error('null'));
      throwable({})();
      throwable(undefined)();
    });

    it('should require the option "validateRequest" to be a Boolean', function () {
      const throwable = v => () => {
        const container = new ServiceContainer();
        new TrieRouterOpenApi(container, {validateRequest: v});
      };
      const error = s =>
        format(
          'Option "validateRequest" must be a Boolean, but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(true)();
      throwable(false)();
      throwable(undefined)();
    });

    it('should require the option "validateResponse" to be a Boolean', function () {
      const throwable = v => () => {
        const container = new ServiceContainer();
        new TrieRouterOpenApi(container, {validateResponse: v});
      };
      const error = s =>
        format(
          'Option "validateResponse" must be a Boolean, but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(true)();
      throwable(false)();
      throwable(undefined)();
    });

    it('should require the option "parseRequestParameterContent" to be a Boolean', function () {
      const throwable = v => () => {
        const container = new ServiceContainer();
        new TrieRouterOpenApi(container, {parseRequestParameterContent: v});
      };
      const error = s =>
        format(
          'Option "parseRequestParameterContent" must be a Boolean, ' +
            'but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(true)();
      throwable(false)();
      throwable(undefined)();
    });

    it('should require the option "coerceRequestParameterDataType" to be a Boolean', function () {
      const throwable = v => () => {
        const container = new ServiceContainer();
        new TrieRouterOpenApi(container, {coerceRequestParameterDataType: v});
      };
      const error = s =>
        format(
          'Option "coerceRequestParameterDataType" must be a Boolean, ' +
            'but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(true)();
      throwable(false)();
      throwable(undefined)();
    });

    it('should require the option "coerceRequestBodyDataType" to be a Boolean', function () {
      const throwable = v => () => {
        const container = new ServiceContainer();
        new TrieRouterOpenApi(container, {coerceRequestBodyDataType: v});
      };
      const error = s =>
        format(
          'Option "coerceRequestBodyDataType" must be a Boolean, ' +
            'but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(true)();
      throwable(false)();
      throwable(undefined)();
    });

    it('should require the option "coerceResponseBodyDataType" to be a Boolean', function () {
      const throwable = v => () => {
        const container = new ServiceContainer();
        new TrieRouterOpenApi(container, {coerceResponseBodyDataType: v});
      };
      const error = s =>
        format(
          'Option "coerceResponseBodyDataType" must be a Boolean, ' +
            'but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(true)();
      throwable(false)();
      throwable(undefined)();
    });

    it('should require the option "removeAdditionalRequestData" to be a Boolean', function () {
      const throwable = v => () => {
        const container = new ServiceContainer();
        new TrieRouterOpenApi(container, {removeAdditionalRequestData: v});
      };
      const error = s =>
        format(
          'Option "removeAdditionalRequestData" must be a Boolean, ' +
            'but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(true)();
      throwable(false)();
      throwable(undefined)();
    });

    it('should require the option "removeAdditionalResponseData" to be a Boolean', function () {
      const throwable = v => () => {
        const container = new ServiceContainer();
        new TrieRouterOpenApi(container, {removeAdditionalResponseData: v});
      };
      const error = s =>
        format(
          'Option "removeAdditionalResponseData" must be a Boolean, ' +
            'but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(true)();
      throwable(false)();
      throwable(undefined)();
    });

    it('should require the option "useDefaultValuesInRequestParameters" to be a Boolean', function () {
      const throwable = v => () => {
        const container = new ServiceContainer();
        new TrieRouterOpenApi(container, {useDefaultValuesInRequestParameters: v});
      };
      const error = s =>
        format(
          'Option "useDefaultValuesInRequestParameters" must be a Boolean, ' +
            'but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(true)();
      throwable(false)();
      throwable(undefined)();
    });

    it('should require the option "useDefaultValuesInRequestBody" to be a Boolean', function () {
      const throwable = v => () => {
        const container = new ServiceContainer();
        new TrieRouterOpenApi(container, {useDefaultValuesInRequestBody: v});
      };
      const error = s =>
        format(
          'Option "useDefaultValuesInRequestBody" must be a Boolean, ' +
            'but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(true)();
      throwable(false)();
      throwable(undefined)();
    });

    it('should require the option "useDefaultValuesInResponseBody" to be a Boolean', function () {
      const throwable = v => () => {
        const container = new ServiceContainer();
        new TrieRouterOpenApi(container, {useDefaultValuesInResponseBody: v});
      };
      const error = s =>
        format(
          'Option "useDefaultValuesInResponseBody" must be a Boolean, ' +
            'but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(true)();
      throwable(false)();
      throwable(undefined)();
    });

    it('should not allow the service OADocumentBuilder when the option "document" is provided', function () {
      const throwable = () => {
        const container = new ServiceContainer();
        container.use(OADocumentBuilder);
        new TrieRouterOpenApi(container, {document: {}});
      };
      expect(throwable).to.throw(
        'Service OADocumentBuilder must not be registered ' +
          'when the option "document" is provided.',
      );
    });

    it('should register the service OADocumentBuilder to avoid per-request instantiation', function () {
      const container = new ServiceContainer();
      expect(container.has(OADocumentBuilder)).to.be.false;
      new TrieRouterOpenApi(container);
      expect(container.has(OADocumentBuilder)).to.be.true;
    });

    it('should register the hook "onDefineRouteOpenApiHook" during instantiation', function () {
      const container = new ServiceContainer();
      const router = container.get(TrieRouter);
      new TrieRouterOpenApi(container);
      const res = router.hasHook(
        RouterHookType.ON_DEFINE_ROUTE,
        onDefineRouteOpenApiHook,
      );
      expect(res).to.be.true;
    });

    it('should not register the hook "requestValidationOpenApiHook" by default', function () {
      const container = new ServiceContainer();
      const router = container.get(TrieRouter);
      new TrieRouterOpenApi(container);
      const res = router.hasHook(
        RouterHookType.PRE_HANDLER,
        requestValidationOpenApiHook,
      );
      expect(res).to.be.false;
    });

    it('should register the hook "requestValidationOpenApiHook" when the option "validateRequest" is true', function () {
      const container = new ServiceContainer();
      const router = container.get(TrieRouter);
      new TrieRouterOpenApi(container, {validateRequest: true});
      const res = router.hasHook(
        RouterHookType.PRE_HANDLER,
        requestValidationOpenApiHook,
      );
      expect(res).to.be.true;
    });

    it('should not register the hook "responseValidationOpenApiHook" by default', function () {
      const container = new ServiceContainer();
      const router = container.get(TrieRouter);
      new TrieRouterOpenApi(container);
      const res = router.hasHook(
        RouterHookType.POST_HANDLER,
        responseValidationOpenApiHook,
      );
      expect(res).to.be.false;
    });

    it('should register the hook "responseValidationOpenApiHook" when the option "validateRequest" is true', function () {
      const container = new ServiceContainer();
      const router = container.get(TrieRouter);
      new TrieRouterOpenApi(container, {validateResponse: true});
      const res = router.hasHook(
        RouterHookType.POST_HANDLER,
        responseValidationOpenApiHook,
      );
      expect(res).to.be.true;
    });
  });

  describe('getOptions', function () {
    it('should return an empty object when the options is not defined in constructor', function () {
      const router = new TrieRouter();
      const S = router.getService(TrieRouterOpenApi);
      expect(S.getOptions()).to.be.eql({});
    });

    it('should return the options object defined in constructor', function () {
      const router = new TrieRouter();
      const options = {validateRequest: true, validateResponse: true};
      const S = router.getService(TrieRouterOpenApi, options);
      expect(S.getOptions()).to.be.eql(options);
    });
  });

  describe('setCompiledAjvValidator', function () {
    it('should require the parameter "key" to be a non-empty String', function () {
      const validator = () => true;
      const throwable = v => () => {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi);
        S.setCompiledAjvValidator(v, validator);
      };
      const error = s =>
        format(
          'Parameter "key" must be a non-empty String, but %s was given.',
          s,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      throwable('key')();
    });

    it('should require the parameter "validator" to be a Function', function () {
      const throwable = v => () => {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi);
        S.setCompiledAjvValidator('key', v);
      };
      const error = s =>
        format(
          'Parameter "validator" must be a Function, but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(() => true)();
    });

    it('should set the validator for the given key', function () {
      const router = new TrieRouter();
      const S = router.getService(TrieRouterOpenApi);
      const validator = () => true;
      S.setCompiledAjvValidator('key', validator);
      const res = S.getCompiledAjvValidator('key');
      expect(res).to.be.eq(validator);
    });
  });

  describe('hasCompiledAjvValidator', function () {
    it('should require the parameter "key" to be a non-empty String', function () {
      const throwable = v => () => {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi);
        S.hasCompiledAjvValidator(v);
      };
      const error = s =>
        format(
          'Parameter "key" must be a non-empty String, but %s was given.',
          s,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      throwable('key')();
    });

    it('should return true when the given key is registered', function () {
      const router = new TrieRouter();
      const S = router.getService(TrieRouterOpenApi);
      const validator = () => true;
      const res1 = S.hasCompiledAjvValidator('key');
      expect(res1).to.be.false;
      S.setCompiledAjvValidator('key', validator);
      const res2 = S.hasCompiledAjvValidator('key');
      expect(res2).to.be.true;
    });
  });

  describe('getCompiledAjvValidator', function () {
    it('should require the parameter "key" to be a non-empty String', function () {
      const throwable = v => () => {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi);
        if (v && typeof v === 'string') {
          S.setCompiledAjvValidator(v, () => true);
        }
        S.getCompiledAjvValidator(v);
      };
      const error = s =>
        format(
          'Parameter "key" must be a non-empty String, but %s was given.',
          s,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      throwable('key')();
    });

    it('should throw an error when the given key is not registered', function () {
      const router = new TrieRouter();
      const S = router.getService(TrieRouterOpenApi);
      const throwable = () => S.getCompiledAjvValidator('key');
      expect(throwable).to.throw('Ajv validator "key" does not exist.');
    });

    it('should return the registered validator for the given key', function () {
      const router = new TrieRouter();
      const S = router.getService(TrieRouterOpenApi);
      const validator = () => true;
      S.setCompiledAjvValidator('key', validator);
      const res = S.getCompiledAjvValidator('key');
      expect(res).to.be.eq(validator);
    });
  });

  describe('getParametersAjvInstance', function () {
    it('should return always the same instance of Ajv2020', function () {
      const router = new TrieRouter();
      const S = router.getService(TrieRouterOpenApi);
      const res1 = S.getParametersAjvInstance();
      const res2 = S.getParametersAjvInstance();
      expect(res1).to.be.instanceOf(Ajv2020);
      expect(res1).to.be.eq(res2);
    });
  });

  describe('getRequestBodyAjvInstance', function () {
    it('should return always the same instance of Ajv2020', function () {
      const router = new TrieRouter();
      const S = router.getService(TrieRouterOpenApi);
      const res1 = S.getRequestBodyAjvInstance();
      const res2 = S.getRequestBodyAjvInstance();
      expect(res1).to.be.instanceOf(Ajv2020);
      expect(res1).to.be.eq(res2);
    });
  });

  describe('getResponseBodyAjvInstance', function () {
    it('should return always the same instance of Ajv2020', function () {
      const router = new TrieRouter();
      const S = router.getService(TrieRouterOpenApi);
      const res1 = S.getResponseBodyAjvInstance();
      const res2 = S.getResponseBodyAjvInstance();
      expect(res1).to.be.instanceOf(Ajv2020);
      expect(res1).to.be.eq(res2);
    });
  });

  describe('on define a route', function () {
    it('should not register the operation when the metadata is not specified', function () {
      const router = new TrieRouter();
      const builder = router.getService(OADocumentBuilder);
      router.useService(TrieRouterOpenApi);
      router.defineRoute({
        method: HttpMethod.GET,
        path: '/',
        handler() {
          return 'OK';
        },
      });
      const res = builder.getDocumentObjectRef();
      expect(res.paths).to.be.eql({});
    });

    it('should not register the operation when the metadata is false', function () {
      const router = new TrieRouter();
      const builder = router.getService(OADocumentBuilder);
      router.useService(TrieRouterOpenApi);
      router.defineRoute({
        method: HttpMethod.GET,
        path: '/',
        meta: {openApi: false},
        handler() {
          return 'OK';
        },
      });
      const res = builder.getDocumentObjectRef();
      expect(res.paths).to.be.eql({});
    });

    it('should register the operation when the metadata is true', function () {
      const router = new TrieRouter();
      const builder = router.getService(OADocumentBuilder);
      router.useService(TrieRouterOpenApi);
      router.defineRoute({
        method: HttpMethod.GET,
        path: '/',
        meta: {openApi: true},
        handler() {
          return 'OK';
        },
      });
      const res = builder.getDocumentObjectRef();
      expect(res.paths['/']).to.be.eql({get: {}});
    });

    it('should register the operation when the metadata is an object', function () {
      const router = new TrieRouter();
      const builder = router.getService(OADocumentBuilder);
      router.useService(TrieRouterOpenApi);
      const oaOperationObject = {
        parameters: [
          {
            name: 'param',
            in: OAParameterLocation.QUERY,
            schema: {type: OADataType.STRING},
          },
        ],
        responses: {
          200: {
            description: 'Response',
            content: {
              [OAMediaType.TEXT_PLAIN]: {
                schema: {
                  type: OADataType.STRING,
                },
              },
            },
          },
        },
      };
      router.defineRoute({
        method: HttpMethod.GET,
        path: '/',
        meta: {openApi: oaOperationObject},
        handler() {
          return 'OK';
        },
      });
      const res = builder.getDocumentObjectRef();
      expect(res.paths['/']).to.be.eql({get: oaOperationObject});
    });

    it('should convert the HTTP method to lower case in the OpenAPI document', function () {
      const router = new TrieRouter();
      const builder = router.getService(OADocumentBuilder);
      router.useService(TrieRouterOpenApi);
      router.defineRoute({
        method: 'POST',
        path: '/',
        meta: {openApi: true},
        handler() {
          return 'OK';
        },
      });
      const res = builder.getDocumentObjectRef();
      expect(res.paths['/']).to.have.property('post');
      expect(res.paths['/']).to.not.have.property('POST');
      expect(res.paths['/']).to.be.eql({post: {}});
    });

    it('should convert path parameters from colon-style to curly-braces-style', function () {
      const router = new TrieRouter();
      const builder = router.getService(OADocumentBuilder);
      router.useService(TrieRouterOpenApi);
      router.defineRoute({
        method: HttpMethod.GET,
        path: '/users/:userId/posts/:postId',
        meta: {openApi: true},
        handler: () => 'OK',
      });
      const res = builder.getDocumentObjectRef();
      expect(res.paths).to.have.property('/users/{userId}/posts/{postId}');
      expect(res.paths).to.not.have.property('/users/:userId/posts/:postId');
    });

    describe('operation object validation', function () {
      it('should validate "/meta/openApi"', function () {
        const throwable = v => () => {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi);
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: v,
            },
            handler() {
              return 'OK';
            },
          });
        };
        const error = s =>
          format(
            'Metadata key "openApi" must be a Boolean or an Object, ' +
              'but %s was given.',
            s,
          );
        expect(throwable('str')).to.throw(error('"str"'));
        expect(throwable('')).to.throw(error('""'));
        expect(throwable(10)).to.throw(error('10'));
        expect(throwable(0)).to.throw(error('0'));
        expect(throwable([])).to.throw(error('Array'));
        expect(throwable(null)).to.throw(error('null'));
        throwable(true)();
        throwable(false)();
        throwable({})();
        throwable(undefined)();
      });

      it('should validate "/meta/openApi/parameters"', async function () {
        const throwable = v => () => {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi);
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: v,
              },
            },
            handler() {
              return 'OK';
            },
          });
        };
        expect(throwable('str')).to.throw(OADocumentObjectValidationError);
        expect(throwable('')).to.throw(OADocumentObjectValidationError);
        expect(throwable(10)).to.throw(OADocumentObjectValidationError);
        expect(throwable(0)).to.throw(OADocumentObjectValidationError);
        expect(throwable(true)).to.throw(OADocumentObjectValidationError);
        expect(throwable(false)).to.throw(OADocumentObjectValidationError);
        expect(throwable({})).to.throw(OADocumentObjectValidationError);
        expect(throwable(null)).to.throw(OADocumentObjectValidationError);
        throwable([])();
        throwable(undefined)();
      });

      it('should validate "/meta/openApi/parameters/{n}"', async function () {
        const throwable = v => () => {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi);
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [v],
              },
            },
            handler() {
              return 'OK';
            },
          });
        };
        expect(throwable('str')).to.throw(OADocumentObjectValidationError);
        expect(throwable('')).to.throw(OADocumentObjectValidationError);
        expect(throwable(10)).to.throw(OADocumentObjectValidationError);
        expect(throwable(0)).to.throw(OADocumentObjectValidationError);
        expect(throwable(true)).to.throw(OADocumentObjectValidationError);
        expect(throwable(false)).to.throw(OADocumentObjectValidationError);
        expect(throwable([])).to.throw(OADocumentObjectValidationError);
        expect(throwable(undefined)).to.throw(OADocumentObjectValidationError);
        expect(throwable(null)).to.throw(OADocumentObjectValidationError);
        throwable({
          name: 'param',
          in: OAParameterLocation.QUERY,
          schema: {type: OADataType.STRING},
        })();
      });

      it('should validate "/meta/openApi/parameters/{n}/schema"', async function () {
        const throwable = v => () => {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi);
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [
                  {
                    name: 'id',
                    in: OAParameterLocation.QUERY,
                    schema: v,
                  },
                ],
              },
            },
            handler() {
              return 'OK';
            },
          });
        };
        expect(throwable('str')).to.throw(OADocumentObjectValidationError);
        expect(throwable('')).to.throw(OADocumentObjectValidationError);
        expect(throwable(10)).to.throw(OADocumentObjectValidationError);
        expect(throwable(0)).to.throw(OADocumentObjectValidationError);
        expect(throwable([])).to.throw(OADocumentObjectValidationError);
        expect(throwable(undefined)).to.throw(OADocumentObjectValidationError);
        expect(throwable(null)).to.throw(OADocumentObjectValidationError);
        throwable(true)();
        throwable(false)();
        throwable({type: OADataType.STRING})();
      });

      it('should validate "/meta/openApi/parameters/{n}/content"', async function () {
        const throwable = v => () => {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi);
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [
                  {
                    name: 'id',
                    in: OAParameterLocation.QUERY,
                    content: v,
                  },
                ],
              },
            },
            handler() {
              return 'OK';
            },
          });
        };
        expect(throwable('str')).to.throw(OADocumentObjectValidationError);
        expect(throwable('')).to.throw(OADocumentObjectValidationError);
        expect(throwable(10)).to.throw(OADocumentObjectValidationError);
        expect(throwable(0)).to.throw(OADocumentObjectValidationError);
        expect(throwable(true)).to.throw(OADocumentObjectValidationError);
        expect(throwable(false)).to.throw(OADocumentObjectValidationError);
        expect(throwable([])).to.throw(OADocumentObjectValidationError);
        expect(throwable({})).to.throw(OADocumentObjectValidationError);
        expect(throwable(undefined)).to.throw(OADocumentObjectValidationError);
        expect(throwable(null)).to.throw(OADocumentObjectValidationError);
        throwable({[OAMediaType.TEXT_PLAIN]: {}})();
      });

      it('should validate "/meta/openApi/parameters/{n}/content/{mediaType}"', async function () {
        const throwable = v => () => {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi);
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [
                  {
                    name: 'id',
                    in: OAParameterLocation.QUERY,
                    content: {
                      [OAMediaType.TEXT_PLAIN]: v,
                    },
                  },
                ],
              },
            },
            handler() {
              return 'OK';
            },
          });
        };
        expect(throwable('str')).to.throw(OADocumentObjectValidationError);
        expect(throwable('')).to.throw(OADocumentObjectValidationError);
        expect(throwable(10)).to.throw(OADocumentObjectValidationError);
        expect(throwable(0)).to.throw(OADocumentObjectValidationError);
        expect(throwable(true)).to.throw(OADocumentObjectValidationError);
        expect(throwable(false)).to.throw(OADocumentObjectValidationError);
        expect(throwable([])).to.throw(OADocumentObjectValidationError);
        expect(throwable(undefined)).to.throw(OADocumentObjectValidationError);
        expect(throwable(null)).to.throw(OADocumentObjectValidationError);
        throwable({})();
      });

      it('should validate "/meta/openApi/parameters/{n}/content/{mediaType}/schema"', async function () {
        const throwable = v => () => {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi);
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [
                  {
                    name: 'id',
                    in: OAParameterLocation.QUERY,
                    content: {
                      [OAMediaType.TEXT_PLAIN]: {
                        schema: v,
                      },
                    },
                  },
                ],
              },
            },
            handler() {
              return 'OK';
            },
          });
        };
        expect(throwable('str')).to.throw(OADocumentObjectValidationError);
        expect(throwable('')).to.throw(OADocumentObjectValidationError);
        expect(throwable(10)).to.throw(OADocumentObjectValidationError);
        expect(throwable(0)).to.throw(OADocumentObjectValidationError);
        expect(throwable([])).to.throw(OADocumentObjectValidationError);
        expect(throwable(null)).to.throw(OADocumentObjectValidationError);
        throwable(true)();
        throwable(false)();
        throwable({type: OADataType.STRING})();
        throwable(undefined)();
      });

      it('should validate "/meta/openApi/requestBody"', async function () {
        const throwable = v => () => {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi);
          router.defineRoute({
            method: HttpMethod.POST,
            path: '/',
            meta: {
              openApi: {
                requestBody: v,
              },
            },
            handler() {
              return 'OK';
            },
          });
        };
        expect(throwable('str')).to.throw(OADocumentObjectValidationError);
        expect(throwable('')).to.throw(OADocumentObjectValidationError);
        expect(throwable(10)).to.throw(OADocumentObjectValidationError);
        expect(throwable(0)).to.throw(OADocumentObjectValidationError);
        expect(throwable(true)).to.throw(OADocumentObjectValidationError);
        expect(throwable(false)).to.throw(OADocumentObjectValidationError);
        expect(throwable([])).to.throw(OADocumentObjectValidationError);
        expect(throwable({})).to.throw(OADocumentObjectValidationError);
        expect(throwable(null)).to.throw(OADocumentObjectValidationError);
        throwable({content: {[OAMediaType.TEXT_PLAIN]: {}}})();
        throwable(undefined)();
      });

      it('should validate "/meta/openApi/requestBody/content"', async function () {
        const throwable = v => () => {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi);
          router.defineRoute({
            method: HttpMethod.POST,
            path: '/',
            meta: {
              openApi: {
                requestBody: {
                  content: v,
                },
              },
            },
            handler() {
              return 'OK';
            },
          });
        };
        expect(throwable('str')).to.throw(OADocumentObjectValidationError);
        expect(throwable('')).to.throw(OADocumentObjectValidationError);
        expect(throwable(10)).to.throw(OADocumentObjectValidationError);
        expect(throwable(0)).to.throw(OADocumentObjectValidationError);
        expect(throwable(true)).to.throw(OADocumentObjectValidationError);
        expect(throwable(false)).to.throw(OADocumentObjectValidationError);
        expect(throwable([])).to.throw(OADocumentObjectValidationError);
        expect(throwable(undefined)).to.throw(OADocumentObjectValidationError);
        expect(throwable(null)).to.throw(OADocumentObjectValidationError);
        throwable({})();
      });

      it('should validate "/meta/openApi/requestBody/content/{mediaType}"', async function () {
        const throwable = v => () => {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi);
          router.defineRoute({
            method: HttpMethod.POST,
            path: '/',
            meta: {
              openApi: {
                requestBody: {
                  content: {
                    [OAMediaType.TEXT_PLAIN]: v,
                  },
                },
              },
            },
            handler() {
              return 'OK';
            },
          });
        };
        expect(throwable('str')).to.throw(OADocumentObjectValidationError);
        expect(throwable('')).to.throw(OADocumentObjectValidationError);
        expect(throwable(10)).to.throw(OADocumentObjectValidationError);
        expect(throwable(0)).to.throw(OADocumentObjectValidationError);
        expect(throwable(true)).to.throw(OADocumentObjectValidationError);
        expect(throwable(false)).to.throw(OADocumentObjectValidationError);
        expect(throwable([])).to.throw(OADocumentObjectValidationError);
        expect(throwable(undefined)).to.throw(OADocumentObjectValidationError);
        expect(throwable(null)).to.throw(OADocumentObjectValidationError);
        throwable({})();
      });

      it('should validate "/meta/openApi/requestBody/content/{mediaType}/schema"', async function () {
        const throwable = v => () => {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi);
          router.defineRoute({
            method: HttpMethod.POST,
            path: '/',
            meta: {
              openApi: {
                requestBody: {
                  content: {
                    [OAMediaType.TEXT_PLAIN]: {
                      schema: v,
                    },
                  },
                },
              },
            },
            handler() {
              return 'OK';
            },
          });
        };
        expect(throwable('str')).to.throw(OADocumentObjectValidationError);
        expect(throwable('')).to.throw(OADocumentObjectValidationError);
        expect(throwable(10)).to.throw(OADocumentObjectValidationError);
        expect(throwable(0)).to.throw(OADocumentObjectValidationError);
        expect(throwable([])).to.throw(OADocumentObjectValidationError);
        expect(throwable(null)).to.throw(OADocumentObjectValidationError);
        throwable(true)();
        throwable(false)();
        throwable({type: OADataType.STRING})();
        throwable(undefined)();
      });

      it('should validate "/meta/openApi/responses"', async function () {
        const throwable = v => () => {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi);
          router.defineRoute({
            method: HttpMethod.POST,
            path: '/',
            meta: {
              openApi: {
                responses: v,
              },
            },
            handler() {
              return 'OK';
            },
          });
        };
        expect(throwable('str')).to.throw(OADocumentObjectValidationError);
        expect(throwable('')).to.throw(OADocumentObjectValidationError);
        expect(throwable(10)).to.throw(OADocumentObjectValidationError);
        expect(throwable(0)).to.throw(OADocumentObjectValidationError);
        expect(throwable(true)).to.throw(OADocumentObjectValidationError);
        expect(throwable(false)).to.throw(OADocumentObjectValidationError);
        expect(throwable([])).to.throw(OADocumentObjectValidationError);
        expect(throwable({})).to.throw(OADocumentObjectValidationError);
        expect(throwable(null)).to.throw(OADocumentObjectValidationError);
        throwable({200: {description: 'Response'}})();
        throwable(undefined)();
      });

      it('should validate "/meta/openApi/responses/{statusCode}"', async function () {
        const throwable = v => () => {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi);
          router.defineRoute({
            method: HttpMethod.POST,
            path: '/',
            meta: {
              openApi: {
                responses: {
                  200: v,
                },
              },
            },
            handler() {
              return 'OK';
            },
          });
        };
        expect(throwable('str')).to.throw(OADocumentObjectValidationError);
        expect(throwable('')).to.throw(OADocumentObjectValidationError);
        expect(throwable(10)).to.throw(OADocumentObjectValidationError);
        expect(throwable(0)).to.throw(OADocumentObjectValidationError);
        expect(throwable(true)).to.throw(OADocumentObjectValidationError);
        expect(throwable(false)).to.throw(OADocumentObjectValidationError);
        expect(throwable([])).to.throw(OADocumentObjectValidationError);
        expect(throwable(null)).to.throw(OADocumentObjectValidationError);
        expect(throwable(undefined)).to.throw(OADocumentObjectValidationError);
        throwable({description: 'Response'})();
      });

      it('should validate "/meta/openApi/responses/{statusCode}/content"', async function () {
        const throwable = v => () => {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi);
          router.defineRoute({
            method: HttpMethod.POST,
            path: '/',
            meta: {
              openApi: {
                responses: {
                  200: {
                    description: 'Response',
                    content: v,
                  },
                },
              },
            },
            handler() {
              return 'OK';
            },
          });
        };
        expect(throwable('str')).to.throw(OADocumentObjectValidationError);
        expect(throwable('')).to.throw(OADocumentObjectValidationError);
        expect(throwable(10)).to.throw(OADocumentObjectValidationError);
        expect(throwable(0)).to.throw(OADocumentObjectValidationError);
        expect(throwable(true)).to.throw(OADocumentObjectValidationError);
        expect(throwable(false)).to.throw(OADocumentObjectValidationError);
        expect(throwable([])).to.throw(OADocumentObjectValidationError);
        expect(throwable(null)).to.throw(OADocumentObjectValidationError);
        throwable({})();
        throwable(undefined)();
      });

      it('should validate "/meta/openApi/responses/{statusCode}/content/{mediaType}"', async function () {
        const throwable = v => () => {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi);
          router.defineRoute({
            method: HttpMethod.POST,
            path: '/',
            meta: {
              openApi: {
                responses: {
                  200: {
                    description: 'Response',
                    content: {
                      [OAMediaType.TEXT_PLAIN]: v,
                    },
                  },
                },
              },
            },
            handler() {
              return 'OK';
            },
          });
        };
        expect(throwable('str')).to.throw(OADocumentObjectValidationError);
        expect(throwable('')).to.throw(OADocumentObjectValidationError);
        expect(throwable(10)).to.throw(OADocumentObjectValidationError);
        expect(throwable(0)).to.throw(OADocumentObjectValidationError);
        expect(throwable(true)).to.throw(OADocumentObjectValidationError);
        expect(throwable(false)).to.throw(OADocumentObjectValidationError);
        expect(throwable([])).to.throw(OADocumentObjectValidationError);
        expect(throwable(null)).to.throw(OADocumentObjectValidationError);
        expect(throwable(undefined)).to.throw(OADocumentObjectValidationError);
        throwable({})();
      });

      it('should validate "/meta/openApi/responses/{statusCode}/content/{mediaType}/schema"', async function () {
        const throwable = v => () => {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi);
          router.defineRoute({
            method: HttpMethod.POST,
            path: '/',
            meta: {
              openApi: {
                responses: {
                  200: {
                    description: 'Response',
                    content: {
                      [OAMediaType.TEXT_PLAIN]: {
                        schema: v,
                      },
                    },
                  },
                },
              },
            },
            handler() {
              return 'OK';
            },
          });
        };
        expect(throwable('str')).to.throw(OADocumentObjectValidationError);
        expect(throwable('')).to.throw(OADocumentObjectValidationError);
        expect(throwable(10)).to.throw(OADocumentObjectValidationError);
        expect(throwable(0)).to.throw(OADocumentObjectValidationError);
        expect(throwable([])).to.throw(OADocumentObjectValidationError);
        expect(throwable(null)).to.throw(OADocumentObjectValidationError);
        throwable(true)();
        throwable(false)();
        throwable({type: OADataType.STRING})();
        throwable(undefined)();
      });

      it('should require the metadata keyword "openApi" to be a Boolean or an Object', function () {
        const throwable = v => () => {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi);
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {openApi: v},
            handler() {
              return 'OK';
            },
          });
        };
        const error = s =>
          format(
            'Metadata key "openApi" must be a Boolean or an Object, ' +
              'but %s was given.',
            s,
          );
        expect(throwable('str')).to.throw(error('"str"'));
        expect(throwable('')).to.throw(error('""'));
        expect(throwable(10)).to.throw(error('10'));
        expect(throwable(0)).to.throw(error('0'));
        expect(throwable([])).to.throw(error('Array'));
        expect(throwable(null)).to.throw(error('null'));
        throwable(true)();
        throwable(false)();
        throwable({})();
        throwable(undefined)();
      });
    });

    describe('when the option "validateRequest" is true', function () {
      it('should compile the validator for "/parameters/{n}/schema"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {validateRequest: true});
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/path',
          meta: {
            openApi: {
              parameters: [
                {
                  name: 'param',
                  in: OAParameterLocation.QUERY,
                  schema: {type: OADataType.STRING},
                },
              ],
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/get/~1path/parameters/0',
          '/head/~1path/parameters/0',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.true;
        });
      });

      it('should compile the validator for "#/components/parameters/{name}/schema"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {validateRequest: true});
        const builder = router.getService(OADocumentBuilder);
        builder.defineParameterComponent('param', {
          name: 'param',
          in: OAParameterLocation.QUERY,
          schema: {type: OADataType.STRING},
        });
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/path',
          meta: {
            openApi: {
              parameters: [{$ref: '#/components/parameters/param'}],
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/get/~1path/parameters/0',
          '/head/~1path/parameters/0',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.true;
        });
      });

      it('should compile the validator for "/parameters/{n}/content/{mediaType}/schema"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {validateRequest: true});
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/path',
          meta: {
            openApi: {
              parameters: [
                {
                  name: 'param',
                  in: OAParameterLocation.QUERY,
                  content: {
                    [OAMediaType.APPLICATION_JSON]: {
                      schema: {type: OADataType.OBJECT},
                    },
                  },
                },
              ],
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/get/~1path/parameters/0/application~1json',
          '/head/~1path/parameters/0/application~1json',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.true;
        });
      });

      it('should compile the validator for "#/components/parameters/{name}/content/{mediaType}/schema"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {validateRequest: true});
        const builder = router.getService(OADocumentBuilder);
        builder.defineParameterComponent('param', {
          name: 'param',
          in: OAParameterLocation.QUERY,
          content: {
            [OAMediaType.APPLICATION_JSON]: {
              schema: {type: OADataType.OBJECT},
            },
          },
        });
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/path',
          meta: {
            openApi: {
              parameters: [{$ref: '#/components/parameters/param'}],
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/get/~1path/parameters/0/application~1json',
          '/head/~1path/parameters/0/application~1json',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.true;
        });
      });

      it('should compile validators for "/requestBody/content/{mediaType}/schema"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {validateRequest: true});
        router.defineRoute({
          method: HttpMethod.POST,
          path: '/path',
          meta: {
            openApi: {
              requestBody: {
                content: {
                  [OAMediaType.APPLICATION_JSON]: {
                    schema: {type: OADataType.OBJECT},
                  },
                  [OAMediaType.TEXT_PLAIN]: {
                    schema: {type: OADataType.STRING},
                  },
                },
              },
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/post/~1path/requestBody/application~1json',
          '/post/~1path/requestBody/text~1plain',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.true;
        });
      });

      it('should compile validators for "#/components/requestBodies/{name}/content/{mediaType}/schema"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {validateRequest: true});
        const builder = router.getService(OADocumentBuilder);
        builder.defineRequestBodyComponent('body', {
          content: {
            [OAMediaType.APPLICATION_JSON]: {
              schema: {type: OADataType.OBJECT},
            },
            [OAMediaType.TEXT_PLAIN]: {
              schema: {type: OADataType.STRING},
            },
          },
        });
        router.defineRoute({
          method: HttpMethod.POST,
          path: '/path',
          meta: {
            openApi: {
              requestBody: {$ref: '#/components/requestBodies/body'},
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/post/~1path/requestBody/application~1json',
          '/post/~1path/requestBody/text~1plain',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.true;
        });
      });

      it('should ignore the media type "application/octet-stream" in "/parameters/{n}/content"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateRequest: true,
        });
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/path',
          meta: {
            openApi: {
              parameters: [
                {
                  name: 'param',
                  in: OAParameterLocation.QUERY,
                  content: {
                    [OAMediaType.APPLICATION_OCTET_STREAM]: {
                      schema: {type: OADataType.STRING},
                    },
                  },
                },
              ],
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/get/~1path/parameters/0/application~1octet-stream',
          '/head/~1path/parameters/0/application~1octet-stream',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.false;
        });
      });

      it('should ignore the media type "multipart/form-data" in "/parameters/{n}/content"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateRequest: true,
        });
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/path',
          meta: {
            openApi: {
              parameters: [
                {
                  name: 'param',
                  in: OAParameterLocation.QUERY,
                  content: {
                    [OAMediaType.MULTIPART_FORM_DATA]: {
                      schema: {type: OADataType.STRING},
                    },
                  },
                },
              ],
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/get/~1path/parameters/0/multipart~1form-data',
          '/head/~1path/parameters/0/multipart~1form-data',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.false;
        });
      });

      it('should ignore the media type "application/octet-stream" in "/requestBody/content"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateRequest: true,
        });
        router.defineRoute({
          method: HttpMethod.POST,
          path: '/path',
          meta: {
            openApi: {
              requestBody: {
                content: {
                  [OAMediaType.APPLICATION_OCTET_STREAM]: {
                    schema: {type: OADataType.STRING},
                  },
                },
              },
            },
          },
          handler() {
            return 'OK';
          },
        });
        const res = S.hasCompiledAjvValidator(
          '/post/~1path/requestBody/application~1octet-stream',
        );
        expect(res).to.be.false;
      });

      it('should ignore the media type "multipart/form-data" in "/requestBody/content"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateRequest: true,
        });
        router.defineRoute({
          method: HttpMethod.POST,
          path: '/path',
          meta: {
            openApi: {
              requestBody: {
                content: {
                  [OAMediaType.MULTIPART_FORM_DATA]: {
                    schema: {type: OADataType.STRING},
                  },
                },
              },
            },
          },
          handler() {
            return 'OK';
          },
        });
        const res = S.hasCompiledAjvValidator(
          '/post/~1path/requestBody/multipart~1form-data',
        );
        expect(res).to.be.false;
      });

      it('should not compile validators for "/responses/{statusCode}/content/{mediaType}/schema"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {validateRequest: true});
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/path',
          meta: {
            openApi: {
              responses: {
                200: {
                  description: 'Success response',
                  content: {
                    [OAMediaType.APPLICATION_JSON]: {
                      schema: {type: OADataType.OBJECT},
                    },
                    [OAMediaType.TEXT_PLAIN]: {
                      schema: {type: OADataType.STRING},
                    },
                  },
                },
                default: {
                  description: 'Default response',
                  content: {
                    [OAMediaType.APPLICATION_JSON]: {
                      schema: {type: OADataType.OBJECT},
                    },
                    [OAMediaType.TEXT_PLAIN]: {
                      schema: {type: OADataType.STRING},
                    },
                  },
                },
              },
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/get/~1path/responses/200/application~1json',
          '/get/~1path/responses/200/text~1plain',
          '/get/~1path/responses/default/application~1json',
          '/get/~1path/responses/default/text~1plain',
          '/head/~1path/responses/200/application~1json',
          '/head/~1path/responses/200/text~1plain',
          '/head/~1path/responses/default/application~1json',
          '/head/~1path/responses/default/text~1plain',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.false;
        });
      });

      it('should not compile validators for "#/components/responses/{name}/content/{mediaType}/schema"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateRequest: true,
        });
        const builder = router.getService(OADocumentBuilder);
        builder.defineResponseComponent('success', {
          description: 'Success response',
          content: {
            [OAMediaType.APPLICATION_JSON]: {
              schema: {type: OADataType.OBJECT},
            },
            [OAMediaType.TEXT_PLAIN]: {
              schema: {type: OADataType.STRING},
            },
          },
        });
        builder.defineResponseComponent('default', {
          description: 'Default response',
          content: {
            [OAMediaType.APPLICATION_JSON]: {
              schema: {type: OADataType.OBJECT},
            },
            [OAMediaType.TEXT_PLAIN]: {
              schema: {type: OADataType.STRING},
            },
          },
        });
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/path',
          meta: {
            openApi: {
              responses: {
                200: {$ref: '#/components/responses/success'},
                default: {$ref: '#/components/responses/default'},
              },
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/get/~1path/responses/200/application~1json',
          '/get/~1path/responses/200/text~1plain',
          '/get/~1path/responses/default/application~1json',
          '/get/~1path/responses/default/text~1plain',
          '/head/~1path/responses/200/application~1json',
          '/head/~1path/responses/200/text~1plain',
          '/head/~1path/responses/default/application~1json',
          '/head/~1path/responses/default/text~1plain',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.false;
        });
      });
    });

    describe('when the option "validateResponse" is true', function () {
      it('should compile validators for "/responses/{statusCode}/content/{mediaType}/schema"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateResponse: true,
        });
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/path',
          meta: {
            openApi: {
              responses: {
                200: {
                  description: 'Success response',
                  content: {
                    [OAMediaType.APPLICATION_JSON]: {
                      schema: {type: OADataType.OBJECT},
                    },
                    [OAMediaType.TEXT_PLAIN]: {
                      schema: {type: OADataType.STRING},
                    },
                  },
                },
                default: {
                  description: 'Default response',
                  content: {
                    [OAMediaType.APPLICATION_JSON]: {
                      schema: {type: OADataType.OBJECT},
                    },
                    [OAMediaType.TEXT_PLAIN]: {
                      schema: {type: OADataType.STRING},
                    },
                  },
                },
              },
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/get/~1path/responses/200/application~1json',
          '/get/~1path/responses/200/text~1plain',
          '/get/~1path/responses/default/application~1json',
          '/get/~1path/responses/default/text~1plain',
          '/head/~1path/responses/200/application~1json',
          '/head/~1path/responses/200/text~1plain',
          '/head/~1path/responses/default/application~1json',
          '/head/~1path/responses/default/text~1plain',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.true;
        });
      });

      it('should compile validators for "#/components/responses/{name}/content/{mediaType}/schema', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateResponse: true,
        });
        const builder = router.getService(OADocumentBuilder);
        builder.defineResponseComponent('success', {
          description: 'Success response',
          content: {
            [OAMediaType.APPLICATION_JSON]: {
              schema: {type: OADataType.OBJECT},
            },
            [OAMediaType.TEXT_PLAIN]: {
              schema: {type: OADataType.STRING},
            },
          },
        });
        builder.defineResponseComponent('default', {
          description: 'Default response',
          content: {
            [OAMediaType.APPLICATION_JSON]: {
              schema: {type: OADataType.OBJECT},
            },
            [OAMediaType.TEXT_PLAIN]: {
              schema: {type: OADataType.STRING},
            },
          },
        });
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/path',
          meta: {
            openApi: {
              responses: {
                200: {$ref: '#/components/responses/success'},
                default: {$ref: '#/components/responses/default'},
              },
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/get/~1path/responses/200/application~1json',
          '/get/~1path/responses/200/text~1plain',
          '/get/~1path/responses/default/application~1json',
          '/get/~1path/responses/default/text~1plain',
          '/head/~1path/responses/200/application~1json',
          '/head/~1path/responses/200/text~1plain',
          '/head/~1path/responses/default/application~1json',
          '/head/~1path/responses/default/text~1plain',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.true;
        });
      });

      it('should ignore the media type "application/octet-stream" in "/responses/{statusCode}/content"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateResponse: true,
        });
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/path',
          meta: {
            openApi: {
              responses: {
                200: {
                  description: 'Success response',
                  content: {
                    [OAMediaType.APPLICATION_OCTET_STREAM]: {
                      schema: {type: OADataType.STRING},
                    },
                  },
                },
                default: {
                  description: 'Default response',
                  content: {
                    [OAMediaType.APPLICATION_OCTET_STREAM]: {
                      schema: {type: OADataType.STRING},
                    },
                  },
                },
              },
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/get/~1path/responses/200/application~1octet-stream',
          '/get/~1path/responses/default/application~1octet-stream',
          '/head/~1path/responses/200/application~1octet-stream',
          '/head/~1path/responses/default/application~1octet-stream',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.false;
        });
      });

      it('should ignore the media type "multipart/form-data" in "/responses/{statusCode}/content"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateResponse: true,
        });
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/path',
          meta: {
            openApi: {
              responses: {
                200: {
                  description: 'Success response',
                  content: {
                    [OAMediaType.MULTIPART_FORM_DATA]: {
                      schema: {type: OADataType.STRING},
                    },
                  },
                },
                default: {
                  description: 'Default response',
                  content: {
                    [OAMediaType.MULTIPART_FORM_DATA]: {
                      schema: {type: OADataType.STRING},
                    },
                  },
                },
              },
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/get/~1path/responses/200/multipart~1form-data',
          '/get/~1path/responses/default/multipart~1form-data',
          '/head/~1path/responses/200/multipart~1form-data',
          '/head/~1path/responses/default/multipart~1form-data',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.false;
        });
      });

      it('should not compile the validator for "/parameters/{n}/schema"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateResponse: true,
        });
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/path',
          meta: {
            openApi: {
              parameters: [
                {
                  name: 'param',
                  in: OAParameterLocation.QUERY,
                  schema: {type: OADataType.STRING},
                },
              ],
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/get/~1path/parameters/0',
          '/head/~1path/parameters/0',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.false;
        });
      });

      it('should not compile the validator for "#/components/parameters/{name}/schema"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateResponse: true,
        });
        const builder = router.getService(OADocumentBuilder);
        builder.defineParameterComponent('param', {
          name: 'param',
          in: OAParameterLocation.QUERY,
          schema: {type: OADataType.STRING},
        });
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/path',
          meta: {
            openApi: {
              parameters: [{$ref: '#/components/parameters/param'}],
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/get/~1path/parameters/0',
          '/head/~1path/parameters/0',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.false;
        });
      });

      it('should not compile the validator for "/parameters/{n}/content/{mediaType}/schema"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateResponse: true,
        });
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/path',
          meta: {
            openApi: {
              parameters: [
                {
                  name: 'param',
                  in: OAParameterLocation.QUERY,
                  content: {
                    [OAMediaType.APPLICATION_JSON]: {
                      schema: {type: OADataType.OBJECT},
                    },
                  },
                },
              ],
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/get/~1path/parameters/0/application~1json',
          '/head/~1path/parameters/0/application~1json',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.false;
        });
      });

      it('should not compile the validator for "#/components/parameters/{name}/content/{mediaType}/schema"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateResponse: true,
        });
        const builder = router.getService(OADocumentBuilder);
        builder.defineParameterComponent('param', {
          name: 'param',
          in: OAParameterLocation.QUERY,
          content: {
            [OAMediaType.APPLICATION_JSON]: {
              schema: {type: OADataType.OBJECT},
            },
          },
        });
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/path',
          meta: {
            openApi: {
              parameters: [{$ref: '#/components/parameters/param'}],
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/get/~1path/parameters/0/application~1json',
          '/head/~1path/parameters/0/application~1json',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.false;
        });
      });

      it('should not compile validators for "/requestBody/content/{mediaType}/schema"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateResponse: true,
        });
        router.defineRoute({
          method: HttpMethod.POST,
          path: '/path',
          meta: {
            openApi: {
              requestBody: {
                content: {
                  [OAMediaType.APPLICATION_JSON]: {
                    schema: {type: OADataType.OBJECT},
                  },
                  [OAMediaType.TEXT_PLAIN]: {
                    schema: {type: OADataType.STRING},
                  },
                },
              },
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/post/~1path/requestBody/application~1json',
          '/post/~1path/requestBody/text~1plain',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.false;
        });
      });

      it('should not compile validators for "#/components/requestBodies/{name}/content/{mediaType}/schema"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateResponse: true,
        });
        const builder = router.getService(OADocumentBuilder);
        builder.defineRequestBodyComponent('body', {
          content: {
            [OAMediaType.APPLICATION_JSON]: {
              schema: {type: OADataType.OBJECT},
            },
            [OAMediaType.TEXT_PLAIN]: {
              schema: {type: OADataType.STRING},
            },
          },
        });
        router.defineRoute({
          method: HttpMethod.POST,
          path: '/path',
          meta: {
            openApi: {
              requestBody: {$ref: '#/components/requestBodies/body'},
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/post/~1path/requestBody/application~1json',
          '/post/~1path/requestBody/text~1plain',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.false;
        });
      });
    });

    describe('when "validateRequest" and "validateResponse" options is true', function () {
      it('should compile the validator for "/parameters/{n}/schema"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateRequest: true,
          validateResponse: true,
        });
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/path',
          meta: {
            openApi: {
              parameters: [
                {
                  name: 'param',
                  in: OAParameterLocation.QUERY,
                  schema: {type: OADataType.STRING},
                },
              ],
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/get/~1path/parameters/0',
          '/head/~1path/parameters/0',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.true;
        });
      });

      it('should compile the validator for "#/components/parameters/{name}/schema"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateRequest: true,
          validateResponse: true,
        });
        const builder = router.getService(OADocumentBuilder);
        builder.defineParameterComponent('param', {
          name: 'param',
          in: OAParameterLocation.QUERY,
          schema: {type: OADataType.STRING},
        });
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/path',
          meta: {
            openApi: {
              parameters: [{$ref: '#/components/parameters/param'}],
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/get/~1path/parameters/0',
          '/head/~1path/parameters/0',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.true;
        });
      });

      it('should compile the validator for "/parameters/{n}/content/{mediaType}/schema"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateRequest: true,
          validateResponse: true,
        });
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/path',
          meta: {
            openApi: {
              parameters: [
                {
                  name: 'param',
                  in: OAParameterLocation.QUERY,
                  content: {
                    [OAMediaType.APPLICATION_JSON]: {
                      schema: {type: OADataType.OBJECT},
                    },
                  },
                },
              ],
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/get/~1path/parameters/0/application~1json',
          '/head/~1path/parameters/0/application~1json',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.true;
        });
      });

      it('should compile the validator for "#/components/parameters/{name}/content/{mediaType}/schema"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateRequest: true,
          validateResponse: true,
        });
        const builder = router.getService(OADocumentBuilder);
        builder.defineParameterComponent('param', {
          name: 'param',
          in: OAParameterLocation.QUERY,
          content: {
            [OAMediaType.APPLICATION_JSON]: {
              schema: {type: OADataType.OBJECT},
            },
          },
        });
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/path',
          meta: {
            openApi: {
              parameters: [{$ref: '#/components/parameters/param'}],
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/get/~1path/parameters/0/application~1json',
          '/head/~1path/parameters/0/application~1json',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.true;
        });
      });

      it('should compile validators for "/requestBody/content/{mediaType}/schema"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateRequest: true,
          validateResponse: true,
        });
        router.defineRoute({
          method: HttpMethod.POST,
          path: '/path',
          meta: {
            openApi: {
              requestBody: {
                content: {
                  [OAMediaType.APPLICATION_JSON]: {
                    schema: {type: OADataType.OBJECT},
                  },
                  [OAMediaType.TEXT_PLAIN]: {
                    schema: {type: OADataType.STRING},
                  },
                },
              },
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/post/~1path/requestBody/application~1json',
          '/post/~1path/requestBody/text~1plain',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.true;
        });
      });

      it('should compile validators for "#/components/requestBodies/{name}/content/{mediaType}/schema"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateRequest: true,
          validateResponse: true,
        });
        const builder = router.getService(OADocumentBuilder);
        builder.defineRequestBodyComponent('body', {
          content: {
            [OAMediaType.APPLICATION_JSON]: {
              schema: {type: OADataType.OBJECT},
            },
            [OAMediaType.TEXT_PLAIN]: {
              schema: {type: OADataType.STRING},
            },
          },
        });
        router.defineRoute({
          method: HttpMethod.POST,
          path: '/path',
          meta: {
            openApi: {
              requestBody: {$ref: '#/components/requestBodies/body'},
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/post/~1path/requestBody/application~1json',
          '/post/~1path/requestBody/text~1plain',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.true;
        });
      });

      it('should compile validators for "/responses/{statusCode}/content/{mediaType}/schema"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateRequest: true,
          validateResponse: true,
        });
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/path',
          meta: {
            openApi: {
              responses: {
                200: {
                  description: 'Success response',
                  content: {
                    [OAMediaType.APPLICATION_JSON]: {
                      schema: {type: OADataType.OBJECT},
                    },
                    [OAMediaType.TEXT_PLAIN]: {
                      schema: {type: OADataType.STRING},
                    },
                  },
                },
                default: {
                  description: 'Default response',
                  content: {
                    [OAMediaType.APPLICATION_JSON]: {
                      schema: {type: OADataType.OBJECT},
                    },
                    [OAMediaType.TEXT_PLAIN]: {
                      schema: {type: OADataType.STRING},
                    },
                  },
                },
              },
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/get/~1path/responses/200/application~1json',
          '/get/~1path/responses/200/text~1plain',
          '/get/~1path/responses/default/application~1json',
          '/get/~1path/responses/default/text~1plain',
          '/head/~1path/responses/200/application~1json',
          '/head/~1path/responses/200/text~1plain',
          '/head/~1path/responses/default/application~1json',
          '/head/~1path/responses/default/text~1plain',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.true;
        });
      });

      it('should compile validators for "#/components/responses/{name}/content/{mediaType}/schema', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateRequest: true,
          validateResponse: true,
        });
        const builder = router.getService(OADocumentBuilder);
        builder.defineResponseComponent('success', {
          description: 'Success response',
          content: {
            [OAMediaType.APPLICATION_JSON]: {
              schema: {type: OADataType.OBJECT},
            },
            [OAMediaType.TEXT_PLAIN]: {
              schema: {type: OADataType.STRING},
            },
          },
        });
        builder.defineResponseComponent('default', {
          description: 'Default response',
          content: {
            [OAMediaType.APPLICATION_JSON]: {
              schema: {type: OADataType.OBJECT},
            },
            [OAMediaType.TEXT_PLAIN]: {
              schema: {type: OADataType.STRING},
            },
          },
        });
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/path',
          meta: {
            openApi: {
              responses: {
                200: {$ref: '#/components/responses/success'},
                default: {$ref: '#/components/responses/default'},
              },
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/get/~1path/responses/200/application~1json',
          '/get/~1path/responses/200/text~1plain',
          '/get/~1path/responses/default/application~1json',
          '/get/~1path/responses/default/text~1plain',
          '/head/~1path/responses/200/application~1json',
          '/head/~1path/responses/200/text~1plain',
          '/head/~1path/responses/default/application~1json',
          '/head/~1path/responses/default/text~1plain',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.true;
        });
      });

      it('should ignore the media type "application/octet-stream" in "/parameters/{n}/content"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateRequest: true,
          validateResponse: true,
        });
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/path',
          meta: {
            openApi: {
              parameters: [
                {
                  name: 'param',
                  in: OAParameterLocation.QUERY,
                  content: {
                    [OAMediaType.APPLICATION_OCTET_STREAM]: {
                      schema: {type: OADataType.STRING},
                    },
                  },
                },
              ],
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/get/~1path/parameters/0/application~1octet-stream',
          '/head/~1path/parameters/0/application~1octet-stream',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.false;
        });
      });

      it('should ignore the media type "multipart/form-data" in "/parameters/{n}/content"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateRequest: true,
          validateResponse: true,
        });
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/path',
          meta: {
            openApi: {
              parameters: [
                {
                  name: 'param',
                  in: OAParameterLocation.QUERY,
                  content: {
                    [OAMediaType.MULTIPART_FORM_DATA]: {
                      schema: {type: OADataType.STRING},
                    },
                  },
                },
              ],
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/get/~1path/parameters/0/multipart~1form-data',
          '/head/~1path/parameters/0/multipart~1form-data',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.false;
        });
      });

      it('should ignore the media type "application/octet-stream" in "/requestBody/content"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateRequest: true,
          validateResponse: true,
        });
        router.defineRoute({
          method: HttpMethod.POST,
          path: '/path',
          meta: {
            openApi: {
              requestBody: {
                content: {
                  [OAMediaType.APPLICATION_OCTET_STREAM]: {
                    schema: {type: OADataType.STRING},
                  },
                },
              },
            },
          },
          handler() {
            return 'OK';
          },
        });
        const res = S.hasCompiledAjvValidator(
          '/post/~1path/requestBody/application~1octet-stream',
        );
        expect(res).to.be.false;
      });

      it('should ignore the media type "multipart/form-data" in "/requestBody/content"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateRequest: true,
          validateResponse: true,
        });
        router.defineRoute({
          method: HttpMethod.POST,
          path: '/path',
          meta: {
            openApi: {
              requestBody: {
                content: {
                  [OAMediaType.MULTIPART_FORM_DATA]: {
                    schema: {type: OADataType.STRING},
                  },
                },
              },
            },
          },
          handler() {
            return 'OK';
          },
        });
        const res = S.hasCompiledAjvValidator(
          '/post/~1path/requestBody/multipart~1form-data',
        );
        expect(res).to.be.false;
      });

      it('should ignore the media type "application/octet-stream" in "/responses/{statusCode}/content"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateResponse: true,
        });
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/path',
          meta: {
            openApi: {
              responses: {
                200: {
                  description: 'Success response',
                  content: {
                    [OAMediaType.APPLICATION_OCTET_STREAM]: {
                      schema: {type: OADataType.STRING},
                    },
                  },
                },
                default: {
                  description: 'Default response',
                  content: {
                    [OAMediaType.APPLICATION_OCTET_STREAM]: {
                      schema: {type: OADataType.STRING},
                    },
                  },
                },
              },
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/get/~1path/responses/200/application~1octet-stream',
          '/get/~1path/responses/default/application~1octet-stream',
          '/head/~1path/responses/200/application~1octet-stream',
          '/head/~1path/responses/default/application~1octet-stream',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.false;
        });
      });

      it('should ignore the media type "multipart/form-data" in "/responses/{statusCode}/content"', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterOpenApi, {
          validateResponse: true,
        });
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/path',
          meta: {
            openApi: {
              responses: {
                200: {
                  description: 'Success response',
                  content: {
                    [OAMediaType.MULTIPART_FORM_DATA]: {
                      schema: {type: OADataType.STRING},
                    },
                  },
                },
                default: {
                  description: 'Default response',
                  content: {
                    [OAMediaType.MULTIPART_FORM_DATA]: {
                      schema: {type: OADataType.STRING},
                    },
                  },
                },
              },
            },
          },
          handler() {
            return 'OK';
          },
        });
        const validatorKeys = [
          '/get/~1path/responses/200/multipart~1form-data',
          '/get/~1path/responses/default/multipart~1form-data',
          '/head/~1path/responses/200/multipart~1form-data',
          '/head/~1path/responses/default/multipart~1form-data',
        ];
        validatorKeys.forEach(key => {
          const res = S.hasCompiledAjvValidator(key);
          expect(res).to.be.false;
        });
      });
    });
  });

  describe('request data validation', function () {
    describe('when no options are specified', function () {
      it('should skip request data validation when no metadata is specified', async function () {
        const router = new TrieRouter();
        router.useService(TrieRouterOpenApi);
        const request = createRequestMock({
          method: HttpMethod.GET,
          path: '/',
          query: '?id=test',
        });
        const response = createResponseMock();
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/',
          handler() {
            return 'OK';
          },
        });
        router.requestListener(request, response);
        const res = await response.getBody();
        expect(res).to.be.eq('OK');
      });

      it('should skip validation against "/meta/openApi/parameters/{n}/schema"', async function () {
        const router = new TrieRouter();
        router.useService(TrieRouterOpenApi);
        const request = createRequestMock({
          method: HttpMethod.GET,
          path: '/',
          query: '?foo=bar',
        });
        const response = createResponseMock();
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/',
          meta: {
            openApi: {
              parameters: [
                {
                  name: 'foo',
                  in: OAParameterLocation.QUERY,
                  schema: {type: OADataType.NUMBER},
                },
              ],
            },
          },
          handler(ctx) {
            return ctx.query.foo;
          },
        });
        router.requestListener(request, response);
        const res = await response.getBody();
        expect(res).to.be.eq('bar');
      });

      it('should skip validation against "#/components/parameters/{name}/schema"', async function () {
        const router = new TrieRouter();
        router.useService(TrieRouterOpenApi);
        const builder = router.getService(OADocumentBuilder);
        builder.defineParameterComponent('param', {
          name: 'foo',
          in: OAParameterLocation.QUERY,
          schema: {type: OADataType.NUMBER},
        });
        const request = createRequestMock({
          method: HttpMethod.GET,
          path: '/',
          query: '?foo=bar',
        });
        const response = createResponseMock();
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/',
          meta: {
            openApi: {
              parameters: [{$ref: '#/components/parameters/param'}],
            },
          },
          handler(ctx) {
            return ctx.query.foo;
          },
        });
        router.requestListener(request, response);
        const res = await response.getBody();
        expect(res).to.be.eq('bar');
      });

      it('should skip validation against "/meta/openApi/parameters/{n}/content/{mediaType}/schema"', async function () {
        const router = new TrieRouter();
        router.useService(TrieRouterOpenApi);
        const request = createRequestMock({
          method: HttpMethod.GET,
          path: '/',
          query: '?foo=bar',
        });
        const response = createResponseMock();
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/',
          meta: {
            openApi: {
              parameters: [
                {
                  name: 'foo',
                  in: OAParameterLocation.QUERY,
                  content: {
                    [OAMediaType.TEXT_PLAIN]: {
                      schema: {type: OADataType.NUMBER},
                    },
                  },
                },
              ],
            },
          },
          handler(ctx) {
            return ctx.query.foo;
          },
        });
        router.requestListener(request, response);
        const res = await response.getBody();
        expect(res).to.be.eq('bar');
      });

      it('should skip validation against "#/components/parameters/{name}/content/{mediaType}/schema"', async function () {
        const router = new TrieRouter();
        router.useService(TrieRouterOpenApi);
        const builder = router.getService(OADocumentBuilder);
        builder.defineParameterComponent('param', {
          name: 'foo',
          in: OAParameterLocation.QUERY,
          content: {
            [OAMediaType.TEXT_PLAIN]: {
              schema: {type: OADataType.NUMBER},
            },
          },
        });
        const request = createRequestMock({
          method: HttpMethod.GET,
          path: '/',
          query: '?foo=bar',
        });
        const response = createResponseMock();
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/',
          meta: {
            openApi: {
              parameters: [{$ref: '#/components/parameters/param'}],
            },
          },
          handler(ctx) {
            return ctx.query.foo;
          },
        });
        router.requestListener(request, response);
        const res = await response.getBody();
        expect(res).to.be.eq('bar');
      });

      it('should skip validation against "/meta/openApi/requestBody/content/{mediaType}/schema"', async function () {
        const router = new TrieRouter();
        router.useService(TrieRouterOpenApi);
        const request = createRequestMock({
          method: HttpMethod.POST,
          path: '/',
          body: 'test',
        });
        const response = createResponseMock();
        router.defineRoute({
          method: HttpMethod.POST,
          path: '/',
          meta: {
            openApi: {
              requestBody: {
                content: {
                  [OAMediaType.TEXT_PLAIN]: {
                    schema: {
                      type: OADataType.NUMBER,
                    },
                  },
                },
              },
            },
          },
          handler(ctx) {
            return ctx.body;
          },
        });
        router.requestListener(request, response);
        const res = await response.getBody();
        expect(res).to.be.eq('test');
      });

      it('should skip validation against "#/components/requestBodies/{name}/content/{mediaType}/schema"', async function () {
        const router = new TrieRouter();
        router.useService(TrieRouterOpenApi);
        const builder = router.getService(OADocumentBuilder);
        builder.defineRequestBodyComponent('body', {
          content: {
            [OAMediaType.TEXT_PLAIN]: {
              schema: {
                type: OADataType.NUMBER,
              },
            },
          },
        });
        const request = createRequestMock({
          method: HttpMethod.POST,
          path: '/',
          body: 'test',
        });
        const response = createResponseMock();
        router.defineRoute({
          method: HttpMethod.POST,
          path: '/',
          meta: {
            openApi: {
              requestBody: {$ref: '#/components/requestBodies/body'},
            },
          },
          handler(ctx) {
            return ctx.body;
          },
        });
        router.requestListener(request, response);
        const res = await response.getBody();
        expect(res).to.be.eq('test');
      });
    });

    describe('when the option "validateRequest" is true', function () {
      describe('validation against "/meta/openApi/parameters/{n}/schema"', function () {
        it('should pass validation for the path parameter', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/bar',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/:foo',
            meta: {
              openApi: {
                parameters: [
                  {
                    name: 'foo',
                    in: OAParameterLocation.PATH,
                    schema: {type: OADataType.STRING},
                    required: true,
                  },
                ],
              },
            },
            handler(ctx) {
              return ctx.params.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.eq('bar');
        });

        it('should fail validation for the path parameter', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/bar',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/:foo',
            meta: {
              openApi: {
                parameters: [
                  {
                    name: 'foo',
                    in: OAParameterLocation.PATH,
                    schema: {type: OADataType.NUMBER},
                    required: true,
                  },
                ],
              },
            },
            handler(ctx) {
              return ctx.params.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message: 'Value at "/request/path/foo" must be number.',
            },
          });
        });

        it('should pass validation for the query parameter', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            query: {foo: 'bar'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [
                  {
                    name: 'foo',
                    in: OAParameterLocation.QUERY,
                    schema: {type: OADataType.STRING},
                  },
                ],
              },
            },
            handler(ctx) {
              return ctx.query.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.eq('bar');
        });

        it('should fail validation for the query parameter', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            query: {foo: 'bar'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [
                  {
                    name: 'foo',
                    in: OAParameterLocation.QUERY,
                    schema: {type: OADataType.NUMBER},
                  },
                ],
              },
            },
            handler(ctx) {
              return ctx.query.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message: 'Value at "/request/query/foo" must be number.',
            },
          });
        });

        it('should pass validation for the request header', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            headers: {foo: 'bar'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [
                  {
                    name: 'foo',
                    in: OAParameterLocation.HEADER,
                    schema: {type: OADataType.STRING},
                  },
                ],
              },
            },
            handler(ctx) {
              return ctx.headers.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.eq('bar');
        });

        it('should fail validation for the request header', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            headers: {foo: 'bar'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [
                  {
                    name: 'foo',
                    in: OAParameterLocation.HEADER,
                    schema: {type: OADataType.NUMBER},
                  },
                ],
              },
            },
            handler(ctx) {
              return ctx.headers.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message: 'Value at "/request/headers/foo" must be number.',
            },
          });
        });

        it('should pass validation for the request cookie', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            cookies: {foo: 'bar'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [
                  {
                    name: 'foo',
                    in: OAParameterLocation.COOKIE,
                    schema: {type: OADataType.STRING},
                  },
                ],
              },
            },
            handler(ctx) {
              return ctx.cookies.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.eq('bar');
        });

        it('should fail validation for the request cookie', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            cookies: {foo: 'bar'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [
                  {
                    name: 'foo',
                    in: OAParameterLocation.COOKIE,
                    schema: {type: OADataType.NUMBER},
                  },
                ],
              },
            },
            handler(ctx) {
              return ctx.headers.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message: 'Value at "/request/cookies/foo" must be number.',
            },
          });
        });
      });

      describe('validation against "#/components/parameters/{name}/schema"', function () {
        it('should pass validation for the path parameter', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineParameterComponent('param', {
            name: 'foo',
            in: OAParameterLocation.PATH,
            schema: {type: OADataType.STRING},
            required: true,
          });
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/bar',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/:foo',
            meta: {
              openApi: {
                parameters: [{$ref: '#/components/parameters/param'}],
              },
            },
            handler(ctx) {
              return ctx.params.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.eq('bar');
        });

        it('should fail validation for the path parameter', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineParameterComponent('param', {
            name: 'foo',
            in: OAParameterLocation.PATH,
            schema: {type: OADataType.NUMBER},
            required: true,
          });
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/bar',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/:foo',
            meta: {
              openApi: {
                parameters: [{$ref: '#/components/parameters/param'}],
              },
            },
            handler(ctx) {
              return ctx.params.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message: 'Value at "/request/path/foo" must be number.',
            },
          });
        });

        it('should pass validation for the query parameter', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineParameterComponent('param', {
            name: 'foo',
            in: OAParameterLocation.QUERY,
            schema: {type: OADataType.STRING},
          });
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            query: {foo: 'bar'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [{$ref: '#/components/parameters/param'}],
              },
            },
            handler(ctx) {
              return ctx.query.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.eq('bar');
        });

        it('should fail validation for the query parameter', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineParameterComponent('param', {
            name: 'foo',
            in: OAParameterLocation.QUERY,
            schema: {type: OADataType.NUMBER},
          });
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            query: {foo: 'bar'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [{$ref: '#/components/parameters/param'}],
              },
            },
            handler(ctx) {
              return ctx.query.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message: 'Value at "/request/query/foo" must be number.',
            },
          });
        });

        it('should pass validation for the request header', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineParameterComponent('param', {
            name: 'foo',
            in: OAParameterLocation.HEADER,
            schema: {type: OADataType.STRING},
          });
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            headers: {foo: 'bar'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [{$ref: '#/components/parameters/param'}],
              },
            },
            handler(ctx) {
              return ctx.headers.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.eq('bar');
        });

        it('should fail validation for the request header', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineParameterComponent('param', {
            name: 'foo',
            in: OAParameterLocation.HEADER,
            schema: {type: OADataType.NUMBER},
          });
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            headers: {foo: 'bar'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [{$ref: '#/components/parameters/param'}],
              },
            },
            handler(ctx) {
              return ctx.headers.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message: 'Value at "/request/headers/foo" must be number.',
            },
          });
        });

        it('should pass validation for the request cookie', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineParameterComponent('param', {
            name: 'foo',
            in: OAParameterLocation.COOKIE,
            schema: {type: OADataType.STRING},
          });
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            cookies: {foo: 'bar'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [{$ref: '#/components/parameters/param'}],
              },
            },
            handler(ctx) {
              return ctx.cookies.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.eq('bar');
        });

        it('should fail validation for the request cookie', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineParameterComponent('param', {
            name: 'foo',
            in: OAParameterLocation.COOKIE,
            schema: {type: OADataType.NUMBER},
          });
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            cookies: {foo: 'bar'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [{$ref: '#/components/parameters/param'}],
              },
            },
            handler(ctx) {
              return ctx.headers.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message: 'Value at "/request/cookies/foo" must be number.',
            },
          });
        });
      });

      describe('validation against "/meta/openApi/parameters/{n}/content/{mediaType}/schema"', function () {
        it('should pass validation for the path parameter', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/bar',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/:foo',
            meta: {
              openApi: {
                parameters: [
                  {
                    name: 'foo',
                    in: OAParameterLocation.PATH,
                    required: true,
                    content: {
                      [OAMediaType.TEXT_PLAIN]: {
                        schema: {type: OADataType.STRING},
                      },
                    },
                  },
                ],
              },
            },
            handler(ctx) {
              return ctx.params.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.eq('bar');
        });

        it('should fail validation for the path parameter', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/bar',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/:foo',
            meta: {
              openApi: {
                parameters: [
                  {
                    name: 'foo',
                    in: OAParameterLocation.PATH,
                    required: true,
                    content: {
                      [OAMediaType.TEXT_PLAIN]: {
                        schema: {type: OADataType.NUMBER},
                      },
                    },
                  },
                ],
              },
            },
            handler(ctx) {
              return ctx.params.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message: 'Value at "/request/path/foo" must be number.',
            },
          });
        });

        it('should pass validation for the query parameter', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            query: {foo: 'bar'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [
                  {
                    name: 'foo',
                    in: OAParameterLocation.QUERY,
                    content: {
                      [OAMediaType.TEXT_PLAIN]: {
                        schema: {type: OADataType.STRING},
                      },
                    },
                  },
                ],
              },
            },
            handler(ctx) {
              return ctx.query.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.eq('bar');
        });

        it('should fail validation for the query parameter', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            query: {foo: 'bar'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [
                  {
                    name: 'foo',
                    in: OAParameterLocation.QUERY,
                    content: {
                      [OAMediaType.TEXT_PLAIN]: {
                        schema: {type: OADataType.NUMBER},
                      },
                    },
                  },
                ],
              },
            },
            handler(ctx) {
              return ctx.query.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message: 'Value at "/request/query/foo" must be number.',
            },
          });
        });

        it('should pass validation for the request header', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            headers: {foo: 'bar'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [
                  {
                    name: 'foo',
                    in: OAParameterLocation.HEADER,
                    content: {
                      [OAMediaType.TEXT_PLAIN]: {
                        schema: {type: OADataType.STRING},
                      },
                    },
                  },
                ],
              },
            },
            handler(ctx) {
              return ctx.headers.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.eq('bar');
        });

        it('should fail validation for the request header', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            headers: {foo: 'bar'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [
                  {
                    name: 'foo',
                    in: OAParameterLocation.HEADER,
                    content: {
                      [OAMediaType.TEXT_PLAIN]: {
                        schema: {type: OADataType.NUMBER},
                      },
                    },
                  },
                ],
              },
            },
            handler(ctx) {
              return ctx.headers.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message: 'Value at "/request/headers/foo" must be number.',
            },
          });
        });

        it('should pass validation for the request cookie', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            cookies: {foo: 'bar'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [
                  {
                    name: 'foo',
                    in: OAParameterLocation.COOKIE,
                    content: {
                      [OAMediaType.TEXT_PLAIN]: {
                        schema: {type: OADataType.STRING},
                      },
                    },
                  },
                ],
              },
            },
            handler(ctx) {
              return ctx.cookies.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.eq('bar');
        });

        it('should fail validation for the request cookie', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            cookies: {foo: 'bar'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [
                  {
                    name: 'foo',
                    in: OAParameterLocation.COOKIE,
                    content: {
                      [OAMediaType.TEXT_PLAIN]: {
                        schema: {type: OADataType.NUMBER},
                      },
                    },
                  },
                ],
              },
            },
            handler(ctx) {
              return ctx.headers.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message: 'Value at "/request/cookies/foo" must be number.',
            },
          });
        });

        it('should ignore the media type "application/octet-stream"', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/bar',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/:foo',
            meta: {
              openApi: {
                parameters: [
                  {
                    name: 'foo',
                    in: OAParameterLocation.PATH,
                    required: true,
                    content: {
                      [OAMediaType.APPLICATION_OCTET_STREAM]: {
                        schema: {type: OADataType.NUMBER},
                      },
                    },
                  },
                ],
              },
            },
            handler(ctx) {
              return ctx.params.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.eql('bar');
        });

        it('should ignore the media type "multipart/form-data"', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/bar',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/:foo',
            meta: {
              openApi: {
                parameters: [
                  {
                    name: 'foo',
                    in: OAParameterLocation.PATH,
                    required: true,
                    content: {
                      [OAMediaType.MULTIPART_FORM_DATA]: {
                        schema: {type: OADataType.NUMBER},
                      },
                    },
                  },
                ],
              },
            },
            handler(ctx) {
              return ctx.params.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.eql('bar');
        });

        it('should send an error when parsing of the query parameter fails', async function() {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            query: '?param={"foo":"bar"',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [
                  {
                    name: 'param',
                    in: OAParameterLocation.QUERY,
                    content: {
                      [OAMediaType.APPLICATION_JSON]: {
                        schema: {type: OADataType.OBJECT},
                      },
                    },
                  },
                ],
              },
            },
            handler() {
              throw new Error('Should not be called!');
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message:
                'Unable to parse a value at "/request/query/param" as JSON.',
            },
          });
        });

        it('should send an error when parsing of the request header fails', async function() {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            headers: {param: '{"foo":"bar"'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [
                  {
                    name: 'param',
                    in: OAParameterLocation.HEADER,
                    content: {
                      [OAMediaType.APPLICATION_JSON]: {
                        schema: {type: OADataType.OBJECT},
                      },
                    },
                  },
                ],
              },
            },
            handler() {
              throw new Error('Should not be called!');
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message:
                'Unable to parse a value at "/request/headers/param" as JSON.',
            },
          });
        });

        it('should send an error when parsing of the request cookie fails', async function() {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            cookies: {param: '{"foo":"bar"'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [
                  {
                    name: 'param',
                    in: OAParameterLocation.COOKIE,
                    content: {
                      [OAMediaType.APPLICATION_JSON]: {
                        schema: {type: OADataType.OBJECT},
                      },
                    },
                  },
                ],
              },
            },
            handler() {
              throw new Error('Should not be called!');
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message:
                'Unable to parse a value at "/request/cookies/param" as JSON.',
            },
          });
        });
      });

      describe('validation against "#/components/parameters/{name}/content/{mediaType}/schema"', function () {
        it('should pass validation for the path parameter', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineParameterComponent('param', {
            name: 'foo',
            in: OAParameterLocation.PATH,
            required: true,
            content: {
              [OAMediaType.TEXT_PLAIN]: {
                schema: {type: OADataType.STRING},
              },
            },
          });
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/bar',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/:foo',
            meta: {
              openApi: {
                parameters: [{$ref: '#/components/parameters/param'}],
              },
            },
            handler(ctx) {
              return ctx.params.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.eq('bar');
        });

        it('should fail validation for the path parameter', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineParameterComponent('param', {
            name: 'foo',
            in: OAParameterLocation.PATH,
            required: true,
            content: {
              [OAMediaType.TEXT_PLAIN]: {
                schema: {type: OADataType.NUMBER},
              },
            },
          });
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/bar',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/:foo',
            meta: {
              openApi: {
                parameters: [{$ref: '#/components/parameters/param'}],
              },
            },
            handler(ctx) {
              return ctx.params.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message: 'Value at "/request/path/foo" must be number.',
            },
          });
        });

        it('should pass validation for the query parameter', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineParameterComponent('param', {
            name: 'foo',
            in: OAParameterLocation.QUERY,
            content: {
              [OAMediaType.TEXT_PLAIN]: {
                schema: {type: OADataType.STRING},
              },
            },
          });
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            query: {foo: 'bar'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [{$ref: '#/components/parameters/param'}],
              },
            },
            handler(ctx) {
              return ctx.query.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.eq('bar');
        });

        it('should fail validation for the query parameter', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineParameterComponent('param', {
            name: 'foo',
            in: OAParameterLocation.QUERY,
            content: {
              [OAMediaType.TEXT_PLAIN]: {
                schema: {type: OADataType.NUMBER},
              },
            },
          });
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            query: {foo: 'bar'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [{$ref: '#/components/parameters/param'}],
              },
            },
            handler(ctx) {
              return ctx.query.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message: 'Value at "/request/query/foo" must be number.',
            },
          });
        });

        it('should pass validation for the request header', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineParameterComponent('param', {
            name: 'foo',
            in: OAParameterLocation.HEADER,
            content: {
              [OAMediaType.TEXT_PLAIN]: {
                schema: {type: OADataType.STRING},
              },
            },
          });
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            headers: {foo: 'bar'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [{$ref: '#/components/parameters/param'}],
              },
            },
            handler(ctx) {
              return ctx.headers.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.eq('bar');
        });

        it('should fail validation for the request header', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineParameterComponent('param', {
            name: 'foo',
            in: OAParameterLocation.HEADER,
            content: {
              [OAMediaType.TEXT_PLAIN]: {
                schema: {type: OADataType.NUMBER},
              },
            },
          });
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            headers: {foo: 'bar'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [{$ref: '#/components/parameters/param'}],
              },
            },
            handler(ctx) {
              return ctx.headers.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message: 'Value at "/request/headers/foo" must be number.',
            },
          });
        });

        it('should pass validation for the request cookie', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineParameterComponent('param', {
            name: 'foo',
            in: OAParameterLocation.COOKIE,
            content: {
              [OAMediaType.TEXT_PLAIN]: {
                schema: {type: OADataType.STRING},
              },
            },
          });
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            cookies: {foo: 'bar'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [{$ref: '#/components/parameters/param'}],
              },
            },
            handler(ctx) {
              return ctx.cookies.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.eq('bar');
        });

        it('should fail validation for the request cookie', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineParameterComponent('param', {
            name: 'foo',
            in: OAParameterLocation.COOKIE,
            content: {
              [OAMediaType.TEXT_PLAIN]: {
                schema: {type: OADataType.NUMBER},
              },
            },
          });
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            cookies: {foo: 'bar'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [{$ref: '#/components/parameters/param'}],
              },
            },
            handler(ctx) {
              return ctx.headers.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message: 'Value at "/request/cookies/foo" must be number.',
            },
          });
        });

        it('should ignore the media type "application/octet-stream"', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineParameterComponent('param', {
            name: 'foo',
            in: OAParameterLocation.PATH,
            required: true,
            content: {
              [OAMediaType.APPLICATION_OCTET_STREAM]: {
                schema: {type: OADataType.NUMBER},
              },
            },
          });
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/bar',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/:foo',
            meta: {
              openApi: {
                parameters: [{$ref: '#/components/parameters/param'}],
              },
            },
            handler(ctx) {
              return ctx.params.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.eql('bar');
        });

        it('should ignore the media type "multipart/form-data"', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineParameterComponent('param', {
            name: 'foo',
            in: OAParameterLocation.PATH,
            required: true,
            content: {
              [OAMediaType.MULTIPART_FORM_DATA]: {
                schema: {type: OADataType.NUMBER},
              },
            },
          });
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/bar',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/:foo',
            meta: {
              openApi: {
                parameters: [{$ref: '#/components/parameters/param'}],
              },
            },
            handler(ctx) {
              return ctx.params.foo;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.eql('bar');
        });

        it('should send an error when parsing of the query parameter fails', async function() {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineParameterComponent('param', {
            name: 'param',
            in: OAParameterLocation.QUERY,
            content: {
              [OAMediaType.APPLICATION_JSON]: {
                schema: {type: OADataType.OBJECT},
              },
            },
          });
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            query: '?param={"foo":"bar"',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [{$ref: '#/components/parameters/param'}],
              },
            },
            handler() {
              throw new Error('Should not be called!');
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message:
                'Unable to parse a value at "/request/query/param" as JSON.',
            },
          });
        });

        it('should send an error when parsing of the request header fails', async function() {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineParameterComponent('param', {
            name: 'param',
            in: OAParameterLocation.HEADER,
            content: {
              [OAMediaType.APPLICATION_JSON]: {
                schema: {type: OADataType.OBJECT},
              },
            },
          });
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            headers: {param: '{"foo":"bar"'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [{$ref: '#/components/parameters/param'}],
              },
            },
            handler() {
              throw new Error('Should not be called!');
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message:
                'Unable to parse a value at "/request/headers/param" as JSON.',
            },
          });
        });

        it('should send an error when parsing of the request cookie fails', async function() {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineParameterComponent('param', {
            name: 'param',
            in: OAParameterLocation.COOKIE,
            content: {
              [OAMediaType.APPLICATION_JSON]: {
                schema: {type: OADataType.OBJECT},
              },
            },
          });
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
            cookies: {param: '{"foo":"bar"'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                parameters: [{$ref: '#/components/parameters/param'}],
              },
            },
            handler() {
              throw new Error('Should not be called!');
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message:
                'Unable to parse a value at "/request/cookies/param" as JSON.',
            },
          });
        });
      });

      describe('validation against "/meta/openApi/requestBody/content/{mediaType}/schema"', function () {
        it('should pass validation for the request body', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.POST,
            path: '/',
            body: 'test',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.POST,
            path: '/',
            meta: {
              openApi: {
                requestBody: {
                  content: {
                    [OAMediaType.TEXT_PLAIN]: {
                      schema: {
                        type: OADataType.STRING,
                      },
                    },
                  },
                },
              },
            },
            handler(ctx) {
              return ctx.body;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.eq('test');
        });

        it('should fail validation for the request body', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.POST,
            path: '/',
            body: 'test',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.POST,
            path: '/',
            meta: {
              openApi: {
                requestBody: {
                  content: {
                    [OAMediaType.TEXT_PLAIN]: {
                      schema: {
                        type: OADataType.NUMBER,
                      },
                    },
                  },
                },
              },
            },
            handler(ctx) {
              return ctx.body;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message: 'Value at "/request/body" must be number.',
            },
          });
        });

        it('should ignore the media type "application/octet-stream"', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.POST,
            path: '/',
            body: 'test',
            headers: {'content-type': 'application/octet-stream'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.POST,
            path: '/',
            meta: {
              openApi: {
                requestBody: {
                  content: {
                    [OAMediaType.APPLICATION_OCTET_STREAM]: {
                      schema: {
                        type: OADataType.NUMBER,
                      },
                    },
                  },
                },
              },
            },
            handler(ctx) {
              return ctx.body;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.undefined;
        });

        it('should ignore the media type "multipart/form-data"', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.POST,
            path: '/',
            body: 'test',
            headers: {'content-type': 'multipart/form-data'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.POST,
            path: '/',
            meta: {
              openApi: {
                requestBody: {
                  content: {
                    [OAMediaType.MULTIPART_FORM_DATA]: {
                      schema: {
                        type: OADataType.NUMBER,
                      },
                    },
                  },
                },
              },
            },
            handler(ctx) {
              return ctx.body;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.undefined;
        });

        it('should send an error when a media type in the "content-type" header does not exist in the specification', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.POST,
            path: '/',
            body: 'test',
            headers: {'content-type': 'media/unknown'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.POST,
            path: '/',
            meta: {
              openApi: {
                requestBody: {
                  content: {
                    [OAMediaType.TEXT_PLAIN]: {
                      schema: {
                        type: OADataType.STRING,
                      },
                    },
                  },
                },
              },
            },
            handler(ctx) {
              return ctx.body;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message:
                'Media type "media/unknown" is not supported ' +
                'by the request body specification.',
            },
          });
        });

        it('should send an error when the router cannot parse the request body', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const request = createRequestMock({
            method: HttpMethod.POST,
            path: '/',
            body: 'test',
            headers: {'content-type': 'application/xml'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.POST,
            path: '/',
            meta: {
              openApi: {
                requestBody: {
                  content: {
                    [OAMediaType.APPLICATION_XML]: {
                      schema: {
                        type: OADataType.STRING,
                      },
                    },
                  },
                },
              },
            },
            handler(ctx) {
              return ctx.body;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {message: 'Media type "application/xml" is not supported.'},
          });
        });
      });

      describe('validation against "#/components/requestBodies/{name}/content/{mediaType}/schema"', function () {
        it('should pass validation for the request body', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineRequestBodyComponent('body', {
            content: {
              [OAMediaType.TEXT_PLAIN]: {
                schema: {
                  type: OADataType.STRING,
                },
              },
            },
          });
          const request = createRequestMock({
            method: HttpMethod.POST,
            path: '/',
            body: 'test',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.POST,
            path: '/',
            meta: {
              openApi: {
                requestBody: {
                  $ref: '#/components/requestBodies/body',
                },
              },
            },
            handler(ctx) {
              return ctx.body;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.eq('test');
        });

        it('should fail validation for the request body', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineRequestBodyComponent('body', {
            content: {
              [OAMediaType.TEXT_PLAIN]: {
                schema: {
                  type: OADataType.NUMBER,
                },
              },
            },
          });
          const request = createRequestMock({
            method: HttpMethod.POST,
            path: '/',
            body: 'test',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.POST,
            path: '/',
            meta: {
              openApi: {
                requestBody: {
                  $ref: '#/components/requestBodies/body',
                },
              },
            },
            handler(ctx) {
              return ctx.body;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message: 'Value at "/request/body" must be number.',
            },
          });
        });

        it('should ignore the media type "application/octet-stream"', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineRequestBodyComponent('body', {
            content: {
              [OAMediaType.APPLICATION_OCTET_STREAM]: {
                schema: {
                  type: OADataType.NUMBER,
                },
              },
            },
          });
          const request = createRequestMock({
            method: HttpMethod.POST,
            path: '/',
            body: 'test',
            headers: {'content-type': 'application/octet-stream'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.POST,
            path: '/',
            meta: {
              openApi: {
                requestBody: {
                  $ref: '#/components/requestBodies/body',
                },
              },
            },
            handler(ctx) {
              return ctx.body;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.undefined;
        });

        it('should ignore the media type "multipart/form-data"', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineRequestBodyComponent('body', {
            content: {
              [OAMediaType.MULTIPART_FORM_DATA]: {
                schema: {
                  type: OADataType.NUMBER,
                },
              },
            },
          });
          const request = createRequestMock({
            method: HttpMethod.POST,
            path: '/',
            body: 'test',
            headers: {'content-type': 'multipart/form-data'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.POST,
            path: '/',
            meta: {
              openApi: {
                requestBody: {
                  $ref: '#/components/requestBodies/body',
                },
              },
            },
            handler(ctx) {
              return ctx.body;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.undefined;
        });

        it('should send an error when a media type in the "content-type" header does not exist in the specification', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineRequestBodyComponent('body', {
            content: {
              [OAMediaType.TEXT_PLAIN]: {
                schema: {
                  type: OADataType.STRING,
                },
              },
            },
          });
          const request = createRequestMock({
            method: HttpMethod.POST,
            path: '/',
            body: 'test',
            headers: {'content-type': 'media/unknown'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.POST,
            path: '/',
            meta: {
              openApi: {
                requestBody: {
                  $ref: '#/components/requestBodies/body',
                },
              },
            },
            handler(ctx) {
              return ctx.body;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message:
                'Media type "media/unknown" is not supported ' +
                'by the request body specification.',
            },
          });
        });

        it('should send an error when the router cannot parse the request body', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateRequest: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineRequestBodyComponent('body', {
            content: {
              [OAMediaType.APPLICATION_XML]: {
                schema: {
                  type: OADataType.STRING,
                },
              },
            },
          });
          const request = createRequestMock({
            method: HttpMethod.POST,
            path: '/',
            body: 'test',
            headers: {'content-type': 'application/xml'},
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.POST,
            path: '/',
            meta: {
              openApi: {
                requestBody: {
                  $ref: '#/components/requestBodies/body',
                },
              },
            },
            handler(ctx) {
              return ctx.body;
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {message: 'Media type "application/xml" is not supported.'},
          });
        });
      });

      describe('when the option "parseRequestParameterContent" is true', function () {
        describe('parsing against "/meta/openApi/parameters/{n}/content/{mediaType}"', function () {
          it('should parse "application/json" in the query parameter', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              parseRequestParameterContent: true,
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
              query: '?param={"foo":"bar"}',
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [
                    {
                      name: 'param',
                      in: OAParameterLocation.QUERY,
                      content: {
                        [OAMediaType.APPLICATION_JSON]: {
                          schema: {type: OADataType.OBJECT},
                        },
                      },
                    },
                  ],
                },
              },
              handler(ctx) {
                expect(ctx.query.param).to.be.eql({foo: 'bar'});
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });
        });

        describe('parsing against "#/components/parameters/{name}/content/{mediaType}"', function () {
          it('should parse "application/json" in the query parameter', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              parseRequestParameterContent: true,
            });
            const builder = router.getService(OADocumentBuilder);
            builder.defineParameterComponent('param', {
              name: 'param',
              in: OAParameterLocation.QUERY,
              content: {
                [OAMediaType.APPLICATION_JSON]: {
                  schema: {type: OADataType.OBJECT},
                },
              },
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
              query: '?param={"foo":"bar"}',
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [{$ref: '#/components/parameters/param'}],
                },
              },
              handler(ctx) {
                expect(ctx.query.param).to.be.eql({foo: 'bar'});
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });
        });
      });

      describe('when the option "coerceRequestParameterDataType" is true', function () {
        describe('type coercion against "/meta/openApi/parameters/{n}/schema"', function () {
          it('should coerce types of the query parameter', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              coerceRequestParameterDataType: true,
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
              query: '?param=10',
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [
                    {
                      name: 'param',
                      in: OAParameterLocation.QUERY,
                      schema: {type: OADataType.NUMBER},
                    },
                  ],
                },
              },
              handler(ctx) {
                expect(ctx.query.param).to.be.eq(10);
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });

          it('should coerce types of the request header', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              coerceRequestParameterDataType: true,
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
              headers: {param: '10'},
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [
                    {
                      name: 'param',
                      in: OAParameterLocation.HEADER,
                      schema: {type: OADataType.NUMBER},
                    },
                  ],
                },
              },
              handler(ctx) {
                expect(ctx.headers.param).to.be.eq(10);
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });

          it('should coerce types of the request cookie', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              coerceRequestParameterDataType: true,
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
              cookies: {param: '10'},
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [
                    {
                      name: 'param',
                      in: OAParameterLocation.COOKIE,
                      schema: {type: OADataType.NUMBER},
                    },
                  ],
                },
              },
              handler(ctx) {
                expect(ctx.cookies.param).to.be.eq(10);
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });
        });

        describe('type coercion against "#/components/parameters/{name}/schema"', function () {
          it('should coerce types of the query parameter', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              coerceRequestParameterDataType: true,
            });
            const builder = router.getService(OADocumentBuilder);
            builder.defineParameterComponent('param', {
              name: 'param',
              in: OAParameterLocation.QUERY,
              schema: {type: OADataType.NUMBER},
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
              query: '?param=10',
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [{$ref: '#/components/parameters/param'}],
                },
              },
              handler(ctx) {
                expect(ctx.query.param).to.be.eq(10);
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });

          it('should coerce types of the request header', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              coerceRequestParameterDataType: true,
            });
            const builder = router.getService(OADocumentBuilder);
            builder.defineParameterComponent('param', {
              name: 'param',
              in: OAParameterLocation.HEADER,
              schema: {type: OADataType.NUMBER},
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
              headers: {param: '10'},
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [{$ref: '#/components/parameters/param'}],
                },
              },
              handler(ctx) {
                expect(ctx.headers.param).to.be.eq(10);
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });

          it('should coerce types of the request cookie', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              coerceRequestParameterDataType: true,
            });
            const builder = router.getService(OADocumentBuilder);
            builder.defineParameterComponent('param', {
              name: 'param',
              in: OAParameterLocation.COOKIE,
              schema: {type: OADataType.NUMBER},
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
              cookies: {param: '10'},
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [{$ref: '#/components/parameters/param'}],
                },
              },
              handler(ctx) {
                expect(ctx.cookies.param).to.be.eq(10);
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });
        });

        describe('type coercion against "/meta/openApi/parameters/{n}/content/{mediaType}"', function () {
          it('should coerce types of the query parameter', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              coerceRequestParameterDataType: true,
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
              query: '?param=10',
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [
                    {
                      name: 'param',
                      in: OAParameterLocation.QUERY,
                      content: {
                        [OAMediaType.TEXT_PLAIN]: {
                          schema: {type: OADataType.NUMBER},
                        },
                      },
                    },
                  ],
                },
              },
              handler(ctx) {
                expect(ctx.query.param).to.be.eq(10);
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });

          it('should coerce types of the request header', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              coerceRequestParameterDataType: true,
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
              headers: {param: '10'},
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [
                    {
                      name: 'param',
                      in: OAParameterLocation.HEADER,
                      content: {
                        [OAMediaType.TEXT_PLAIN]: {
                          schema: {type: OADataType.NUMBER},
                        },
                      },
                    },
                  ],
                },
              },
              handler(ctx) {
                expect(ctx.headers.param).to.be.eq(10);
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });

          it('should coerce types of the request cookie', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              coerceRequestParameterDataType: true,
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
              cookies: {param: '10'},
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [
                    {
                      name: 'param',
                      in: OAParameterLocation.COOKIE,
                      content: {
                        [OAMediaType.TEXT_PLAIN]: {
                          schema: {type: OADataType.NUMBER},
                        },
                      },
                    },
                  ],
                },
              },
              handler(ctx) {
                expect(ctx.cookies.param).to.be.eq(10);
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });
        });

        describe('type coercion against "#/components/parameters/{name}/content/{mediaType}"', function () {
          it('should coerce types of the query parameter', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              coerceRequestParameterDataType: true,
            });
            const builder = router.getService(OADocumentBuilder);
            builder.defineParameterComponent('param', {
              name: 'param',
              in: OAParameterLocation.QUERY,
              content: {
                [OAMediaType.TEXT_PLAIN]: {
                  schema: {type: OADataType.NUMBER},
                },
              },
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
              query: '?param=10',
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [{$ref: '#/components/parameters/param'}],
                },
              },
              handler(ctx) {
                expect(ctx.query.param).to.be.eq(10);
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });

          it('should coerce types of the request header', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              coerceRequestParameterDataType: true,
            });
            const builder = router.getService(OADocumentBuilder);
            builder.defineParameterComponent('param', {
              name: 'param',
              in: OAParameterLocation.HEADER,
              content: {
                [OAMediaType.TEXT_PLAIN]: {
                  schema: {type: OADataType.NUMBER},
                },
              },
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
              headers: {param: '10'},
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [{$ref: '#/components/parameters/param'}],
                },
              },
              handler(ctx) {
                expect(ctx.headers.param).to.be.eq(10);
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });

          it('should coerce types of the request cookie', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              coerceRequestParameterDataType: true,
            });
            const builder = router.getService(OADocumentBuilder);
            builder.defineParameterComponent('param', {
              name: 'param',
              in: OAParameterLocation.COOKIE,
              content: {
                [OAMediaType.TEXT_PLAIN]: {
                  schema: {type: OADataType.NUMBER},
                },
              },
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
              cookies: {param: '10'},
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [{$ref: '#/components/parameters/param'}],
                },
              },
              handler(ctx) {
                expect(ctx.cookies.param).to.be.eq(10);
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });
        });
      });

      describe('when the option "coerceRequestBodyDataType" is true', function () {
        describe('type coercion against "/meta/openApi/requestBody/content/{mediaType}/schema"', function () {
          it('should coerce type of the request body', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              coerceRequestBodyDataType: true,
            });
            const request = createRequestMock({
              method: HttpMethod.POST,
              path: '/',
              body: '"10"',
              headers: {'content-type': 'application/json'},
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.POST,
              path: '/',
              meta: {
                openApi: {
                  requestBody: {
                    content: {
                      [OAMediaType.APPLICATION_JSON]: {
                        schema: {
                          type: OADataType.NUMBER,
                        },
                      },
                    },
                  },
                },
              },
              handler(ctx) {
                expect(ctx.body).to.be.eq(10);
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });
        });

        describe('type coercion against "#/components/requestBodies/{name}/content/{mediaType}/schema"', function () {
          it('should coerce type of the request body', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              coerceRequestBodyDataType: true,
            });
            const builder = router.getService(OADocumentBuilder);
            builder.defineRequestBodyComponent('body', {
              content: {
                [OAMediaType.APPLICATION_JSON]: {
                  schema: {
                    type: OADataType.NUMBER,
                  },
                },
              },
            });
            const request = createRequestMock({
              method: HttpMethod.POST,
              path: '/',
              body: '"10"',
              headers: {'content-type': 'application/json'},
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.POST,
              path: '/',
              meta: {
                openApi: {
                  requestBody: {
                    $ref: '#/components/requestBodies/body',
                  },
                },
              },
              handler(ctx) {
                expect(ctx.body).to.be.eq(10);
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });
        });
      });

      describe('when the option "removeAdditionalRequestData" is true', function () {
        describe('removing additional data against "/meta/openApi/parameters/{n}/content/{mediaType}"', function () {
          it('should remove additional data from the query parameter', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              parseRequestParameterContent: true,
              removeAdditionalRequestData: true,
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
              query: '?param={"foo":10,"bar":20}',
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [
                    {
                      name: 'param',
                      in: OAParameterLocation.QUERY,
                      content: {
                        [OAMediaType.APPLICATION_JSON]: {
                          schema: {
                            type: OADataType.OBJECT,
                            additionalProperties: false,
                            properties: {
                              foo: {type: OADataType.NUMBER},
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              },
              handler(ctx) {
                expect(ctx.query.param).to.be.eql({foo: 10});
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });
        });

        describe('removing additional data against "#/components/parameters/{name}/content/{mediaType}"', function () {
          it('should remove additional data from the query parameter', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              parseRequestParameterContent: true,
              removeAdditionalRequestData: true,
            });
            const builder = router.getService(OADocumentBuilder);
            builder.defineParameterComponent('param', {
              name: 'param',
              in: OAParameterLocation.QUERY,
              content: {
                [OAMediaType.APPLICATION_JSON]: {
                  schema: {
                    type: OADataType.OBJECT,
                    additionalProperties: false,
                    properties: {
                      foo: {type: OADataType.NUMBER},
                    },
                  },
                },
              },
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
              query: '?param={"foo":10,"bar":20}',
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [{$ref: '#/components/parameters/param'}],
                },
              },
              handler(ctx) {
                expect(ctx.query.param).to.be.eql({foo: 10});
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });
        });

        describe('removing additional data against "/meta/openApi/requestBody/content/{mediaType}/schema"', function () {
          it('should remove additional data from the request body', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              removeAdditionalRequestData: true,
            });
            const request = createRequestMock({
              method: HttpMethod.POST,
              path: '/',
              body: {foo: 10, bar: 20},
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.POST,
              path: '/',
              meta: {
                openApi: {
                  requestBody: {
                    content: {
                      [OAMediaType.APPLICATION_JSON]: {
                        schema: {
                          type: OADataType.OBJECT,
                          additionalProperties: false,
                          properties: {
                            foo: {type: OADataType.NUMBER},
                          },
                        },
                      },
                    },
                  },
                },
              },
              handler(ctx) {
                expect(ctx.body).to.be.eql({foo: 10});
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });
        });

        describe('removing additional data against "#/components/requestBodies/{name}/content/{mediaType}/schema"', function () {
          it('should remove additional data from the request body', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              removeAdditionalRequestData: true,
            });
            const builder = router.getService(OADocumentBuilder);
            builder.defineRequestBodyComponent('body', {
              content: {
                [OAMediaType.APPLICATION_JSON]: {
                  schema: {
                    type: OADataType.OBJECT,
                    additionalProperties: false,
                    properties: {
                      foo: {type: OADataType.NUMBER},
                    },
                  },
                },
              },
            });
            const request = createRequestMock({
              method: HttpMethod.POST,
              path: '/',
              body: {foo: 10, bar: 20},
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.POST,
              path: '/',
              meta: {
                openApi: {
                  requestBody: {
                    $ref: '#/components/requestBodies/body',
                  },
                },
              },
              handler(ctx) {
                expect(ctx.body).to.be.eql({foo: 10});
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });
        });
      });

      describe('when the option "useDefaultValuesInRequestParameters" is true', function () {
        describe('using default values from "/meta/openApi/parameters/{n}/schema"', function () {
          it('should set default value to the query parameter', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              useDefaultValuesInRequestParameters: true,
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [
                    {
                      name: 'param',
                      in: OAParameterLocation.QUERY,
                      schema: {
                        type: OADataType.NUMBER,
                        default: 10,
                      },
                    },
                  ],
                },
              },
              handler(ctx) {
                expect(ctx.query.param).to.be.eq(10);
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });

          it('should set default value to the request header', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              useDefaultValuesInRequestParameters: true,
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [
                    {
                      name: 'param',
                      in: OAParameterLocation.HEADER,
                      schema: {
                        type: OADataType.NUMBER,
                        default: 10,
                      },
                    },
                  ],
                },
              },
              handler(ctx) {
                expect(ctx.headers.param).to.be.eq(10);
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });

          it('should set default value to the request cookie', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              useDefaultValuesInRequestParameters: true,
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [
                    {
                      name: 'param',
                      in: OAParameterLocation.COOKIE,
                      schema: {
                        type: OADataType.NUMBER,
                        default: 10,
                      },
                    },
                  ],
                },
              },
              handler(ctx) {
                expect(ctx.cookies.param).to.be.eq(10);
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });
        });

        describe('using default values from "#/components/parameters/{name}/schema"', function () {
          it('should set default value to the query parameter', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              useDefaultValuesInRequestParameters: true,
            });
            const builder = router.getService(OADocumentBuilder);
            builder.defineParameterComponent('param', {
              name: 'param',
              in: OAParameterLocation.QUERY,
              schema: {
                type: OADataType.NUMBER,
                default: 10,
              },
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [{$ref: '#/components/parameters/param'}],
                },
              },
              handler(ctx) {
                expect(ctx.query.param).to.be.eq(10);
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });

          it('should set default value to the request header', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              useDefaultValuesInRequestParameters: true,
            });
            const builder = router.getService(OADocumentBuilder);
            builder.defineParameterComponent('param', {
              name: 'param',
              in: OAParameterLocation.HEADER,
              schema: {
                type: OADataType.NUMBER,
                default: 10,
              },
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [{$ref: '#/components/parameters/param'}],
                },
              },
              handler(ctx) {
                expect(ctx.headers.param).to.be.eq(10);
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });

          it('should set default value to the request cookie', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              useDefaultValuesInRequestParameters: true,
            });
            const builder = router.getService(OADocumentBuilder);
            builder.defineParameterComponent('param', {
              name: 'param',
              in: OAParameterLocation.COOKIE,
              schema: {
                type: OADataType.NUMBER,
                default: 10,
              },
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [{$ref: '#/components/parameters/param'}],
                },
              },
              handler(ctx) {
                expect(ctx.cookies.param).to.be.eq(10);
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });
        });

        describe('using default values from "/meta/openApi/parameters/{n}/content/{mediaType}"', function () {
          it('should set default value to the query parameter', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              useDefaultValuesInRequestParameters: true,
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [
                    {
                      name: 'param',
                      in: OAParameterLocation.QUERY,
                      content: {
                        [OAMediaType.TEXT_PLAIN]: {
                          schema: {
                            type: OADataType.NUMBER,
                            default: 10,
                          },
                        },
                      },
                    },
                  ],
                },
              },
              handler(ctx) {
                expect(ctx.query.param).to.be.eq(10);
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });

          it('should set default value to the request header', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              useDefaultValuesInRequestParameters: true,
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [
                    {
                      name: 'param',
                      in: OAParameterLocation.HEADER,
                      content: {
                        [OAMediaType.TEXT_PLAIN]: {
                          schema: {
                            type: OADataType.NUMBER,
                            default: 10,
                          },
                        },
                      },
                    },
                  ],
                },
              },
              handler(ctx) {
                expect(ctx.headers.param).to.be.eq(10);
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });

          it('should set default value to the request cookie', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              useDefaultValuesInRequestParameters: true,
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [
                    {
                      name: 'param',
                      in: OAParameterLocation.COOKIE,
                      content: {
                        [OAMediaType.TEXT_PLAIN]: {
                          schema: {
                            type: OADataType.NUMBER,
                            default: 10,
                          },
                        },
                      },
                    },
                  ],
                },
              },
              handler(ctx) {
                expect(ctx.cookies.param).to.be.eq(10);
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });
        });

        describe('using default values from "#/components/parameters/{name}/content/{mediaType}"', function () {
          it('should set default value to the query parameter', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              useDefaultValuesInRequestParameters: true,
            });
            const builder = router.getService(OADocumentBuilder);
            builder.defineParameterComponent('param', {
              name: 'param',
              in: OAParameterLocation.QUERY,
              content: {
                [OAMediaType.TEXT_PLAIN]: {
                  schema: {
                    type: OADataType.NUMBER,
                    default: 10,
                  },
                },
              },
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [{$ref: '#/components/parameters/param'}],
                },
              },
              handler(ctx) {
                expect(ctx.query.param).to.be.eq(10);
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });

          it('should set default value to the request header', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              useDefaultValuesInRequestParameters: true,
            });
            const builder = router.getService(OADocumentBuilder);
            builder.defineParameterComponent('param', {
              name: 'param',
              in: OAParameterLocation.HEADER,
              content: {
                [OAMediaType.TEXT_PLAIN]: {
                  schema: {
                    type: OADataType.NUMBER,
                    default: 10,
                  },
                },
              },
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [{$ref: '#/components/parameters/param'}],
                },
              },
              handler(ctx) {
                expect(ctx.headers.param).to.be.eq(10);
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });

          it('should set default value to the request cookie', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              useDefaultValuesInRequestParameters: true,
            });
            const builder = router.getService(OADocumentBuilder);
            builder.defineParameterComponent('param', {
              name: 'param',
              in: OAParameterLocation.COOKIE,
              content: {
                [OAMediaType.TEXT_PLAIN]: {
                  schema: {
                    type: OADataType.NUMBER,
                    default: 10,
                  },
                },
              },
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  parameters: [{$ref: '#/components/parameters/param'}],
                },
              },
              handler(ctx) {
                expect(ctx.cookies.param).to.be.eq(10);
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });
        });
      });

      describe('when the option "useDefaultValuesInRequestBody" is true', function () {
        describe('using default values from "/meta/openApi/requestBody/content/{mediaType}/schema"', function () {
          it('should set default value to the request body', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              useDefaultValuesInRequestBody: true,
            });
            const request = createRequestMock({
              method: HttpMethod.POST,
              path: '/',
              body: {},
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.POST,
              path: '/',
              meta: {
                openApi: {
                  requestBody: {
                    content: {
                      [OAMediaType.APPLICATION_JSON]: {
                        schema: {
                          type: OADataType.OBJECT,
                          properties: {
                            prop: {
                              type: OADataType.NUMBER,
                              default: 10,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              handler(ctx) {
                expect(ctx.body).to.be.eql({prop: 10});
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });
        });

        describe('using default values from "#/components/requestBodies/{name}/content/{mediaType}/schema"', function () {
          it('should set default value to the request body', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateRequest: true,
              useDefaultValuesInRequestBody: true,
            });
            const builder = router.getService(OADocumentBuilder);
            builder.defineRequestBodyComponent('body', {
              content: {
                [OAMediaType.APPLICATION_JSON]: {
                  schema: {
                    type: OADataType.OBJECT,
                    properties: {
                      prop: {
                        type: OADataType.NUMBER,
                        default: 10,
                      },
                    },
                  },
                },
              },
            });
            const request = createRequestMock({
              method: HttpMethod.POST,
              path: '/',
              body: {},
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.POST,
              path: '/',
              meta: {
                openApi: {
                  requestBody: {
                    $ref: '#/components/requestBodies/body',
                  },
                },
              },
              handler(ctx) {
                expect(ctx.body).to.be.eql({prop: 10});
                return 'OK';
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(res).to.be.eq('OK');
          });
        });
      });
    });
  });

  describe('response data validation', function () {
    describe('when no options are specified', function () {
      it('should skip response data validation when no metadata is specified', async function () {
        const router = new TrieRouter();
        router.useService(TrieRouterOpenApi);
        const request = createRequestMock({
          method: HttpMethod.GET,
          path: '/',
          query: '?id=test',
        });
        const response = createResponseMock();
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/',
          handler() {
            return 'OK';
          },
        });
        router.requestListener(request, response);
        const res = await response.getBody();
        expect(res).to.be.eq('OK');
      });

      it('should skip validation against "/meta/openApi/responses/{statusCode}/content/{mediaType}/schema"', async function () {
        const router = new TrieRouter();
        router.useService(TrieRouterOpenApi);
        const request = createRequestMock({
          method: HttpMethod.GET,
          path: '/',
        });
        const response = createResponseMock();
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/',
          meta: {
            openApi: {
              responses: {
                200: {
                  description: 'Response',
                  content: {
                    [OAMediaType.TEXT_PLAIN]: {
                      schema: {
                        type: OADataType.NUMBER,
                      },
                    },
                  },
                },
              },
            },
          },
          handler() {
            return 'test';
          },
        });
        router.requestListener(request, response);
        const res = await response.getBody();
        expect(res).to.be.eq('test');
      });

      it('should skip validation against "#/components/responses/{name}/content/{mediaType}/schema"', async function () {
        const router = new TrieRouter();
        router.useService(TrieRouterOpenApi);
        const builder = router.getService(OADocumentBuilder);
        builder.defineResponseComponent('response', {
          description: 'Response',
          content: {
            [OAMediaType.TEXT_PLAIN]: {
              schema: {
                type: OADataType.NUMBER,
              },
            },
          },
        });
        const request = createRequestMock({
          method: HttpMethod.GET,
          path: '/',
        });
        const response = createResponseMock();
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/',
          meta: {
            openApi: {
              responses: {
                200: {$ref: '#/components/responses/response'},
              },
            },
          },
          handler() {
            return 'test';
          },
        });
        router.requestListener(request, response);
        const res = await response.getBody();
        expect(res).to.be.eql('test');
      });
    });

    describe('when the option "validateResponse" is true', function () {
      describe('validation against "/meta/openApi/responses/{statusCode}/content/{mediaType}/schema"', function () {
        it('should pass validation for the response body', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateResponse: true});
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                responses: {
                  200: {
                    description: 'Response',
                    content: {
                      [OAMediaType.TEXT_PLAIN]: {
                        schema: {
                          type: OADataType.STRING,
                        },
                      },
                    },
                  },
                },
              },
            },
            handler() {
              return 'test';
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.eq('test');
        });

        it('should fail validation for the response body', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateResponse: true});
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                responses: {
                  200: {
                    description: 'Response',
                    content: {
                      [OAMediaType.TEXT_PLAIN]: {
                        schema: {
                          type: OADataType.NUMBER,
                        },
                      },
                    },
                  },
                },
              },
            },
            handler() {
              return 'test';
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {message: 'Value at "/response/body" must be number.'},
          });
        });

        it('should ignore the media type "application/octet-stream"', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateResponse: true});
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                responses: {
                  200: {
                    description: 'Response',
                    content: {
                      [OAMediaType.APPLICATION_OCTET_STREAM]: {
                        schema: {
                          type: OADataType.NUMBER,
                        },
                      },
                    },
                  },
                },
              },
            },
            handler(ctx) {
              const data = Buffer.from('test', 'utf-8');
              const mediaType = 'application/octet-stream';
              ctx.response.statusCode = 200;
              ctx.response.setHeader('Content-Type', mediaType);
              ctx.response.setHeader('Content-Length', data.length);
              ctx.response.end(data);
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.eql('test');
        });

        it('should send an error when the status code does not specified in the responses', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateResponse: true});
          const request = createRequestMock({
            method: HttpMethod.POST,
            path: '/path',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.POST,
            path: '/path',
            meta: {
              openApi: {
                responses: {
                  201: {
                    description: 'Response',
                    content: {
                      [OAMediaType.TEXT_PLAIN]: {
                        schema: {
                          type: OADataType.STRING,
                        },
                      },
                    },
                  },
                },
              },
            },
            handler() {
              return 'OK';
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message:
                'Status code 200 is missing for the OpenAPI ' +
                'response definition.',
            },
          });
        });

        it('should use the "default" keyword for the unspecified status code', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateResponse: true});
          const request = createRequestMock({
            method: HttpMethod.POST,
            path: '/path',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.POST,
            path: '/path',
            meta: {
              openApi: {
                responses: {
                  201: {
                    description: 'Response',
                    content: {
                      [OAMediaType.TEXT_PLAIN]: {
                        schema: {
                          type: OADataType.STRING,
                        },
                      },
                    },
                  },
                  default: {
                    description: 'Default response',
                    content: {
                      [OAMediaType.TEXT_PLAIN]: {
                        schema: {
                          type: OADataType.NUMBER,
                        },
                      },
                    },
                  },
                },
              },
            },
            handler() {
              return 'OK';
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message: 'Value at "/response/body" must be number.',
            },
          });
        });

        it('should send an error when parsing of the request body fails', async function() {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateResponse: true});
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                responses: {
                  200: {
                    description: 'Response',
                    content: {
                      [OAMediaType.APPLICATION_JSON]: {
                        schema: {
                          type: OADataType.OBJECT,
                        },
                      },
                    },
                  },
                },
              },
            },
            handler(ctx) {
              ctx.response.setHeader('content-type', 'application/json');
              return '{"foo":"bar"';
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message: 'Unable to parse a value at "/response/body" as JSON.',
            },
          });
        });
      });

      describe('validation against "#/components/responses/{name}/content/{mediaType}/schema"', function () {
        it('should pass validation for the response body', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateResponse: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineResponseComponent('response', {
            description: 'Response',
            content: {
              [OAMediaType.TEXT_PLAIN]: {
                schema: {
                  type: OADataType.STRING,
                },
              },
            },
          });
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                responses: {
                  200: {$ref: '#/components/responses/response'},
                },
              },
            },
            handler() {
              return 'test';
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(res).to.be.eq('test');
        });

        it('should fail validation for the response body', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateResponse: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineResponseComponent('response', {
            description: 'Response',
            content: {
              [OAMediaType.TEXT_PLAIN]: {
                schema: {
                  type: OADataType.NUMBER,
                },
              },
            },
          });
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                responses: {
                  200: {$ref: '#/components/responses/response'},
                },
              },
            },
            handler() {
              return 'test';
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {message: 'Value at "/response/body" must be number.'},
          });
        });

        it('should send an error when parsing of the request body fails', async function() {
          const router = new TrieRouter();
          router.useService(TrieRouterOpenApi, {validateResponse: true});
          const builder = router.getService(OADocumentBuilder);
          builder.defineResponseComponent('response', {
            description: 'Response',
            content: {
              [OAMediaType.APPLICATION_JSON]: {
                schema: {
                  type: OADataType.OBJECT,
                },
              },
            },
          });
          const request = createRequestMock({
            method: HttpMethod.GET,
            path: '/',
          });
          const response = createResponseMock();
          router.defineRoute({
            method: HttpMethod.GET,
            path: '/',
            meta: {
              openApi: {
                responses: {
                  200: {$ref: '#/components/responses/response'},
                },
              },
            },
            handler(ctx) {
              ctx.response.setHeader('content-type', 'application/json');
              return '{"foo":"bar"';
            },
          });
          router.requestListener(request, response);
          const res = await response.getBody();
          expect(JSON.parse(res)).to.be.eql({
            error: {
              message: 'Unable to parse a value at "/response/body" as JSON.',
            },
          });
        });
      });

      describe('when the option "coerceResponseBodyDataType" is true', function () {
        describe('type coercion against "/meta/openApi/responses/{statusCode}/content/{mediaType}/schema"', function() {
          it('should coerce type of the response body', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateResponse: true,
              coerceResponseBodyDataType: true,
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  responses: {
                    200: {
                      description: 'Response',
                      content: {
                        [OAMediaType.APPLICATION_JSON]: {
                          schema: {
                            type: OADataType.OBJECT,
                            properties: {
                              prop: {type: OADataType.NUMBER},
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              handler() {
                return {prop: '10'};
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(JSON.parse(res)).to.be.eql({prop: 10});
          });
        });

        describe('type coercion against "#/components/responses/{name}/content/{mediaType}/schema"', function() {
          it('should coerce type of the response body', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateResponse: true,
              coerceResponseBodyDataType: true,
            });
            const builder = router.getService(OADocumentBuilder);
            builder.defineResponseComponent('response', {
              description: 'Response',
              content: {
                [OAMediaType.APPLICATION_JSON]: {
                  schema: {
                    type: OADataType.OBJECT,
                    properties: {
                      prop: {type: OADataType.NUMBER},
                    },
                  },
                },
              },
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  responses: {
                    200: {
                      $ref: '#/components/responses/response',
                    },
                  },
                },
              },
              handler() {
                return {prop: '10'};
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(JSON.parse(res)).to.be.eql({prop: 10});
          });
        });
      });

      describe('when the option "removeAdditionalResponseData" is true', function () {
        describe('removing additional data against "/meta/openApi/responses/{statusCode}/content/{mediaType}/schema"', function() {
          it('should remove additional data from the response body', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateResponse: true,
              removeAdditionalResponseData: true,
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  responses: {
                    200: {
                      description: 'Response',
                      content: {
                        [OAMediaType.APPLICATION_JSON]: {
                          schema: {
                            type: OADataType.OBJECT,
                            additionalProperties: false,
                            properties: {
                              foo: {type: OADataType.NUMBER},
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              handler() {
                return {foo: 10, bar: 20};
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(JSON.parse(res)).to.be.eql({foo: 10});
          });
        });

        describe('removing additional data against "#/components/responses/{name}/content/{mediaType}/schema"', function() {
          it('should remove additional data from the response body', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateResponse: true,
              removeAdditionalResponseData: true,
            });
            const builder = router.getService(OADocumentBuilder);
            builder.defineResponseComponent('response', {
              description: 'Response',
              content: {
                [OAMediaType.APPLICATION_JSON]: {
                  schema: {
                    type: OADataType.OBJECT,
                    additionalProperties: false,
                    properties: {
                      foo: {type: OADataType.NUMBER},
                    },
                  },
                },
              },
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  responses: {
                    200: {
                      $ref: '#/components/responses/response',
                    },
                  },
                },
              },
              handler() {
                return {foo: 10, bar: 20};
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(JSON.parse(res)).to.be.eql({foo: 10});
          });
        });
      });

      describe('when the option "useDefaultValuesInResponseBody" is true', function () {
        describe('using default values from "/meta/openApi/responses/{statusCode}/content/{mediaType}/schema"', function() {
          it('should set default value to the response body', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateResponse: true,
              useDefaultValuesInResponseBody: true,
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  responses: {
                    200: {
                      description: 'Response',
                      content: {
                        [OAMediaType.APPLICATION_JSON]: {
                          schema: {
                            type: OADataType.OBJECT,
                            properties: {
                              prop: {
                                type: OADataType.NUMBER,
                                default: 10,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              handler() {
                return {};
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(JSON.parse(res)).to.be.eql({prop: 10});
          });
        });

        describe('using default values from "#/components/responses/{name}/content/{mediaType}/schema"', function() {
          it('should set default value to the response body', async function () {
            const router = new TrieRouter();
            router.useService(TrieRouterOpenApi, {
              validateResponse: true,
              useDefaultValuesInResponseBody: true,
            });
            const builder = router.getService(OADocumentBuilder);
            builder.defineResponseComponent('response', {
              description: 'Response',
              content: {
                [OAMediaType.APPLICATION_JSON]: {
                  schema: {
                    type: OADataType.OBJECT,
                    properties: {
                      prop: {
                        type: OADataType.NUMBER,
                        default: 10,
                      },
                    },
                  },
                },
              },
            });
            const request = createRequestMock({
              method: HttpMethod.GET,
              path: '/',
            });
            const response = createResponseMock();
            router.defineRoute({
              method: HttpMethod.GET,
              path: '/',
              meta: {
                openApi: {
                  responses: {
                    200: {
                      $ref: '#/components/responses/response',
                    },
                  },
                },
              },
              handler() {
                return {};
              },
            });
            router.requestListener(request, response);
            const res = await response.getBody();
            expect(JSON.parse(res)).to.be.eql({prop: 10});
          });
        });
      });
    });
  });
});
