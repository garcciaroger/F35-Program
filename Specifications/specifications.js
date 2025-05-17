document.addEventListener('DOMContentLoaded', function() {
    console.log("Setting up F-35 video background");
    setupVideoWithPreciseLoop();
    // ===== MOBILE MENU TOGGLE =====
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    // ===== NAVIGATION ACTIVE STATE =====
    const navLinks = document.querySelectorAll('.nav-link');
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
    // ===== NAVBAR SCROLL EFFECT =====
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('main-nav');
        if (navbar) {
            navbar.classList.toggle('bg-opacity-90', window.scrollY > 50);
        }
    });
    const viewButtons = document.querySelectorAll('.stealth-view-btn');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            viewButtons.forEach(btn => btn.classList.remove('active-view'));
            document.querySelectorAll('.stealth-view-panel').forEach(panel => {
                panel.classList.add('hidden');
                panel.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active-view');
            
            // Show corresponding panel
            const targetView = this.getAttribute('data-view');
            const targetPanel = document.getElementById('stealth-view-' + targetView);
            targetPanel.classList.remove('hidden');
            targetPanel.classList.add('active');
        });
    });

    // Tab functionality for the avionics section
    const tabs = document.querySelectorAll('.avionics-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            document.querySelectorAll('.avionics-tab').forEach(t => {
                t.classList.remove('active');
                t.classList.remove('bg-accent/20');
                t.classList.remove('text-accent');
                t.classList.add('text-gray-300');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            this.classList.add('bg-accent/20');
            this.classList.add('text-accent');
            this.classList.remove('text-gray-300');
            
            // Hide all panels
            document.querySelectorAll('.avionics-panel').forEach(p => {
                p.classList.add('hidden');
                p.classList.remove('active');
            });
            
            // Show corresponding panel
            const tabId = this.getAttribute('data-tab');
            const panel = document.getElementById(tabId + '-panel');
            panel.classList.remove('hidden');
            panel.classList.add('active');
        });
    });
});

// Main video setup function - using direct embed approach
function setupVideoWithPreciseLoop() {
    const videoContainer = document.querySelector('.video-container');
    if (!videoContainer) return;
    
    // Clear existing content
    videoContainer.innerHTML = '';
    
    // Add the iframe directly
    videoContainer.innerHTML = `
        <iframe 
            id="f35-video"
            src="https://www.youtube.com/embed/1lCOgFPtaZ4?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playlist=1lCOgFPtaZ4&loop=0&start=0"
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;">
        </iframe>
        <div class="logo-blocker"></div>
    `;
    
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
    
    const iframe = document.getElementById('f35-video');
    styleVideoForFullscreen(iframe);

    // Set up the precise loop timer for 42 seconds
    const LOOP_TIME = 42000; 
    
    // Initial timeout to start the loop
    setTimeout(function() {
        refreshVideo(iframe);
        setInterval(function() {
            refreshVideo(iframe);
        }, LOOP_TIME);
    }, LOOP_TIME);
    
    // Apply responsive styling on resize
    window.addEventListener('resize', function() {
        styleVideoForFullscreen(iframe);
    });
}

// Refresh the video to create a loop effect
function refreshVideo(iframe) {
    if (!iframe) return;
    
    console.log("Looping video at 42 seconds");
    const currentSrc = iframe.src;
    iframe.src = currentSrc;
}

// Apply fullscreen styling to video element
function styleVideoForFullscreen(videoElement) {
    if (!videoElement) return;
    
    if (window.innerWidth < 768) {
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

// Track the current image index
let currentEngineImageIndex = 0;
// Array of engine images and captions
const engineImages = [
    { src: 'Photos/f-135-1.jpg', caption: 'F135-PW-100 Variant' },
    { src: 'Photos/f135-3.jpeg', caption: 'F135 Engine Nozzle Detail' },
    { src: 'Photos/f135-4.avif', caption: 'F135 Engine Installation' }
];
// Function to change the main engine image with animated caption
function changeEngineImage(newSrc, caption, index = null) {
    // Get the main image element
    const mainImage = document.getElementById('main-engine-image');
    const captionElement = document.getElementById('engine-image-caption');
    // First fade out the image
    mainImage.style.opacity = '0.3';
    setTimeout(() => {
        // Update the main image
        mainImage.src = newSrc;
        // Reset the caption animation by removing and re-adding the text
        if (captionElement) {
            const captionText = caption;
            captionElement.textContent = "";
            // Add the text back after a brief delay to restart animation when hovered
            setTimeout(() => {
                captionElement.textContent = captionText;
            }, 50);
        }
        // Fade image back in
        mainImage.style.opacity = '1';
        // Update active thumbnail state
        const thumbnails = document.querySelectorAll('.grid.grid-cols-3 > div');
        thumbnails.forEach(thumb => {
            thumb.classList.remove('active-thumbnail');
        });
        // Set active thumbnail
        if (index !== null) {
            currentEngineImageIndex = index;
            thumbnails[index].classList.add('active-thumbnail');
        } else {
            // Find matching thumbnail
            thumbnails.forEach((thumb, idx) => {
                const thumbImg = thumb.querySelector('img');
                if (thumbImg && thumbImg.src.includes(newSrc.split('/').pop())) {
                    thumb.classList.add('active-thumbnail');
                    currentEngineImageIndex = idx;
                }
            });
        }
    }, 200);
}

// Function to navigate to the next image
function nextEngineImage() {
    const nextIndex = (currentEngineImageIndex + 1) % engineImages.length;
    const nextImage = engineImages[nextIndex];
    changeEngineImage(nextImage.src, nextImage.caption, nextIndex);
}

// Function to navigate to the previous image
function prevEngineImage() {
    const prevIndex = (currentEngineImageIndex - 1 + engineImages.length) % engineImages.length;
    const prevImage = engineImages[prevIndex];
    changeEngineImage(prevImage.src, prevImage.caption, prevIndex);
}
