const conf = {
    fps: 60,
    img: [],
    width: 420 + 20,
    height: 240,
    canvas: find('#slot'),
    spinBtn: find('#spin'),
    autoBtn: find('#auto'),
    mode: find('#mode'),
    where: find('#where'),
    what: find('#what'),
    balance: find('#balance'),
    bet: find('#bet'),
    win: find('#cwin'),
    checkout: find('#checkout'),
    reel: {
        width: 140,
        height: 120,
        xOffsets: [0, 140, 280].map((x) => x + 10),
        animTimes: [20, 25, 30].map((x) => x * 100),
    },
    pSkip: 40,
    imgMap: ['BAR', '2xBAR', '3xBAR', '7', 'Cherry'],
    imgStartPts: [...range(-2, 2)],
    player: {
        money: 10,
    },
    imgDot: null,
    autoModeDelay: 3000,
    sound: {
        win: new Audio('./sound/win.mp3'),
        spin: new Audio('./sound/spin.mp3'),
    },
};

function initial(aiImages,sound) {
    console.log("Initialze:", aiImages,sound);
    window.aiImage = [];
    console.log("AI image", window.aiImage);
    //Resource loader
	conf.sound.spin = new Audio(sound);
	console.log(conf.sound.spin);
    Resources(aiImages[0], aiImages[1], aiImages[2], aiImages[3], aiImages[4]).onLoad(
        function (resources, names) {
            //loading done and ready to go
            //save loaded resources to conf.img
            if (resources instanceof Array) {
                conf.imgMap.forEach((i, j) => (conf.img[i] = resources[j]));
            }
            //add options to select
            names.forEach(function (name) {
                const key = name.replace(new RegExp('^(./img/)|(.png|.jpg|.jpeg)$', 'ig'), '');
                const option = document.createElement('option');
                option.value = key;
                option.innerText = key;
                conf.what.appendChild(option);
            });

            //sounds load
            conf.sound.win.load();
            conf.sound.spin.load();

            //instantiation the game
            (function (slot) {
                let fps = conf.fps,
                    interval = 1000 / fps,
                    delta,
                    lastpUpdate = 0;

                //bind click events
                conf.spinBtn.onclick = slot.spin;
                conf.checkout.onclick = slot.checkout;
                conf.mode.onchange = slot.setMode;
                conf.where.onchange = slot.setMode;
                conf.what.onchange = slot.setMode;
                conf.balance.onchange = slot.setCredits;
                conf.balance.value = conf.player.money;
                conf.autoBtn.onclick = slot.autoToggle;

                //init game
                slot.start();
                //core function of the game
                (function update(now) {
                    delta = now - lastpUpdate;
                    if (delta > interval) {
                        lastpUpdate = now - (delta % interval);
                        slot.loop(now);
                    }
                    window.requestAnimationFrame(update);
                })();
            })(new Slot(conf.canvas.getContext('2d')));
        },
    );
}