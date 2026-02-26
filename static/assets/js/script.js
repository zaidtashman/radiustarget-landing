document.addEventListener('DOMContentLoaded', function() {
    
    /* --------------------------------------------------
       Mobile Menu Logic
    -------------------------------------------------- */
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');

    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }

    /* --------------------------------------------------
       Map Comparison Logic
    -------------------------------------------------- */
    const mapContainer = document.getElementById('map-container');
    
    // Check if map container exists before initializing Leaflet
    if (mapContainer) {
        const centerPoint = [33.95, -118.2437];
        const zoomLevel = 10;
        
        // 1. Initialize "Before" Map
        var mapBefore = L.map('map-before', { 
            center: centerPoint, 
            zoom: zoomLevel, 
            zoomControl: false, 
            scrollWheelZoom: false, 
            dragging: false, 
            attributionControl: false 
        });
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { 
            subdomains: 'abcd', 
            maxZoom: 20 
        }).addTo(mapBefore);

        var laPolygonPoints = [[33.94604785957606, -117.97062613259399], [33.90281485440156, -117.97660513012127], [33.84612584346322, -118.05893013946809], [33.77947183391495, -118.09657314049362], [33.758476831819145, -118.09198213805331], [33.73706882789909, -118.11952214099136], [33.697155823076855, -118.12591213891174], [33.69059981622018, -118.23702015705197], [33.66343381113919, -118.27425116115054], [33.66343180722245, -118.34542717305868], [33.72552880740235, -118.46697419824487], [33.7536688094803, -118.48558920357809], [33.803158815001034, -118.48449520733766], [33.839061821217385, -118.44398020345717], [33.95305382930078, -118.52345922587983], [33.98767783118222, -118.55736823433044], [33.98749616585407, -118.57661661177684], [34.0397948, -118.5796177], [34.0888558, -118.5203945], [34.1198454, -118.2760245], [34.1090442, -117.9684073], [33.94604785957606, -117.97062613259399]];
        
        L.polygon(laPolygonPoints, { 
            color: '#ef4444', 
            fillColor: '#ef4444', 
            fillOpacity: 0.25, 
            weight: 1 
        }).addTo(mapBefore);

        // 2. Initialize "After" Map
        var mapAfter = L.map('map-after', { 
            center: centerPoint, 
            zoom: zoomLevel, 
            zoomControl: false, 
            scrollWheelZoom: false, 
            dragging: false, 
            attributionControl: false 
        });
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { 
            subdomains: 'abcd', 
            maxZoom: 20 
        }).addTo(mapAfter);

        const circles = [{ lat: 33.96, lon: -118.219, radiusMi: 3.0 }, { lat: 34.115, lon: -118.1, radiusMi: 3.0 }, { lat: 34.00, lon: -118.30, radiusMi: 3.0 }, { lat: 34.05, lon: -118.38, radiusMi: 3.5 }, { lat: 33.90, lon: -118.1, radiusMi: 3.0 }, { lat: 34.06, lon: -118.20, radiusMi: 3.5 }, { lat: 33.94, lon: -118.42, radiusMi: 3.0 }];
        
        circles.forEach(c => { 
            L.circle([c.lat, c.lon], { 
                radius: c.radiusMi * 1609.34, 
                color: "#10b981", 
                weight: 2, 
                fillColor: "#10b981", 
                fillOpacity: 0.25 
            }).addTo(mapAfter); 
        });

        // 3. Slider Interactions
        const slider = document.getElementById('comparison-slider');
        const beforeWrapper = document.getElementById('before-wrapper');
        const beforeInner = document.getElementById('map-before-inner');
        const handle = document.getElementById('slider-handle');

        function updateSlider() {
            const percent = slider.value;
            beforeWrapper.style.width = `${percent}%`;
            handle.style.left = `calc(${percent}% - 20px)`;
        }

        function syncMapWidth() {
            if(mapContainer && beforeInner) {
                const fullWidth = mapContainer.offsetWidth;
                beforeInner.style.width = fullWidth + 'px';
                mapBefore.invalidateSize();
                mapAfter.invalidateSize();
            }
        }

        slider.addEventListener('input', updateSlider);
        window.addEventListener('resize', syncMapWidth);
        
        // Initial setup
        syncMapWidth();
        updateSlider();
        setTimeout(syncMapWidth, 100);
    }
});