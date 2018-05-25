var _dir = '../images/index/';
var Config = {
    designW: 2048,
    designH: 1536,
    designFS: 100,
    animalSrcs: [_dir + 'mouse.png', _dir + 'cattle.png', _dir + 'tiger.png', _dir + 'rabbit.png',
    _dir + 'dragon.png', _dir + 'snake.png', _dir + 'horse.png', _dir + 'sheep.png',
    _dir + 'monkey.png', _dir + 'chicken.png', _dir + 'dog.png', _dir + 'pig.png'],
    animalMsg: { disx: 99, disy: -135, w: 128, h: 88 },
    userMsg: { disx: 40, disy: -85, w: 116, h: 116 },
    birdSrcs: [_dir + 'bird1.png', _dir + 'bird2.png'],
    birdMsgs: [{ w: 115, h: 155 }, { w: 113, h: 160 }],
    greySrc: _dir + 'grey.png',
    greyMsg: { w: 91, h: 91 },
    brightSrc: _dir + 'bright.png',
    brightMsg: { w: 91, h: 91, disx: 0, disy: 0 },
    medalSrcs: [_dir + 'medal1.png'],
    medalMsgs: [{ w: 91, h: 91, disx: 0, disy: 0 }],
    giftSrc: [_dir + 'gift.png'],
    giftMsgs: [{ w: 128, h: 145 }],

    levelsMsg: [
        { x: 1090, y: 1098, w: 91, h: 91, type: 'grey' }, //0
        { x: 1330, y: 1007, w: 91, h: 91, type: 'grey' }, //1
        { x: 1302, y: 759, w: 91, h: 91, type: 'grey' }, //2
        { x: 1470, y: 426, w: 218, h: 236, type: 'home' },//3
        { x: 1368, y: 246, w: 91, h: 91, type: 'grey' },//4
        { x: 1323, y: 9, w: 91, h: 91, type: 'grey' }//5
    ],
    levelsExtra: {
        0: [{ type: 'bird', index: 0, x: 839, y: 1061 }],
        3: [{ type: 'bird', index: 1, x: 1714, y: 409 }, { type: 'gift', index: 0, x: 1697, y: 562 }]
    },

    nowMsg: [{ type: 'bird', index: 0, x: 839, y: 1061 }],
    homeMsg: { w: 262, h: 476, x: 519, y: 706 },
    tree2: { w: 280, h: 1260, x: 265, y: 0 }
}
