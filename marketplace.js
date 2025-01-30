// Marketplace JavaScript

// Initialize the marketplace interface
document.addEventListener('DOMContentLoaded', function() {
    populateLocationFilter();
    renderListings();
    setupEventListeners();
});

// Populate location filter from forum data
function populateLocationFilter() {
    const locationFilter = document.getElementById('locationFilter');
    const locations = window.forumData.locations;

    // Add locations from the data
    Object.entries(locations).forEach(([country, regions]) => {
        Object.entries(regions).forEach(([region, cities]) => {
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = `${city}, ${region}, ${country}`;
                locationFilter.appendChild(option);
            });
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    document.getElementById('searchInput').addEventListener('input', renderListings);
    
    // Filters
    document.getElementById('typeFilter').addEventListener('change', renderListings);
    document.getElementById('locationFilter').addEventListener('change', renderListings);
    document.getElementById('statusFilter').addEventListener('change', renderListings);
    document.getElementById('sortBy').addEventListener('change', renderListings);
}

// Filter listings
function filterListings(listings) {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value;
    const locationFilter = document.getElementById('locationFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    return listings.filter(listing => {
        // Search term
        const matchesSearch = 
            listing.title.toLowerCase().includes(searchTerm) ||
            listing.description.toLowerCase().includes(searchTerm);

        // Type filter
        const matchesType = !typeFilter || listing.type === typeFilter;

        // Location filter
        const matchesLocation = !locationFilter || listing.location === locationFilter;

        // Status filter
        const matchesStatus = !statusFilter || listing.status === statusFilter;

        return matchesSearch && matchesType && matchesLocation && matchesStatus;
    });
}

// Sort listings
function sortListings(listings) {
    const sortBy = document.getElementById('sortBy').value;
    
    return [...listings].sort((a, b) => {
        switch(sortBy) {
            case 'newest':
                return b.createdAt - a.createdAt;
            case 'priceAsc':
                return a.price - b.price;
            case 'priceDesc':
                return b.price - a.price;
            default:
                return 0;
        }
    });
}

// Render listings
function renderListings() {
    const listingGrid = document.getElementById('listingGrid');
    let listings = filterListings(window.marketplaceData.listings);
    listings = sortListings(listings);

    listingGrid.innerHTML = listings.map(listing => `
        <div class="listing-card" onclick="showListingDetails(${listing.id})">
            <div class="listing-image">
                ${listing.images.length > 0 
                    ? `<img src="${listing.images[0]}" alt="${listing.title}">`
                    : '<i class="fas fa-image"></i>'}
            </div>
            <div class="listing-content">
                <span class="listing-type ${listing.type}">${listing.type}</span>
                <h3 class="listing-title">${listing.title}</h3>
                <p class="listing-location">
                    <i class="fas fa-map-marker-alt"></i> ${listing.location}
                </p>
                <p class="listing-price">
                    ${window.marketplaceData.utils.formatCurrency(listing.price)}
                </p>
                ${renderTypeSpecificDetails(listing)}
                <span class="status-badge ${listing.status}">${listing.status}</span>
            </div>
        </div>
    `).join('');
}

// Render type-specific details
function renderTypeSpecificDetails(listing) {
    switch(listing.type) {
        case 'rental':
            return `
                <p>
                    <i class="fas fa-calendar"></i> 
                    ${window.marketplaceData.utils.formatDate(listing.rentalDetails.checkIn)} - 
                    ${window.marketplaceData.utils.formatDate(listing.rentalDetails.checkOut)}
                </p>
                <p>
                    <i class="fas fa-home"></i> 
                    ${listing.rentalDetails.unit}
                </p>
            `;
        case 'points':
            return `
                <p>
                    <i class="fas fa-star"></i> 
                    ${listing.pointsDetails.pointsAmount.toLocaleString()} ${listing.pointsDetails.club} Points
                </p>
                <p>
                    <i class="fas fa-dollar-sign"></i> 
                    MF/Point: ${(listing.pointsDetails.maintenanceFees / listing.pointsDetails.pointsAmount).toFixed(2)}
                </p>
            `;
        case 'deed':
            return `
                <p>
                    <i class="fas fa-calendar-week"></i> 
                    Week ${listing.deedDetails.week} (${listing.deedDetails.season})
                </p>
                <p>
                    <i class="fas fa-home"></i> 
                    ${listing.deedDetails.unit}
                </p>
            `;
        default:
            return '';
    }
}

// Show listing details
function showListingDetails(listingId) {
    const listing = window.marketplaceData.listings.find(l => l.id === listingId);
    if (!listing) return;

    const modal = document.getElementById('listingModal');
    const detailsContainer = document.getElementById('listingDetails');

    detailsContainer.innerHTML = `
        <h2>${listing.title}</h2>
        <div class="listing-header">
            <span class="listing-type ${listing.type}">${listing.type}</span>
            <span class="status-badge ${listing.status}">${listing.status}</span>
        </div>
        
        <div class="listing-images">
            ${listing.images.length > 0 
                ? listing.images.map(img => `<img src="${img}" alt="${listing.title}">`).join('')
                : '<div class="placeholder-image"><i class="fas fa-image"></i></div>'}
        </div>

        <div class="listing-info">
            <p class="listing-price">
                ${window.marketplaceData.utils.formatCurrency(listing.price)}
            </p>
            <p class="listing-location">
                <i class="fas fa-map-marker-alt"></i> ${listing.location}
            </p>
            <p class="listing-description">${listing.description}</p>
            
            ${renderDetailedTypeSpecificInfo(listing)}
            
            <div class="amenities-section">
                <h3>Amenities</h3>
                <div class="amenities-grid">
                    ${renderAmenities(listing.amenities)}
                </div>
            </div>

            <div class="listing-meta">
                <p>Listed: ${window.marketplaceData.utils.formatDate(listing.createdAt)}</p>
                <p>Last Updated: ${window.marketplaceData.utils.formatDate(listing.updatedAt)}</p>
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

// Render detailed type-specific information
function renderDetailedTypeSpecificInfo(listing) {
    switch(listing.type) {
        case 'rental':
            return `
                <div class="type-specific-info">
                    <h3>Rental Details</h3>
                    <p><strong>Check-in:</strong> ${window.marketplaceData.utils.formatDate(listing.rentalDetails.checkIn)}</p>
                    <p><strong>Check-out:</strong> ${window.marketplaceData.utils.formatDate(listing.rentalDetails.checkOut)}</p>
                    <p><strong>Unit Type:</strong> ${listing.rentalDetails.unit}</p>
                    <p><strong>Maximum Occupancy:</strong> ${listing.rentalDetails.maxOccupancy} guests</p>
                </div>
            `;
        case 'points':
            return `
                <div class="type-specific-info">
                    <h3>Points Package Details</h3>
                    <p><strong>Club:</strong> ${listing.pointsDetails.club}</p>
                    <p><strong>Points Amount:</strong> ${listing.pointsDetails.pointsAmount.toLocaleString()}</p>
                    <p><strong>Use Year:</strong> ${listing.pointsDetails.useYear}</p>
                    <p><strong>Maintenance Fees:</strong> ${window.marketplaceData.utils.formatCurrency(listing.pointsDetails.maintenanceFees)}/year</p>
                    <p><strong>Points/MF Ratio:</strong> ${listing.pointsDetails.pointsPerMF.toFixed(2)}</p>
                </div>
            `;
        case 'deed':
            return `
                <div class="type-specific-info">
                    <h3>Deed Details</h3>
                    <p><strong>Season:</strong> ${listing.deedDetails.season}</p>
                    <p><strong>Week:</strong> ${listing.deedDetails.week}</p>
                    <p><strong>Unit Type:</strong> ${listing.deedDetails.unit}</p>
                    <p><strong>Maintenance Fees:</strong> ${window.marketplaceData.utils.formatCurrency(listing.deedDetails.maintenanceFees)}/year</p>
                    <p><strong>Ownership:</strong> ${listing.deedDetails.ownership}</p>
                </div>
            `;
        default:
            return '';
    }
}

// Render amenities
function renderAmenities(amenities) {
    if (!amenities) return '';

    return Object.entries(amenities)
        .filter(([, value]) => value)
        .map(([amenity]) => `
            <div class="amenity-item">
                <i class="fas fa-check"></i>
                ${formatAmenityName(amenity)}
            </div>
        `).join('');
}

// Format amenity name for display
function formatAmenityName(amenity) {
    return amenity
        .split(/(?=[A-Z])|_/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// Close listing modal
function closeListingModal() {
    document.getElementById('listingModal').style.display = 'none';
}
