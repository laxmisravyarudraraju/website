import jquery from "./jquery";


$(function () {
    /*********************************VARIABLES*********************************/

    let curPage = 1,
        curSection = 1,
        curImage = 1;

    /*********************************EVENT HANDLERS*********************************/

    // down arrow clicked
    $('.btn-down').on("click", function () {
        curSection = 1;
        scrollTo(2);
    })

    // to function dots
    $('a.side-dots__link').on("click", function (e) {
        $('*').removeClass('dot-active');
        e.preventDefault();
        curPage = $(this)[0].id.split('-')[1] * 1;
        scrollTo(curPage);
    })

    $('.slide-dots__link').on("click", function (e) {
        e.preventDefault();
        curImage = $(this)[0].id.split('-')[1] * 1;
        slideTo(curImage);
    });


    $('textarea').on("keydown", function (e) {
        if (e.key === "Enter") {
            this.value = this.value + '\n'
        }
    })

    // move up and down using keys
    $(window).on("keydown",function (e) {
        $('*').removeClass('dot-active');
        if (e.key === "Enter" || e.key === "ArrowDown") {
            e.preventDefault();
            scrollSection('down');
            curSection += 1;
        } else if (e.key === "ArrowUp") {
            curSection -= 1;
            scrollSection('up');
        } 
        animatedOn();
        reset();
        $(`#dot-${curSection}`).addClass('dot-active');
    });


    /*********************************FUNCTIONS*********************************/

    //reset function

    function reset() {
        curSection = curSection <= 1 ? 1 : curSection;
        curSection = curSection >= 4 ? 4 : curSection;
    }

    // scroll section function
    function scrollSection(dir) {
        if (dir === 'up') {
            $(`#section-${curSection}`).slideDown(1000, 'easeInOutExpo');
        } else if (dir === 'down' && curSection !== 4) {
            $(`#section-${curSection}`).slideUp(1000, 'easeInOutExpo');
        }
        animatedOff();
    }

    // scroll function when used dots
    function scrollTo(page) {
        $('*').removeClass('dot-active');
        if (page < curSection) {
            for (curSection; curSection >= page; curSection--) {
                scrollSection('up');
            }
            curSection++;
        } else if (page > curSection) {
            for (curSection; curSection < page; curSection++) {
                scrollSection('down');
            }
        }
        $(`#dot-${page}`).addClass('dot-active');
        animatedOn();
        reset();
    }

    //css animations
    function animatedOn() {
        if (curSection === 2) {
            $('.about__skills').addClass('animated');
        } else if (curSection === 3) {
            $('.plans__box').addClass('animated');
        }
    }

    function animatedOff() {
        $('.about__skills').removeClass('animated');
        $('.plans__box').removeClass('animated');
    }

    function animateDelay(el) {
        let index = 0;
        $(el).each(function () {
            $(this).css("animation-delay", `${index += 0.25}s`);
        });
    }

    animateDelay('.planInfo__feature');

    /*********************************WAYPOINTS*********************************/
    $('.js--wp-2').waypoint(function (direction) {
        $('.js--wp-2').addClass('js--animate');
        animateDelay('.technologyUsed__item');
    }, {
        offset: '50%'
    });

    /*********************************PLUGINS*********************************/

    //jquery api for easing functions
    $.extend($.easing, {
        easeInOutExpo: function (x, t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    });
});
