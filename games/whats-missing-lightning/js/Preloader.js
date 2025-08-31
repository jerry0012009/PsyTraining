Game.Preloader = function (game) {

    this.background = null;
    this.preloadBar = null;

    this.ready = false;

};

Game.Preloader.prototype = {

    init: function (problem_set) {
        this.problem_set = problem_set
    },

    preload: function () {

        this.stage.backgroundColor = '#2d2d2d';

        this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');
        this.preloadBar.anchor.setTo(0.5, 0.5);

        this.load.setPreloadSprite(this.preloadBar);

        // Load images
        this.load.image('k0', 'images/Keyboard_0.png');
        this.load.image('k1', 'images/Keyboard_1.png');
        this.load.image('k2', 'images/Keyboard_2.png');
        this.load.image('k3', 'images/Keyboard_3.png');
        this.load.image('k4', 'images/Keyboard_4.png');
        this.load.image('k5', 'images/Keyboard_5.png');
        this.load.image('k6', 'images/Keyboard_6.png');
        this.load.image('k7', 'images/Keyboard_7.png');
        this.load.image('k8', 'images/Keyboard_8.png');
        this.load.image('k9', 'images/Keyboard_9.png');
        this.load.image('delete', 'images/Delete_button.png');
        this.load.image('go', 'images/Go_button.png');
        this.load.image('next', 'images/next_button.png');
        this.load.image('back', 'images/back_button.png');
        this.load.image('lightning', 'images/LightningRound_Button.png');

    },

    create: function () {

        this.preloadBar.cropEnabled = false;

    },

    update: function () {

        if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
        {
            this.ready = true;
            this.state.start('Menu', true, false, this.problem_set);
        } else if (this.ready == false) {
            this.ready = true;
            this.state.start('Menu', true, false, this.problem_set);
        }

    }

};