/* global utils,ccui,cc,res,game_score,game_timer */

var initialized_game_scene = false,
  score_board_text = '',
  topMargin = 80,
  timer_text = null,
  mole_out_len = 35,
  mole_speed = 1.0,
  mole_out_factor = 10,
  minutes = 0,
  seconds = 0,
  GameScreenLayer,
  GameScene;

GameScreenLayer = cc.Layer.extend({
  sprite: null,
  ctor: function () {
    'use strict';

    var size = cc.winSize,
      layout,
      finishBtn,
      hole_back,
      hole_front,
      mole,
      hide,
      sky_layer,
      sky_layer2,
      ground_layer,
      mole_sprites,
      hole_locations,
      i;

    this._super();

    // top layer
    sky_layer = new cc.LayerGradient(
      cc.color(0, 0, 255),
      cc.color(255, 255, 255)
    );
    sky_layer.setContentSize(cc.size(size.width, size.height / 4));
    sky_layer.x = 0;
    sky_layer.y = size.height / 2 + size.height / 4;
    this.addChild(sky_layer);

    // cloud layer
    sky_layer2 = new cc.LayerGradient(
      cc.color(255, 255, 255),
      cc.color(255, 255, 200)
    );
    sky_layer2.setContentSize(cc.size(size.width, size.height / 4));
    sky_layer2.x = 0;
    sky_layer2.y = size.height / 2;
    this.addChild(sky_layer2);

    // ground layer
    ground_layer = new cc.LayerGradient(
      cc.color(78, 159, 61),
      cc.color(78, 159, 61)
    );
    ground_layer.setContentSize(cc.size(size.width, size.height / 2 + 100));
    ground_layer.x = 0;
    ground_layer.y = 0;
    this.addChild(ground_layer);

    // curr_score layer
    score_board_text = new ccui.Text();
    score_board_text.attr({
      string: 'Score :' + game_score.curr_score,
      fontName: 'Arial',
      fontSize: 32,
      x: size.width - 200,
      y: size.height - 100
    });
    score_board_text.setColor(cc.color(26, 18, 11));
    this.addChild(score_board_text, 1);

    // curr_timer layer
    timer_text = new ccui.Text();
    timer_text.attr({
      string: '00:00',
      fontName: 'Arial',
      fontSize: 32,
      x: size.width - 200,
      y: size.height - 50
    });
    timer_text.setColor(cc.color(220, 0, 0));
    this.addChild(timer_text, 1);

    mole_sprites = [];

    hole_locations = [
      [0, 0],
      [-100, -100],
      [-100, 100],
      [100, -100],
      [100, 100],
      [200, 0],
      [-200, 0]
    ];

    for (i = 0; i < hole_locations.length; i++) {
      hole_back = new cc.Sprite(res.hole_back_png);
      hole_back.x = size.width / 2 + hole_locations[i][0];
      hole_back.y = size.height / 2 + hole_locations[i][1] - topMargin;
      this.addChild(hole_back, 0);

      hole_front = new cc.Sprite(res.hole_front_png);
      hole_front.x = size.width / 2 + hole_locations[i][0];
      hole_front.y = size.height / 2 + hole_locations[i][1] - topMargin;
      this.addChild(hole_front, 2);

      mole = new ccui.Button(res.mole_normal_png, res.mole_hit_png);
      mole.x = size.width / 2 + hole_locations[i][0];
      mole.y =
        size.height / 2 + hole_locations[i][1] - mole_out_len - topMargin;
      mole.setLocalZOrder(1);
      this.addChild(mole);

      mole.addTouchEventListener(this.scoreFunc, this);
      mole.setEnabled(false);
      mole_sprites.push(mole);

      hide = new ccui.Button(res.green_png, res.green_png);
      hide.x = size.width / 2 + hole_locations[i][0];
      hide.y =
        size.height / 2 + hole_locations[i][1] - mole_out_len - 5 - topMargin;
      hide.setScale(0.2);
      this.addChild(hide, 3);
    }

    // scheduling mole movement
    this.schedule(function () {
      var r_index = Math.floor
      (Math.random() * mole_sprites.length), // choosing random hole
      random_mole,
      show_action,
      hide_action,
      mole_up,
      mole_down,
      mole_seq;

      random_mole = mole_sprites[r_index];

      show_action = cc.callFunc(function () {
        random_mole.setEnabled(true);
      });

      hide_action = cc.callFunc(function () {
        random_mole.setEnabled(false);
      });

      // mole movements
      mole_up = new cc.MoveBy(
        mole_speed,
        cc.p(0, mole_out_len + mole_out_factor)
      );
      mole_down = new cc.MoveBy(
        mole_speed,
        cc.p(0, -(mole_out_len + mole_out_factor))
      );

      mole_seq = new cc.Sequence(
        show_action,
        mole_up,
        mole_down,
        hide_action
      );

      random_mole.runAction(mole_seq);
    }, mole_speed * 2 + 0.5);

    this.schedule(function () {
      var prev_timer = game_timer.time,
      curr_timer;

      game_timer.time = prev_timer + 1;

      curr_timer = game_timer.time;
      minutes = Math.floor(curr_timer / 60);
      seconds = Math.floor(curr_timer % 60);
      timer_text.string =
        utils.pad_start(minutes + '', 2, '0') + ' : ' +
        utils.pad_start(seconds + '', 2, '0');
    }, 1);

    // layout for finish button
    layout = new ccui.Layout();
    layout.setContentSize(size.width * 0.2, size.height * 0.08);
    layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
    layout.setBackGroundColor(cc.color('#850000'));
    layout.setBackGroundColorOpacity(100);
    layout.setPosition(size.width / 2, 75);
    layout.setAnchorPoint(0.5, 0.5);
    layout.setTag(12);
    this.addChild(layout);

    // finish
    finishBtn = new ccui.Button();
    finishBtn.titleText = 'Finish';
    finishBtn.titleFontSize = 25;
    finishBtn.setPosition(layout.width / 2.0, layout.height / 2.0);
    finishBtn.addTouchEventListener(
      function (sender, event) {
        utils.handleBtnEvent(sender, event, 'end');
      }, this);
    layout.addChild(finishBtn);

    return true;
  },

  scoreFunc: function (sender, event) {
    'use strict';

    var prev_score,
      curr_score;

    if (event === ccui.Widget.TOUCH_BEGAN) {
      prev_score = game_score.curr_score;
      game_score.curr_score = prev_score + 1;

      curr_score = game_score.curr_score;
      if (mole_speed > 0.5 &&
        mole_speed - parseInt(curr_score / 10) * 0.1 > 0.2) {
        mole_speed -= parseInt(curr_score / 10) * 0.1;
      }
      score_board_text.string = 'Score :' + curr_score;
    }
  }

});

GameScene = cc.Scene.extend({
  onEnter: function () {
    'use strict';

    var layer;

    this._super();
    if (initialized_game_scene === false) {
      initialized_game_scene = true;
      layer = new GameScreenLayer();
      this.addChild(layer);
    }
  }
});
