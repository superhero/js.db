# DB

Licence: [MIT](https://opensource.org/licenses/MIT)

---

[![npm version](https://badge.fury.io/js/%40superhero%2Fdb.svg)](https://badge.fury.io/js/%40superhero%2Fdb)

A simple DB interface implementation that reads queries from a file, segregating your code from your queries.

## Install

`npm install @superhero/db`

...or just set the dependency in your `package.json` file:

```json
{
  "dependencies":
  {
    "@superhero/db": "*"
  }
}
```

## Example

```js
const
connections     = 5,
host            = 'mysql.example.com',
user            = 'root',
pass            = 'b4real',
filePath        = '/sql',
fileSuffix      = '.sql',
mysql           = require('mysql'),
Db              = require('@superhero/db'),
AdapterFactory  = require('@superhero/db/adapter/mysql/factory'),
adapterFactory  = new AdapterFactory(),
adapter         = adapterFactory.create(mysql, { connections, host, user, password }),
db              = new Db(adapter, filePath, fileSuffix),
result          = await db.query('file', ['context'])
```

The example above will create a pool with 5 idle connections and query the database with the content from the `/sql/file.sql` file composed with the specified context.
