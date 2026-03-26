## @e22m4u/js-trie-router-openapi

Модуль создания OpenAPI документа для
[@e22m4u/js-trie-router](https://www.npmjs.com/package/@e22m4u/js-trie-router)

- Генерация OpenAPI 3.1 документа согласно определению маршрутов.
- Валидация OpenAPI схем и компонентов в момент определения.
- Поддержка ссылок `$ref` на зарегистрированные компоненты.

## Содержание

- [Установка](#установка)
- [Использование](#использование)
- [Компоненты и ссылки](#компоненты-и-ссылки)
- [Настройки](#настройки)
- [Тесты](#тесты)
- [Лицензия](#лицензия)

## Установка

```bash
npm install @e22m4u/js-trie-router-openapi
```

Модуль поддерживает ESM и CommonJS стандарты.

*ESM*

```js
import {TrieRouterOpenApi} from '@e22m4u/js-trie-router-openapi';
```

*CommonJS*

```js
const {TrieRouterOpenApi} = require('@e22m4u/js-trie-router-openapi');
```

## Использование

Подключение модуля к маршрутизатору.

```js
import {TrieRouter} from '@e22m4u/js-trie-router';
import {TrieRouterOpenApi} from '@e22m4u/js-trie-router-openapi';

// создание маршрутизатора
const router = new TrieRouter();

// модуль анализирует маршруты в момент их регистрации
// в маршрутизаторе, поэтому подключение модуля должно
// происходить до определения маршрутов
router.useService(TrieRouterOpenApi, {
  document: {
    info: {
      title: 'API Documentation',
      version: '0.0.1',
    },
  },
});
```

Быстрое добавление маршрута в документацию.

```js
router.defineRoute({
  method: HttpMethod.GET,
  path: '/ping',
  meta: {
    // если детальное описание параметров не требуется,
    // можно передать логическое значение true, тогда
    // маршрутизатор автоматически зарегистрирует
    // путь и метод в OpenAPI документе
    openApi: true,
  },
  handler: () => 'pong',
});
```

Определение компонента схемы.

```js
import {OADataType, OADocumentBuilder} from '@e22m4u/js-trie-router-openapi';

// извлечение сборщика документа
const builder = router.getService(OADocumentBuilder);

// определение компонента схемы
builder.defineSchemaComponent('city', {
  type: OADataType.OBJECT,
  properties: {
    id: {
      type: OADataType.STRING,
      format: 'uuid',
    },
    name: {
      type: OADataType.STRING,
      example: 'Moscow',
    },
    population: {
      type: OADataType.NUMBER,
      default: 0,
    },
  },
  required: ['name'],
});
```

Использование компонентов в спецификации маршрута.

```js
import {HttpMethod} from '@e22m4u/js-trie-router';
import {oaSchemaRef, OAMediaType} from '@e22m4u/js-trie-router-openapi';

// определение маршрута
router.defineRoute({
  method: HttpMethod.POST,
  path: '/cities',
  meta: {
    // спецификация
    openApi: {
      summary: 'Create a new city',
      // тело запроса
      requestBody: {
        description: 'Document data',
        required: true,
        content: {
          [OAMediaType.APPLICATION_JSON]: {
            schema: oaSchemaRef('city'), // <= ссылка на компонент
            // создаст {$ref: '#/components/schemas/city'}
          },
        },
      },
      responses: {
        // успешный ответ
        201: {
          description: 'Document created',
          content: {
            [OAMediaType.APPLICATION_JSON]: {
              schema: oaSchemaRef('city'), // <= ссылка на компонент
              // создаст {$ref: '#/components/schemas/city'}
            },
          },
        },
      },
    },
  },
  handler: (ctx) => {
    // ...
  },
});
```

Отдача документации через маршрутизатор.

```js
router.defineRoute({
  method: HttpMethod.GET,
  path: '/openapi.json',
  handler: () => {
    const builder = router.getService(OADocumentBuilder);
    return builder.buildJson();
  },
});
```

Формирование JSON документа.

```js
import {OADocumentBuilder} from '@e22m4u/js-trie-router-openapi';

const builder = router.getService(OADocumentBuilder);

const jsonDoc = builder.buildJson(2);
// первый аргумент указывает количество пробелов
// для каждого уровня вложенности, и может быть
// опущен в целях экономии размера документа

console.log(jsonDoc);
// {
//   "openapi": "3.1.2",
//   "info": {
//     "title": "API Documentation",
//     "version": "0.0.1"
//   },
//   "paths": {
//     "/cities": {
//       "post": {
//         "summary": "Create a new city",
//         "requestBody": {
//           "description": "Document data",
//           "required": true,
//           "content": {
//             "application/json": {
//               "schema": {
//                 "$ref": "#/components/schemas/city"
//               }
//             }
//           }
//         },
//         "responses": {
//           "201": {
//             "description": "Document created",
//             "content": {
//               "application/json": {
//                 "schema": {
//                   "$ref": "#/components/schemas/city"
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   },
//   "components": {
//     "schemas": {
//       "city": { ... }
//     }
//   }
// }
```

## Компоненты и ссылки

OpenAPI позволяет выносить повторяющиеся участки спецификации в общий набор
компонентов. Это делает определения маршрутов и итоговый документ компактными.

Для регистрации компонентов в классе `OADocumentBuilder` предусмотрены
специальные методы, а для формирования ссылок на компоненты используются
функции-утилиты.

```js
import {oaSchemaRef, OADocumentBuilder} from '@e22m4u/js-trie-router-openapi';

// извлечение сборщика из маршрутизатора
const builder = router.get(OADocumentBuilder);

// регистрация компонента схемы соответствющим методом
builder.defineSchemaComponent('mySchema', {type: OADataType.OBJECT});

// создание объекта-ссылки на компонент схемы
const mySchemaRef = oaSchemaRef('mySchema');
console.log(mySchemaRef); // {$ref: '#/components/schemas/mySchema'}
```

### Поддерживаемые типы компонентов

Ниже представлен список доступных типов компонентов. Для каждого из них
указан метод регистрации в объекте `OADocumentBuilder` и соответствующая
функция-утилита для создания `$ref` ссылки.

**Schema**

Метод: `defineSchemaComponent(name, component)`  
Ссылка: `oaSchemaRef(name)`

**Parameter**

Метод: `defineParameterComponent(name, component)`  
Ссылка: `oaParameterRef(name)`

**Request Body**

Метод: `defineRequestBodyComponent(name, component)`  
Ссылка: `oaRequestBodyRef(name)`

**Response**

Метод: `defineResponseComponent(name, component)`  
Ссылка: `oaResponseRef(name)`

**Security Scheme**

Метод: `defineSecuritySchemeComponent(name, component)`  
Ссылка: `oaSecuritySchemeRef(name)`

**Example**

Метод: `defineExampleComponent(name, component)`  
Ссылка: `oaExampleRef(name)`

**Link**

Метод: `defineLinkComponent(name, component)`  
Ссылка: `oaLinkRef(name)`

**Callback**

Метод: `defineCallbackComponent(name, component)`  
Ссылка: `oaCallbackRef(name)`

**Path Item**

Метод: `definePathItemComponent(name, component)`  
Ссылка: `oaPathItemRef(name)`

### Пример использования

Если в маршрутах используется определенный параметр и стандартный ответ,
то их можно зарегистрировать в качестве переиспользуемых компонентов.
В примере ниже определяется компонент параметра `limit` и компонент
ответа сервера `404 Not Found`.

```js
import {
  OADataType,
  OADocumentBuilder,
  OAParameterLocation,
} from '@e22m4u/js-trie-router-openapi';

// извлечение сборщика документа из маршрутизатора
const builder = router.getService(OADocumentBuilder);

// регистрация компонента параметра
builder.defineParameterComponent('limitParam', {
  name: 'limit',
  in: OAParameterLocation.QUERY,
  description: 'Pagination limit',
  schema: {
    type: OADataType.INTEGER,
    default: 10,
  },
});

// регистрация компонента ответа
builder.defineResponseComponent('notFoundResponse', {
  description: 'Resource is not found'
});
```

Теперь можно ссылаться на эти компоненты при определении маршрутов, используя
специальные утилиты, которые автоматически генерируют объект ссылки.

```js
import {HttpMethod} from '@e22m4u/js-trie-router';

import {
  oaResponseRef,
  oaParameterRef,
} from '@e22m4u/js-trie-router-openapi';

router.defineRoute({
  method: HttpMethod.GET,
  path: '/articles',
  meta: {
    openApi: {
      summary: 'Get articles list',
      parameters: [
        oaParameterRef('limitParam'), // <= ссылка на параметр
        // создаст {$ref: '#/components/parameters/limitParam'}
      ],
      responses: {
        200: {
          description: 'Successful response with articles list'
        },
        404: oaResponseRef('notFoundResponse') // <= ссылка на ответ
        // создаст {$ref: '#/components/responses/notFoundResponse'}
      },
    },
  },
  handler: (ctx) => {
    // логика контроллера...
  },
});
```

## Настройки

При подключении данного расширения к маршрутизатору, вторым аргументом можно
определить параметры, как это показано на примере ниже.

```js
import {TrieRouter} from '@e22m4u/js-trie-router';
import {TrieRouterOpenApi} from '@e22m4u/js-trie-router-openapi';

const router = new TrieRouter();

router.useService(TrieRouterOpenApi, {
  document: {
    info: {
      title: 'API Documentation',
      version: '0.0.1',
    },
  },
});
```

### Параметры

- [document](#document)

#### document

Тип: `object`  
По умолчанию: `{info: {title: 'API Documentation', version: '0.0.1'}}`

Позволяет задать базовую структуру OpenAPI документа при инициализации
расширения. Сюда передаются корневые настройки спецификации, список серверов,
глобальные требования безопасности и заранее подготовленные компоненты.

```js
router.useService(TrieRouterOpenApi, {
  document: {
    info: {
      title: 'My Custom API',
      version: '1.2.0',
      description: 'API for managing users and posts',
    },
    servers: [
      {url: 'https://api.example.com/v1'},
    ],
  },
});
```

## Тесты

```bash
npm run test
```

## Лицензия

MIT
