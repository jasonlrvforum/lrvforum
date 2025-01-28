// Forum Categories Data
var categories = [
    {
        id: 1,
        name: "Resort Reviews",
        description: "Share your experiences and read reviews from other owners",
        icon: "hotel",
        topicCount: 245,
        memberCount: 1200
    },
    {
        id: 2,
        name: "General Discussion",
        description: "Chat about timeshare ownership, experiences, and tips",
        icon: "comments",
        topicCount: 189,
        memberCount: 956
    },
    {
        id: 3,
        name: "Buying/Selling Tips",
        description: "Expert advice on timeshare transactions and negotiations",
        icon: "handshake",
        topicCount: 167,
        memberCount: 823
    },
    {
        id: 4,
        name: "Market Updates",
        description: "Stay informed about timeshare market trends and news",
        icon: "chart-line",
        topicCount: 134,
        memberCount: 745
    },
    {
        id: 5,
        name: "Owner Support",
        description: "Get help with ownership questions and issues",
        icon: "life-ring",
        topicCount: 198,
        memberCount: 934
    }
];

// Forum Topics Data
var topics = [
    {
        id: 1,
        categoryId: 4,
        title: "Best Time to Buy: Market Analysis 2025",
        author: {
            id: 1,
            username: "JohnDoe",
            reputation: 1250
        },
        createdAt: new Date("2025-01-27T14:00:00"),
        lastReplyAt: new Date("2025-01-27T15:00:00"),
        viewCount: 1200,
        replyCount: 45,
        status: "hot",
        content: "A comprehensive analysis of the current timeshare market trends...",
        tags: ["market-analysis", "buying", "trends"]
    },
    {
        id: 2,
        categoryId: 1,
        title: "Maui Resort Review: Post-Recovery Update",
        author: {
            id: 2,
            username: "TravelPro",
            reputation: 3400
        },
        createdAt: new Date("2025-01-27T11:00:00"),
        lastReplyAt: new Date("2025-01-27T14:00:00"),
        viewCount: 890,
        replyCount: 32,
        status: "featured",
        content: "Detailed review of the Maui resort's recovery and current state...",
        tags: ["resort-review", "maui", "hawaii"]
    }
];

// Forum Posts Data (Replies)
var posts = [
    {
        id: 1,
        topicId: 1,
        author: {
            id: 3,
            username: "ResortExpert",
            reputation: 2100
        },
        content: "Great analysis! I've noticed similar trends in the market...",
        createdAt: new Date("2025-01-27T14:30:00"),
        editedAt: null,
        likes: 15
    },
    {
        id: 2,
        topicId: 1,
        author: {
            id: 4,
            username: "TimeshareOwner",
            reputation: 850
        },
        content: "This matches my experience. The winter months tend to have better deals...",
        createdAt: new Date("2025-01-27T14:45:00"),
        editedAt: null,
        likes: 8
    }
];

// Users Data
var users = [
    {
        id: 1,
        username: "JohnDoe",
        joinDate: new Date("2024-01-01"),
        reputation: 1250,
        postCount: 156,
        badges: ["verified-owner", "top-contributor"]
    },
    {
        id: 2,
        username: "TravelPro",
        joinDate: new Date("2023-06-15"),
        reputation: 3400,
        postCount: 342,
        badges: ["verified-owner", "expert", "moderator"]
    },
    {
        id: 3,
        username: "ResortExpert",
        joinDate: new Date("2024-03-20"),
        reputation: 2100,
        postCount: 89,
        badges: ["verified-owner", "expert"]
    },
    {
        id: 4,
        username: "TimeshareOwner",
        joinDate: new Date("2024-11-05"),
        reputation: 850,
        postCount: 27,
        badges: ["verified-owner"]
    }
];

// Utility Functions
var formatTimeAgo = function(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    if (diffInHours > 0) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    if (diffInMinutes > 0) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    return 'just now';
};

var formatNumber = function(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
};

// Timeshare Locations Data
var locations = {
    "United States": {
        "Alabama": ["Gulf Shores"],
        "Arizona": ["Phoenix", "Sedona", "Scottsdale"],
        "California": ["Anaheim", "Lake Tahoe", "Napa Valley", "Palm Springs", "San Diego", "San Francisco"],
        "Colorado": ["Breckenridge", "Steamboat Springs", "Vail", "Winter Park"],
        "Florida": ["Daytona Beach", "Fort Lauderdale", "Kissimmee", "Miami", "Orlando", "Panama City Beach"],
        "Hawaii": ["Honolulu (Oahu)", "Lahaina (Maui)", "Kailua-Kona (Big Island)", "Princeville (Kauai)"],
        "Nevada": ["Las Vegas", "Lake Tahoe"],
        "South Carolina": ["Hilton Head Island", "Myrtle Beach"],
        "Tennessee": ["Gatlinburg", "Pigeon Forge"],
        "Texas": ["Galveston"],
        "Utah": ["Park City"],
        "Vermont": ["Stowe"],
        "Virginia": ["Williamsburg"],
        "Wisconsin": ["Wisconsin Dells"]
    },
    "Mexico": {
        "Baja California Sur": ["Cabo San Lucas", "San José del Cabo"],
        "Jalisco": ["Puerto Vallarta"],
        "Nayarit": ["Nuevo Vallarta"],
        "Quintana Roo": ["Cancun", "Cozumel", "Playa del Carmen"]
    },
    "Caribbean": {
        "Aruba": ["Palm Beach"],
        "Bahamas": ["Nassau", "Paradise Island"],
        "Dominican Republic": ["Punta Cana"],
        "Jamaica": ["Montego Bay"],
        "St. Maarten": ["Philipsburg", "Simpson Bay"],
        "US Virgin Islands": ["St. Thomas"]
    }
};

// Export data and utilities
window.forumData = {
    categories,
    topics,
    posts,
    users,
    locations,
    utils: {
        formatTimeAgo,
        formatNumber
    }
};
