document.addEventListener('DOMContentLoaded', () => {
    // Check if forum data is loaded
    if (!window.forumData) {
        console.error('Forum data not loaded. Make sure forum-data.js is included before forum.js');
        return;
    }

    // Initialize forum data
    const { categories, topics, posts, users, locations, utils } = window.forumData;
    const { formatTimeAgo, formatNumber } = utils;

    // DOM Elements
    const categoriesGrid = document.querySelector('.categories-grid');
    if (!categoriesGrid) {
        console.error('Categories grid element not found');
        return;
    }

    // Initialize location dropdown
    const locationDropdown = document.getElementById('locationDropdown');
    if (locationDropdown) {
        console.log('Found location dropdown, populating...');
        populateLocationDropdown(locationDropdown);
        
        // Add change event listener
        locationDropdown.addEventListener('change', () => {
            console.log('Location selected:', locationDropdown.value);
            performSearch();
        });
    } else {
        console.error('Location dropdown element not found');
    }

    function populateLocationDropdown(dropdown) {
        console.log('Populating dropdown with locations:', locations);
        
        // Add the default option
        dropdown.innerHTML = '<option value="">Find your perfect timeshare</option>';

        // Iterate through countries
        for (const country in locations) {
            const countryOptgroup = document.createElement('optgroup');
            countryOptgroup.label = country;
            console.log('Adding country:', country);

            // Iterate through states/regions
            for (const state in locations[country]) {
                const stateOptgroup = document.createElement('optgroup');
                stateOptgroup.label = `${country} - ${state}`;
                console.log('Adding state:', state);
                
                // Iterate through cities
                locations[country][state].forEach(city => {
                    const option = document.createElement('option');
                    option.value = `${country}|${state}|${city}`;
                    option.textContent = city;
                    stateOptgroup.appendChild(option);
                    console.log('Added city:', city);
                });

                dropdown.appendChild(stateOptgroup);
            }
        }
        
        console.log('Dropdown population complete');
        
        // Trigger a change event to ensure proper initialization
        const event = new Event('change');
        dropdown.dispatchEvent(event);
    }

    const topicsList = document.querySelector('.topics-list');
    if (!topicsList) {
        console.error('Topics list element not found');
        return;
    }

    const searchInput = document.querySelector('input[placeholder="Search forums..."]');
    const searchButton = document.querySelector('.btn-search');
    const newTopicButton = document.querySelector('.new-topic-btn');

    console.log('Forum data loaded:', { categories, topics, posts, users });

    // Update category statistics
    function updateCategoryStats() {
        console.log('Updating categories...');
        categoriesGrid.innerHTML = '';
        categories.forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card';
            categoryCard.innerHTML = `
                <div class="category-icon">
                    <i class="fas fa-${category.icon}"></i>
                </div>
                <div class="category-content">
                    <h2>${category.name}</h2>
                    <p>${category.description}</p>
                    <div class="category-stats">
                        <span><i class="fas fa-comments"></i> ${category.topicCount} topics</span>
                        <span><i class="fas fa-users"></i> ${formatNumber(category.memberCount)} members</span>
                    </div>
                </div>
            `;

            categoryCard.addEventListener('click', () => {
                navigateToCategory(category.id);
            });

            categoriesGrid.appendChild(categoryCard);
        });
    }

    // Update trending topics
    function updateTrendingTopics() {
        console.log('Updating trending topics...');
        topicsList.innerHTML = '';
        const trendingTopics = topics
            .sort((a, b) => b.viewCount - a.viewCount)
            .slice(0, 5);

        trendingTopics.forEach(topic => {
            const topicItem = document.createElement('div');
            topicItem.className = 'topic-item';
            
            const statusIcon = topic.status === 'hot' ? 'fire' : 'star';
            
            topicItem.innerHTML = `
                <div class="topic-icon">
                    <i class="fas fa-${statusIcon}"></i>
                </div>
                <div class="topic-content">
                    <h3><a href="#" data-topic-id="${topic.id}">${topic.title}</a></h3>
                    <div class="topic-meta">
                        <span><i class="fas fa-user"></i> ${topic.author.username}</span>
                        <span><i class="fas fa-comments"></i> ${topic.replyCount} replies</span>
                        <span><i class="fas fa-eye"></i> ${formatNumber(topic.viewCount)} views</span>
                        <span><i class="fas fa-clock"></i> ${formatTimeAgo(topic.lastReplyAt)}</span>
                    </div>
                </div>
                <div class="topic-status">
                    <span class="status-badge ${topic.status}">${topic.status}</span>
                </div>
            `;

            const topicLink = topicItem.querySelector('a');
            topicLink.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Navigating to topic:', topic.id);
                window.location.href = `topic.html?id=${topic.id}`;
            });

            topicsList.appendChild(topicItem);
        });
    }

    // Search functionality
    function setupSearch() {
        console.log('Setting up search...', { searchButton, searchInput });
        
        if (!searchButton || !searchInput) {
            console.error('Search elements not found');
            return;
        }

        searchButton.addEventListener('click', () => {
            console.log('Search button clicked');
            performSearch();
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                console.log('Enter key pressed in search');
                performSearch();
            }
        });

        console.log('Search setup complete');
    }

    function performSearch() {
        if (!searchInput) {
            console.error('Search input not found');
            return;
        }

        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedLocation = locationDropdown ? locationDropdown.value : '';
        
        console.log('Search term:', searchTerm, 'Location:', selectedLocation);
        if (!searchTerm && !selectedLocation) {
            console.log('Empty search criteria, returning');
            return;
        }

        console.log('Available topics:', topics);

        const searchResults = topics.filter(topic => {
            // Location filtering
            if (selectedLocation) {
                const [country, state, city] = selectedLocation.split('|');
                const locationMatch = topic.tags.some(tag => 
                    tag.toLowerCase() === city.toLowerCase() ||
                    tag.toLowerCase() === state.toLowerCase() ||
                    tag.toLowerCase() === country.toLowerCase()
                );
                if (!locationMatch) return false;
            }

            // Text search filtering (only if search term exists)
            if (!searchTerm) return true;
            const titleMatch = topic.title.toLowerCase().includes(searchTerm);
            const contentMatch = topic.content.toLowerCase().includes(searchTerm);
            const tagMatch = topic.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            
            console.log('Checking topic:', {
                id: topic.id,
                title: topic.title,
                titleMatch,
                contentMatch,
                tagMatch
            });

            return titleMatch || contentMatch || tagMatch;
        });

        console.log('Found results:', searchResults);
        
        // Clear previous search results
        console.log('Clearing previous results');
        categoriesGrid.innerHTML = '';
        topicsList.innerHTML = '';

        displaySearchResults(searchResults);
    }

    function displaySearchResults(results) {
        console.log('Displaying results:', results);
        
        if (results.length === 0) {
            categoriesGrid.innerHTML = '<div class="no-results">No results found</div>';
            return;
        }

        // Show search results header
        const header = document.createElement('div');
        header.className = 'search-results-header';
        header.innerHTML = '<h2>Search Results</h2>';
        categoriesGrid.appendChild(header);

        const searchResultsList = document.createElement('div');
        searchResultsList.className = 'search-results-list';

        results.forEach(topic => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            
            resultItem.innerHTML = `
                <div class="topic-content">
                    <h3><a href="#" data-topic-id="${topic.id}">${topic.title}</a></h3>
                    <div class="topic-meta">
                        <span><i class="fas fa-user"></i> ${topic.author.username}</span>
                        <span><i class="fas fa-comments"></i> ${topic.replyCount} replies</span>
                        <span><i class="fas fa-eye"></i> ${formatNumber(topic.viewCount)} views</span>
                        <span><i class="fas fa-clock"></i> ${formatTimeAgo(topic.lastReplyAt)}</span>
                    </div>
                    <div class="topic-preview">${topic.content.substring(0, 150)}...</div>
                    <div class="topic-tags">
                        ${topic.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            `;

            resultItem.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                navigateToTopic(topic.id);
            });

            searchResultsList.appendChild(resultItem);
        });

        categoriesGrid.appendChild(searchResultsList);
        topicsList.innerHTML = ''; // Hide trending topics during search
    }

    // Navigation functions
