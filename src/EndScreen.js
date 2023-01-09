var initialized_end_scene = false;

var EndLayer = cc.Layer.extend({
  sprite: null,
  ctor: function () {
    this._super();

    var size = cc.winSize;

    var top_display_label = new cc.LabelTTF("THE END", "Arial", 58);
    // * position the label on the center of the screen
    top_display_label.x = size.width / 2;
    top_display_label.y = size.height / 2 + 200;
    // * add the label as a child to this layer
    this.addChild(top_display_label, 0);

    //score text
    var score_text = new ccui.Text();
    score_text.attr({
      string: "Total Score: " + score,
      fontName: "Arial",
      fontSize: 32,
      x: size.width / 2,
      y: size.height / 2 + 50,
    });
    this.addChild(score_text);

    //layout for button
    var layout = new ccui.Layout();
    layout.setContentSize(size.width * 0.2, size.height * 0.08);
    layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
    layout.setBackGroundColor(cc.color("#205295"));
    layout.setBackGroundColorOpacity(100);
    layout.setPosition(size.width / 2, 200);
    layout.setAnchorPoint(0.5, 0.5);
    layout.setTag(12);
    this.addChild(layout);

    //retry button
    var retry_button = new ccui.Button();
    retry_button.titleText = "RETRY";
    retry_button.titleFontSize = 25;
    retry_button.setPosition(layout.width / 2, layout.height / 2);
    retry_button.addTouchEventListener(pop,this);
    layout.addChild(retry_button);

    return true;
  },
});

var pop = function () {
  initialized_end_scene = false;
  score = 0;
  minutes = 0;
  seconds = 0;
  timer = 0;
  timer_text.string = "00:00";
  score_board_text.string = "Score: " + score;

  cc.director.popScene();
};

var EndScene = cc.Scene.extend({
  onEnter: function () {
    this._super();
    if (initialized_end_scene === false) {
      initialized_end_scene = true;
      var layer = new EndLayer();
      layer.setColor(cc.color("#CDFCF6"));
      this.addChild(layer);
    }
  },
});
