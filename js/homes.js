fetch('data/homes.json')
    .then(response => response.json())
    .then(homes => {
        const homesGrid = document.getElementById('homes-grid');
        homesGrid.innerHTML = ''; // Clear loading state

        homes.forEach(home => {
            const card = document.createElement('div');
            card.className = 'glass-card home-card';
            card.style.overflow = 'hidden';
            card.style.transition = 'transform 0.3s ease';

            // Main image (first one)
            const mainImage = home.photos[0] || 'assets/placeholder.jpg';

            // Top features (first 3)
            const topFeatures = home.features.slice(0, 3).map(f => 
                `<span style="background: rgba(27, 77, 62, 0.1); color: var(--color-primary); padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 500;">${f}</span>`
            ).join('');

            card.innerHTML = `
                <div style="position: relative; height: 250px; overflow: hidden;">
                    <img src="${mainImage}" alt="${home.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;">
                    <div style="position: absolute; top: 1rem; right: 1rem; background: var(--color-accent); color: var(--color-primary-dark); padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-weight: 700; font-size: 0.8rem; text-transform: uppercase;">
                        ${home.status}
                    </div>
                </div>
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
    })
    .catch(error => {
        console.error('Error loading homes:', error);
        document.getElementById('homes-grid').innerHTML = '<p>Sorry, could not load listings at this time.</p>';
    });
