document.addEventListener('DOMContentLoaded', function() {
    // Load YouTube API
    loadYouTubeAPI();
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !expanded);
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Navigation link highlighting
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Get the href attribute
            const href = this.getAttribute('href');
            const isInternalLink = href && href.startsWith('#');
            // For external links (partnership.html, variants.html, etc.)
            if (!isInternalLink) {
                console.log("External navigation to:", href); // Debug log
                return; 
            }
            e.preventDefault();
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
                navLink.classList.remove('text-white');
                navLink.classList.add('text-gray-300');
            });
            // Add active class to clicked link
            this.classList.add('active');
            this.classList.remove('text-gray-300');
            this.classList.add('text-white');
            // Scroll to the target section for internal links
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Change navbar style on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('main-nav');
        if (window.scrollY > 50) {
            navbar.classList.add('bg-opacity-90');
        } else {
            navbar.classList.remove('bg-opacity-90');
        }
    });
    initVariantTabs();
    initTimelineInteractivity();
    initGalleryFilters();
    // Global Partnership Map Interaction
    const partnerCountries = document.querySelectorAll('.partner-country');
    const countryIndicators = document.querySelectorAll('[data-country]');
    // Highlight corresponding country when indicator is hovered
    countryIndicators.forEach(indicator => {
        indicator.addEventListener('mouseenter', () => {
            const country = indicator.getAttribute('data-country');
            document.querySelectorAll(`.partner-country[data-country="${country}"]`)
                .forEach(path => path.style.fillOpacity = '0.8');
        });
        indicator.addEventListener('mouseleave', () => {
            const country = indicator.getAttribute('data-country');
            document.querySelectorAll(`.partner-country[data-country="${country}"]`)
                .forEach(path => path.style.fillOpacity = '0.5');
        });
    });
    // Create tooltip for countries
    partnerCountries.forEach(country => {
        country.addEventListener('mouseenter', function(e) {
            const countryName = this.getAttribute('data-country');
            const countryNames = {
                'usa': 'United States',
                'uk': 'United Kingdom',
                'italy': 'Italy',
                'australia': 'Australia',
                'japan': 'Japan',
                'skorea': 'South Korea'
            };
        });
    });

    // Check if partnerships map container exists
    const mapContainer = document.getElementById('partnership-map');
    if (!mapContainer) return;
    // Initialize the map using amCharts library
    am4core.ready(function() {
        // Disable animations for better performance
        am4core.options.animationsEnabled = false;
        // Create map instance
        let chart = am4core.create("partnership-map", am4maps.MapChart);
        // Set map definition
        chart.geodata = am4geodata_worldLow;
        // Set projection to show entire globe
        chart.projection = new am4maps.projections.Miller();
        // Disable all interaction
        chart.seriesContainer.draggable = false;
        chart.seriesContainer.resizable = false;
        chart.maxZoomLevel = 1; // Prevent zooming in
        chart.minZoomLevel = 1; // Prevent zooming out
        chart.chartContainer.wheelable = false; // Disable mouse wheel zoom
        // Background styling
        chart.background.fill = am4core.color("#0d1b2a");
        chart.background.fillOpacity = 0;
        // Create map polygon series for all countries (base layer)
        let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
        polygonSeries.useGeodata = true;
        polygonSeries.exclude = ["AQ"]; // Exclude Antarctica
        // Set regular country appearance
        let polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.fill = am4core.color("#1a1f2e"); // stealth color
        polygonTemplate.stroke = am4core.color("#3a86ff");
        polygonTemplate.strokeWidth = 0.2;
        polygonTemplate.strokeOpacity = 0.15;
        polygonTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;
        // Configure series for partner nations
        let partnerSeries = chart.series.push(new am4maps.MapPolygonSeries());
        partnerSeries.name = "Partner Nations";
        partnerSeries.useGeodata = true;
        partnerSeries.include = [
            "US", // United States
            "GB", // United Kingdom
            "IT", // Italy
            "AU", // Australia
            "JP", // Japan
            "KR", // South Korea
            "NL", // Netherlands
            "NO", // Norway
            "DK", // Denmark
            "CA", // Canada
            "IL"  // Israel - ADDED
        ];
        // Set partner nations appearance
        let partnerTemplate = partnerSeries.mapPolygons.template;
        partnerTemplate.fill = am4core.color("#3a86ff");
        partnerTemplate.fillOpacity = 0.7;
        partnerTemplate.stroke = am4core.color("#3a86ff");
        partnerTemplate.strokeWidth = 0.5;
        // Update the tooltip implementation in the amCharts section
        partnerTemplate.tooltipHTML = `
          <div style="display: flex; align-items: center; padding: 5px;">
            <img src="https://flagcdn.com/w20/{id}.png" style="margin-right: 8px; border: 1px solid rgba(255, 255, 255, 0.2);" />
            <span style="font-family: 'Rajdhani', sans-serif;">{name}</span>
          </div>
        `;
        // Make sure the adapter function works correctly
        partnerTemplate.adapter.add("tooltipHTML", function(html, target) {
          if (target.dataItem && target.dataItem.dataContext) {
            const id = target.dataItem.dataContext.id.toLowerCase();
            console.log("Country code:", id); // Debug line
            return html.replace("{id}", id);
          }
          return html;
        });
        // Add hover effect to partner nations
        let hs = partnerTemplate.states.create("hover");
        hs.properties.fill = am4core.color("#3a86ff");
        hs.properties.fillOpacity = 0.9;
        // Add grid lines
        chart.gridLines = new am4maps.MapGridLines();
        chart.gridLines.line.stroke = am4core.color("#3a86ff");
        chart.gridLines.line.strokeOpacity = 0.08;
        chart.gridLines.line.strokeWidth = 0.5;
        // Add glow filter to partner nations
        let glowFilter = new am4core.DropShadowFilter();
        glowFilter.color = am4core.color("#3a86ff");
        glowFilter.blur = 10;
        glowFilter.opacity = 0.5;
        partnerTemplate.filters.push(glowFilter);
        // Center on the world
        chart.homeGeoPoint = { longitude: 0, latitude: 0 };
        chart.homeZoomLevel = 1;
        chart.goHome();
    });
});

