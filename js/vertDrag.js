angular.module('sm-meetApp.vertDrag', []).
directive('draggable', function($document) {
  return function(scope, element, attr) {
    var $sendInfo = $('.hTabs');
    var startY = 0, y = 0, offsetHeight = $sendInfo[0].offsetHeight,
        maxHeight = offsetHeight + $sendInfo[0].offsetTop,
        offsetTop=$sendInfo[0].offsetTop;
    element.on('touchstart', function(event) {
      startY = event.touches[0].screenY - y;
      element.on('touchmove', touchmove);
      element.on('touchend', touchend);
      element.on('click', searchClick);
      $('.map').on('click', mapClick);
    });

    function mapClick(event) {
        var sendInfo = $(".hTabs")
        sendInfo.height(4+"em");
        y=0;
    }

    function searchClick(event) {
      var sendInfo = $(".hTabs")
      var pageHeight = parseFloat($("#map-page").height());
      sendInfo.height(pageHeight+"px");
      y=offsetTop*-1;
    }

    function touchmove(event) {
      event.preventDefault();
      y = event.touches[0].screenY - startY;
      if (y < maxHeight*(-1)) {
        y  = maxHeight*(-1);
        $sendInfo.css({
          height: maxHeight + 'px'
        });
      } else if (y > 0) {
        y = 0;
        $sendInfo.css({
          height: offsetHeight + 'px'
        });
      }
      else {
        $sendInfo.css({
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
