var game_score, game_timer;

game_score = {
  score: 0,

  // getting curr score
  get curr_score() {
    'use strict';

    return this.score;
  },

  // setting new score
  set curr_score(scr) {
    'use strict';

    this.score = scr;
  }
};

game_timer = {
  timer: 0,

  // setting timer
  set time(tm) {
    'use strict';

    this.timer = tm;
  },

  // getting the curr time
  get time() {
    'use strict';

    return this.timer;
  }
};
