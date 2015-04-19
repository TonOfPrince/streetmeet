angular.module('sm-meetApp.vertDrag', []).
directive('draggable', function($document) {
  return function(scope, element, attr) {
    var startY = 0, y = 0, offsetHeight = element[0].offsetHeight,
        maxHeight = offsetHeight + element[0].offsetTop;
    console.log(element);
    element.css({
     // position: 'relative',
    });
    element.on('touchstart', function(event) {
      console.log(event);
    // element.on('mousedown', function(event) {
      // Prevent default dragging of selected content
      event.preventDefault();
      startY = event.touches[0].screenY - y;
      // $document.on('mousemove', mousemove);
      $document.on('touchmove', touchmove);
      // $document.on('mouseup', mouseup);
      $document.on('touchend', touchend);
    });

    function touchmove(event) {
      y = event.touches[0].screenY - startY;
      console.log(y);
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
