var videoUrlList = [
    //概述
    '',//0
]

var audioList = [
    './sco/audio/blank.mp3',//0

]
var player;
var Video = function () {
    var $this = this;
    var videoId = 'my-player';
    var player = videojs(videoId, {}, function onPlayerReady() {
        console.log('ready');
     });
    this.play = function (videoArry, doSomeThing) {
        $('#' + videoId).css('display', 'block');
        player.show();
        var url = videoUrlList[videoArry[0]];
        player.src({ type: "video/mp4", src: url });
        player.load();
        player.play();
        player.on("ended", function () {
            videoArry.splice(0, 1)
            if (videoArry.length != 0) {
                player.off('ended')
                $this.play(videoArry, doSomeThing)
            } else {
                player.off('ended')
                if (this.isFullscreen()) {
                    this.exitFullscreen()
                }
                this.hide();
                if (typeof doSomeThing == "function") {
                    doSomeThing()
                }
                videojs.log('Awww...over so soon?!');
            }
        })
    }
}
player = new Video();
var _audio = null;
function audioPlay(num, fun, fun2) {
    if (_audio) { _audio.stop() }
    console.log('num', num);
    soundManager.setup({
        useHighPerformance: true,
        onready: function () {
            _audio = soundManager.createSound({
                autoPlay: true,
                autoLoad: true,
                url: audioList[num],
                onfinish: fun,
                whileplaying: fun2
            });
        }
    });
}
function stopAudioPlay() {
    if (_audio) { _audio.stop() }
}

//点击播放当前按钮 公用class 视频索引值 列表数组;
function getCurrentContent(btnCom, videoListIndex, listItem, doSomeThing, isContent) {
    $('.' + btnCom).unbind().click(function (e) {
        stopAudioPlay()
        var numId = e.currentTarget.id;
        var id = parseInt(numId.replace(/[^\d]/g, ''));
        //症状视频从第二个开始
        var parms = null;
        //如果是视频
        if (!isContent) {
            parms = id + videoListIndex
        }
        listItem.splice(id, 1, true);
        // console.log('lis',listItem);
        doSomeThing(parms, id)
    })
}

//看完后设置状态 选中的class，未选中的class，选中div内的文本class
function setStatus(that, chooseBtn, comBtn, isDbChoose) {
    if (isDbChoose) {
        $(that).toggleClass(chooseBtn);
        if (chooseTxtColor) {
            // $(that).toggleClass(chooseTxtColor);
        }
    }else{
        $("." + comBtn).removeClass(chooseBtn)
        $(that).addClass(chooseBtn)
    }  
}

//classArry 0:公用class,1选中按钮背景色class，2选中按钮字体颜色class
function checkAnswer(type, classArry, listItemChoose, rightAnswer, clickfunction, doSomeThing, dbChooseHasTwoAnswer) {
    var tm;
    btn = '.' + classArry[0];
    var chooseList = $(btn);
    chooseList.each(function (idx, ele) {
        $(ele).data('number', idx);
    });
    $(btn).unbind().click(function (e) {
        var $that = this;
        var id = $(this).data('number');
        //点击触发事件，如显示✅
        if (typeof clickfunction == "function") {
            clickfunction()
        }
        if (type == 'singleChoose') {
            choose('singleChoose', listItemChoose, rightAnswer, id, doSomeThing);
            setStatus($that, classArry[1], classArry[0], false);
        }
        if (type == 'dbChoose') {
            listItemChoose.splice(id, 1, !listItemChoose[id]);
            if (tm) {
                clearTimeout(tm)
            }
            tm = setTimeout(function () {
                choose('dbChoose', listItemChoose, rightAnswer, id, doSomeThing, dbChooseHasTwoAnswer);
                console.log('come in');
            }, 3000);
            setStatus($that, classArry[1], classArry[0], true);
        }
        

    })
}

//选择题
function choose(chooseType, arry, trueArry, index, doSomeThing, dbChooseHasTwoAnswer) {
    var flag = 1;
    if (chooseType == 'singleChoose') {
        arry.forEach(function (ele, idx) {
            arry.splice(idx, 1, false);
        })
        arry.splice(index, 1, true);
        for (var i = 0; i < arry.length; i++) {
            if (arry[i] != trueArry[i]) {
                flag = 0;
            }
        }
        if (flag == 1) {
            console.log('答对了');
            // audioPlay(1,function(){
                doSomeThing(true);
            // });
            return true;
        } else {
            console.log('答错了');
            doSomeThing(false);
            // audioPlay(2);
            return false;
        }
    }
    if (chooseType == 'dbChoose') {
        for (var i = 0; i < arry.length; i++) {
            if (arry[i] != trueArry[i] && trueArry[i] && !arry[i]) {
                flag = 2;
            } else if (arry[i] != trueArry[i] && !trueArry[i] && arry[i]) {
                flag = 0;
                break;
            }
        };
        if (flag == 1) {
            setTimeout(function () {
                doSomeThing(true);
            }, 2000);
            console.log('答对了', arry);
            // audioPlay(14);
        } else if (flag == 2) {
            if (dbChooseHasTwoAnswer) {
                console.log('答错了');
                doSomeThing(false)
            } else {
                console.log('再好好想想');
                doSomeThing(null)
            }
            // doSomeThing()
        } else if (flag == 0) {
            doSomeThing(false)
            // audioPlay(13);
            console.log('答错了');
        }
    }
}


