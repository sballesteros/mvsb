function Mvsb(select){

  this.select = select;

  select.addEventListener('change', function(e){
    if(!select.nextElementSibling || !select.nextElementSibling.classList.contains('mvsb-values')){
      select.insertAdjacentHTML('afterend', '<ul class="mvsb-values"><li data-value="' + this.value + '">' + this.value + '<a href="#">&times;</a></li></ul>');
      select.nextElementSibling.addEventListener('click', function(e){
        e.preventDefault();
        if(e.target.tagName === 'A'){
          this.removeChild(e.target.parentNode);
        }
      });
    } else {
      select.nextElementSibling.insertAdjacentHTML('beforeend', '<li data-value="' + this.value + '">' + this.value + '<a href="#">&times;</a></li>');
    }
    this.selectedIndex = 0;
  });

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

if (typeof module !== 'undefined' && module.exports){
  module.exports = Mvsb;
}
