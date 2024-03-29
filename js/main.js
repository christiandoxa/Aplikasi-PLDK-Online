function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

if (getCookie("login") === "false" || getCookie("login") === undefined || getCookie("login") === "") {
    $("#selamat_datang").html('Selamat Datang di PLDK SMK Telkom Malang!').typewriter({speed: 60});
}

jQuery(function ($) {
    "use strict";
    // Author Code Here

    var owlPricing;
    var ratio = 2;

    // Window Load
    $(window).load(function () {
        // Preloader
        $('.intro-tables, .parallax, header').css('opacity', '0');
        $('.preloader').addClass('animated fadeOut').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $('.preloader').hide();
            $('.parallax, header').addClass('animated fadeIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $('.intro-tables').addClass('animated fadeInUp').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
            });
        });

        // Header Init
        if ($(window).height() > $(window).width()) {
            var ratio = $('.parallax').width() / $('.parallax').height();
            $('.parallax img').css('height', ($(window).height()) + 'px');
            $('.parallax img').css('width', $('.parallax').height() * ratio + 'px');
        }

        $('header').height($(window).height() + 80);
        $('section .cut').each(function () {
            if ($(this).hasClass('cut-top'))
                $(this).css('border-right-width', $(this).parent().width() + "px");
            else if ($(this).hasClass('cut-bottom'))
                $(this).css('border-left-width', $(this).parent().width() + "px");
        });

        // Sliders Init
        $('.owl-schedule').owlCarousel({
            singleItem: true,
            pagination: true
        });
        $('.owl-testimonials').owlCarousel({
            singleItem: true,
            pagination: true
        });
        $('.owl-twitter').owlCarousel({
            singleItem: true,
            pagination: true
        });

        // Navbar Init
        $('nav').addClass('original').clone().insertAfter('nav').addClass('navbar-fixed-top').css('position', 'fixed').css('top', '0').css('margin-top', '0').removeClass('original');
        $('.mobile-nav ul').html($('nav .navbar-nav').html());
        $('nav.navbar-fixed-top .navbar-brand img').attr('src', $('nav.navbar-fixed-top .navbar-brand img').data("active-url"));

        // Popup Form Init
        var i = 0;
        var interval = 0.15;
        $('.popup-form .dropdown-menu li').each(function () {
            $(this).css('animation-delay', i + "s");
            i += interval;
        });
        $('.popup-form .dropdown-menu li a').click(function (event) {
            event.preventDefault();
            $(this).parent().parent().prev('button').html($(this).html());
        });

        // Onepage Nav
        $('.navbar.navbar-fixed-top .navbar-nav').onePageNav({
            currentClass: 'active',
            changeHash: false,
            scrollSpeed: 400,
            filter: ':not(.btn)'
        });
    });

    // Window Scroll
    function onScroll() {
        if ($(window).scrollTop() > 50) {
            $('nav.original').css('opacity', '0');
            $('nav.navbar-fixed-top').css('opacity', '1');
        } else {
            $('nav.original').css('opacity', '1');
            $('nav.navbar-fixed-top').css('opacity', '0');
        }
    }

    window.addEventListener('scroll', onScroll, false);

    // Window Resize
    $(window).resize(function () {
        $('header').height($(window).height());
    });

    // Pricing Box Click Event
    $('.pricing .box-main').click(function () {
        $('.pricing .box-main').removeClass('active');
        $('.pricing .box-second').removeClass('active');
        $(this).addClass('active');
        $(this).next($('.box-second')).addClass('active');
        $('#pricing').css("background-image", "url(" + $(this).data('img') + ")");
        $('#pricing').css("background-size", "cover");
    });

    // Mobile Nav
    $('body').on('click', 'nav .navbar-toggle', function () {
        event.stopPropagation();
        $('.mobile-nav').addClass('active');
    });

    $('body').on('click', '.mobile-nav a', function (event) {
        $('.mobile-nav').removeClass('active');
        if (!this.hash) return;
        event.preventDefault();
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            event.stopPropagation();
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });

    $('body').on('click', '.mobile-nav a.close-link', function (event) {
        $('.mobile-nav').removeClass('active');
        event.preventDefault();
    });

    $('body').on('click', 'nav.original .navbar-nav a:not([data-toggle])', function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            event.stopPropagation();
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });

    function centerModal() {
        $(this).css('display', 'block');
        var $dialog = $(this).find(".modal-dialog"),
            offset = ($(window).height() - $dialog.height()) / 2,
            bottomMargin = parseInt($dialog.css('marginBottom'), 10);

        // Make sure you don't hide the top part of the modal w/ a negative margin
        // if it's longer than the screen height, and keep the margin equal to
        // the bottom margin of the modal
        if (offset < bottomMargin) offset = bottomMargin;
        $dialog.css("margin-top", offset);
    }

    $('.modal').on('show.bs.modal', centerModal);

    $('.modal-popup .close-link').click(function (event) {
        event.preventDefault();
        $('#modal1').modal('hide');
    });

    $(window).on("resize", function () {
        $('.modal:visible').each(centerModal);
    });
});

var button_scan = '<a id="button_scan" href="javascript:void(0)" onclick="scanQRCode()" class="btn btn-blue wow fadeIn" data-wow-duration="5s" style="font-size: x-large">Scan QR Senior</a>';
var logout = '<a id="button_logout" href="javascript:void(0)" onclick="signOut()" class="btn btn-blue wow fadeIn" data-wow-duration="5s">Logout</a>';
var button_login = '<a href="#" data-toggle="modal" data-target="#modal1" class="btn btn-blue wow fadeIn">Masuk</a>';

new WOW().init();

function onSuccess(googleUser) {
    setCookie('login', 'true', 365);
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    /*$("#scan").html(button_scan);*/
    $("#login").html(logout);
    $("#login").html(logout);
    $("#login").html(logout);
    $("#selamat_datang").html("");
    $("#selamat_datang").html('Selamat Datang, ' + googleUser.getBasicProfile().getName() + '!').typewriter({speed: 60});
    console.log('running')
}

function onFailure(error) {
    console.log(error);
}

function renderButton() {
    gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 125,
        'height': 50,
        'longtitle': false,
        'theme': 'light',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}

function scanQRCode() {
    swal({
        title: '<i>HTML</i> <u>example</u>',
        type: 'info',
        html:
        '<video id="video" width="500" height="480" autoplay></video>\n' +
        '<button id="snap">Snap Photo</button>\n' +
        '<canvas id="canvas" width="500" height="480"></canvas>',
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
            '<i class="fa fa-thumbs-up"></i> Great!',
        confirmButtonAriaLabel: 'Thumbs up, great!',
        cancelButtonText:
            '<i class="fa fa-thumbs-down"></i>',
        cancelButtonAriaLabel: 'Thumbs down'
    });
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Not adding `{ audio: true }` since we only want video now
        navigator.mediaDevices.getUserMedia({video: true}).then(function (stream) {
            video.src = window.URL.createObjectURL(stream);
            video.play();
        });
    }
}

function signOut() {
    setCookie('login', 'false', 365);
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.disconnect();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        $("#selamat_datang").html('Selamat Datang di PLDK Online SMK Telkom Malang!').typewriter({speed: 60});
        /*$('#button_scan').fadeOut(1500, function () {
            $(this).remove();
        });*/
        $('#button_logout').fadeOut(1500, function () {
            $(this).remove();
        });
        $("#login").html(button_login);
        renderButton();
    });
}