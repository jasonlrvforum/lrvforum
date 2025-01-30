// Marketplace Admin JavaScript

// Initialize the admin interface
document.addEventListener('DOMContentLoaded', function() {
    populateLocationDropdown();
    populateClubDropdown();
    populateAmenitiesGrid();
    renderListingsTable();
});

// Populate location dropdown from forum data
function populateLocationDropdown() {
    const locationSelect = document.getElementById('listingLocation');
    const locations = window.forumData.locations;

    // Clear existing options
    locationSelect.innerHTML = '<option value="">Select Location</option>';

    // Add locations from the data
    Object.entries(locations).forEach(([country, regions]) => {
        Object.entries(regions).forEach(([region, cities]) => {
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = `${city}, ${region}, ${country}`;
                locationSelect.appendChild(option);
            });
        });
    });
}

// Populate clubs dropdown
function populateClubDropdown() {
    const clubSelect = document.getElementById('pointsClub');
    const clubs = window.marketplaceData.CLUBS;

    // Clear existing options
    clubSelect.innerHTML = '<option value="">Select Club</option>';

    // Add clubs from the data
    clubs.forEach(club => {
        const option = document.createElement('option');
        option.value = club;
        option.textContent = club;
        clubSelect.appendChild(option);
    });
}

// Populate amenities grid
function populateAmenitiesGrid() {
    const amenitiesGrid = document.getElementById('amenitiesGrid');
    const amenities = window.marketplaceData.AMENITIES;

    amenitiesGrid.innerHTML = amenities.map(amenity => `
        <div class="amenity-item">
            <input type="checkbox" id="amenity_${amenity}" name="amenities" value="${amenity}">
            <label for="amenity_${amenity}">${formatAmenityName(amenity)}</label>
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

// Update form fields based on listing type
function updateFormFields() {
    const listingType = document.getElementById('listingType').value;
    const rentalFields = document.getElementById('rentalFields');
    const pointsFields = document.getElementById('pointsFields');
    const deedFields = document.getElementById('deedFields');

    // Hide all type-specific fields
    rentalFields.style.display = 'none';
    pointsFields.style.display = 'none';
    deedFields.style.display = 'none';

    // Show fields based on selected type
    switch(listingType) {
        case 'rental':
            rentalFields.style.display = 'block';
            break;
        case 'points':
            pointsFields.style.display = 'block';
            break;
        case 'deed':
            deedFields.style.display = 'block';
            break;
    }

    // Update price validation based on type
    const priceInput = document.getElementById('listingPrice');
    const validation = window.marketplaceData.VALIDATION[listingType];
    if (validation) {
        priceInput.min = validation.minPrice;
        priceInput.max = validation.maxPrice;
    }
}

// Open create form
function openCreateForm() {
    const dialog = document.getElementById('listingFormDialog');
    const form = document.getElementById('listingForm');
    
    // Reset form
    form.reset();
    document.getElementById('formTitle').textContent = 'Create New Listing';
    
    // Show dialog
    dialog.style.display = 'block';
    updateFormFields();
}

// Open edit form
function openEditForm(listingId) {
    const dialog = document.getElementById('listingFormDialog');
    const form = document.getElementById('listingForm');
    const listing = window.marketplaceData.listings.find(l => l.id === listingId);

    if (!listing) return;

    // Set form title
    document.getElementById('formTitle').textContent = 'Edit Listing';
    
    // Populate form fields
    document.getElementById('listingType').value = listing.type;
    document.getElementById('listingTitle').value = listing.title;
    document.getElementById('listingDescription').value = listing.description;
    document.getElementById('listingPrice').value = listing.price;
    document.getElementById('listingLocation').value = listing.location;

    // Update and populate type-specific fields
    updateFormFields();
    switch(listing.type) {
        case 'rental':
            if (listing.rentalDetails) {
                document.getElementById('checkInDate').value = listing.rentalDetails.checkIn.toISOString().split('T')[0];
                document.getElementById('checkOutDate').value = listing.rentalDetails.checkOut.toISOString().split('T')[0];
                document.getElementById('unitType').value = listing.rentalDetails.unit;
                document.getElementById('maxOccupancy').value = listing.rentalDetails.maxOccupancy;
            }
            break;
        case 'points':
            if (listing.pointsDetails) {
                document.getElementById('pointsClub').value = listing.pointsDetails.club;
                document.getElementById('pointsAmount').value = listing.pointsDetails.pointsAmount;
                document.getElementById('useYear').value = listing.pointsDetails.useYear;
                document.getElementById('maintenanceFees').value = listing.pointsDetails.maintenanceFees;
            }
            break;
        case 'deed':
            if (listing.deedDetails) {
                document.getElementById('season').value = listing.deedDetails.season;
                document.getElementById('weekNumber').value = listing.deedDetails.week;
                document.getElementById('deedUnitType').value = listing.deedDetails.unit;
                document.getElementById('deedMaintenanceFees').value = listing.deedDetails.maintenanceFees;
                document.getElementById('ownershipType').value = listing.deedDetails.ownership;
            }
            break;
    }

    // Set amenities
    if (listing.amenities) {
        Object.entries(listing.amenities).forEach(([amenity, value]) => {
            const checkbox = document.getElementById(`amenity_${amenity}`);
            if (checkbox) checkbox.checked = value;
        });
    }

    // Show dialog
    dialog.style.display = 'block';
}

// Close listing form
function closeListingForm() {
    document.getElementById('listingFormDialog').style.display = 'none';
}

// Toggle between dropdown and custom location input
function toggleCustomLocation() {
    const useCustom = document.getElementById('useCustomLocation').checked;
    const locationDropdown = document.getElementById('listingLocation');
    const customLocationInput = document.getElementById('customLocation');
    
    if (useCustom) {
        locationDropdown.style.display = 'none';
        customLocationInput.classList.add('visible');
        locationDropdown.required = false;
        customLocationInput.required = true;
        locationDropdown.value = '';
    } else {
        locationDropdown.style.display = 'block';
        customLocationInput.classList.remove('visible');
        locationDropdown.required = true;
        customLocationInput.required = false;
        customLocationInput.value = '';
    }
}

// Handle listing form submission
function handleListingSubmit(event) {
    event.preventDefault();

    const formData = {
        type: document.getElementById('listingType').value,
        title: document.getElementById('listingTitle').value,
        description: document.getElementById('listingDescription').value,
        price: parseFloat(document.getElementById('listingPrice').value),
        location: document.getElementById('useCustomLocation').checked ? 
            document.getElementById('customLocation').value :
            document.getElementById('listingLocation').value,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 1, // Hardcoded for demo, should be current admin user
        images: [], // Would handle image upload in a real implementation
    };

    // Add type-specific details
    switch(formData.type) {
        case 'rental':
            formData.rentalDetails = {
                checkIn: new Date(document.getElementById('checkInDate').value),
                checkOut: new Date(document.getElementById('checkOutDate').value),
                unit: document.getElementById('unitType').value,
                maxOccupancy: parseInt(document.getElementById('maxOccupancy').value)
            };
            break;
        case 'points':
            formData.pointsDetails = {
                club: document.getElementById('pointsClub').value,
                pointsAmount: parseInt(document.getElementById('pointsAmount').value),
                useYear: parseInt(document.getElementById('useYear').value),
                maintenanceFees: parseFloat(document.getElementById('maintenanceFees').value),
                pointsPerMF: parseInt(document.getElementById('pointsAmount').value) / 
                            parseFloat(document.getElementById('maintenanceFees').value)
            };
            break;
        case 'deed':
            formData.deedDetails = {
                season: document.getElementById('season').value,
                week: parseInt(document.getElementById('weekNumber').value),
                unit: document.getElementById('deedUnitType').value,
                maintenanceFees: parseFloat(document.getElementById('deedMaintenanceFees').value),
                ownership: document.getElementById('ownershipType').value
            };
            break;
    }

    // Collect amenities
    formData.amenities = {};
    document.querySelectorAll('#amenitiesGrid input[type="checkbox"]').forEach(checkbox => {
        formData.amenities[checkbox.value] = checkbox.checked;
    });

    // Validate listing
    if (!window.marketplaceData.utils.validateListing(formData)) {
        alert('Invalid listing data. Please check the form and try again.');
        return;
    }

    // Add to listings
    formData.id = window.marketplaceData.listings.length + 1;
    window.marketplaceData.listings.push(formData);

    // Update UI
    closeListingForm();
    renderListingsTable();
}

// Delete listing
function deleteListing(listingId) {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    const index = window.marketplaceData.listings.findIndex(l => l.id === listingId);
    if (index !== -1) {
        window.marketplaceData.listings.splice(index, 1);
        renderListingsTable();
    }
}

// Update listing status
function updateListingStatus(listingId, newStatus) {
    const listing = window.marketplaceData.listings.find(l => l.id === listingId);
    if (listing) {
        listing.status = newStatus;
        listing.updatedAt = new Date();
        renderListingsTable();
    }
}

// Render listings table
function renderListingsTable() {
    const tbody = document.getElementById('listingsTableBody');
    tbody.innerHTML = window.marketplaceData.listings.map(listing => `
        <tr>
            <td>${listing.title}</td>
            <td><span class="listing-type ${listing.type}">${listing.type}</span></td>
            <td>${window.marketplaceData.utils.formatCurrency(listing.price)}</td>
            <td>${listing.location}</td>
            <td><span class="status-badge ${listing.status}">${listing.status}</span></td>
            <td>${window.marketplaceData.utils.formatDate(listing.createdAt)}</td>
            <td>
                <button class="admin-button edit" onclick="openEditForm(${listing.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="admin-button delete" onclick="deleteListing(${listing.id})">
                    <i class="fas fa-trash"></i>
                </button>
                <select onchange="updateListingStatus(${listing.id}, this.value)">
                    <option value="active" ${listing.status === 'active' ? 'selected' : ''}>Active</option>
                    <option value="pending" ${listing.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="sold" ${listing.status === 'sold' ? 'selected' : ''}>Sold</option>
                </select>
            </td>
        </tr>
    `).join('');
}

// Export listings
function exportListings() {
    const data = JSON.stringify(window.marketplaceData.listings, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `marketplace-listings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Open bulk edit interface
function openBulkEdit() {
    alert('Bulk edit functionality coming soon!');
}
