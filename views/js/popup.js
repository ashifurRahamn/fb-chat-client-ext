/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function() {
    // sliding top menu
    $('.online-users').click(function() {
        $('.top-menu-container').slideToggle('slow', function() {
            });
    });

    $('.arrow , .top-menu-footer').click(function() {
        $('.top-menu-container').slideUp('slow', function() {
            });
    });
    $('.typing-box').click(function(){
        if(this.value == 'type your message here'){
            this.value='';
        }
    }).mouseout(function(){
        if(this.value == ''){
            //use i18n later for message
            this.value='type your message here';
        }
    });
    $('.icons').click(function(){
        $('.emoticons-container').toggle();
    });
    $('body').click(function(event){
        if( !$(event.target.parentNode).hasClass('emoticons') &&
            !$(event.target.parentNode).hasClass('emoticons-middle') &&
            !$(event.target.parentNode).hasClass('emoticons-container') &&
            !$(event.target.parentNode).hasClass('icons') &&
            !$(event.target).hasClass('emoticons') &&
            !$(event.target).hasClass('emoticons-middle') &&
            !$(event.target).hasClass('emoticons-container') &&
            !$(event.target).hasClass('icons') ){

            $('.emoticons-container').hide();
        }
    });
    $('.emoticons').click(function(){
        if($("#chat-text-box").attr('value')=='type your message here'){
            $("#chat-text-box").attr('value',$(this).attr('value'));
        }else{
            $("#chat-text-box").attr('value', $("#chat-text-box").attr('value')+$(this).attr('value'));
        }

    });
    // users slider
    var currentPosition = 0;
    var slideWidth = 50;
    var slides = $('.slide');
    var numberOfSlides = slides.length;

    // Remove scrollbar in JS
    $('#slidesContainer').css('overflow', 'hidden');

    // Wrap all .slides with #slideInner div
    slides
    .wrapAll('<div id="slideInner"></div>')
    // Float left to display horizontally, readjust .slides width
    .css({
        'float' : 'left',
        'width' : slideWidth
    });

    // Set #slideInner width equal to total width of all slides
    $('#slideInner').css('width', slideWidth * numberOfSlides);

    // Insert controls in the DOM
    $('#slideshow')
    .prepend('<span class="control" id="leftControl">Clicking moves left</span>')
    .append('<span class="control" id="rightControl">Clicking moves right</span>');

    // Hide left arrow control on first load
    manageControls(currentPosition);

    // Create event listeners for .controls clicks
    $('.control')
    .bind('click', function(){
        // Determine new position
        currentPosition = ($(this).attr('id')=='rightControl') ? currentPosition+1 : currentPosition-1;

        // Hide / show controls
        manageControls(currentPosition);
        // Move slideInner using margin-left
        $('#slideInner').animate({
            'marginLeft' : slideWidth*(-currentPosition)
        });
    });

    // manageControls: Hides and Shows controls depending on currentPosition
    function manageControls(position){
        // Hide left arrow if position is first slide
        if(position==0){
            $('#leftControl').hide()
        } else{
            $('#leftControl').show()
        }
        // Hide right arrow if position is last slide
        if(position==numberOfSlides-6){
            $('#rightControl').hide()
        } else{
            $('#rightControl').show()
        }
    }
});

/*var emotions = [
        {
            id:'',
            src:'',
            value:''
        },
        {
            id:'',
            src:'',
            value:''
        },
        {
            id:'',
            src:'',
            value:''
        },
        {
            id:'',
            src:'',
            value:''
        },
        {
            id:'',
            src:'',
            value:''
        },
        {
            id:'',
            src:'',
            value:''
        },
        {
            id:'',
            src:'',
            value:''
        },
        {
            id:'',
            src:'',
            value:''
        },
        {
            id:'',
            src:'',
            value:''
        },
        {
            id:'',
            src:'',
            value:''
        },
        {
            id:'',
            src:'',
            value:''
        },
        {
            id:'',
            src:'',
            value:''
        },
        {
            id:'',
            src:'',
            value:''
        }
]
*/