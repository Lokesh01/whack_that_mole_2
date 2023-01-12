/* global utils,ccui,cc,res */

var initialized_start_scene = false,
  FirstLayer,
  FirstScene;

FirstLayer = cc.Layer.extend({
  sprite: null,
  ctor: function () {
    'use strict';

    var size = cc.winSize,
     play_btn;

    this._super();

    // adding sprite
    this.sprite = new cc.Sprite(res.title_screen_png);
    this.sprite.attr({
      x: size.width / 2,
      y: size.height / 2
    });
    this.sprite.setScale(2);
    this.addChild(this.sprite, 0);

    // * start button
    play_btn = new ccui.Button(res.play_btn_png, res.play_btn_inv_png);
    play_btn.setScale(2);
    play_btn.x = size.width / 2 - 10;
    play_btn.y = size.height / 2 - 250;
    play_btn.setLocalZOrder(2);
    play_btn.addTouchEventListener(
    function (sender, event) {
      utils.handleBtnEvent(sender, event, 'play');
    }, this);
    this.addChild(play_btn);

    return true;
  }

});

FirstScene = cc.Scene.extend({
  onEnter: function () {
    'use strict';

    var layer;

    this._super();
    if (initialized_start_scene === false) {
      layer = new FirstLayer();

      initialized_start_scene = true;

      this.addChild(layer);
    }
  }
});
