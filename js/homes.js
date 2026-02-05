// Fallback data for when fetch fails (e.g. local file opening)
const FALLBACK_HOMES = [
    {
        "id": "3430-sharon-lane",
        "title": "3430 Sharon Ln",
        "price": "Contact for Pricing",
        "status": "Available",
        "description": "Brand New 2026 Champion / Dutch Home now on the market! \n\nGet a brand-new energy efficient home at a fraction of the cost of a nearby residential home.\nModern spacious kitchen with island, all stainless-steel new appliances.\nWooded lot with spectacular views.\nRapid Wall premium insulated skirting all along the bottom for energy efficiency and even lower utility bills.\nThis is a high quality all drywall Dutch home on a beautiful, secluded lot.\nThere are no property taxes for this home.\nClose to shopping district in a peaceful and beautiful country setting.",
        "features": [
            "3 Bedrooms",
            "2 Bathrooms",
            "1,493 Sq Ft",
            "Dimensions: 27' x 56'",
            "All Drywall Interior",
            "Stainless-Steel Appliances",
            "Modern Kitchen with Island",
            "Wooded lot with views",
            "Manufacturer: Champion / Dutch Home",
            "Model: Warren",
            "Rapid Wall Premium Insulated Skirting"
        ],
        "photos": [
            "assets/homes/sharon-main.webp",
            "assets/homes/sharon-ext.webp",
            "assets/homes/sharon-bath.webp",
            "assets/homes/sharon-kitchen.webp",
            "assets/homes/sharon-living.webp",
            "assets/homes/sharon-bed.webp",
            "assets/homes/sharon-interior-1.webp",
            "assets/homes/sharon-interior-2.webp",
            "assets/homes/sharon-interior-3.webp"
        ]
    }
];

function renderHomes(homes) {
    const homesGrid = document.getElementById('homes-grid');
    if (!homesGrid) return;

    homesGrid.innerHTML = ''; // Clear loading state

    homes.forEach(home => {
        const card = document.createElement('div');
        card.className = 'glass-card home-card';
        card.style.overflow = 'hidden';
        card.style.transition = 'transform 0.3s ease';

        // Main image (first one)
        const mainImage = home.photos[0] || 'assets/placeholder.webp';

        // Top features (first 3)
        const topFeatures = home.features.slice(0, 3).map(f =>
            `<span style="background: rgba(27, 77, 62, 0.1); color: var(--color-primary); padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 500;">${f}</span>`
        ).join('');

        card.innerHTML = `
            <a href="listing.html?id=${home.id}" style="display: block; position: relative; height: 250px; overflow: hidden;">
                <img src="${mainImage}" alt="${home.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;">
                <div style="position: absolute; top: 1rem; right: 1rem; background: var(--color-accent); color: var(--color-primary-dark); padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-weight: 700; font-size: 0.8rem; text-transform: uppercase;">
                    ${home.status}
                </div>
            </a>
            <div style="padding: 1.5rem;">
                <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">${home.title}</h3>
                <p style="color: var(--color-primary); font-weight: 700; font-size: 1.25rem; margin-bottom: 1rem;">${home.price}</p>
                
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
                    ${topFeatures}
                </div>

                <a href="listing.html?id=${home.id}" class="btn btn-outline" style="width: 100%; text-align: center;">View Details</a>
            </div>
        `;

        // Hover effect
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.querySelector('img').style.transform = 'scale(1.1)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.querySelector('img').style.transform = 'scale(1)';
        });

        homesGrid.appendChild(card);
    });

    // Inject Notify Card
    const notifyCard = document.createElement('div');
    notifyCard.className = 'glass-card hover-animate'; // Reusing glass-card and adding hover effect
    notifyCard.style.display = 'flex';
    notifyCard.style.flexDirection = 'column';
    notifyCard.style.alignItems = 'center';
    notifyCard.style.justifyContent = 'center';
    notifyCard.style.textAlign = 'center';
    notifyCard.style.cursor = 'pointer';
    notifyCard.style.height = '250px'; // Match image height of home cards
    notifyCard.style.padding = '1.5rem';
    notifyCard.style.border = '2px solid var(--color-primary-light)'; // Solid border, distinct but cohesive

    notifyCard.innerHTML = `
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem; color: var(--color-primary);">🔔</div>
        <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem; color: var(--color-primary-dark);">Stay Updated</h3>
        <p style="color: var(--color-text-muted); font-size: 0.9rem;">Get notified when a new home goes on the market!</p>
    `;

    // Add click listener to open modal
    notifyCard.addEventListener('click', () => {
        const modal = document.getElementById('notify-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });

    homesGrid.appendChild(notifyCard);
}

// Function to get query param
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Check if we are on the listing details page
const detailId = getQueryParam('id');

if (detailId) {
    // We are on listing.html, fetch data and render details
    fetch('data/homes.json?v=' + new Date().getTime())
        .then(response => response.json())
        .catch(err => {
            console.warn('Fetch failed, using fallback data', err);
            return FALLBACK_HOMES;
        })
        .then(homes => {
            const home = homes.find(h => h.id === detailId);
            if (home) {
                renderListingDetails(home);
            } else {
                document.getElementById('listing-details').innerHTML = '<p>Home not found.</p>';
            }
        });
} else {
    // We are on index.html or properties.html, render grid
    fetch('data/homes.json')
        .then(response => response.json())
        .catch(err => {
            console.warn('Fetch failed, using fallback data', err);
            return FALLBACK_HOMES;
        })
        .then(homes => {
            renderHomes(homes);
        });
}



function getFeatureIcon(text) {
    const t = (text || '').toLowerCase();
    const color = 'var(--color-primary)';

    // Bed / Bedroom
    if (t.includes('bed')) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>`;
    }

    // Bath / Bathroom
    if (t.includes('bath')) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="12" x="4" y="6" rx="2"/><path d="M9 21V6"/><path d="M15 21V6"/><path d="M2 10h20"/></svg>`;
    }

    // Area / Dimensions
    if (t.includes('sq ft') || t.includes('dimensions') || t.includes('size')) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 21V7h14"/><path d="M7 11h4"/><path d="M7 15h4"/><path d="M11 7v14"/><path d="M15 7v14"/></svg>`;
    }

    // Kitchen
    if (t.includes('kitchen')) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.6 9c.6-.6 1.4-1 2.4-1 2 0 3.5 1.5 3.5 3.5v11"/><path d="M9.6 9c-.6-.6-1.4-1-2.4-1-2 0-3.5 1.5-3.5 3.5v11"/><path d="M7 2v5"/><path d="M17 2v5"/><line x1="2" y1="12" x2="22" y2="12"/></svg>`;
    }

    // Manufacturer / Tag
    if (t.includes('model') || t.includes('manufact') || t.includes('brand')) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`;
    }

    // Skirting / Insulation
    if (t.includes('skirting') || t.includes('insulat') || t.includes('wall')) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M13 14h-2"/><path d="M13 18h-2"/></svg>`;
    }

    // Default Check
    return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
}

