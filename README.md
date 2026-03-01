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

При подключении данного расширения к маршрутизатору, вторым аргументом можно
определить параметры, как это показано на примере ниже.

```js
import {TrieRouter} from '@e22m4u/js-trie-router';
import {TrieRouterOpenApi} from '@e22m4u/js-trie-router-openapi';

const router = new TrieRouter();

router.useService(TrieRouterOpenApi, {
  // параметры:
  document: {
    info: {
      title: 'API Documentation',
      version: '0.0.1',
    },
  },
  validateRequest: false,
  validateResponse: false,
  // ...
});
```

### Порядок объявления компонентов и маршрутов

При включении валидации параметром `validateRequest` или `validateResponse`,
для достижения максимальной производительности и экономии оперативной памяти,
маршрутизатор кэширует глобальный словарь OpenAPI-компонентов.

Кэширование происходит в момент регистрации первого маршрута. Данный подход
требует соблюдения строгого порядка инициализации приложения. Все глобальные
компоненты должны быть добавлены до регистрации первого маршрута.

```js
const builder = router.getService(OADocumentBuilder);

// 1. сначала объявляются все схемы и компоненты
builder.defineSchemaComponent('user', {/* ... */});
builder.defineSchemaComponent('post', {/* ... */});

// 2. только после этого регистрируются маршруты
router.defineRoute({path: '/users', /* ... */});
router.defineRoute({path: '/posts', /* ... */});
```

### Параметры

