$(function() {
    var correctCards = 0;
    $(init);

    function init() {
        console.log('初始化');


        // Reset the game
        correctCards = 0;
        $('#cardPile').html('');
        $('#cardSlots').html('');

        // 16,15,14,17,11,12,13
        // Create the pile of shuffled cards
        var numbers = [1, 2, 3, 4];
        numbers.sort(function () { return Math.random() - .5 });

        for (var i = 0; i < 4; i++) {
            $("<div class='cs-pic cs-pic-p"+numbers[i]+"'></div>").data('number', numbers[i]).appendTo('#cardPile').draggable({
                containment: '.cs-db',
                stack: '#cardPile div',
                cursor: 'move',
                revert: true
            })
        }
        // Create the card slots
        var words = [1,2,3,4];
        for (var i = 0; i < 4; i++) {
            $('<div class="cs-pic-dp'+  words[i]+'"></div>').data('number', words[i]).appendTo('#cardSlots').droppable({
                accept: '#cardPile div',
                hoverClass: 'hovered',
                drop: handleCardDrop
            });
        }
        // $('<div class="trueBox"></div>').data('number', 1).appendTo('#cardSlots').droppable({
        //     accept: '#cardPile div',
        //     hoverClass: 'hovered',
        //     drop: handleCardDrop 
        // });
        // $('<div class="falseBox"></div>').data('number', 2).appendTo('#cardSlots').droppable({
        //     accept: '#cardPile div',
        //     hoverClass: 'hovered',
        //     drop: handleCardDrop
        // });

    }

    function handleCardDrop( event, ui ) {
        var slotNumber = $(this).data( 'number' );
        var cardNumber = ui.draggable.data( 'number' );
        // var trueList = [16,15,14,17,11,12,13];
        // If the card was dropped to the correct slot,
        // change the card colour, position it directly
        // on top of the slot, and prevent it being dragged
        // again
        console.log('slotNumber==cardNumber',slotNumber,cardNumber);
        if ( slotNumber==cardNumber ) {
            if(cardNumber==3){
                $('.cs-mask-p3').css('display','block'); 
                ui.draggable.css('z-index','1');
            }
          ui.draggable.addClass( 'correct' );
          ui.draggable.draggable( 'disable' );
        //   $(this).droppable( 'disable' );
          ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
           
            // ui.draggable.css('visibility','hidden');
          ui.draggable.draggable( 'option', 'revert', false );
          correctCards++;
        } 
        
        // If all the cards have been placed correctly then display a message
        // and reset the cards for another go
      
        if ( correctCards == 4 ) {
            drgaCallback()
            
        }
      
      }
});