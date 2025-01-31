// page init
jQuery(function(){
    initMobileNav();
    initScrollTop();
    initMarquee();
    initAnchors();
});

// smooth anchor links
function initAnchors() {
    /* global SmoothScroll */

    // common case:
    new SmoothScroll({
        extraOffset: $('.anchor-nav').height() || 0,
        anchorLinks: '.anchor-nav a',
        activeClasses: 'link',
        wheelBehavior: 'ignore',
        animDuration: 800
    });
}


// running line init
function initMarquee() {
    jQuery('.crawlline').marquee({
        line: 'div.line-wrap',
        animSpeed: 30,
        initialDelay: 1000
    });
}




jQuery(document).ready(function($){
    $('.row').each(function(){
        var highestBox = 0;
        $('.sameheight', this).each(function(){
            if($(this).height() > highestBox) {
                highestBox = $(this).height();
            }
        });
        $('.sameheight',this).height(highestBox);
    });
});


function initScrollTop() {
    var win = jQuery(window);
    var headerClass = 'header-fixed';
    var scrollHeight = 0;
    var header = jQuery('#wrapper');

    // add class to header
    function addClass(){
        var scrollTop = win.scrollTop();
        if (scrollTop > scrollHeight){
            header.addClass(headerClass);
        } else {
            header.removeClass(headerClass);
        }
    }

    win.on('scroll', addClass);

}


function initMobileNav() {
    jQuery('body').mobileNav({
        hideOnClickOutside: true,
        menuActiveClass: 'nav-active',
        menuOpener: '.nav-opener',
        menuDrop: '#nav'
    });;

    jQuery('body').mobileNav({
        hideOnClickOutside: true,
        menuActiveClass: 'award-active',
        menuOpener: '.award-btn',
        menuDrop: '.award-holder'
    });;
}

/*
 * Simple Mobile Navigation
 */
;(function($) {
    function MobileNav(options) {
        this.options = $.extend({
            container: null,
            hideOnClickOutside: false,
            menuActiveClass: 'nav-active',
            menuOpener: '.nav-opener',
            menuDrop: '.nav-drop',
            toggleEvent: 'click',
            outsideClickEvent: 'click touchstart pointerdown MSPointerDown'
        }, options);
        this.initStructure();
        this.attachEvents();
    }
    MobileNav.prototype = {
        initStructure: function() {
            this.page = $('html');
            this.container = $(this.options.container);
            this.opener = this.container.find(this.options.menuOpener);
            this.drop = this.container.find(this.options.menuDrop);
        },
        attachEvents: function() {
            var self = this;

            if(activateResizeHandler) {
                activateResizeHandler();
                activateResizeHandler = null;
            }

            this.outsideClickHandler = function(e) {
                if(self.isOpened()) {
                    var target = $(e.target);
                    if(!target.closest(self.opener).length && !target.closest(self.drop).length) {
                        self.hide();
                    }
                }
            };

            this.openerClickHandler = function(e) {
                e.preventDefault();
                self.toggle();
            };

            this.opener.on(this.options.toggleEvent, this.openerClickHandler);
        },
        isOpened: function() {
            return this.container.hasClass(this.options.menuActiveClass);
        },
        show: function() {
            this.container.addClass(this.options.menuActiveClass);
            if(this.options.hideOnClickOutside) {
                this.page.on(this.options.outsideClickEvent, this.outsideClickHandler);
            }
        },
        hide: function() {
            this.container.removeClass(this.options.menuActiveClass);
            if(this.options.hideOnClickOutside) {
                this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
            }
        },
        toggle: function() {
            if(this.isOpened()) {
                this.hide();
            } else {
                this.show();
            }
        },
        destroy: function() {
            this.container.removeClass(this.options.menuActiveClass);
            this.opener.off(this.options.toggleEvent, this.clickHandler);
            this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
        }
    };

    var activateResizeHandler = function() {
        var win = $(window),
            doc = $('html'),
            resizeClass = 'resize-active',
            flag, timer;
        var removeClassHandler = function() {
            flag = false;
            doc.removeClass(resizeClass);
        };
        var resizeHandler = function() {
            if(!flag) {
                flag = true;
                doc.addClass(resizeClass);
            }
            clearTimeout(timer);
            timer = setTimeout(removeClassHandler, 500);
        };
        win.on('resize orientationchange', resizeHandler);
    };

    $.fn.mobileNav = function(options) {
        return this.each(function() {
            var params = $.extend({}, options, {container: this}),
                instance = new MobileNav(params);
            $.data(this, 'MobileNav', instance);
        });
    };
}(jQuery));







