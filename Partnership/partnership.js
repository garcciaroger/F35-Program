// ===== CONSTANTS =====
const VIDEO_ID = '9LgH-Rwdwhs'; 
const MOBILE_BREAKPOINT = 768; 
const VIDEO_END_TIME = 82; 

// YouTube Player variable
let player;

// ===== MAIN INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing F-35 Partnerships page...");
    
    // Load YouTube API
    loadYouTubeAPI();
    
    // Initialize all page components
    setupMobileMenu();
    setupNavigation();
    initializePartnershipMap();
});


function loadYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// This function is called automatically by the YouTube API when it's ready
function onYouTubeIframeAPIReady() {
    setupVideoBackground();
}

// ===== VIDEO BACKGROUND FUNCTIONS =====
function setupVideoBackground() {
    console.log("Setting up F-35 partnership video background");
    const videoContainer = document.querySelector('.video-container');
    if (!videoContainer) {
        console.warn('Video container not found');
        return;
    }
    
    // Clear existing content
    videoContainer.innerHTML = '';
    
    // Create a div for the player
    const playerDiv = document.createElement('div');
    playerDiv.id = 'f35-video';
    videoContainer.appendChild(playerDiv);
    
    // Add logo blocker div
    const logoBlocker = document.createElement('div');
    logoBlocker.className = 'logo-blocker';
    videoContainer.appendChild(logoBlocker);
    
    // Style container for fullscreen
    videoContainer.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        z-index: -1 !important;
        overflow: hidden !important;
        pointer-events: none !important;
    `;
    
    // Create YouTube player
    player = new YT.Player('f35-video', {
        videoId: VIDEO_ID,
        playerVars: {
            'autoplay': 1,
            'mute': 1,
            'controls': 0,
            'showinfo': 0,
            'rel': 0,
            'modestbranding': 1,
            'loop': 0, 
            'playsinline': 1,
            'start': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
    
    window.addEventListener('resize', function() {
        styleVideoForFullscreen(document.getElementById('f35-video'));
    });
}

/**
 * Triggered when the player is ready
 */
function onPlayerReady(event) {
    event.target.playVideo();
    styleVideoForFullscreen(document.getElementById('f35-video'));
}

/**
 * Triggered when the player's state changes
 */
function onPlayerStateChange(event) {
    // Check if the video is playing
    if (event.data === YT.PlayerState.PLAYING) {
        // Start checking the time
        checkTime();
    }
}

/**
 * Checks the current video time and restarts if it reaches the end point
 */
function checkTime() {
    if (player && typeof player.getCurrentTime === 'function') {
        const currentTime = player.getCurrentTime();
        
        if (currentTime >= VIDEO_END_TIME) {
            // Reached 1:22, restart from beginning
            player.seekTo(0);
        }
        
        // Continue checking every 500ms
        setTimeout(checkTime, 500);
    }
}

/**
 * Applies responsive fullscreen styling to the video
 * @param {HTMLElement} videoElement 
 */
function styleVideoForFullscreen(videoElement) {
    if (!videoElement) return;
    
    if (window.innerWidth < MOBILE_BREAKPOINT) {
        // Mobile styling - wide video centered
        videoElement.style.cssText = `
            position: absolute !important;
            top: 0 !important;
            left: -100% !important;
            width: 300% !important;
            height: 100% !important;
            border: none !important;
            pointer-events: none !important;
        `;
    } else {
        // Desktop styling - fill screen
        videoElement.style.cssText = `
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            width: 100% !important;
            height: 140% !important;
            transform: translate(-50%, -50%) !important;
            border: none !important;
            pointer-events: none !important;
        `;
    }
}

// ===== NAVIGATION FUNCTIONS =====

/**
 * Sets up the mobile menu toggle
 */
function setupMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    } else {
        console.warn('Mobile menu elements not found');
    }
}

/**
 * Sets up navigation active state handling
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    if (navLinks.length === 0) {
        console.warn('Navigation links not found');
        return;
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') e.preventDefault();
            
            navLinks.forEach(navLink => {
                navLink.classList.remove('active', 'text-white');
                navLink.classList.add('text-gray-300');
            });
            
            this.classList.add('active', 'text-white');
            this.classList.remove('text-gray-300');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('main-nav');
        if (navbar) {
            navbar.classList.toggle('bg-opacity-90', window.scrollY > 50);
        }
    });
}


function initializePartnershipMap() {
    // This function will be implemented for the partnership world map
    console.log("Partnership map functionality will be initialized here");
    
    // Check if the map container exists
    const mapContainer = document.getElementById('partnership-map');
    if (!mapContainer) {
        console.warn('Partnership map container not found');
        return;
    }
}
