import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {ServiceContainer} from '@e22m4u/js-service';
import {HttpMethod, TrieRouter, RouterHookType} from '@e22m4u/js-trie-router';

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
  });
});