/*
 * jQuery <marquee> plugin
 */
;(function($){
    function Marquee(options) {
        this.options = $.extend({
            holder: null,
            handleFlexible: true,
            pauseOnHover: true,
            hoverClass: 'hover',
            direction: 'left',
            cloneClass: 'cloned',
            mask: null,
            line: '>*',
            items: '>*',
            animSpeed: 10, // px per second
            initialDelay: 0
        }, options);
        this.init();
    }
    Marquee.prototype = {
        init: function() {
            if(this.options.holder) {
                this.initStructure();
                this.attachEvents();
            }
        },
        initStructure: function() {
            // find elements
            this.holder = $(this.options.holder);
            this.mask = this.options.mask ? this.holder.find(this.options.mask) : this.holder,
                this.line = this.mask.find(this.options.line),
                this.items = this.line.find(this.options.items).css({'float':'left'});
            this.direction = (this.options.direction === 'left') ? -1 : 1;
            this.recalculateDimensions();

            // prepare structure
            this.cloneItems = this.items.clone().addClass(this.options.cloneClass).appendTo(this.line);
            if(this.itemWidth >= this.maskWidth) {
                this.activeLine = true;
                this.offset = (this.direction === -1 ? 0 : this.maxOffset);
            } else {
                this.activeLine = false;
                this.cloneItems.hide();
                this.offset = 0;
            }
            this.line.css({
                width: this.itemWidth * 2,
                marginLeft: this.offset
            });
        },
        attachEvents: function() {
            // flexible layout handling
            var self = this;
            if(this.options.handleFlexible) {
                this.resizeHandler = function() {
                    self.recalculateDimensions();
                    if(self.itemWidth < self.maskWidth) {
                        self.activeLine = false;
                        self.cloneItems.hide();
                        self.stopMoving();
                        self.offset = 0;
                        self.line.css({marginLeft: self.offset});
                    } else {
                        self.activeLine = true;
                        self.cloneItems.show();
                        self.startMoving();
                    }
                };
                $(window).bind('resize orientationchange', this.resizeHandler);
            }

            // pause on hover
            if(this.options.pauseOnHover) {
                this.hoverHandler = function() {
                    self.stopMoving();
                    self.holder.addClass(self.options.hoverClass);
                };
                this.leaveHandler = function() {
                    self.startMoving();
                    self.holder.removeClass(self.options.hoverClass);
                };
                this.holder.bind({ mouseenter: this.hoverHandler, mouseleave: this.leaveHandler });
            }

            // initial delay
            setTimeout(function(){
                self.initialFlag = true;
                self.startMoving();
            }, self.options.initialDelay || 1);
        },
        recalculateDimensions: function() {
            // calculate block dimensions
            var self = this;
            this.maskWidth = this.mask.width();
            this.itemWidth = 1;
            this.items.each(function(){
                self.itemWidth += $(this).outerWidth(true);
            });
            this.maxOffset = -this.itemWidth;
        },
        startMoving: function() {
            // start animation
            var self = this;
            if(self.activeLine && self.initialFlag) {
                var targetOffset = (self.direction < 0 ? self.maxOffset : 0);

                self.offset = parseInt(self.line.css('marginLeft'), 10) || 0;
                self.line.stop().animate({
                    marginLeft: targetOffset
                }, {
                    duration: Math.abs(1000 * (self.offset - targetOffset) / self.options.animSpeed),
                    easing: 'linear',
                    complete: function() {
                        self.offset = (self.direction < 0 ? 0 : self.maxOffset);
                        self.line.css({marginLeft: self.offset});
                        self.startMoving();
                    }
                });
            }
        },
        stopMoving: function() {
            // stop animation
            this.line.stop();
        },
        destroy: function() {
            this.stopMoving();
            this.cloneItems.remove();
            this.items.css({'float':''});
            this.line.css({marginLeft:'',width:''});
            this.holder.removeClass(this.options.hoverClass);
            this.holder.unbind('mouseenter', this.hoverHandler);
            this.holder.unbind('mouseleave', this.leaveHandler);
            $(window).unbind('resize orientationchange', this.resizeHandler);
        }
    };

    // jQuery plugin interface
    $.fn.marquee = function(opt) {
        return this.each(function() {
            jQuery(this).data('Marquee', new Marquee($.extend(opt, {holder: this})));
        });
    };
}(jQuery));





