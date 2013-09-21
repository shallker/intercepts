var intercepts = require('intercepts')

var obj = {}
intercepts(obj);

obj.before('create', function (next) {
  var args = this;
  var data = args[0];
  var callback = args[1];
  var onError = args[2];

  data.title = 'new title';

  next();
})

obj.create = function (data, callback, onError) {
  this.intercept('create', arguments, create);

  function create() {
    db.collection('users').create(data);
  }

  return this;
}
