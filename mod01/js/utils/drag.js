
// type1:一一对应，不对则返回；
// type2：不一一对应，对的进
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
        trueLists.forEach(element => {
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