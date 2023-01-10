"use strict";

var utils = {
    pad_start: function (string, targetLength, padString) {
        while (string.length < targetLength) {
            string = padString + string;
        }
        return string;
    },
    handleBtnEvent: function (sender, event, scene_to_be_pushed) {
        if (event === ccui.Widget.TOUCH_BEGAN) {
            if (scene_to_be_pushed === "play") {
                var scene = new GameScene();
            } else if (scene_to_be_pushed === "end") {
                var scene = new EndScene();
            }

            cc.director.pushScene(scene);
        }
    },
}