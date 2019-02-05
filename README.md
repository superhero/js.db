# ORM

Licence: [MIT](https://opensource.org/licenses/MIT)

---

[![npm version](https://badge.fury.io/js/%40superhero%2Form.svg)](https://badge.fury.io/js/%40superhero%2Form)

A simple ORM implementation that reads sql queries from file.

## Install

`npm install @superhero/orm`

...or just set the dependency in your `package.json` file:

```json
{
  "dependencies":
  {
    "@superhero/orm": "*"
  }
}
```

## Example

```js
const
connections = 5,
host        = 'mysql.example.com',
user        = 'root',
pass        = 'b4real',
filePath    = '/sql',
mysql       = require('mysql'),
ORM         = require('@superhero/orm'),
Adaptor     = require('@superhero/orm/adaptor/mysql'),
adaptor     = Adapter.from(mysql, { connections, host, user, password }),
orm         = new ORM(adaptor, filePath),
result      = await orm.query('file', ['context'])
```

The example above will create a pool with 5 idle connections and query the database with the content from the `/sql/file.sql` file composed with the specified context.