function navigateToCategory(categoryId) {
    window.location.href = `category.html?id=${categoryId}`;
}

function navigateToTopic(topicId) {
    window.location.href = `topic.html?id=${topicId}`;
}

    // New Topic functionality
    function setupNewTopic() {
        newTopicButton.addEventListener('click', () => {
            // TODO: Implement new topic creation
            console.log('Creating new topic');
        });
    }

    // Mobile menu functionality
    function setupMobileMenu() {
        const menuButton = document.createElement('button');
        menuButton.className = 'mobile-menu-toggle';
        menuButton.innerHTML = '<i class="fas fa-bars"></i>';
        
        const nav = document.querySelector('.main-nav');
        nav.insertBefore(menuButton, nav.firstChild);

        menuButton.addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('active');
        });
    }

    // Add mobile menu styles
    function addMobileStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .mobile-menu-toggle {
                    display: block;
                    background: none;
                    border: none;
                    color: var(--primary-blue);
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0.5rem;
                }

                .nav-links {
                    display: none;
                    width: 100%;
                }

                .nav-links.active {
                    display: flex;
                }
            }

            @media (min-width: 769px) {
                .mobile-menu-toggle {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize forum
    function initForum() {
        updateCategoryStats();
        updateTrendingTopics();
        setupSearch();
        setupNewTopic();
        setupMobileMenu();
        addMobileStyles();

        // Auto-update times
        setInterval(() => {
            document.querySelectorAll('.topic-meta span:last-child').forEach(timeSpan => {
                const topicId = timeSpan.closest('.topic-item').querySelector('a').dataset.topicId;
                const topic = topics.find(t => t.id === parseInt(topicId));
                if (topic) {
                    timeSpan.innerHTML = `<i class="fas fa-clock"></i> ${formatTimeAgo(topic.lastReplyAt)}`;
                }
            });
        }, 60000); // Update every minute
    }

    // Start the forum
    initForum();
});
