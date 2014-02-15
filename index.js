var util = require("util");
var events = require("events");

function Mvsb(select){
  events.EventEmitter.call(this);

  var self = this;

  this.select = select;

  select.addEventListener('change', function(e){
    if(!select.nextElementSibling || !select.nextElementSibling.classList.contains('mvsb-values')){
      select.insertAdjacentHTML('afterend', '<ul class="mvsb-values">'+ _createLi(this.value) + '</ul>');
      self.emit('added', this.value);

      //at first creation of ul, add click handler to remove
      select.nextElementSibling.addEventListener('click', function(e){
        e.preventDefault();
        if(e.target.tagName === 'A'){
          var rvalue = e.target.parentNode.getAttribute('data-value');
          this.removeChild(e.target.parentNode);
          self.emit('removed', rvalue);
        }
      });
    } else {
      if(self.values().indexOf(this.value) === -1){        
        select.nextElementSibling.insertAdjacentHTML('beforeend', _createLi(this.value));
        self.emit('added', this.value);
      }
    }
    this.selectedIndex = 0;
  });

};

util.inherits(Mvsb, events.EventEmitter);


Mvsb.prototype.append = function(value){
  var opt;
  var opts = this.select.getElementsByTagName('option');
  for(var i=0; i<opts.length; i++){
    if(opts[i].value === value){
      opt = opts[i];
      break;
    }
  }

  if(opt){
    var ul = this.select.nextElementSibling;
    if(ul && ul.classList.contains('mvsb-values')){
      var lis = ul.getElementsByTagName('li');

      var alreadyIn = false;
      for(var i=0; i<lis.length; i++){
        if(lis[i].getAttribute('data-value') === value){
          alreadyIn = true;
          break;
        };
      }

      if(!alreadyIn){
        ul.insertAdjacentHTML('beforeend', _createLi(value));
      }
    } else {

      //set value and trigger change event so that click handler is added to li
      this.select.value = value;

      var event = document.createEvent('HTMLEvents');
      event.initEvent('change', true, false);
      this.select.dispatchEvent(event);

    }
  }
};

Mvsb.prototype.remove = function(value){
  var opt;
  var opts = this.select.getElementsByTagName('option');
  for(var i=0; i<opts.length; i++){
    if(opts[i].value === value){
      opt = opts[i];
      break;
    }
  }

  if(opt){
    opt.parentNode.removeChild(opt);

    var ul = this.select.nextElementSibling;
    if(ul && ul.classList.contains('mvsb-values')){
      var lis = ul.getElementsByTagName('li');
      var li;
      for(var i=0; i<lis.length; i++){
        if(lis[i].getAttribute('data-value') === value){
          li = lis[i];
          break;
        };
      }

      if(li){
        var event = document.createEvent('HTMLEvents');
        event.initEvent('click', true, false);
        li.lastElementChild.dispatchEvent(event);
      }
    }
  }  

};

Mvsb.prototype.values = function(){
  var values;

  var ul = this.select.nextElementSibling;
  if(ul && ul.classList.contains('mvsb-values')){
    var li = ul.getElementsByTagName('li');
    values = Array.prototype.map.call(li, function(el){
      return el.getAttribute('data-value');
    });
  }

  return values;
};


function _createLi(value){
  return '<li data-value="' + value + '">' + value + '<a href="#">&times;</a></li>';
};


module.exports = Mvsb;
