var initialized_game_scene = false;
// var curr_score = 0;
var score_board_text = "";
// var curr_timer = 0;
var topMargin = 80;
var timer_text = null;
var mole_out_len = 35;
var mole_speed = 1.0;
var mole_out_factor = 10;
var minutes = 0;
var seconds = 0;

var gameScreenLayer = cc.Layer.extend({
  sprite: null,
  ctor: function () {
    this._super();

    var size = cc.winSize;

    //top layer
    var sky_layer = new cc.LayerGradient(
      cc.color(0, 0, 255),
      cc.color(255, 255, 255)
    );
    sky_layer.setContentSize(cc.size(size.width, size.height / 4));
    sky_layer.x = 0;
    sky_layer.y = size.height / 2 + size.height / 4;
    this.addChild(sky_layer);

    //cloud layer
    var sky_layer2 = new cc.LayerGradient(
      cc.color(255, 255, 255),
      cc.color(255, 255, 200)
    );
    sky_layer2.setContentSize(cc.size(size.width, size.height / 4));
    sky_layer2.x = 0;
    sky_layer2.y = size.height / 2;
    this.addChild(sky_layer2);

    //ground layer
    var ground_layer = new cc.LayerGradient(
      cc.color(78, 159, 61),
      cc.color(78, 159, 61)
    );
    ground_layer.setContentSize(cc.size(size.width, size.height / 2 + 100));
    ground_layer.x = 0;
    ground_layer.y = 0;
    this.addChild(ground_layer);

    //curr_score layer
    score_board_text = new ccui.Text();
    score_board_text.attr({
      string: "Score :" + game_score.get_score,
      fontName: "Arial",
      fontSize: 32,
      x: size.width - 200,
      y: size.height - 100,
    });
    score_board_text.setColor(cc.color(26, 18, 11));
    this.addChild(score_board_text, 1);

    //curr_timer layer
    timer_text = new ccui.Text();
    timer_text.attr({
      string: "00:00",
      fontName: "Arial",
      fontSize: 32,
      x: size.width - 200,
      y: size.height - 50,
    });
    timer_text.setColor(cc.color(220, 0, 0));
    this.addChild(timer_text, 1);

    var mole_sprites = [];

    var hole_locations = [
      [0, 0],
      [-100, -100],
      [-100, 100],
      [100, -100],
      [100, 100],
      [200, 0],
      [-200, 0],
    ];

    for (var i = 0; i < hole_locations.length; i++) {
      var hole_back = new cc.Sprite(res.hole_back_png);
      hole_back.x = size.width / 2 + hole_locations[i][0];
      hole_back.y = size.height / 2 + hole_locations[i][1] - topMargin;
      this.addChild(hole_back, 0);

      var hole_front = new cc.Sprite(res.hole_front_png);
      hole_front.x = size.width / 2 + hole_locations[i][0];
      hole_front.y = size.height / 2 + hole_locations[i][1] - topMargin;
      this.addChild(hole_front, 2);

      var mole = new ccui.Button(res.mole_normal_png, res.mole_hit_png);
      mole.x = size.width / 2 + hole_locations[i][0];
      mole.y =
        size.height / 2 + hole_locations[i][1] - mole_out_len - topMargin;
      mole.setLocalZOrder(1);
      this.addChild(mole);

      mole.addTouchEventListener(this.scoreFunc, this);
      mole.setEnabled(false);
      mole_sprites.push(mole);

      var hide = new ccui.Button(res.green_png, res.green_png);
      hide.x = size.width / 2 + hole_locations[i][0];
      hide.y =
        size.height / 2 + hole_locations[i][1] - mole_out_len - 5 - topMargin;
      hide.setScale(0.2);
      this.addChild(hide, 3);
    }

    //scheduling mole movement
    this.schedule(function () {
      var r_index = Math.floor(Math.random() * mole_sprites.length); //choosing random hole

      var random_mole = mole_sprites[r_index];

      var show_action = cc.callFunc(function () {
        random_mole.setEnabled(true);
      });

      var hide_action = cc.callFunc(function () {
        random_mole.setEnabled(false);
      });

      //mole movements
      var mole_up = new cc.MoveBy(
        mole_speed,
        cc.p(0, mole_out_len + mole_out_factor)
      );
      var mole_down = new cc.MoveBy(
        mole_speed,
        cc.p(0, -(mole_out_len + mole_out_factor))
      );

      var mole_seq = new cc.Sequence(
        show_action,
        mole_up,
        mole_down,
        hide_action
      );

      random_mole.runAction(mole_seq);
    }, mole_speed * 2 + 0.5);

    this.schedule(function () {
      var prev_timer = game_timer.get_time;
      game_timer.set_time=prev_timer+1;

      var curr_timer = game_timer.get_time;
      minutes = Math.floor(curr_timer / 60);
      seconds = Math.floor(curr_timer % 60);
      timer_text.string =
        utils.pad_start((minutes + ""), 2, "0") + " : " + utils.pad_start((seconds + ""), 2, "0");
    }, 1);

    //layout for finish button
    var layout = new ccui.Layout();
    layout.setContentSize(size.width * 0.2, size.height * 0.08);
    layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
    layout.setBackGroundColor(cc.color("#850000"));
    layout.setBackGroundColorOpacity(100);
    layout.setPosition(size.width / 2, 75);
    layout.setAnchorPoint(0.5, 0.5);
    layout.setTag(12);
    this.addChild(layout);

    //finish
    var finishBtn = new ccui.Button();
    finishBtn.titleText = "Finish";
    finishBtn.titleFontSize = 25;
    finishBtn.setPosition(layout.width / 2.0, layout.height / 2.0);
    finishBtn.addTouchEventListener(function (sender, event) { utils.handleBtnEvent(sender, event, "end") }, this);
    // finishBtn.addTouchEventListener(utils.handleBtnEvent.bind(this,"end"), this);
    layout.addChild(finishBtn);

    return true;
  },

  // finishBtnEvent: function (sender, event) {
  //   if (event === ccui.Widget.TOUCH_BEGAN) {
  //     var scene = new EndScene();
  //     cc.director.pushScene(scene);
  //   }
  // },

  scoreFunc: function (sender, event) {
    if (event === ccui.Widget.TOUCH_BEGAN) {
      var prev_score = game_score.get_score;
      game_score.set_score = prev_score+1;

      var curr_score = game_score.get_score;
      if (mole_speed > 0.5 && mole_speed - parseInt(curr_score / 10) * 0.1 > 0.2) {
        mole_speed -= parseInt(curr_score / 10) * 0.1;
      }
      score_board_text.string = "Score :" + curr_score;
    }
  }

});

var GameScene = cc.Scene.extend({
  onEnter: function () {
    this._super();
    if (initialized_game_scene === false) {
      initialized_game_scene = true;
      var layer = new gameScreenLayer();
      this.addChild(layer);
    }
  },
});
