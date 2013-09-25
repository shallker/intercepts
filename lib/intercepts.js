var toString = Object.prototype.toString;

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

  function executeBefore(eventname, args, done, onError) {
    execute(interception[eventname]['before'] || [], args, done, onError);
  }

  
  function executeAfter(eventname, args, done, onError) {
    execute(interception[eventname]['after'] || [], args, done, onError);
  }

  function execute(callbacks, args, done, onError) {
    var i = -1;

    (function next() {
      i++;
      if (i >= callbacks.length) return done();
      callbacks[i].call(args, next, onError);
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

  obj.intercepts = function (eventname, args, itself, onError) {
    args = [].slice.call(args, 0);

    if (interception[eventname] === undefined) {
      itself.call(args, function () {});
      return obj;
    }

    function doneBefore() {
      itself.call(args, doneSelf, onError);
    }

    function doneSelf() {
      executeAfter(eventname, args, doneAfter, onError);
    }

    function doneAfter() {

    }

    executeBefore(eventname, args, doneBefore, onError);
    return obj;
  }

  return obj;
}
