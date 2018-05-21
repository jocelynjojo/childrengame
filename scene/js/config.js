var Config = {
    designW: 2048,
    designH: 1536,
    designFS: 100,
    animals: ['images/mouse.png', 'images/cattle.png', 'images/tiger.png', 'images/rabbit.png',
        'images/dragon.png', 'images/snake.png', 'images/horse.png', 'images/sheep.png',
        'images/monkey.png', 'images/chicken.png', 'images/dog.png', 'images/pig.png'],
    birds: {
        birds1: { src: 'images/bird1.png', w: 115, h: 155 },
        birds2: { src: 'images/bird1.png', w: 113, h: 160 }
    },
    srcs: {
        bg: 'images/bg.jpg',
        grey: 'images/grey.png',
        bright: 'images/bright.png',
        medal1: 'images/medal1.png',
        bird1: 'images/bird1.png',
        bird2: 'images/bird2.png',
        gift: 'images/gift.png'
    },
    homeMsg: { w: 262, h: 476, x: 519, y: 706 },
    tree2: { w: 280, h: 1260, x: 265, y: 0 },
    tree: {
        level0: {
            success: [{ w: 115, h: 155, x: 839, y: 1061, name: 'bird1' }]
        },
        level1: {
            base: { x: 1090, y: 1098, w: 91, h: 91, name: 'grey' },
            success: [
                { x: 1090, y: 1098, w: 91, h: 91, name: 'bright' },
            ]
        },
        level2: {
            base: { x: 1330, y: 1007, w: 91, h: 91, name: 'grey' },
            success: [
                { x: 1330, y: 1007, w: 91, h: 91, name: 'bright' },
            ]
        },
        level3: {
            base: { x: 1302, y: 759, w: 91, h: 91, name: 'grey' },
            success: [
                { x: 1302, y: 759, w: 91, h: 91, name: 'medal1' },
            ]
        },
        level4: {
            base: { x: 1470, y: 426, w: 218, h: 236 },
            extra: [
                { x: 1714, y: 409, w: 113, h: 160, name: 'bird2' },
                { x: 1697, y: 562, w: 128, h: 145, name: 'gift' }
            ]
        },
        level5: {
            base: { x: 1368, y: 246, w: 91, h: 91, name: 'grey' }
        },
        level6: {
            base: { x: 1323, y: 9, w: 91, h: 91, name: 'grey' }
        }
    },
    allNum: 7,
    now: [],
    /**
     * @param {number} passL 通过第几关 
     * @param {src} user 用户头像
     * @param {number} index 用户生效
     */
    init: function (passL, user, index) {
        this.level = passL;
        // 定义小鸟
        switch (passL) {
            case 1: case 2: case 3:
                var bird = this.birds.birds1;
                this.srcs.bird = bird.src
                this.now.push({ disx: -66, disy: -124, w: bird.w, h: bird.h, name: 'bird' });
                this.srcs.user = user;
                this.now.push({ disx: 40, disy: -85, w: 116, h: 116, name: 'user' })
                this.srcs.animal = this.animals[index];
                this.now.push({ disx: 99, disy: -135, w: 128, h: 88, name: 'animal' })
                break;
        }
    }
}
