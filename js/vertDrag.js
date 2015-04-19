angular.module('sm-meetApp.vertDrag', []).
directive('draggable', function($document) {
  return function(scope, element, attr) {
    var startY = 0, y = 0, offsetHeight = element[0].offsetHeight,
        maxHeight = offsetHeight + element[0].offsetTop;
    element.on('touchstart', function(event) {
      startY = event.touches[0].screenY - y;
      $document.on('touchmove', touchmove);
      $document.on('touchend', touchend);
    });

    function touchmove(event) {
      event.preventDefault();
      y = event.touches[0].screenY - startY;

      if (y < maxHeight*(-1)) {
        y  = maxHeight*(-1);
        element.css({
          height: maxHeight + 'px'
        });
      } else if (y > 0) {
        y = 0;
        element.css({
          height: offsetHeight + 'px'
        });
      }
      else {
        element.css({
          height: offsetHeight-y + 'px'
        });
      }
    }

    function touchend() {
      $document.off('touchmove', touchmove);
      $document.off('touchend', touchend);
    }
  };
});
