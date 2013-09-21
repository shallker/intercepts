intercepts
==========

Intercepts event with `before` and `after`.


## Installation
```bash
npm install intercepts
```


## Quick Start
```javascript
var intercepts = require('intercepts')

function Users() {
  intercepts(this)

  f(this.before)
  f(this.after)
  f(this.intercepts)

  this.create = function (data, callback, onError) {
    this.intercepts('create', arguments, create)

    function create(done) {
      log('create data', data)

      eq(data.age, 21)
      data.age = 22
      done()
    }

    return this
  }

}

var users = new Users

users.before('create', function (done) {
  log('before create', this)

  var data = this[0]
  eq(data.name, 'jack')
  eq(data.age, 20)
  data.age = 21

  done()
})

users.after('create', function (done) {
  log('after create', this)

  var data = this[0]
  eq(data.name, 'jack')
  eq(data.age, 22)

  done()
})

users.create({name: 'jack', age: 20}, function () {
  log('create successful')
}, function () {
  log('create error')
})
```

## API
```javascript
var intercepts = require('intercepts');
var obj = {};
intercepts(obj);
```

#### obj.before(String name, Function callback)

#### obj.after(String name, Function callback)

#### obj.intercepts(String name, Object arguments, Function itself)


## License

  MIT