// YouTube API functions
function loadYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    // Insert script into page
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
// Video variables
let player;
let videoDuration = 0;
const START_TIME = 5; 
const END_TRIM = 8; 

// This function is called automatically by YouTube API when it's ready
window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('yt-player', {
        videoId: 'lkZJRJxWIUg', // 
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'rel': 0,
            'showinfo': 0,
            'loop': 1,
            'playlist': 'lkZJRJxWIUg', 
            'mute': 1, 
            'playsinline': 1,
            'modestbranding': 1,
            'enablejsapi': 1,
            'start': START_TIME 
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerReady(event) {
    // Start playback
    event.target.playVideo();
    videoDuration = player.getDuration();
    setInterval(checkVideoTime, 1000);
    try {
        const iframe = document.querySelector('#yt-player iframe');
        if (iframe) {
            iframe.style.position = 'fixed';
            iframe.style.width = '100vw';
            iframe.style.height = '120vh'; 
            iframe.style.top = '50%';
            iframe.style.left = '50%';
            iframe.style.transform = 'translate(-50%, -50%)';
        }
    } catch (e) {
        console.log('Could not style iframe', e);
    }
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        player.seekTo(START_TIME);
        player.playVideo();
    }
}

function checkVideoTime() {
    if (player && player.getCurrentTime) {
        const currentTime = player.getCurrentTime();
        if (videoDuration > 0 && currentTime >= (videoDuration - END_TRIM - 0.5)) {
            // Jump back to start
            player.seekTo(START_TIME);
        }
    }
}

// This function handles tab switching
function initVariantTabs() {
    const variantTabs = document.querySelectorAll('.variant-tab');
    const variantContents = document.querySelectorAll('.variant-content');
    
    variantTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            variantTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            variantContents.forEach(content => {
                content.classList.add('hidden');
                content.classList.remove('active');
            });
            // Show the selected content panel
            const variant = this.getAttribute('data-variant');
            const targetPanel = document.getElementById('variant-' + variant);
            targetPanel.classList.remove('hidden');
            targetPanel.classList.add('active');
        });
    });
}

