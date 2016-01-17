
$(function () {
    $(window).on("load resize", function () {
        $(".fill-screen").css("height", window.innerHeight);
    });

    // add Bootstrap's scrollspy
    $('body').scrollspy({
        target: '.navbar',
        offset: 160
    });

    // smooth scrolling
    $('nav a, .down-button a').bind('click', function () {
        $('html, body').stop().animate({
            scrollTop: $($(this).attr('href')).offset().top - 100
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });

    // initialize WOW for element animation
    new WOW().init();

    // initialize NanoGallery
    $(document).ready(function () {
        $("#nanoGallery3").nanoGallery();
    });

	// for initialize the background video

	 $("#video-wallpaper").wallpaper({
                source: {
                    poster: "image/photos/water-pink-bleu.jpg",
                    mp4: "video/deltahacks.mp4",
					mp4: "video/deltahacks.mp4",
					ogg: "video/The Water Drop-HD.ogv",
					ogg: "video/The Water Drop-Mobile.ogv",
					webm: "video/The Water Drop-HD.webm",
					webm: "video/The Water Drop-Mobile.webm"

                }
            });

});
