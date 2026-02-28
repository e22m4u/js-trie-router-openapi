import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {trieRouterPathToOpenApiPath} from './trie-router-path-to-openapi-path.js';

describe('trieRouterPathToOpenApiPath', function () {
  it('should require the parameter "path" to be a String', function () {
    const throwable = v => () => trieRouterPathToOpenApiPath(v);
    const error = s =>
      format('Parameter "path" must be a String, but %s was given.', s);
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable(undefined)).to.throw(error('undefined'));
    expect(throwable(null)).to.throw(error('null'));
  });

  it('should return a string without parameters as is', function () {
    expect(trieRouterPathToOpenApiPath('')).to.be.eql('');
    expect(trieRouterPathToOpenApiPath('/')).to.be.eql('/');
    expect(trieRouterPathToOpenApiPath('/path')).to.be.eql('/path');
    expect(trieRouterPathToOpenApiPath('/a/b/c')).to.be.eql('/a/b/c');
  });

  it('should convert path parameters from colon-style to curly-braces-style', function () {
    expect(trieRouterPathToOpenApiPath(':id')).to.be.eql('{id}');
    expect(trieRouterPathToOpenApiPath('/:id')).to.be.eql('/{id}');
    expect(trieRouterPathToOpenApiPath('/path/:id')).to.be.eql('/path/{id}');
    expect(trieRouterPathToOpenApiPath('/a/:b/:c')).to.be.eql('/a/{b}/{c}');
    expect(trieRouterPathToOpenApiPath('/a/:b/c/:d')).to.be.eql('/a/{b}/c/{d}');
    expect(trieRouterPathToOpenApiPath('/:a-:b')).to.be.eql('/{a}-{b}');
  });
});
