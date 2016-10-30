/* rekord-vue 1.4.1 - A rekord binding to Vue.js by Philip Diffenderfer */
// UMD (Universal Module Definition)
(function (root, factory)
{
  if (typeof define === 'function' && define.amd) // jshint ignore:line
  {
    // AMD. Register as an anonymous module.
    define(['Rekord'], function(Rekord) { // jshint ignore:line
      return factory(root, Rekord);
    });
  }
  else if (typeof module === 'object' && module.exports)  // jshint ignore:line
  {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(global, require('Rekord'));  // jshint ignore:line
  }
  else
  {
    // Browser globals (root is window)
    root.Rekord = factory(root, root.Rekord);
  }
}(this, function(global, Rekord, undefined)
{

  var Collection = Rekord.Collection;

  Rekord.replaceMethod( Collection.prototype, 'trigger', function($trigger)
  {
    return function trigger(eventName, args)
    {
      var result = $trigger.apply(this, arguments);
      var ob = this.__ob__;

      if (ob)
      {
        switch (eventName)
        {
          case 'add':
            ob.observeArray(args);
            break;
          case 'adds':
            ob.observeArray(args[0]);
            break;
          case 'reset':
            ob.observeArray(this);
            break;
        }

        ob.dep.notify();
      }

      return result;
    };
  });

  return Rekord;

}));
