document.addEventListener('DOMContentLoaded', () => {
    // Initialize forum data
    const { categories, topics, posts, users, utils } = window.forumData;
    const { formatTimeAgo, formatNumber } = utils;

    // Get category ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = parseInt(urlParams.get('id')) || 1;
    const category = categories.find(c => c.id === categoryId);

    // DOM Elements
    const categoryIcon = document.querySelector('.category-icon i');
    const categoryTitle = document.querySelector('.category-info h1');
    const categoryDescription = document.querySelector('.category-info p');
    const searchInput = document.querySelector('.forum-search input');
    const topicsList = document.querySelector('.topics-list');
    const sortSelect = document.querySelector('.filter-sort');
    const timeSelect = document.querySelector('.filter-time');
    const viewToggleButtons = document.querySelectorAll('.category-view-toggle button');
    const paginationButtons = document.querySelectorAll('.pagination button');

    // Initialize category page
    function initCategoryPage() {
        updateCategoryInfo();
        loadTopics();
        setupEventListeners();
    }

    // Update category information
    function updateCategoryInfo() {
        categoryIcon.className = `fas fa-${category.icon}`;
        categoryTitle.textContent = category.name;
        categoryDescription.textContent = category.description;
        searchInput.placeholder = `Search in ${category.name}...`;
        document.title = `${category.name} - LRV Forum`;
        document.querySelector('.forum-breadcrumb span').textContent = category.name;
    }

    // Load and display topics
    function loadTopics() {
        const categoryTopics = topics.filter(topic => topic.categoryId === categoryId);
        const sortedTopics = sortTopics(categoryTopics);
        displayTopics(sortedTopics);
    }

    // Sort topics based on selected criteria
    function sortTopics(topicsList) {
        const sortBy = sortSelect.value;
        const timeFrame = timeSelect.value;

        // Filter by time frame
        const filteredTopics = filterByTimeFrame(topicsList, timeFrame);

        // Sort by selected criteria
        return filteredTopics.sort((a, b) => {
            switch (sortBy) {
                case 'recent':
                    return b.lastReplyAt - a.lastReplyAt;
                case 'popular':
                    return b.viewCount - a.viewCount;
                case 'replies':
                    return b.replyCount - a.replyCount;
                case 'views':
                    return b.viewCount - a.viewCount;
                default:
                    return b.lastReplyAt - a.lastReplyAt;
            }
        });
    }

    // Filter topics by time frame
    function filterByTimeFrame(topicsList, timeFrame) {
        const now = new Date();
        const timeFrames = {
            'today': 24 * 60 * 60 * 1000,
            'week': 7 * 24 * 60 * 60 * 1000,
            'month': 30 * 24 * 60 * 60 * 1000,
            'year': 365 * 24 * 60 * 60 * 1000
        };

        if (timeFrame === 'all') return topicsList;

        const timeLimit = timeFrames[timeFrame];
        return topicsList.filter(topic => {
            return (now - new Date(topic.createdAt)) <= timeLimit;
        });
    }

    // Display topics in the list
    function displayTopics(topics) {
        const topicsContainer = document.querySelector('.topics-list');
        topicsContainer.innerHTML = '';
        
        if (topics.length === 0) {
            topicsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comments"></i>
                    <h3>No topics found</h3>
                    <p>Be the first to start a discussion in this category!</p>
                    <button class="btn btn-primary new-topic-btn">
                        <i class="fas fa-plus"></i> New Topic
                    </button>
                </div>
            `;
            return;
        }

        topics.forEach(topic => {
            const topicElement = document.createElement('div');
            topicElement.className = 'topic-item';
            
            const author = users.find(u => u.id === topic.author.id);
            const replyCount = posts.filter(p => p.topicId === topic.id).length;
            
            topicElement.innerHTML = `
                <div class="topic-icon">
                    <i class="fas fa-${topic.status === 'hot' ? 'fire' : 'comments'}"></i>
                </div>
                <div class="topic-content">
                    <h3><a href="#" data-topic-id="${topic.id}">${topic.title}</a></h3>
                    <div class="topic-meta">
                        <span class="author">
                            <i class="fas fa-user"></i> ${author.username}
                            ${author.badges.map(badge => 
                                `<span class="badge ${badge}">${badge.replace('-', ' ')}</span>`
                            ).join('')}
                        </span>
                        <span><i class="fas fa-comments"></i> ${replyCount} replies</span>
                        <span><i class="fas fa-eye"></i> ${formatNumber(topic.viewCount)} views</span>
                        <span><i class="fas fa-clock"></i> ${formatTimeAgo(topic.lastReplyAt)}</span>
                    </div>
                    <div class="topic-tags">
                        ${topic.tags.map(tag => 
                            `<span class="tag">${tag}</span>`
                        ).join('')}
                    </div>
                </div>
                ${topic.status ? `
                    <div class="topic-status">
                        <span class="status-badge ${topic.status}">${topic.status}</span>
                    </div>
                ` : ''}
            `;

            // Add click event listener to topic title
            topicElement.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `topic.html?id=${topic.id}`;
            });

            topicsContainer.appendChild(topicElement);
        });
    }

    // Setup event listeners
    function setupEventListeners() {
        // Sort and time filter changes
        sortSelect.addEventListener('change', loadTopics);
        timeSelect.addEventListener('change', loadTopics);

        // View toggle
        viewToggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                viewToggleButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                topicsList.dataset.view = button.dataset.view;
            });
        });

        // Search functionality
        const searchButton = document.querySelector('.forum-search .btn-search');
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // New topic button
        const newTopicButton = document.querySelector('.new-topic-btn');
        newTopicButton.addEventListener('click', () => {
            // TODO: Implement new topic creation
            console.log('Creating new topic in category:', categoryId);
        });

        // Pagination
        setupPagination();
    }

    // Search functionality
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (!searchTerm) {
            loadTopics();
            return;
        }

        const categoryTopics = topics.filter(topic => 
            topic.categoryId === categoryId &&
            (topic.title.toLowerCase().includes(searchTerm) ||
             topic.content.toLowerCase().includes(searchTerm) ||
             topic.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        );

        displayTopics(categoryTopics);
    }

    // Setup pagination
    function setupPagination() {
        const pageButtons = document.querySelectorAll('.page-numbers .btn');
        pageButtons.forEach(button => {
            button.addEventListener('click', () => {
                pageButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                // TODO: Implement actual pagination
                loadTopics();
            });
        });
    }

    // Add mobile menu functionality
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

    // Initialize the page
    initCategoryPage();
    setupMobileMenu();

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
});
