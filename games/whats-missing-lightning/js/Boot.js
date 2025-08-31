var Game = {}

Game.Boot = function (game) {

}

Game.Boot.prototype = {

    init: function (problem_set) {
      this.problem_set = problem_set

        this.input.maxPointers = 1

        this.stage.disableVisibilityChange = true

        if (this.game.device.desktop) {
            this.scale.pageAlignHorizontally = true
        } else {
             this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
             this.scale.forcePortrait = true
        }

    },

    preload: function () {
        this.load.image('preloaderBar', 'images/preloader_bar.png')
    },

    create: function () {
        this.state.start('Preloader', true, false, this.problem_set)
    }

}