function renderListingDetails(home) {
    const container = document.getElementById('listing-content');
    if (!container) return;

    // Format features with icons
    const featuresHtml = home.features.map(f => `
        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 0; border-bottom: 1px solid #eee;">
            <div style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; background: rgba(27, 77, 62, 0.05); border-radius: 50%;">
                ${getFeatureIcon(f)}
            </div>
            <span style="font-size: 1.05rem; color: var(--color-text-body); font-weight: 500;">${f}</span>
        </div>
    `).join('');

    // Format gallery
    const galleryHtml = home.photos.map((photo, index) => `
        <img src="${photo}" alt="${home.title}" class="gallery-img" style="width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius-sm); cursor: pointer; transition: transform 0.3s ease;" onclick="openLightbox(${index})">
    `).join('');

    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-md" style="align-items: start;">
            <!-- Left Column: Images -->
            <div>
                <!-- Main Image -->
                <div class="glass-card" style="padding: 0.5rem; overflow: hidden; margin-bottom: 2rem; cursor: pointer;" onclick="openLightbox(0)">
                    <img src="${home.photos[0]}" alt="${home.title}" style="width: 100%; height: auto; border-radius: var(--radius-sm);">
                </div>

                <!-- Gallery Section (Moved Up) -->
                <div>
                    <h2 style="font-size: 1.5rem; margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">Photo Gallery</h2>
                    <div class="gallery-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 0.5rem;">
                        ${galleryHtml}
                    </div>
                </div>
            </div>

            <!-- Right Column: Details -->
            <div>
                <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem;">${home.title}</h1>
                <p style="font-size: 2rem; color: var(--color-primary); font-weight: 700; margin-bottom: 1.5rem;">${home.price}</p>
                
                <div class="glass-card" style="padding: 1.5rem; margin-bottom: 2rem;">
                    <h3 style="margin-bottom: 1rem;">Description</h3>
                    <p style="color: var(--color-text-muted); white-space: pre-wrap;">${home.description}</p>
                </div>

                <div style="margin-bottom: 2rem;">
                    <h3 style="margin-bottom: 1rem;">Features & Specs</h3>
                    <div style="display: flex; flex-direction: column;">
                        ${featuresHtml}
                    </div>
                </div>

                <a href="contact.html?interest=${home.id}" class="btn btn-primary" style="width: 100%; text-align: center; font-size: 1.2rem;">Detailed Inquiry / Schedule Viewing</a>
            </div>
        </div>
    `;

    // Initialize Lightbox if not already present
    if (!document.getElementById('lightbox')) {
        createLightbox(home.photos);
    } else {
        // Update photos if re-rendering (rare case without reload, but good practice)
        window.currentPhotos = home.photos;
    }
}

// Lightbox Logic
let currentSlideIndex = 0;
let currentPhotos = [];

function createLightbox(photos) {
    window.currentPhotos = photos;

    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
        <button class="lightbox-prev" onclick="changeSlide(-1)">&#10094;</button>
        <button class="lightbox-next" onclick="changeSlide(1)">&#10095;</button>
        <img class="lightbox-content" id="lightbox-img" src="">
        <div class="lightbox-caption" id="lightbox-caption"></div>
    `;
    document.body.appendChild(lightbox);

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (document.getElementById('lightbox').classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') changeSlide(-1);
            if (e.key === 'ArrowRight') changeSlide(1);
        }
    });

    // Close on background click
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

function openLightbox(index) {
    currentSlideIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    lightboxImg.src = window.currentPhotos[currentSlideIndex];
    lightboxCaption.innerText = `${currentSlideIndex + 1} / ${window.currentPhotos.length}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

function changeSlide(n) {
    currentSlideIndex += n;
    if (currentSlideIndex >= window.currentPhotos.length) {
        currentSlideIndex = 0;
    }
    if (currentSlideIndex < 0) {
        currentSlideIndex = window.currentPhotos.length - 1;
    }

    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    // Simple fade effect
    lightboxImg.style.opacity = '0.5';
    setTimeout(() => {
        lightboxImg.src = window.currentPhotos[currentSlideIndex];
        lightboxCaption.innerText = `${currentSlideIndex + 1} / ${window.currentPhotos.length}`;
        lightboxImg.style.opacity = '1';
    }, 150);
}

