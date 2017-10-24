/*!
 * pagepiling.js 1.5.4
 *
 * https://github.com/alvarotrigo/pagePiling.js
 * @license MIT licensed
 *
 * Copyright (C) 2016 alvarotrigo.com - A project by Alvaro Trigo
 */
(function ($, document, window, undefined) {
    'use strict';

        $.fn.pillUp = function(options) {

            var defaults = {
                'first': 1
            } ;
            var settings = $.extend({}, defaults, options);


            return $(this).each(function() {
            
                var p = $.fn.pillUp;
                var container = $(this);

                if(container.hasClass('pilled')) return;
                container.addClass('pilled');

                var items = container.children('div.section');
                var last_item;
                var last_index;
                var animation_time = 1000;
                var current;
                var zindex = 1;
                var nav_list; 

                container.css({
                    'position' : 'relative', 
                    'overflow': 'hidden',
                    'width': 'inherit',
                    'height': 'inherit'
                });

                items.each(function(index){  
     
                    this.pos = {
                        x: (container.width() - $(this).width()) / 2,
                        y: -$(this).height(),
                        h: $(this).height(),
                        w: $(this).width()
                    }
                    $(this).css({
                        'position' : 'absolute',
                        'top' : this.pos.y+'px',
                        'left': this.pos.x+'px',
                        'width': this.pos.w+'px',
                        'height': this.pos.h+'px',
                        'z-index': 0,
                    });                
                    $(this).attr('data-index',index);
                });                

                function buildNav () {

                    var ul = $(document.createElement('ul'));
                    ul.addClass('pillup-menu');
                    items.each(function(index){
                        var li = $(document.createElement('li'));
                        if(index == 0) li.addClass('active');
                        var a = $(document.createElement('a'));
                        a.html('item'+index);
                        a.attr('data-index',index);
                        a.attr('title',$(this).attr('data-title'));
                        a.attr('href',"#");
                        a.click(clickNav);
                        li.append($(a));
                        ul.append($(li));                    
                    });

                    nav_list = ul;
                    container.parent().prepend(ul);

                    var next = $(document.createElement('a'));
                    next.attr('href','#next').addClass('pillup-next').click(showNext);

                    var prev = $(document.createElement('a'));
                    prev.attr('href','#prev').addClass('pillup-prev').click(showPrev);

                    container.prepend(next).prepend(prev);
                }

                function clickNav(e) {
                    var index = $(this).attr('data-index');
                    show(index);
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }

                function show(index) {
                    current = index;
                    if(current == last_index) return;

                    var item = $(items[index]);
                    beforeShow(item);
                    zindex++;
                    item.css({'z-index' : zindex,'top': '0px','transition': 'top '+Math.floor(animation_time/1000)+'s ease-in-out'});
                    updateNav(index);   

                    setTimeout(proxy(showItemTerminated,this,[index]), animation_time);                   
                }

                function showItemTerminated(index) {
                    var item = $(items[index]);
                    if(last_item) last_item.css('transition','none').css('top',last_item[0].pos.y).css('z-index',0); 
                    last_item = item;
                    last_item.css('z-index',1);
                    last_index = index;
                    zindex--;

                    afterShow(item);
                }

                function beforeShow(item) {
                    if(item.attr('data-exec-before')) {
                        var func = item.attr('data-exec-before');
                        if(typeof window[func] === 'function') {
                            window[func]();
                        }
                        
                    }
                }

                function afterShow(item) {

                }

                function showFirstItem() {
                    var first = settings.first - 1;
                    var item = $(items[first]);
                    item.css('top','0px');
                    last_item = item;
                    current = first;
                }

                function showNext(e) {
                    current++;
                    if(current > items.length-1) return current = items.length-1;
                    show(current);
                                    
                    return e.preventDefault();    
                }

                function showPrev(e) {
                    current--;
                    if(current < 0) return current = 0;
                    show(current);
                    
                    return e.preventDefault();
                }

                function updateNav(index) {
                    nav_list.find('li').removeClass('active');
                    nav_list.find('li:nth-child('+(parseInt(index)+1)+')').addClass('active');
                }

                function proxy(method, scope, args) { 
                    if(args == undefined ) return function() { return method.apply(scope, arguments); } 
                    else return function() { return method.apply(scope, args); } 
                }


                buildNav();
                showFirstItem();

                return this;    
            });
        };


})(jQuery, document, window);