// type1:一对一，不对则返回；
// type2：多对一，对的进
//dragBox 拖动块存放的box id/class
//dropBox 存放的box id/class
//dragNumbers 可拖动的元素个数
//dropNumbers 可放置个数
//dragClass 拖动元素的class /card card1，
//dropClass 存放元素的class /dp1 dp2
//dropHidden 拖动完后是否隐藏
//trueList 当dragType为type2，设置trueList，如只有一个drop [1,1,0,0]
function startDrag(dragType, dragBox, dropBox, dragNumbers, dropNumbers, dragClass, dropClass, containmentClass, dragCallBack, drgaFinishCallBack, dropHidden, trueLists) {
    var correctCards = 0;
    var trueNum = 0;
    var numbers = [];
    for (var i = 1; i <= dragNumbers; i++) {
        numbers.push(i)
    }
    if (dragType=='type2'&&trueLists) {
        trueLists.forEach(function(element) {
            if (element == 1) {
                trueNum++
            }
        });
    }
    console.log('trueNum',trueNum);
    $(init);
    function init() {
        console.log('初始化');
        // Reset the game
        correctCards = 0;
        $(dragBox).html('');
        $(dropBox).html('');
        // Create the pile of shuffled cards
        // numbers.sort(function () { return Math.random() - .5 });
        if (dragType == "type1") {
            for (var i = 0; i < numbers.length; i++) {
                $("<div class='" + dragClass + numbers[i] + "'></div>").data('number', numbers[i]).appendTo(dragBox).draggable({
                    containment: '.' + containmentClass,
                    stack: dragBox + ' div',
                    cursor: 'move',
                    revert: true
                })
            }
            // Create the card slots
            for (var i = 0; i < numbers.length; i++) {
                $('<div class="' + dropClass + numbers[i] + '"></div>').data('number', numbers[i]).appendTo(dropBox).droppable({
                    accept: dragBox + ' div',
                    hoverClass: 'hovered',
                    drop: handleCardDrop
                });
            }
        }
        if (dragType == "type2") {
            var trueList = trueLists;
            for (var i = 0; i < numbers.length; i++) {
                $("<div class='" + dragClass + numbers[i] + "'></div>").data('number', trueList[i]).appendTo(dragBox).draggable({
                    containment: '.' + containmentClass,
                    stack: dragBox + ' div',
                    cursor: 'move',
                    revert: true
                })
            }
            for (var i = 1; i <= dropNumbers; i++) {
                $('<div class="' + dropClass + i + '"></div>').data('number', i).appendTo(dropBox).droppable({
                    accept: dragBox + ' div',
                    hoverClass: 'hovered',
                    drop: handleCardDrop
                });
            }
        }
    }

    function handleCardDrop(event, ui) {
        var slotNumber = $(this).data('number');
        var cardNumber = ui.draggable.data('number');
        // If the card was dropped to the correct slot,
        // change the card colour, position it directly
        // on top of the slot, and prevent it being dragged
        // again
        if (slotNumber == cardNumber) {
            ui.draggable.draggable('disable');
            //   $(this).droppable( 'disable' );
            ui.draggable.position({ of: $(this), my: 'left top', at: 'left top' });
            if (dropHidden) {
                ui.draggable.css('visibility', 'hidden');
            }
            ui.draggable.draggable('option', 'revert', false);
            correctCards++;
            if (typeof dragCallBack == "function") {
                dragCallBack(true, cardNumber, ui.draggable)
            }
        } else {
            if (typeof dragCallBack == "function") {
                dragCallBack(true, cardNumber, ui.draggable)
            }
        }
        // If all the cards have been placed correctly then display a message
        // and reset the cards for another go
        console.log('correctCards',correctCards,trueNum);
        if ((dragType == "type1" && correctCards == numbers.length) ||
            (dragType == "type2" && correctCards == trueNum)) {
            if (typeof drgaFinishCallBack == "function") {
                drgaFinishCallBack(true, cardNumber, ui.draggable)
            }
        }
    }
}

