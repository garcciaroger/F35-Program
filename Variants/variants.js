// ===== CONSTANTS =====
const VIDEO_START_TIME = 63; // 1:03 in seconds
const LOOP_DURATION = 25000; // 25 seconds in milliseconds
const VIDEO_ID = 'OeZ1DrnQl5c';
const MOBILE_BREAKPOINT = 768; // pixels

// ===== MAIN INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing F-35 Variants page...");
    
    // Initialize all page components
    setupVideoBackground();
    setupMobileMenu();
    setupNavigation();
    setupVariantTabs();
    setupF35iGallery(); 
});

// ===== VIDEO BACKGROUND FUNCTIONS =====

function setupVideoBackground() {
    console.log("Setting up F-35 video background");
    const videoContainer = document.querySelector('.video-container');
    if (!videoContainer) {
        console.warn('Video container not found');
        return;
    }
    
    // Clear existing content
    videoContainer.innerHTML = '';
    
    // Add the iframe with the video URL
    videoContainer.innerHTML = `
        <iframe 
            id="f35-video"
            src="https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playlist=${VIDEO_ID}&loop=0&start=${VIDEO_START_TIME}"
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
    
    // Get iframe and style it
    const iframe = document.getElementById('f35-video');
    if (iframe) {
        styleVideoForFullscreen(iframe);
        
        // Create interval to loop the specific segment
        setInterval(function() {
            refreshVideoWithTimestamp(iframe, VIDEO_START_TIME);
        }, LOOP_DURATION);
        
        // Apply responsive styling on resize
        window.addEventListener('resize', function() {
            styleVideoForFullscreen(iframe);
        });
    }
}

/**
 * Refreshes the video to a specific timestamp
 * @param {HTMLElement} iframe - The iframe element
 * @param {number} startTime - The timestamp in seconds
 */
function refreshVideoWithTimestamp(iframe, startTime) {
    if (!iframe) return;
    
    console.log(`Looping video back to ${startTime} seconds`);
    const baseUrl = iframe.src.split('?')[0];
    iframe.src = `${baseUrl}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playlist=${VIDEO_ID}&loop=0&start=${startTime}`;
}

/**
 * @param {HTMLElement} videoElement - The video element
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

// ===== NAVIGATION FUNCTIONS =====/
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

// ===== VARIANT TABS FUNCTIONS =====

/**
 * Sets up the variant tabs interactive behavior
 */
function setupVariantTabs() {
    const variantTabs = document.querySelectorAll('.variant-tab');
    const variantPanels = document.querySelectorAll('.variant-panel');
    const variantDisplays = document.querySelectorAll('.variant-display');
    
    if (variantTabs.length === 0) {
        console.warn('Variant tabs not found');
        return;
    }
    
    variantTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetVariant = this.getAttribute('data-variant');
            
            // Update tabs styling
            updateTabsVisuals(variantTabs, this);
            
            // Update content panels
            updateContentPanels(variantPanels, targetVariant);
            
            // Update aircraft displays
            updateAircraftDisplays(variantDisplays, targetVariant);
        });
    });
}

/**
 * Updates the tabs visual state
 * @param {NodeList} tabs - All tab elements
 * @param {HTMLElement} activeTab - The active tab
 */
function updateTabsVisuals(tabs, activeTab) {
    tabs.forEach(tab => {
        tab.classList.remove('active', 'border-accent', 'text-white');
        tab.classList.add('border-accent/30', 'text-gray-400');
    });
    
    activeTab.classList.add('active', 'border-accent', 'text-white');
    activeTab.classList.remove('border-accent/30', 'text-gray-400');
}

/**
 * Updates the content panels for the selected variant
 * @param {NodeList} panels - All panel elements
 * @param {string} targetVariant - The target variant ID
 */
function updateContentPanels(panels, targetVariant) {
    panels.forEach(panel => {
        if (panel.getAttribute('data-variant') === targetVariant) {
            panel.classList.remove('hidden');
            panel.classList.add('active');
            setTimeout(() => panel.classList.add('opacity-100'), 50);
        } else {
            panel.classList.add('hidden');
            panel.classList.remove('active', 'opacity-100');
        }
    });
}

/**
 * Updates the aircraft display visuals
 * @param {NodeList} displays - All display elements
 * @param {string} targetVariant - The target variant ID
 */
function updateAircraftDisplays(displays, targetVariant) {
    displays.forEach(display => {
        if (display.getAttribute('data-variant') === targetVariant) {
            display.classList.remove('opacity-0');
            display.classList.add('active', 'opacity-100');
            display.classList.remove('absolute');
        } else {
            display.classList.add('opacity-0', 'absolute');
            display.classList.remove('active', 'opacity-100');
        }
    });
}

// ===== F-35I GALLERY FUNCTIONS =====
function setupF35iGallery() {
    console.log("Initializing F-35I Adir gallery...");
    
    const galleryContainer = document.querySelector('.f35i-gallery-container');
    const galleryItems = document.querySelectorAll('.f35i-gallery-item');
    const indicators = document.querySelectorAll('.f35i-indicator');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    const currentSlideElement = document.getElementById('gallery-current');
    const totalSlidesElement = document.getElementById('gallery-total');

    if (totalSlidesElement) totalSlidesElement.textContent = galleryItems.length;

    if (!galleryContainer || !galleryItems.length || !indicators.length) {
        console.warn('F-35I gallery elements not found');
        return;
    }
    
    let currentIndex = 0;
    const itemCount = galleryItems.length;
    
    // Function to update gallery position
    function updateGallery() {
        galleryContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('bg-accent', 'shadow-glow');
                indicator.classList.remove('bg-accent/30');
            } else {
                indicator.classList.remove('bg-accent', 'shadow-glow');
                indicator.classList.add('bg-accent/30');
            }
        });
        
        // Update counter
        if (currentSlideElement) currentSlideElement.textContent = currentIndex + 1;
    }
    
    // Next button click
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % itemCount;
            updateGallery();
        });
    }
    
    // Previous button click
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + itemCount) % itemCount;
            updateGallery();
        });
    }
    
    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            currentIndex = index;
            updateGallery();
        });
    });
    
    // Auto-advance every 5 seconds
    setInterval(function() {
        currentIndex = (currentIndex + 1) % itemCount;
        updateGallery();
    }, 5000);
}