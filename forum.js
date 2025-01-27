document.addEventListener('DOMContentLoaded', () => {
    // Initialize forum data
    const { categories, topics, posts, users, utils } = window.forumData;
    const { formatTimeAgo, formatNumber } = utils;

    // DOM Elements
    const categoriesGrid = document.querySelector('.categories-grid');
    const topicsList = document.querySelector('.topics-list');
    const searchInput = document.querySelector('.forum-search input');
    const searchButton = document.querySelector('.forum-search .btn-search');
    const newTopicButton = document.querySelector('.new-topic-btn');

    // Update category statistics
    function updateCategoryStats() {
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

            topicItem.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                navigateToTopic(topic.id);
            });

            topicsList.appendChild(topicItem);
        });
    }

    // Search functionality
    function setupSearch() {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (!searchTerm) return;

        const searchResults = topics.filter(topic => 
            topic.title.toLowerCase().includes(searchTerm) ||
            topic.content.toLowerCase().includes(searchTerm) ||
            topic.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );

        displaySearchResults(searchResults);
    }

    function displaySearchResults(results) {
        // TODO: Implement search results display
        console.log('Search results:', results);
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
