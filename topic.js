document.addEventListener('DOMContentLoaded', () => {
    // Initialize forum data
    const { categories, topics, posts, users, utils } = window.forumData;
    const { formatTimeAgo, formatNumber } = utils;

    // Get topic ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const topicId = parseInt(urlParams.get('id')) || 2;
    const topic = topics.find(t => t.id === topicId);
    if (!topic) {
        window.location.href = 'forum.html';
        return;
    }
    const category = categories.find(c => c.id === topic.categoryId);

    // DOM Elements
    const repliesList = document.querySelector('.replies-list');
    const sortSelect = document.querySelector('.sort-replies');
    const replyEditor = document.querySelector('.reply-box textarea');
    const replyButton = document.querySelector('.reply-box .btn-primary');
    const editorToolbar = document.querySelector('.editor-toolbar');

    // Initialize topic page
    function initTopicPage() {
        updateTopicInfo();
        loadReplies();
        setupEventListeners();
        setupEditor();
    }

    // Update topic information
    function updateTopicInfo() {
        document.title = `${topic.title} - LRV Forum`;
        
        // Update breadcrumb
        const breadcrumbCategory = document.querySelector('.forum-breadcrumb a:nth-child(3)');
        const breadcrumbTopic = document.querySelector('.forum-breadcrumb span');
        breadcrumbCategory.textContent = category.name;
        breadcrumbCategory.href = `category.html?id=${category.id}`;
        breadcrumbTopic.textContent = topic.title;

        // Update topic header
        document.querySelector('.topic-header h1').textContent = topic.title;
        document.querySelector('.topic-stats').innerHTML = `
            <span><i class="fas fa-eye"></i> ${formatNumber(topic.viewCount)} views</span>
            <span><i class="fas fa-comments"></i> ${topic.replyCount} replies</span>
            <span><i class="fas fa-clock"></i> Started ${formatTimeAgo(topic.createdAt)}</span>
        `;

        // Update original post
        const author = users.find(u => u.id === topic.author.id);
        document.querySelector('.author-info h3').textContent = author.username;
        document.querySelector('.author-badges').innerHTML = author.badges.map(badge => 
            `<span class="badge ${badge}">${badge.replace('-', ' ')}</span>`
        ).join('');
        document.querySelector('.author-stats').innerHTML = `
            <span><i class="fas fa-star"></i> ${formatNumber(author.reputation)}</span>
            <span><i class="fas fa-comment"></i> ${author.postCount}</span>
        `;
        document.querySelector('.join-date').textContent = 
            `Member since ${new Date(author.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
        
        document.querySelector('.post-content p').textContent = topic.content;
        document.querySelector('.post-tags').innerHTML = topic.tags.map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('');
    }

    // Load and display replies
    function loadReplies() {
        const topicReplies = posts.filter(post => post.topicId === topicId);
        const sortedReplies = sortReplies(topicReplies);
        displayReplies(sortedReplies);
    }

    // Sort replies based on selected criteria
    function sortReplies(repliesList) {
        const sortBy = sortSelect.value;
        
        return repliesList.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'likes':
                    return b.likes - a.likes;
                default:
                    return new Date(a.createdAt) - new Date(b.createdAt);
            }
        });
    }

    // Display replies in the list
    function displayReplies(repliesList) {
        const repliesContainer = document.querySelector('.replies-list');
        repliesContainer.innerHTML = '';

        repliesList.forEach((reply, index) => {
            const author = users.find(u => u.id === reply.author.id);
            const replyElement = document.createElement('div');
            replyElement.className = 'post reply';
            
            replyElement.innerHTML = `
                <div class="post-sidebar">
                    <div class="author-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="author-info">
                        <h3>${author.username}</h3>
                        <div class="author-badges">
                            ${author.badges.map(badge => 
                                `<span class="badge ${badge}">${badge.replace('-', ' ')}</span>`
                            ).join('')}
                        </div>
                        <div class="author-stats">
                            <span><i class="fas fa-star"></i> ${formatNumber(author.reputation)}</span>
                            <span><i class="fas fa-comment"></i> ${author.postCount}</span>
                        </div>
                        <span class="join-date">Member since ${new Date(author.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    </div>
                </div>
                <div class="post-main">
                    <div class="post-content">
                        ${reply.content}
                    </div>
                    <div class="post-footer">
                        <div class="post-actions">
                            <button class="btn btn-icon" title="Like">
                                <i class="far fa-heart"></i>
                                <span>${reply.likes}</span>
                            </button>
                            <button class="btn btn-icon" title="Quote">
                                <i class="fas fa-quote-right"></i>
                            </button>
                            <button class="btn btn-icon" title="Share">
                                <i class="fas fa-share"></i>
                            </button>
                        </div>
                        <div class="post-meta">
                            <span class="post-number">#${index + 2}</span>
                            <span class="post-time">${formatTimeAgo(reply.createdAt)}</span>
                            <button class="btn btn-text">Report</button>
                        </div>
                    </div>
                </div>
            `;

            repliesContainer.appendChild(replyElement);
        });

        // Update empty state if no replies
        if (repliesList.length === 0) {
            repliesContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comments"></i>
                    <h3>No replies yet</h3>
                    <p>Be the first to reply to this topic!</p>
                </div>
            `;
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // Sort replies
        sortSelect.addEventListener('change', loadReplies);

        // Reply actions
        document.querySelectorAll('.post-actions .btn').forEach(button => {
            button.addEventListener('click', handlePostAction);
        });

        // Topic actions
        document.querySelectorAll('.topic-actions .btn').forEach(button => {
            button.addEventListener('click', handleTopicAction);
        });

        // Pagination
        setupPagination();
    }

    // Handle post actions (like, quote, share)
    function handlePostAction(e) {
        const action = e.currentTarget.title.toLowerCase();
        const postElement = e.currentTarget.closest('.post');
        const postNumber = postElement.querySelector('.post-number').textContent;

        switch (action) {
            case 'like':
                toggleLike(postElement);
                break;
            case 'quote':
                quotePost(postElement);
                break;
            case 'share':
                sharePost(postNumber);
                break;
        }
    }

    // Handle topic actions (share, bookmark, report)
    function handleTopicAction(e) {
        const action = e.currentTarget.title.toLowerCase();
        
        switch (action) {
            case 'share':
                sharePost('topic');
                break;
            case 'bookmark':
                toggleBookmark();
                break;
            case 'report':
                reportContent('topic');
                break;
        }
    }

    // Toggle like status
    function toggleLike(postElement) {
        const likeButton = postElement.querySelector('.post-actions .btn[title="Like"]');
        const likeIcon = likeButton.querySelector('i');
        const likeCount = likeButton.querySelector('span');
        
        if (likeIcon.classList.contains('far')) {
            likeIcon.classList.replace('far', 'fas');
            likeCount.textContent = parseInt(likeCount.textContent) + 1;
        } else {
            likeIcon.classList.replace('fas', 'far');
            likeCount.textContent = parseInt(likeCount.textContent) - 1;
        }
    }

    // Quote post content
    function quotePost(postElement) {
        const author = postElement.querySelector('.author-info h3').textContent;
        const content = postElement.querySelector('.post-content').textContent.trim();
        const quote = `> **${author}** wrote:\n> ${content}\n\n`;
        
        replyEditor.value = quote + replyEditor.value;
        replyEditor.focus();
    }

    // Share post
    function sharePost(reference) {
        const url = `${window.location.origin}${window.location.pathname}${reference !== 'topic' ? `#${reference}` : ''}`;
        // TODO: Implement sharing functionality
        console.log('Sharing URL:', url);
    }

    // Toggle bookmark status
    function toggleBookmark() {
        const bookmarkButton = document.querySelector('.topic-actions .btn[title="Bookmark"]');
        const bookmarkIcon = bookmarkButton.querySelector('i');
        
        if (bookmarkIcon.classList.contains('far')) {
            bookmarkIcon.classList.replace('far', 'fas');
            bookmarkButton.title = 'Bookmarked';
        } else {
            bookmarkIcon.classList.replace('fas', 'far');
            bookmarkButton.title = 'Bookmark';
        }
    }

    // Report content
    function reportContent(type) {
        // TODO: Implement reporting functionality
        console.log('Reporting', type);
    }

    // Setup pagination
    function setupPagination() {
        const pageButtons = document.querySelectorAll('.page-numbers .btn');
        pageButtons.forEach(button => {
            button.addEventListener('click', () => {
                pageButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                // TODO: Implement actual pagination
                loadReplies();
            });
        });
    }

    // Setup reply editor
    function setupEditor() {
        // Editor toolbar functionality
        editorToolbar.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', () => {
                const command = button.title.toLowerCase();
                let syntax = '';
                
                switch (command) {
                    case 'bold':
                        syntax = '**text**';
                        break;
                    case 'italic':
                        syntax = '*text*';
                        break;
                    case 'link':
                        syntax = '[text](url)';
                        break;
                    case 'image':
                        syntax = '![alt text](image-url)';
                        break;
                    case 'quote':
                        syntax = '> text';
                        break;
                }

                insertAtCursor(replyEditor, syntax);
            });
        });

        // Post reply
        replyButton.addEventListener('click', () => {
            const content = replyEditor.value.trim();
            if (content) {
                // TODO: Implement reply posting
                console.log('Posting reply:', content);
                replyEditor.value = '';
            }
        });
    }

    // Helper function to insert text at cursor position
    function insertAtCursor(textarea, text) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = textarea.value.substring(0, start);
        const after = textarea.value.substring(end);
        
        textarea.value = before + text + after;
        textarea.focus();
        textarea.selectionStart = start + text.length;
        textarea.selectionEnd = start + text.length;
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
    initTopicPage();
    setupMobileMenu();

    // Auto-update times
    setInterval(() => {
        document.querySelectorAll('.post-time').forEach(timeSpan => {
            const postElement = timeSpan.closest('.post');
            const isOriginalPost = postElement.classList.contains('original-post');
            const time = isOriginalPost ? topic.createdAt : posts[parseInt(timeSpan.previousElementSibling.textContent.slice(1)) - 2].createdAt;
            timeSpan.textContent = formatTimeAgo(time);
        });
    }, 60000); // Update every minute
});
