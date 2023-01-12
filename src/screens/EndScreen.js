/* global ccui,cc,game_score,minutes:true,seconds:true,
timer_text,timer:true,score_board_text */

var initialized_end_scene = false,
  EndLayer,
  EndScene,
  pop;

EndLayer = cc.Layer.extend({
  sprite: null,
  ctor: function () {
    'use strict';

    var size = cc.winSize,
      top_display_label,
      score_text,
      retry_button,
      layout;

    this._super();

    top_display_label = new cc.LabelTTF('THE END', 'Arial', 58);

    // * position the label on the center of the screen
    top_display_label.x = size.width / 2;
    top_display_label.y = size.height / 2 + 200;

    // * add the label as a child to this layer
    this.addChild(top_display_label, 0);

    // score text
    score_text = new ccui.Text();
    score_text.attr({
      string: 'Total Score: ' + game_score.curr_score,
      fontName: 'Arial',
      fontSize: 32,
      x: size.width / 2,
      y: size.height / 2 + 50
    });
    this.addChild(score_text);

    // layout for button
    layout = new ccui.Layout();
    layout.setContentSize(size.width * 0.2, size.height * 0.08);
    layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
    layout.setBackGroundColor(cc.color('#205295'));
    layout.setBackGroundColorOpacity(100);
    layout.setPosition(size.width / 2, 200);
    layout.setAnchorPoint(0.5, 0.5);
    layout.setTag(12);
    this.addChild(layout);

    // retry button
    retry_button = new ccui.Button();
    retry_button.titleText = 'RETRY';
    retry_button.titleFontSize = 25;
    retry_button.setPosition(layout.width / 2, layout.height / 2);
    retry_button.addTouchEventListener(pop, this);
    layout.addChild(retry_button);

    return true;
  }
});

pop = function () {
  'use strict';

  initialized_end_scene = false;
  game_score.curr_score = 0;
  minutes = 0;
  seconds = 0;
  timer = 0;
  timer_text.string = '00:00';
  score_board_text.string = 'Score: ' + game_score.curr_score;

  cc.director.popScene();
};

EndScene = cc.Scene.extend({
  onEnter: function () {
    'use strict';

    var layer;

    this._super();
    if (initialized_end_scene === false) {
      initialized_end_scene = true;
      layer = new EndLayer();
      layer.setColor(cc.color('#CDFCF6'));
      this.addChild(layer);
    }
  }
});
