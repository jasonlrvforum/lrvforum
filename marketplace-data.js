// Marketplace Data and Utilities

window.marketplaceData = {
    // Constants
    CLUBS: [
        'HGVC',
        'Marriott Vacation Club',
        'Disney Vacation Club',
        'Wyndham',
        'WorldMark',
        'Club Wyndham',
        'Vistana',
        'Diamond Resorts'
    ],

    AMENITIES: [
        'pool',
        'spa',
        'gym',
        'restaurant',
        'bar',
        'beachAccess',
        'wifi',
        'parking',
        'kitchen',
        'laundry',
        'airConditioning',
        'balcony',
        'oceanView',
        'mountainView',
        'childcare',
        'roomService',
        'businessCenter',
        'conferenceRoom',
        'tennisCount',
        'golfCourse'
    ],

    VALIDATION: {
        rental: {
            minPrice: 500,
            maxPrice: 10000,
            minNights: 1,
            maxNights: 30,
            minOccupancy: 1,
            maxOccupancy: 12
        },
        points: {
            minPoints: 1000,
            maxPoints: 100000,
            minPrice: 1000,
            maxPrice: 50000,
            minMF: 100,
            maxMF: 5000
        },
        deed: {
            minPrice: 5000,
            maxPrice: 100000,
            minMF: 500,
            maxMF: 3000,
            validWeeks: Array.from({length: 52}, (_, i) => i + 1)
        }
    },

    // Sample listings data
    listings: [
        {
            id: 1,
            type: 'rental',
            title: 'Luxury Week at HGVC Lagoon Tower',
            description: 'Beautiful ocean view unit in the heart of Waikiki',
            price: 2500.00,
            location: 'Honolulu (Oahu)',
            status: 'active',
            createdAt: new Date('2025-01-14'),
            updatedAt: new Date('2025-01-14'),
            createdBy: 1,
            images: [],
            rentalDetails: {
                checkIn: new Date('2025-06-01'),
                checkOut: new Date('2025-06-08'),
                unit: '2 Bedroom Ocean View',
                maxOccupancy: 6
            },
            amenities: {
                pool: true,
                spa: true,
                gym: true,
                beachAccess: true,
                wifi: true,
                parking: true,
                kitchen: true,
                oceanView: true
            }
        },
        {
            id: 2,
            type: 'points',
            title: 'HGVC Points Package - Great Value!',
            description: 'Annual points package with great MF/point ratio',
            price: 25000.00,
            location: 'Multiple Locations',
            status: 'active',
            createdAt: new Date('2025-01-19'),
            updatedAt: new Date('2025-01-19'),
            createdBy: 1,
            images: [],
            pointsDetails: {
                club: 'HGVC',
                pointsAmount: 7000,
                useYear: 2025,
                maintenanceFees: 1200,
                pointsPerMF: 5.83
            },
            amenities: {}
        },
        {
            id: 3,
            type: 'deed',
            title: "Marriott's Maui Ocean Club - Platinum Week",
            description: 'Prime platinum season oceanfront unit',
            price: 45000.00,
            location: 'Lahaina (Maui)',
            status: 'active',
            createdAt: new Date('2025-01-24'),
            updatedAt: new Date('2025-01-24'),
            createdBy: 1,
            images: [],
            deedDetails: {
                season: 'Platinum',
                week: 26,
                unit: '2 Bedroom Oceanfront',
                maintenanceFees: 2400,
                ownership: 'annual'
            },
            amenities: {
                pool: true,
                spa: true,
                gym: true,
                restaurant: true,
                bar: true,
                beachAccess: true,
                wifi: true,
                parking: true,
                kitchen: true,
                oceanView: true
            }
        }
    ],

    // Utility functions
    utils: {
        formatCurrency: (amount) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(amount);
        },

        formatDate: (date) => {
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(new Date(date));
        },

        validateListing: (listing) => {
            const validation = window.marketplaceData.VALIDATION[listing.type];
            if (!validation) return false;

            // Basic validation
            if (!listing.title || !listing.description || !listing.location) {
                return false;
            }

            // Price validation
            if (listing.price < validation.minPrice || listing.price > validation.maxPrice) {
                return false;
            }

            // Type-specific validation
            switch(listing.type) {
                case 'rental':
                    if (!listing.rentalDetails) return false;
                    const nights = Math.ceil(
                        (new Date(listing.rentalDetails.checkOut) - new Date(listing.rentalDetails.checkIn)) 
                        / (1000 * 60 * 60 * 24)
                    );
                    if (nights < validation.minNights || nights > validation.maxNights) return false;
                    if (listing.rentalDetails.maxOccupancy < validation.minOccupancy || 
                        listing.rentalDetails.maxOccupancy > validation.maxOccupancy) return false;
                    break;

                case 'points':
                    if (!listing.pointsDetails) return false;
                    if (listing.pointsDetails.pointsAmount < validation.minPoints || 
                        listing.pointsDetails.pointsAmount > validation.maxPoints) return false;
                    if (listing.pointsDetails.maintenanceFees < validation.minMF || 
                        listing.pointsDetails.maintenanceFees > validation.maxMF) return false;
                    break;

                case 'deed':
                    if (!listing.deedDetails) return false;
                    if (!validation.validWeeks.includes(listing.deedDetails.week)) return false;
                    if (listing.deedDetails.maintenanceFees < validation.minMF || 
                        listing.deedDetails.maintenanceFees > validation.maxMF) return false;
                    break;
            }

            return true;
        }
    }
};
