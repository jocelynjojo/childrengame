var _dir = '../images/game4/';
var Config = {
    designW: 2048,
    designH: 1536,
    designFS: 100,

    bearMsg: {w: 210, h: 166, x:1830, y:394},
    appleMsg: {w: 210,h: 184, x:1830, y:685},
    bananaMsg: {w: 210,h: 162, x:1830, y:987},
    bgSrc: _dir + 'scene4_bg.jpg',
    pieceSrc: [_dir + 'bear.png',
    _dir + 'apple.png',
    _dir + 'banana.png',
    _dir + 'book.png',
    _dir + 'balloon.png'],
    pieceMsgs: [{ w: 307, h: 260, x: 1503, y: 916, endw: 177, endh:150, endx: 1847, endy: 402 ,type: 'bear'},
    { w: 207, h: 240, x: 853, y: 1206, endw: 146, endh:171, endx: 1858, endy: 690, type: 'apple' },
    { w: 230, h: 217, x: 1200, y: 1235, endw: 145, endh:137, endx: 1858, endy: 996, type: 'banana' },
    { w: 225, h: 253, x: 72, y: 1206, type:'bolloon'},
    { w: 208, h: 261, x: 441, y: 1199, type: 'book'}],
    pressSrc: [_dir + 'bear_p.png',
    _dir + 'apple_p.png',
    _dir + 'banana_p.png',
    _dir + 'book_p.png',
    _dir + 'balloon_p.png'],
    pressMsgs: [{ w: 417, h: 368, disx: -55, disy: -54 },
    { w: 318, h: 350, disx: -55, disy: -55 },
    { w: 340, h: 328, disx: -55, disy: -56 },
    { w: 338, h: 363, disx: -57, disy: -57 },
    { w: 316, h: 373, disx: -54, disy: -56 }],
    trancls: 'J-tran',
    releaseTime: 300,
    zIndex: 20
}


