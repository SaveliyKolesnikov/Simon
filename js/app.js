(function () {
    class Button {
        constructor(elementId) {
            this.el = document.getElementById(elementId);
            this.number = +elementId[elementId.length - 1];
            this.soundSrc = this.el.dataset.soundSrc;
            this.el.addEventListener('click', function (event) {
                if ((isDemonstration && event.isTrusted))
                    return;

                this.playAudio();
                if (currentLvl === -1) {
                    event.stopPropagation();
                    return;
                }

                if (!event.isTrusted)
                    event.stopPropagation();
                else
                    playerSequence.push(this.number);

                this.el.className += " clicked";
                setTimeout(() => this.el.className = this.el.className.replace(/ clicked/, ""), 500);
            }.bind(this));

            this.el.addEventListener('mouseover', function () {
                if (!/ clicked/.test(this.el.className))
                    this.el.className += " clicked";
            }.bind(this));
            this.el.addEventListener('mouseout', function () {
                this.el.className = this.el.className.replace(/ clicked/, "");
            }.bind(this));
        }

        playAudio() {
            let audio = document.createElement("audio");
            audio.src = this.soundSrc;
            audio.addEventListener("ended", function () {
                document.body.removeChild(this);
            });
            document.body.appendChild(audio);
            audio.play();
        }
    }


    let levels = [];
    // Generate levels
    for (let i = 1; i <= 10; i++) {
        let level = [];
        for (let j = 0; j < i; j++) {
            let buttonNum = Math.floor(Math.random() * 3 + 1);
            level.push(buttonNum);
        }
        levels.push(level);
    }
    const output = document.getElementById('output');
    const delay = 1000;

    let buttonsElem = document.getElementsByClassName('button');
    let buttons = [];
    for (let i = 0; i < buttonsElem.length; i++)
        buttons.push(new Button(buttonsElem[i].id));

    let currentLvl = -1;
    let isDemonstration = false;
    let playerSequence = [];

    document.getElementById('game-window').addEventListener('click', function () {
        if (isDemonstration)
            return;
        if (currentLvl === -1) {
            currentLvl = 0;
            demonstration(levels[currentLvl]);
        }
        let isTurnsEquals = playerSequence[playerSequence.length - 1] === levels[currentLvl][playerSequence.length - 1];
        if (playerSequence.length === levels[currentLvl].length) {
            currentLvl++;
            if (levels.length === currentLvl) {
                document.getElementById('victory-sound').play();
                output.innerHTML = "You won Simon!";
                output.innerHTML += "\nPress to play again";
                currentLvl = -1;
                playerSequence = [];
            }
            else {
                levelComplete();
            }
        }
        else if (isTurnsEquals) {
            output.innerHTML = "turns " + getTurnsLeft();
        }
        else if (!isTurnsEquals) {
            gameOver();
            playerSequence = [];
        }
    });

    function levelComplete() {
        playerSequence = [];
        let delayCount = 0;
        setTimeout(() => output.innerHTML = "You win!", delay * delayCount++);
        demonstration(levels[currentLvl]);
    }

    function demonstration(levelSequence) {
        isDemonstration = true;
        let delayCount = 0;
        setTimeout(() => output.innerHTML = "Level " + (currentLvl + 1), delay * delayCount++);
        setTimeout(() => output.innerHTML = "Ready?", delay * delayCount++);
        setTimeout(() => output.innerHTML = "Begin!", delay * delayCount++);

        setTimeout(() => {
            output.innerHTML = "Simon says";
            for (let i = 0; i < levelSequence.length; i++) {
                setTimeout((idx) => buttons[idx].el.click(), delay * i, levelSequence[i] - 1);
            }
        }, delay * delayCount);

        // Wait when all buttons will be clicked
        delayCount += levelSequence.length;

        setTimeout(() => {
            output.innerHTML = "turns " + getTurnsLeft();
            isDemonstration = false;
        }, delay * delayCount++);
    }

    function getTurnsLeft() {
        return levels[currentLvl].length - playerSequence.length;
    }

    function gameOver() {
        document.getElementById('mistake-sound').play();
        let delayCount = 0;
        setTimeout(() => {
            output.innerHTML = "You lose";
            currentLvl = -1;
        }, delay * delayCount++);
        delayCount += 3;
        setTimeout(() => output.innerHTML = "Press To Start", delay * delayCount++);

    }

})();
