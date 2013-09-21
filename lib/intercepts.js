module.exports = function intercepts(obj) {
  var interception = {};

  function fill(eventname) {
    if (interception[eventname]) return interception[eventname];

    interception[eventname] = {
      'before': [],
      'after': []
    }

    return interception[eventname];
  }

  function executeBefore(eventname, args, done) {
    execute(interception[eventname]['before'] || [], args, done);
  }

  
  function executeAfter(eventname, args, done) {
    execute(interception[eventname]['after'] || [], args, done);
  }

  function execute(callbacks, args, done) {
    var i = -1;

    (function next() {
      i++;
      if (i >= callbacks.length) return done();
      callbacks[i].call(args, next);
    }());
  }

  obj.before = function (eventname, callback) {
    fill(eventname)['before'].push(callback);
    return obj;
  }

  obj.after = function (eventname, callback) {
    fill(eventname)['after'].push(callback);
    return obj;
  }

  obj.intercepts = function (eventname, args, itself) {
    args = [].slice.call(args, 0);

    if (interception[eventname] === undefined) {
      itself.call(args, function () {});
      return obj;
    }

    function doneBefore() {
      itself.call(args, doneSelf);
    }

    function doneSelf() {
      executeAfter(eventname, args, doneAfter);      
    }

    function doneAfter() {

    }

    executeBefore(eventname, args, doneBefore);
    return obj;
  }

  return obj;
}