var TxtType = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(function() {
        that.tick();
    }, delta);
};

window.onload = function() {
    var elements = document.getElementsByClassName('typewrite');
    for (var i=0; i<elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #3b3952}";
    document.body.appendChild(css);
};








/*!
 * SmoothScroll module
 */
;(function($, exports) {
    // private variables
    var page,
        win = $(window),
        activeBlock, activeWheelHandler,
        wheelEvents = ('onwheel' in document || document.documentMode >= 9 ? 'wheel' : 'mousewheel DOMMouseScroll');

    // animation handlers
    function scrollTo(offset, options, callback) {
        // initialize variables
        var scrollBlock;
        if (document.body) {
            if (typeof options === 'number') {
                options = { duration: options };
            } else {
                options = options || {};
            }
            page = page || $('html, body');
            scrollBlock = options.container || page;
        } else {
            return;
        }

        // treat single number as scrollTop
        if (typeof offset === 'number') {
            offset = { top: offset };
        }

        // handle mousewheel/trackpad while animation is active
        if (activeBlock && activeWheelHandler) {
            activeBlock.off(wheelEvents, activeWheelHandler);
        }
        if (options.wheelBehavior && options.wheelBehavior !== 'none') {
            activeWheelHandler = function(e) {
                if (options.wheelBehavior === 'stop') {
                    scrollBlock.off(wheelEvents, activeWheelHandler);
                    scrollBlock.stop();
                } else if (options.wheelBehavior === 'ignore') {
                    e.preventDefault();
                }
            };
            activeBlock = scrollBlock.on(wheelEvents, activeWheelHandler);
        }

        // start scrolling animation
        scrollBlock.stop().animate({
            scrollLeft: offset.left,
            scrollTop: offset.top
        }, options.duration, function() {
            if (activeWheelHandler) {
                scrollBlock.off(wheelEvents, activeWheelHandler);
            }
            if ($.isFunction(callback)) {
                callback();
            }
        });
    }

    // smooth scroll contstructor
    function SmoothScroll(options) {
        this.options = $.extend({
            anchorLinks: 'a[href^="#"]',	// selector or jQuery object
            container: null,		// specify container for scrolling (default - whole page)
            extraOffset: null,		// function or fixed number
            activeClasses: null,	// null, "link", "parent"
            easing: 'swing',		// easing of scrolling
            animMode: 'duration',	// or "speed" mode
            animDuration: 800,		// total duration for scroll (any distance)
            animSpeed: 1500,		// pixels per second
            anchorActiveClass: 'anchor-active',
            sectionActiveClass: 'section-active',
            wheelBehavior: 'stop', // "stop", "ignore" or "none"
            useNativeAnchorScrolling: false // do not handle click in devices with native smooth scrolling
        }, options);
        this.init();
    }
    SmoothScroll.prototype = {
        init: function() {
            this.initStructure();
            this.attachEvents();
        },
        initStructure: function() {
            this.container = this.options.container ? $(this.options.container) : $('.profile-holder');
            this.scrollContainer = this.options.container ? this.container : win;
            this.anchorLinks = $(this.options.anchorLinks);
        },
        getAnchorTarget: function(link) {
            // get target block from link href
            var targetId = $(link).attr('href');
            return $(targetId.length > 1 ? targetId : 'html');
        },
        getTargetOffset: function(block) {
            // get target offset
            var blockOffset = block.offset().top;
            if (this.options.container) {
                blockOffset -= this.container.offset().top - this.container.prop('scrollTop');
            }

            // handle extra offset
            if (typeof this.options.extraOffset === 'number') {
                blockOffset -= this.options.extraOffset;
            } else if (typeof this.options.extraOffset === 'function') {
                blockOffset -= this.options.extraOffset(block);
            }
            return { top: blockOffset };
        },
        attachEvents: function() {
            var self = this;

            // handle active classes
            if (this.options.activeClasses) {
                // cache structure
                this.anchorData = [];
                this.anchorLinks.each(function() {
                    var link = jQuery(this),
                        targetBlock = self.getAnchorTarget(link),
                        anchorDataItem;

                    $.each(self.anchorData, function(index, item) {
                        if (item.block[0] === targetBlock[0]) {
                            anchorDataItem = item;
                        }
                    });

                    if (anchorDataItem) {
                        anchorDataItem.link = anchorDataItem.link.add(link);
                    } else {
                        self.anchorData.push({
                            link: link,
                            block: targetBlock
                        });
                    }
                });

                // add additional event handlers
                this.resizeHandler = function() {
                    self.recalculateOffsets();
                };
                this.scrollHandler = function() {
                    self.refreshActiveClass();
                };

                this.recalculateOffsets();
                this.scrollContainer.on('scroll', this.scrollHandler);
                win.on('resize', this.resizeHandler);
            }

            // handle click event
            this.clickHandler = function(e) {
                self.onClick(e);
            };
            if (!this.options.useNativeAnchorScrolling) {
                this.anchorLinks.on('click', this.clickHandler);
            }
        },
        recalculateOffsets: function() {
            var self = this;
            $.each(this.anchorData, function(index, data) {
                data.offset = self.getTargetOffset(data.block);
                data.height = data.block.outerHeight();
            });
            this.refreshActiveClass();
        },
        refreshActiveClass: function() {
            var self = this,
                foundFlag = false,
                containerHeight = this.container.prop('scrollHeight'),
                viewPortHeight = this.scrollContainer.height(),
                scrollTop = this.options.container ? this.container.prop('scrollTop') : win.scrollTop();

            // user function instead of default handler
            if (this.options.customScrollHandler) {
                this.options.customScrollHandler.call(this, scrollTop, this.anchorData);
                return;
            }

            // sort anchor data by offsets
            this.anchorData.sort(function(a, b) {
                return a.offset.top - b.offset.top;
            });
            function toggleActiveClass(anchor, block, state) {
                anchor.toggleClass(self.options.anchorActiveClass, state);
                block.toggleClass(self.options.sectionActiveClass, state);
            }

            // default active class handler
            $.each(this.anchorData, function(index) {
                var reverseIndex = self.anchorData.length - index - 1,
                    data = self.anchorData[reverseIndex],
                    anchorElement = (self.options.activeClasses === 'parent' ? data.link.parent() : data.link);

                if (scrollTop >= containerHeight - viewPortHeight) {
                    // handle last section
                    if (reverseIndex === self.anchorData.length - 1) {
                        toggleActiveClass(anchorElement, data.block, true);
                    } else {
                        toggleActiveClass(anchorElement, data.block, false);
                    }
                } else {
                    // handle other sections
                    if (!foundFlag && (scrollTop >= data.offset.top - 1 || reverseIndex === 0)) {
                        foundFlag = true;
                        toggleActiveClass(anchorElement, data.block, true);
                    } else {
                        toggleActiveClass(anchorElement, data.block, false);
                    }
                }
            });
        },
        calculateScrollDuration: function(offset) {
            var distance;
            if (this.options.animMode === 'speed') {
                distance = Math.abs(this.scrollContainer.scrollTop() - offset.top);
                return (distance / this.options.animSpeed) * 1000;
            } else {
                return this.options.animDuration;
            }
        },
        onClick: function(e) {
            var targetBlock = this.getAnchorTarget(e.currentTarget),
                targetOffset = this.getTargetOffset(targetBlock);

            e.preventDefault();
            scrollTo(targetOffset, {
                container: this.container,
                wheelBehavior: this.options.wheelBehavior,
                duration: this.calculateScrollDuration(targetOffset)
            });
        },
        destroy: function() {
            if (this.options.activeClasses) {
                win.off('resize', this.resizeHandler);
                this.scrollContainer.off('scroll', this.scrollHandler);
            }
            this.anchorLinks.off('click', this.clickHandler);
        }
    };

    // public API
    $.extend(SmoothScroll, {
        scrollTo: function(blockOrOffset, durationOrOptions, callback) {
            scrollTo(blockOrOffset, durationOrOptions, callback);
        }
    });

    // export module
    exports.SmoothScroll = SmoothScroll;
}(jQuery, this));









