/* rekord-vue 1.4.0 - A rekord binding to Vue.js by Philip Diffenderfer */
(function(global, undefined)
{
  var Rekord = global.Rekord;
  var Collection = Rekord.Collection;
  var replaceMethod = Rekord.replaceMethod;

  replaceMethod( Collection.prototype, 'trigger', function($trigger)
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
            ob.observeArray([args[0]]);
            break;
          case 'adds':
            ob.observeArray(args[0]);
            break;
          case 'reset':
            ob.observeArray(this.slice());
            break;
        }
        ob.dep.notify();
      }
      return result;
    };
  });

})(this);
