# MySQL

Licence: [MIT](https://opensource.org/licenses/MIT)

---

[![npm version](https://badge.fury.io/js/%40superhero%2Fmysql.svg)](https://badge.fury.io/js/%40superhero%2Fmysql)

A wrapper for the mysql module that allows to load queries from a file and returns a promise on querying the database.

## Install

`npm install @superhero/mysql`

...or just set the dependency in your `package.json` file:

```json
{
  "dependencies":
  {
    "@superhero/mysql": "*"
  }
}
```

## Example

```js
const
connections = 5,
host        = mysql.example.com,
user        = 'root',
pass        = 'b4real',
filePath    = '/sql',
MySQL       = require('@superhero/mysql'),
mysql       = new MySQL(connections, host, user, pass, filePath),
result      = await mysql.query('file', [ 'context' ])
```

The example above will load the mysql module, create a pool with 5 idle connections and query the database with the content from the `/sql/file.sql` file composed with the specified context.
