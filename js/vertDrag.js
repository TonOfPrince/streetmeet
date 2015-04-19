angular.module('sm-meetApp.vertDrag', []).
directive('draggable', function($document) {
  return function(scope, element, attr) {
    var startY = 0, y = 0, offsetHeight = element[0].offsetHeight;
    element.css({
     position: 'relative',
    });
    element.on('touchstart', function(event) {
    // element.on('mousedown', function(event) {
      // Prevent default dragging of selected content
      event.preventDefault();
      startY = event.screenY - y;
      // $document.on('mousemove', mousemove);
      $document.on('touchmove', touchmove);
      // $document.on('mouseup', mouseup);
      $document.on('touchend', touchend);
    });

    function touchmove(event) {
      y = event.screenY - startY;
      if (y > 0) {
        element.css({
          top: 0 + 'px',
          height: offsetHeight + 'px'
        });
      } else {
        element.css({
          top: y + 'px',
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