// This function handles timeline interactivity
function initTimelineInteractivity() {
    const timelineSection = document.querySelector('#operations');
    if (!timelineSection) return; 
    const timelineItems = timelineSection.querySelectorAll('.space-y-16 > div');
    timelineItems.forEach(item => {
        if (!item.classList.contains('timeline-entry')) {
            item.classList.add('timeline-entry');
        }
    });
    // Observer for fade-in animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('timeline-visible');
                const marker = entry.target.querySelector('.timeline-marker');
                if (marker) marker.classList.add('animate-timeline-pulse');
            }
        });
    }, { threshold: 0.2 });
    // Observe all timeline entries
    const timelineEntries = document.querySelectorAll('.timeline-entry');
    timelineEntries.forEach(entry => {
        observer.observe(entry);
    });
    // Make timeline cards clickable to show more content
    const timelineDetails = document.querySelectorAll('.timeline-details');
    timelineDetails.forEach(detail => {
        detail.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
        
            this.classList.toggle('timeline-expanded');
            
            const expandedContent = this.querySelector('.timeline-expanded-content');
            if (expandedContent) {
                if (this.classList.contains('timeline-expanded')) {
                    expandedContent.style.maxHeight = expandedContent.scrollHeight + 'px';
                } else {
                    expandedContent.style.maxHeight = '0px';
                }
            }
        });
    });
    
    // Timeline progress bar
    const timelineProgress = document.querySelector('.timeline-progress');
    if (timelineProgress) {
        window.addEventListener('scroll', function() {
            const sectionTop = timelineSection.getBoundingClientRect().top;
            const sectionHeight = timelineSection.offsetHeight;
            const viewportHeight = window.innerHeight;
            
            let progressHeight = 0;
            
            if (sectionTop < 0) {
                const scrolledPastTop = Math.abs(sectionTop);
                const maxScrollPosition = sectionHeight - viewportHeight;
                const scrollProgress = Math.min(scrolledPastTop / maxScrollPosition, 1);
                
                progressHeight = Math.min(sectionHeight * scrollProgress, sectionHeight);
            }
            
            timelineProgress.style.height = progressHeight + 'px';
        });
    }

    // Fix for timeline line extending too far
    function adjustTimelineLine() {
        const timelineContainer = document.querySelector('#operations .space-y-16');
        if (!timelineContainer) return;
        
        const timelineEntries = timelineContainer.querySelectorAll('.timeline-entry');
        if (timelineEntries.length === 0) return;
        
        // Get the first and last timeline entry
        const firstEntry = timelineEntries[0];
        const lastEntry = timelineEntries[timelineEntries.length - 1];
        
        // Calculate positions
        const firstPos = firstEntry.getBoundingClientRect().top - timelineContainer.getBoundingClientRect().top;
        const lastPos = lastEntry.getBoundingClientRect().bottom - timelineContainer.getBoundingClientRect().top;
        
        // Adjust center line height
        const centerLine = document.querySelector('#operations .hidden.md\\:block.absolute.left-1\\/2');
        if (centerLine) {
            centerLine.style.top = (firstPos + 20) + 'px'; // Adjust based on marker position
            centerLine.style.height = (lastPos - firstPos - 40) + 'px'; // Subtract some padding
            centerLine.style.bottom = 'auto'; // Override any bottom positioning
        }
        
        const progressLine = document.querySelector('.timeline-progress');
        if (progressLine) {
            progressLine.style.top = (firstPos + 20) + 'px';
            progressLine.style.height = '0px'; // Start with 0 height, will be animated on scroll
            progressLine.setAttribute('data-max-height', (lastPos - firstPos - 40) + 'px');
        }
    }
    
    // Call initially and on window resize
    adjustTimelineLine();
    window.addEventListener('resize', adjustTimelineLine);
    
    // Update the progress line scroll handler
    if (document.querySelector('.timeline-progress')) {
        window.addEventListener('scroll', function() {
            const timelineSection = document.querySelector('#operations');
            const timelineProgress = document.querySelector('.timeline-progress');
            const maxHeight = parseFloat(timelineProgress.getAttribute('data-max-height') || 0);
            
            const sectionTop = timelineSection.getBoundingClientRect().top;
            const sectionHeight = timelineSection.offsetHeight;
            const viewportHeight = window.innerHeight;
            
            let progressHeight = 0;
            
            if (sectionTop < 0) {
                const scrolledPastTop = Math.abs(sectionTop);
                const maxScrollPosition = sectionHeight - viewportHeight;
                const scrollProgress = Math.min(scrolledPastTop / maxScrollPosition, 1);
                
                progressHeight = Math.min(maxHeight * scrollProgress, maxHeight);
            }
            
            timelineProgress.style.height = progressHeight + 'px';
        });
    }
}

// This function handles gallery filtering
function initGalleryFilters() {
    const galleryFilters = document.querySelectorAll('.gallery-filter');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active state
            galleryFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}