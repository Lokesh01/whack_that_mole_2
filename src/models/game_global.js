var game_score = {
    score: 0,

    //getting curr score
    get get_score() {
        return this.score;
    },

    //setting new score
    set set_score(scr) {
        this.score = scr;
    }
}

var game_timer = {
    timer: 0,

    //getting the curr time
    get get_time() {
        return this.timer;
    },

    //setting timer
    set set_time(tm) {
        this.timer = tm;
    }
}