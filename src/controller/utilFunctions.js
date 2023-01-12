/* global ccui,cc,GameScene,EndScene */

/* exported utils */

var utils = {
  pad_start: function (string, targetLength, padString) {
    'use strict';

    while (string.length < targetLength) {
      string = padString + string;
    }
    return string;
  },
  handleBtnEvent: function (sender, event, scene_to_be_pushed) {
    'use strict';

    var scene;

    if (event === ccui.Widget.TOUCH_BEGAN) {
      if (scene_to_be_pushed === 'play') {
        scene = new GameScene();
      } else if (scene_to_be_pushed === 'end') {
        scene = new EndScene();
      }

      cc.director.pushScene(scene);
    }
  }
};
