var er = function (m) {throw new Error(m)},
    ok = function (x) {if (!x) throw new Error(x + ' is not ok'); return 1;},
    eq = function (x, y) {if (x !== y) er(x + ' not equal ' + y); return 1;},
    mc = function(ox, oy) {for (var i in ox) {if (!eq(ox[i], oy[i])) er(ox[i] + ' not match ' + oy[i])}}
    s = function (x) {eq(Object.prototype.toString.call(x), '[object String]')},
    f = function (x) {eq(Object.prototype.toString.call(x), '[object Function]')},
    a = function (x) {eq(Object.prototype.toString.call(x), '[object Array]')},
    b = function (x) {eq(Object.prototype.toString.call(x), '[object Boolean]')},
    o = function (x) {eq(Object.prototype.toString.call(x), '[object Object]')},
    log = function () {console.log.apply(console, arguments)};

var intercepts = require('../index')

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
