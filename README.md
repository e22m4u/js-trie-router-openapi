## @e22m4u/js-trie-router-openapi

Модуль OpenAPI документации для
[@e22m4u/js-trie-router](https://www.npmjs.com/package/@e22m4u/js-trie-router)

- Автоматическая генерация OpenAPI 3.1 документации из маршрутов.
- Валидация тела и параметров запроса согласно спецификации.
- Валидация тела ответа согласно спецификации.
- Приведение типов данных в данных запроса и ответа.
- Удаление лишних полей из данных запроса и ответа.
- Подстановка значений по умолчанию согласно схеме.
- Автоматический парсинг *JSON* параметрах запроса.
- Поддержка ссылок `$ref` на зарегистрированные компоненты.
- Валидация схем и компонентов OpenAPI в момент определения.

## Содержание

- [Установка](#установка)
- [Использование](#использование)
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

// подключение расширения
router.useService(TrieRouterOpenApi, {
  document: {
    info: {
      title: 'API Documentation',
      version: '0.0.1',
    },
  },
});
```

Определение компонентов схем, используемых в следующих примерах.

```js
import {OADataType, OADocumentBuilder} from '@e22m4u/js-trie-router-openapi';

const builder = router.getService(OADocumentBuilder);

// данные нового пользователя
builder.defineSchemaComponent('userInput', {
  type: OADataType.OBJECT,
  properties: {
    email: {
      type: OADataType.STRING,
      format: 'email',
    },
    password: {
      type: OADataType.STRING,
    },
  },
  required: ['email', 'password'],
});

// публичные данные пользователя
builder.defineSchemaComponent('userOutput', {
  type: OADataType.OBJECT,
  properties: {
    id: {
      type: OADataType.STRING,
      format: 'uuid',
    },
    email: {
      type: OADataType.STRING,
      format: 'email',
    },
  },
  required: ['id', 'password'],
});
```

Определение метаданных маршрута.

```js
import {HttpMethod} from '@e22m4u/js-trie-router';
import {oaSchemaRef, OAMediaType} from '@e22m4u/js-trie-router-openapi';

router.defineRoute({
  method: HttpMethod.POST,
  path: '/users',
  meta: {
    openApi: {
      summary: 'Create a new user',
      // тело запроса
      requestBody: {
        description: 'Data for the new user',
        required: true,
        content: {
          [OAMediaType.APPLICATION_JSON]: {
            schema: oaSchemaRef('userInput'),
            // ссылка на схему ^^^
          },
        },
      },
      responses: {
        // успешный ответ
        201: {
          description: 'User created',
          content: {
            [OAMediaType.APPLICATION_JSON]: {
              schema: oaSchemaRef('userOutput'),
              // ссылка на схему ^^^
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
//     "/users": {
//       "post": {
//         "summary": "Create a new user",
//         "requestBody": {
//           "description": "Data for the new user",
//           "required": true,
//           "content": {
//             "application/json": {
//               "schema": {
//                 "$ref": "#/components/schemas/userInput"
//               }
//             }
//           }
//         },
//         "responses": {
//           "201": {
//             "description": "User created",
//             "content": {
//               "application/json": {
//                 "schema": {
//                   "$ref": "#/components/schemas/userOutput"
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
//       "userInput": { ... },
//       "userOutput": { ... }
//     }
//   }
// }
```

## Настройки

В момент регистрации данного расширения, вторым аргументом можно определить
параметры, как это показано на примере ниже.

```js
import {TrieRouter} from '@e22m4u/js-trie-router';
import {TrieRouterOpenApi} from '@e22m4u/js-trie-router-openapi';

const router = new TrieRouter();

router.useService(TrieRouterOpenApi, {
  // основные параметры:
  document: {
    info: {
      title: 'API Documentation',
      version: '0.0.1',
    },
  },
  validateRequest: false,
  validateResponse: false,
  // параметры, требующие validateRequest: true
  parseRequestParameterContent: false,
  coerceRequestParameterDataType: false,
  coerceRequestBodyDataType: false,
  removeAdditionalRequestData: false,
  useDefaultValuesInRequestParameters: false,
  useDefaultValuesInRequestBody: false,
  // параметры, требующие validateResponse: true
  coerceResponseBodyDataType: false,
  removeAdditionalResponseData: false,
  useDefaultValuesInResponseBody: false,
});
```

#### validateRequest

Тип: `boolean`.
По умолчанию `false`.

Включает автоматическую проверку входящих параметров и тела запроса на
соответствие описанной OpenAPI схеме. В случае ошибки возвращает ответ
*400 BadRequest*.

- Проверяет данные согласно схеме.
- Приводит типы параметров запроса.

#### validateResponse

Тип: `boolean`.
По умолчанию `false`.

Включает автоматическую проверку исходящих данных, возвращаемых из обработчика
маршрута, на соответствие OpenAPI схеме. В случае ошибки возвращает ответ
*500 InternalServerError*.

## Тесты

```bash
npm run test
```

## Лицензия

MIT