- [document](#document)
- [validateRequest](#validaterequest)
- [validateResponse](#validateresponse)
- [parseRequestParameterContent](#parserequestparametercontent)
- [coerceRequestParameterDataType](#coercerequestparameterdatatype)
- [coerceRequestBodyDataType](#coercerequestbodydatatype)
- [coerceResponseBodyDataType](#coerceresponsebodydatatype)
- [removeAdditionalRequestData](#removeadditionalrequestdata)
- [removeAdditionalResponseData](#removeadditionalresponsedata)
- [useDefaultValuesInRequestParameters](#usedefaultvaluesinrequestparameters)
- [useDefaultValuesInRequestBody](#usedefaultvaluesinrequestbody)
- [useDefaultValuesInResponseBody](#usedefaultvaluesinresponsebody)

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

#### validateRequest

Тип: `boolean`  
По умолчанию `false`  

Включает автоматическую проверку входящих параметров и тела запроса на
соответствие описанной OpenAPI схеме. В случае ошибки возвращает ответ
*400 BadRequest*.

```js
router.useService(TrieRouterOpenApi, {
  validateRequest: true,
});

router.defineRoute({
  method: HttpMethod.GET,
  path: '/items',
  meta: {
    openApi: {
      parameters: [{
        name: 'sort',
        in: OAParameterLocation.QUERY,
        schema: { 
          type: OADataType.STRING, 
          enum: ['asc', 'desc'], // только два конкретных значения
        },
      }],
    },
  },
  handler(ctx) { /* ... */ },
});

// если клиент отправит GET /items?sort=invalid
// маршрутизатор прервет запрос и вернет ошибку:
// 400 Bad Request:
// Value at "/request/query/sort" must be equal to one of the allowed values.
```

#### validateResponse

Тип: `boolean`  
По умолчанию `false`  

Включает автоматическую проверку исходящих данных, возвращаемых из обработчика
маршрута, на соответствие OpenAPI схеме. В случае ошибки возвращает ответ
*500 InternalServerError*.

```js
router.useService(TrieRouterOpenApi, {
  validateResponse: true,
});

router.defineRoute({
  method: HttpMethod.GET,
  path: '/count',
  meta: {
    openApi: {
      responses: {
        200: {
          description: 'Total count',
          content: {
            [OAMediaType.APPLICATION_JSON]: {
              schema: {type: OADataType.NUMBER},
            },
          },
        },
      },
    },
  },
  handler() {
    return "10"; 
    // так как схема ожидает число, но возвращается строка,
    // маршрутизатор автоматически перехватит ответ
    // и вернет клиенту 500 Internal Server Error
  }
});
```

#### parseRequestParameterContent

Тип: `boolean`  
По умолчанию `false`  
*Требует включенной опции `validateRequest: true`*

Включает автоматический парсинг параметров запроса, если они описаны через
объект `content`. При успешном разборе значение параметра подменяется
в контексте запроса, а при неудаче выбрасывается ошибка.

```js
router.useService(TrieRouterOpenApi, {
  validateRequest: true,
  parseRequestParameterContent: true,
});

router.defineRoute({
  method: HttpMethod.GET,
  path: '/search',
  meta: {
    openApi: {
      parameters: [{
        name: 'filter',
        in: OAParameterLocation.QUERY,
        content: {
          [OAMediaType.APPLICATION_JSON]: {
            schema: {type: OADataType.OBJECT},
          },
        },
      }],
    },
  },
  handler(ctx) {
    // при запросе GET /search?filter={"active":true}
    // строка автоматически приводится к объекту
    console.log(ctx.query.filter); // {active: true}
  },
});
```

#### coerceRequestParameterDataType

Тип: `boolean`  
По умолчанию `false`  
*Требует включенной опции `validateRequest: true`*

Включает приведение типов для параметров запроса в соответствии с их схемой.
Например, строковое значение `"10"` будет преобразовано в число `10`.
Преобразованные значения заменяют исходные данные в контексте запроса.

```js
router.useService(TrieRouterOpenApi, {
  validateRequest: true,
  coerceRequestParameterDataType: true,
});

router.defineRoute({
  method: HttpMethod.GET,
  path: '/users/:id',
  meta: {
    openApi: {
      parameters: [{
        name: 'id',
        in: OAParameterLocation.PATH,
        schema: {type: OADataType.NUMBER},
      }],
    },
  },
  handler(ctx) {
    // при запросе GET /users/123
    // без данной опции, значение параметра ctx.params.id
    // было бы строкой "123", но с включенной опцией значение
    // приводится к числу согласно указанному типу
    console.log(typeof ctx.params.id); // "number"
  }
});
```

#### coerceRequestBodyDataType

Тип: `boolean`  
По умолчанию `false`  
*Требует включенной опции `validateRequest: true`*

Включает приведение типов для полей объекта и элементов массива внутри
входящего тела запроса. Полезно, если клиент присылает данные в свободном
формате (например, числа в виде строк).

```js
router.useService(TrieRouterOpenApi, {
  validateRequest: true,
  coerceRequestBodyDataType: true,
});

router.defineRoute({
  method: HttpMethod.POST,
  path: '/items',
  meta: {
    openApi: {
      requestBody: {
        content: {
          [OAMediaType.APPLICATION_JSON]: {
            schema: {
              type: OADataType.OBJECT,
              properties: {
                count: {type: OADataType.NUMBER},
              },
            },
          },
        },
      },
    },
  },
  handler(ctx) {
    // если клиент пришлет JSON {"count": "42"},
    // значение "42" (строка) станет числом 42
    console.log(typeof ctx.body.count); // "number"
  }
});
```

#### coerceResponseBodyDataType

Тип: `boolean`  
По умолчанию `false`  
*Требует включенной опции `validateResponse: true`*

Включает автоматическое приведение типов данных в теле ответа (которое
возвращает обработчик маршрута) к типам, указанным в схеме ответа,
перед отправкой данных клиенту.

```js
router.useService(TrieRouterOpenApi, {
  validateResponse: true,
  coerceResponseBodyDataType: true,
});

router.defineRoute({
  method: HttpMethod.GET,
  path: '/stats',
  meta: {
    openApi: {
      responses: {
        200: {
          description: 'Stats',
          content: {
            [OAMediaType.APPLICATION_JSON]: {
              schema: {
                type: OADataType.OBJECT,
                properties: {
                  total: {type: OADataType.NUMBER},
                },
              },
            },
          },
        },
      },
    },
  },
  handler: () => {
    // обработчик возвращает значение свойства как строку
    return {total: "150"};
    // перед отправкой клиенту строка "150" будет
    // автоматически приведена к числу 150 согласно схеме
  }
});
```

#### removeAdditionalRequestData

Тип: `boolean`  
По умолчанию `false`  
*Требует включенной опции `validateRequest: true`*

Удаляет из параметров и тела запроса все свойства, которые явно не описаны
в схеме. Чтобы опция работала для объектов, в их схеме должно быть явно
указано `additionalProperties: false`.

```js
router.useService(TrieRouterOpenApi, {
  validateRequest: true,
  removeAdditionalRequestData: true,
});

router.defineRoute({
  method: HttpMethod.POST,
  path: '/login',
  meta: {
    openApi: {
      requestBody: {
        content: {
          [OAMediaType.APPLICATION_JSON]: {
            schema: {
              type: OADataType.OBJECT,
              properties: {
                username: {type: OADataType.STRING},
              },
              additionalProperties: false, // обязательное условие
            },
          },
        },
      },
    },
  },
  handler(ctx) {
    // если клиент отправит {"username": "admin", "role": "root"},
    // поле "role" будет вырезано до входа в обработчик, так как
    // схема объекта исключает дополнительные поля
    console.log(ctx.body); // {username: "admin"}
  },
});
```

#### removeAdditionalResponseData

Тип: `boolean`  
По умолчанию `false`  
*Требует включенной опции `validateResponse: true`*

Удаляет из тела ответа все поля, которые явно не описаны в схеме. Чтобы
опция работала для объектов, в их схеме должно быть явно указано
`additionalProperties: false`.

```js
router.useService(TrieRouterOpenApi, {
  validateResponse: true,
  removeAdditionalResponseData: true,
});

router.defineRoute({
  method: HttpMethod.GET,
  path: '/profile',
  meta: {
    openApi: {
      responses: {
        200: {
          description: 'Profile data',
          content: {
            [OAMediaType.APPLICATION_JSON]: {
              schema: {
                type: OADataType.OBJECT,
                properties: {
                  username: {type: OADataType.STRING},
                },
                additionalProperties: false, // обязательное условие
              },
            },
          },
        },
      },
    },
  },
  handler() {
    // обработчик может извлекать из базы чувствительные данные
    return {username: "admin", passwordHash: "secret123"};
    // клиент получит только {"username": "admin"},
    // поле "passwordHash" автоматически удаляется
  },
});
```

#### useDefaultValuesInRequestParameters

Тип: `boolean`  
По умолчанию `false`  
*Требует включенной опции `validateRequest: true`*

Автоматически подставляет значения по умолчанию, указанные через ключевое
слово `default` в схеме параметров запроса. Добавленные значения будут
доступны в контексте запроса.

```js
router.useService(TrieRouterOpenApi, {
  validateRequest: true,
  useDefaultValuesInRequestParameters: true,
});

router.defineRoute({
  method: HttpMethod.GET,
  path: '/items',
  meta: {
    openApi: {
      parameters: [{
        name: 'limit',
        in: OAParameterLocation.QUERY,
        schema: {
          type: OADataType.NUMBER,
          default: 20,
        },
      }],
    },
  },
  handler(ctx) {
    // при запросе GET /items (без передачи ?limit=...)
    // значение по умолчанию подставится автоматически
    console.log(ctx.query.limit); // 20
  },
});
```

#### useDefaultValuesInRequestBody

Тип: `boolean`  
По умолчанию `false`  
*Требует включенной опции `validateRequest: true`*

Автоматически заполняет отсутствующие поля во входящем теле запроса значениями
по умолчанию, описанными в схеме с помощью ключевого слова `default`.

```js
router.useService(TrieRouterOpenApi, {
  validateRequest: true,
  useDefaultValuesInRequestBody: true,
});

router.defineRoute({
  method: HttpMethod.POST,
  path: '/users',
  meta: {
    openApi: {
      requestBody: {
        content: {
          [OAMediaType.APPLICATION_JSON]: {
            schema: {
              type: OADataType.OBJECT,
              properties: {
                name: {type: OADataType.STRING},
                active: {type: OADataType.BOOLEAN, default: true},
              },
            },
          },
        },
      },
    },
  },
  handler: (ctx) => {
    // если клиент отправит лишь {"name": "John"},
    // свойство "active" получит значение по умолчанию
    console.log(ctx.body); // {name: "John", active: true}
  },
});
```

#### useDefaultValuesInResponseBody

Тип: `boolean`  
По умолчанию `false`  
*Требует включенной опции `validateResponse: true`*

Автоматически добавляет отсутствующие свойства в возвращаемый объект ответа,
используя значения по умолчанию, указанные в ключевом слове `default` схемы.

```js
router.useService(TrieRouterOpenApi, {
  validateResponse: true,
  useDefaultValuesInResponseBody: true,
});

router.defineRoute({
  method: HttpMethod.GET,
  path: '/data',
  meta: {
    openApi: {
      responses: {
        200: {
          description: 'Data response',
          content: {
            [OAMediaType.APPLICATION_JSON]: {
              schema: {
                type: OADataType.OBJECT,
                properties: {
                  items: {type: OADataType.ARRAY},
                  status: {type: OADataType.STRING, default: "success"},
                },
              },
            },
          },
        },
      },
    },
  },
  handler() {
    // обработчик возвращает неполный объект
    return {items: [1, 2, 3]};
    // клиент в итоге получит:
    // {"items": [1, 2, 3], "status": "success"}
  },
});
```

## Тесты

```bash
npm run test
```

## Лицензия

MIT
