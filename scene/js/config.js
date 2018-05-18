var Config = {
    designW: 2048,
    designH: 1536,
    animals: ['images/mouse.png', 'images/cattle.png', 'images/tiger.png', 'images/rabbit.png', 
    'images/dragon.png', 'images/snake.png', 'images/horse.png', 'images/sheep.png',
     'images/monkey.png', 'images/chicken.png', 'images/dog.png', 'images/pig.png'],
    texts: ['子', '丑', '寅', '卯', '辰', '己', '午', '未', '申', '酉', '戊', '亥'],
    birds: {
        birds1: { src: 'images/bird1.png', w: 115, h: 155 }
    },
    medals: {
        medal1: 'images/medal1.png'
    },
    srcs: {
        bg: 'images/bg.jpg',
        grey: 'images/grey.png',
        bright: 'images/bright.png',
    },
    homeMsg: { w: 262, h: 476, x: 519, y: 706 },
    tree2: { w: 280, h: 1260, x: 265, y: 0 },
    tree: {
        level0: {
            now: [{ w: 115, h: 155, x: 839, y: 1061, str: 'bird' }]
        },
        level1: {
            base: { x: 1090, y: 1098, w: 91, h: 91, str: 'grey' },
            success: [
                { x: 1090, y: 1098, w: 91, h: 91, str: 'bright' },
            ]
        },
        level2: {
            base: { x: 1330, y: 1007, w: 91, h: 91, str: 'grey' },
            success: [
                { x: 1330, y: 1007, w: 91, h: 91, str: 'bright' },
            ]
        },
        level3: {
            base: { x: 1302, y: 759, w: 91, h: 91, str: 'grey' },
            success: [
                { x: 1302, y: 759, w: 91, h: 91, str: 'medal' },
            ]
        }
    },
    now: [],
    init: function (passL, user, index) {
        // 定义小鸟
        switch (passL) {
            case 1: case 2: case 3:
                var bird = this.birds.birds1;
                this.srcs.bird = bird.src
                this.now.push({ disx: -66, disy: -124, w: bird.w, h: bird.h, str: 'bird' });
                break;
        }
        // 定义用户
        this.srcs.user = user;
        this.now.push({ disx: 40, disy: -85, w: 116, h: 116, str:'user' })
        this.srcs.animal = this.animals[index];
        this.now.push({ disx: 99, disy: -85, w: 128, h: 88, str:'animal' })
        this.font = this.texts[index];
    }
}
Config.init(0, 'images/user.png', 4)