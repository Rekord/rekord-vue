(function(global, undefined)
{
  var Rekord = global.Rekord;
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

})(this);
