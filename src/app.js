var initialized_start_scene = false;

var FirstLayer = cc.Layer.extend({
  sprite: null,
  ctor: function () {
    this._super();

    var size = cc.winSize;

    //adding sprite
    this.sprite = new cc.Sprite(res.title_screen_png);
    this.sprite.attr({
      x: size.width / 2,
      y: size.height / 2,
    });
    this.sprite.setScale(1.25);
    this.addChild(this.sprite, 0);

    // * start button
    var play_btn = new ccui.Button(res.play_btn_png, res.play_btn_inv_png);
    play_btn.setScale(1.25);
    play_btn.x = size.width / 2 - 8;
    play_btn.y = size.height / 2 - 150;
    play_btn.setLocalZOrder(10);
    play_btn.addTouchEventListener(this.play, this);
    this.addChild(play_btn);

    return true;
  },

  play: function (sender, type) {
    if (type == ccui.Widget.TOUCH_BEGAN) {
      var scene = new GameScene();
      cc.director.pushScene(scene);
    }
  },
});

var FirstScene = cc.Scene.extend({
  onEnter: function () {
    this._super();
    if (initialized_start_scene === false) {
      initialized_start_scene = true;
      var layer = new FirstLayer();
      this.addChild(layer);
    }
  },
});
