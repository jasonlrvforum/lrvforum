// Sample featured listings data
const featuredListings = [
    {
        id: 1,
        title: "Luxury Beach Resort",
        location: "Maui, Hawaii",
        price: 1200,
        type: "rental",
        week: "Week 26 (June 25-July 2)",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        featured: true,
        negotiable: true
    },
    {
        id: 2,
        title: "Mountain View Villa",
        location: "Vail, Colorado",
        price: 25000,
        type: "sale",
        week: "Week 51 (December 19-26)",
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        featured: true,
        negotiable: false
    },
    {
        id: 3,
        title: "Oceanfront Suite",
        location: "Cancun, Mexico",
        price: 900,
        type: "rental",
        week: "Week 32 (August 6-13)",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        featured: true,
        negotiable: true
    }
];

// Populate featured listings
function populateFeaturedListings() {
    const listingsGrid = document.querySelector('.listings-grid');
    
    featuredListings.forEach(listing => {
        const listingCard = document.createElement('div');
        listingCard.className = 'listing-card';
        
        const priceDisplay = listing.type === 'rental' 
            ? `$${listing.price}/week`
            : `$${listing.price.toLocaleString()}`;
            
        const negotiableTag = listing.negotiable
            ? '<span class="tag negotiable">Negotiable</span>'
            : '<span class="tag firm">Firm Price</span>';

        listingCard.innerHTML = `
            <div class="listing-image" style="background-image: url('${listing.image}')">
                <span class="tag featured">Featured</span>
                <span class="tag ${listing.type}">${listing.type === 'rental' ? 'Rental' : 'For Sale'}</span>
            </div>
            <div class="listing-content">
                <h3>${listing.title}</h3>
                <p class="location"><i class="fas fa-map-marker-alt"></i> ${listing.location}</p>
                <p class="week"><i class="fas fa-calendar"></i> ${listing.week}</p>
                <div class="listing-footer">
                    <p class="price">${priceDisplay}</p>
                    ${negotiableTag}
                </div>
            </div>
        `;
        
        listingsGrid.appendChild(listingCard);
    });
}

// Add styles for listing cards
const style = document.createElement('style');
style.textContent = `
    .listing-card {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
    }

    .listing-card:hover {
        transform: translateY(-5px);
    }

    .listing-image {
        height: 200px;
        background-size: cover;
        background-position: center;
        position: relative;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
    }

    .listing-content {
        padding: 1.5rem;
    }

    .listing-content h3 {
        margin-bottom: 0.5rem;
        color: var(--primary-blue);
    }

    .location, .week {
        color: var(--dark-gray);
        margin: 0.5rem 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .listing-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--gray);
    }

    .price {
        font-weight: bold;
        color: var(--primary-blue);
        font-size: 1.2rem;
    }

    .tag {
        padding: 0.3rem 0.8rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
    }

    .tag.featured {
        background-color: var(--red);
        color: white;
    }

    .tag.rental {
        background-color: var(--secondary-blue);
        color: white;
    }

    .tag.sale {
        background-color: var(--primary-blue);
        color: white;
    }

    .tag.negotiable {
        background-color: #4CAF50;
        color: white;
    }

    .tag.firm {
        background-color: #FFA000;
        color: white;
    }
`;

document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    populateFeaturedListings();
});

// Search functionality
const searchInput = document.querySelector('.search-box input');
const searchButton = document.querySelector('.btn-search');

searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.toLowerCase();
    // TODO: Implement search functionality
    console.log('Searching for:', searchTerm);
});

// Mobile menu toggle (to be implemented)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}
