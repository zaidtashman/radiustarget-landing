/* --------------------------------------------------
   2. Track Button Clicks
-------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function() {

    function trackClick(id, eventName, properties = {}) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', function() {
                amplitude.track(eventName, properties);
                console.log(`Amplitude Event: ${eventName}`);
            });
        }
    }

    /* --- TRACKERS --- */
    trackClick('btn-request-access', 'Request Access Clicked', { location: 'hero' });
    trackClick('btn-book-demo-desktop', 'Book Demo Clicked', { location: 'nav_desktop' });
    trackClick('btn-book-demo-mobile', 'Book Demo Clicked', { location: 'nav_mobile' });
    trackClick('btn-book-demo-footer', 'Book Demo Clicked', { location: 'footer' });
    trackClick('btn-watch-demo-hero', 'Watch Demo Clicked', { location: 'hero_button' });

    // Track Map Slider Interaction
    const sliderInput = document.getElementById('comparison-slider');
    if (sliderInput) {
        // 'change' fires only when the user commits the change (releases the mouse/finger)
        sliderInput.addEventListener('change', function() {
            amplitude.track('Map Slider Used', {
                final_position: this.value // Tracks if they slid it to 0%, 100%, or somewhere in between
            });
            console.log('Amplitude Event: Map Slider Used');
        });
    }
});

/* --------------------------------------------------
   3. Track YouTube Video (Play, Pause, Complete)
-------------------------------------------------- */
// Load YouTube IFrame API asynchronously
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {
    // 1 = Playing, 2 = Paused, 0 = Ended
    if (event.data == YT.PlayerState.PLAYING) {
        amplitude.track('Video Playing', { video_title: 'RadiusTarget Demo' });
    } else if (event.data == YT.PlayerState.PAUSED) {
        amplitude.track('Video Paused', { video_title: 'RadiusTarget Demo' });
    } else if (event.data == YT.PlayerState.ENDED) {
        amplitude.track('Video Completed', { video_title: 'RadiusTarget Demo' });
    }
}