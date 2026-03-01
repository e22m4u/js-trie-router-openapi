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

Доступные параметры:

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

#### validateRequest

Тип: `boolean`  
По умолчанию `false`  

Включает автоматическую проверку входящих параметров и тела запроса на
соответствие описанной OpenAPI схеме. В случае ошибки возвращает ответ
*400 BadRequest*.

#### validateResponse

Тип: `boolean`  
По умолчанию `false`  

Включает автоматическую проверку исходящих данных, возвращаемых из обработчика
маршрута, на соответствие OpenAPI схеме. В случае ошибки возвращает ответ
*500 InternalServerError*.

#### parseRequestParameterContent

Тип: `boolean`  
По умолчанию `false`  
*Требует включенной опции `validateRequest: true`*

Включает автоматический парсинг параметров запроса, если они описаны через
объект `content`. При успешном разборе значение параметра подменяется
в контексте запроса, а при неудаче выбрасывается ошибка.

#### coerceRequestParameterDataType

Тип: `boolean`  
По умолчанию `false`  
*Требует включенной опции `validateRequest: true`*

Включает приведение типов для параметров запроса в соответствии с их схемой.
Например, строковое значение `"10"` будет преобразовано в число `10`.
Преобразованные значения заменяют исходные данные в контексте запроса.

#### coerceRequestBodyDataType

Тип: `boolean`  
По умолчанию `false`  
*Требует включенной опции `validateRequest: true`*

Включает приведение типов для полей объекта и элементов массива внутри
входящего тела запроса. Полезно, если клиент присылает данные в свободном
формате (например, числа в виде строк).

#### coerceResponseBodyDataType

Тип: `boolean`  
По умолчанию `false`  
*Требует включенной опции `validateResponse: true`*

Включает автоматическое приведение типов данных в теле ответа (которое
возвращает обработчик маршрута) к типам, указанным в схеме ответа,
перед отправкой данных клиенту.

#### removeAdditionalRequestData

Тип: `boolean`  
По умолчанию `false`  
*Требует включенной опции `validateRequest: true`*

Удаляет из параметров и тела запроса все свойства, которые явно не описаны
в схеме. Чтобы опция работала для объектов, в их схеме должно быть явно
указано `additionalProperties: false`.

#### removeAdditionalResponseData

Тип: `boolean`  
По умолчанию `false`  
*Требует включенной опции `validateResponse: true`*

Удаляет из тела ответа все поля, которые явно не описаны в схеме. Чтобы
опция работала для объектов, в их схеме должно быть явно указано
`additionalProperties: false`.

#### useDefaultValuesInRequestParameters

Тип: `boolean`  
По умолчанию `false`  
*Требует включенной опции `validateRequest: true`*

Автоматически подставляет значения по умолчанию, указанные через ключевое
слово `default` в схеме параметров запроса. Добавленные значения будут
доступны в контексте запроса.

#### useDefaultValuesInRequestBody

Тип: `boolean`  
По умолчанию `false`  
*Требует включенной опции `validateRequest: true`*

Автоматически заполняет отсутствующие поля во входящем теле запроса значениями
по умолчанию, описанными в схеме с помощью ключевого слова `default`.

#### useDefaultValuesInResponseBody

Тип: `boolean`  
По умолчанию `false`  
*Требует включенной опции `validateResponse: true`*

Автоматически добавляет отсутствующие свойства в возвращаемый объект ответа,
используя значения по умолчанию, указанные в ключевом слове `default` схемы.

## Тесты

```bash
npm run test
```

## Лицензия

MIT
