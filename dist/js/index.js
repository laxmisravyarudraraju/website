import {
    signup,
    login,
    logout
} from './login';

import {
    checkout
} from './stripe';

import {
    showAlert
} from './alert';

import {
    sendComment,
    addReview,
    addLike,
    deleteLike
} from './comment';

import {
    checkOffer
} from './offer';

import {
    updateSettings
} from './updateSettings';

import {
    startTimer
} from './timer';
import {
    sign
} from 'jsonwebtoken';


$(function () {
    /*********************************VARIABLES*********************************/

    let curPage = 1,
        curSection = 1,
        curImage = 1;

    /*********************************EVENT HANDLERS*********************************/
    if ($('.section__top--loggedIn')) {
        setInterval(() => {
            slideTo(curImage++);
        }, 2500);
    };

    // down arrow clicked
    $('.btn-down').click(function () {
        curSection = 1;
        scrollTo(2);
    })

    // to function dots
    $('a.side-dots__link').click(function (e) {
        $('*').removeClass('dot-active');
        e.preventDefault();
        curPage = $(this)[0].id.split('-')[1] * 1;
        scrollTo(curPage);
    })

    $('.slide-dots__link').click(function (e) {
        e.preventDefault();
        curImage = $(this)[0].id.split('-')[1] * 1;
        slideTo(curImage);
    });


    $('textarea').keydown(function (e) {
        if (e.keyCode === 13) {
            this.value = this.value + '\n'
        }
    })

    // move up and down using keys
    $(window).keydown(function (e) {
        $('*').removeClass('dot-active');
        if (e.keyCode === 13 || e.keyCode === 40) {
            e.preventDefault();
            scrollSection('down');
            curSection += 1;
        } else if (e.keyCode === 38) {
            curSection -= 1;
            scrollSection('up');
        } else if (e.keyCode === 37) {
            if (curImage > 1) curImage -= 1;
            slideTo(curImage);
        } else if (e.keyCode === 39) {
            if (curImage < $('.portfolioBox__img').length) curImage += 1;
            slideTo(curImage);
        }
        animatedOn();
        reset();
        $(`#dot-${curSection}`).addClass('dot-active');
    });

    $('.blogfeed__collections--item').click(function () {
        localStorage.setItem('collection', $(this)[0].dataset.id);
    });

    // $('.btn-likes').click(async function () {
    //     $('.btn-likes .icon').toggleClass('isNotClicked');
    // });

    $('.comments__login, .plan__login, .btn-addReview').click(function () {
        $('.popup').css("display", "flex");
    });

    $('.btn-close').click(function () {
        $('.popup').css("display", "none");
    })

    $('.nav__link, .user__sidebar--item').click(function () {
        localStorage.setItem('id', this.dataset.id);
    });

    $('.btn-selectCoupon').click(function () {
        localStorage.setItem('coupon', this.closest('.offer').dataset.id);
        checkOffer();
    });

    $('.weFollow__link').click(function (e) {
        e.preventDefault();
        $('.weFollow__link').removeClass('activeItem');
        $(this).addClass('activeItem')
    });

    $('.btn-signup').click(function (e) {
        e.preventDefault();
        const name = $('#name').val();
        const email = $('#email').val();
        const password = $('#password').val();
        const confirmPassword = $('#confirmPassword').val();
        signup(name, email, password, confirmPassword);
    })

    $('.btn-login').click(function (e) {
      console.log('button clicked')
        e.preventDefault();
        const email = $('.form__input[type=email]').val();
        const password = $('.form__input[type=password]').val();
        login(email, password);
        $('.form__input').val('');
    });

    $('.btn-logout').click(function (e) {
        e.preventDefault();
        logout();
    });

    $('.btn-likes .icon-heart-outlined').click(async function (e) {
        e.preventDefault();
        await addLike();
    });

    $('.btn-likes .icon-heart').click(async function (e) {
        e.preventDefault();
        await deleteLike();
    });

    $('.comments__send').click(async function (e) {
        e.preventDefault();
        const comment = $('.commentBox').val();
        await sendComment(comment);
    });

    $('.btn-sendReview').click(async function (e) {
        e.preventDefault();
        const review = $('.addReview__textBox').val();
        const rating = localStorage.getItem('rating');
        await addReview(review, rating * 1);
    })

    $('.buy__plan').click(async function (e) {
        e.preventDefault();
        $(this).css('background', '#048d54')
        $(this).text('Processing..');
        await checkout(this.dataset.id);
    });

    $('.btn-edit-plan').click(function (e) {
        e.preventDefault();
        $(`.editPlans__form[data-id=${this.dataset.id}]`).slideDown(500);
    })

    $('.btn-cancelEdit').click(function (e) {
        e.preventDefault();
        $(`.editPlans__form`).slideUp(500);
    })

    $('.btn-addCollection').click(function (e) {
        e.preventDefault();
        $('.addCollection__box').slideDown(500);
    })

    $('.btn-cancel-edit-mode').click(function (e) {
        e.preventDefault();
        $('.addCollection__box').slideUp(500);
        localStorage.removeItem('collec');
        if ($('.btn-addCollection').hasClass('edit-mode')) {
            $('.edit-mode .icon use').attr('href', "./img/sprite.svg#icon-plus");
            $('.edit-mode .manage__text').text(`Add to Collections`);
            $('.btn-addCollection').removeClass('edit-mode')
        }
    })

    $('input[name=collections]').click(function (e) {
        e.preventDefault();
        $('.addCollection__box').slideUp(500);
        $('.btn-addCollection').addClass('edit-mode');
        localStorage.setItem('collec', $('input[name=collections]:checked').val());
        // localStorage.setItem('edit-mode', 'on');
        $('.edit-mode .btn-add').addClass('btn-white');
        $('.edit-mode .icon use').attr('href', "./img/sprite.svg#icon-pencil");
        $('.edit-mode .manage__text').text(`Added to: ${localStorage.getItem('collec')}`);
    })

    $('.icon-clickable').hover(function () {
        // $(this).toggleClass('icon-starGrey');
        const curRating = $(this)[0].dataset.rating * 1;
        for (let i = 0; i <= 5; i++) {
            if (i <= curRating) {
                $(`.icon-clickable[data-rating=${i}]`).addClass('icon-star');
                $(`.icon-clickable[data-rating=${i}]`).removeClass('icon-starGrey');
            } else {
                $(`.icon-clickable[data-rating=${i}]`).addClass('icon-starGrey');
                $(`.icon-clickable[data-rating=${i}]`).removeClass('icon-star');
            }
        }
        localStorage.setItem('rating', curRating);
    });

    $('.btn-save-userinfo').click(async function (e) {
        e.preventDefault();
        const form = new FormData();
        form.append('name', $('input[name=name]').val());
        form.append('email', $('input[name=email]').val());
        if ($('input[type=file')[0].files.length !== 0) form.append('photo', $('input[type=file')[0].files[0]);
        await updateSettings(form, 'data');
    });

    $('.btn-save-password').click(async function (e) {
        e.preventDefault();
        const currentPassword = $('.currentPassword').val();
        const newPassword = $('.newPassword').val();
        const confirmPassword = $('.confirmPassword').val();
        await updateSettings({
            currentPassword,
            newPassword,
            confirmPassword
        }, 'password');
    })

    $('input[type=file]').change(async function () {
        if ($(this)[0].files && $(this)[0].files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $('.account__img--content').attr('src', reader.result);
            }
            reader.readAsDataURL($(this)[0].files[0]);
        }
    })

    $('.btn-cancel').click(function (e) {
        e.preventDefault();
        location.reload(true);
    })

    initStates();

    /*********************************FUNCTIONS*********************************/

    function initStates() {
        window.localStorage.clear();
        let id;
        const idArr = window.location.pathname.split('/');
        startTimer();

        // if (id === '/users/myaccount') localStorage.setItem('id', 'dashboard');

        const allowedFields = ['manageblogs', 'manageplans', 'manageusers', 'plans', 'blogs', 'home', 'contact', 'signup', 'settings', 'orders', 'dashboard', 'favourites', 'askaquestion', 'inbox', 'statistics'];
        idArr.forEach(el => {
            if (allowedFields.includes(el)) {
                id = el;
                localStorage.setItem('id', id);
            }
        });

        if (!id) localStorage.setItem('id', 'dashboard')

        if (window.location.search)
            localStorage.setItem('collection', window.location.search.split('=').slice(-1));
        else
            localStorage.setItem('collection', 'all');


        $('.editPlans__form').slideUp(0);
        $('.addCollection__box').slideUp(0);
        $(`.nav__link[data-id=${localStorage.getItem('id')}]`).addClass('active');
        $(`.user__sidebar--item[data-id=${localStorage.getItem('id')}]`).addClass('active-option');
        $(`.blogfeed__collections--item[data-id=${localStorage.getItem('collection')}]`).addClass('blogfeed__collections--active');
    }

    //reset function

    function reset() {
        curSection = curSection <= 1 ? 1 : curSection;
        curSection = curSection >= 5 ? 5 : curSection;
    }

    function slideTo(img) {
        $('*').removeClass('slide-active');
        $('*').removeClass('current__img');
        if (curImage < 1) curImage = $('.portfolioBox__img').length;
        else if (curImage > $('.portfolioBox__img').length) curImage = 1;
        $(`#img-${curImage}`).addClass('current__img');
        $(`#slide-${curImage}`).addClass('slide-active');
    }

    // scroll section function
    function scrollSection(dir) {
        if (dir === 'up') {
            $(`#section-${curSection}`).slideDown(1000, 'easeInOutExpo');
        } else if (dir === 'down' && curSection !== 5) {
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

    // jquery api for easing functions
    $.extend($.easing, {
        easeInOutExpo: function (x, t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    });
});
