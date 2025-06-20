// Initialize base utilities
const Utils = {
    formatDate(timestamp) {
        if (!timestamp) return '';
        
        const date = timestamp.toDate();
        const now = new Date();
        const diff = now - date;
        
        // Less than 24 hours
        if (diff < 24 * 60 * 60 * 1000) {
            const hours = Math.floor(diff / (60 * 60 * 1000));
            if (hours === 0) {
                const minutes = Math.floor(diff / (60 * 1000));
                return `${minutes}m ago`;
            }
            return `${hours}h ago`;
        }
        
        // Less than 7 days
        if (diff < 7 * 24 * 60 * 60 * 1000) {
            const days = Math.floor(diff / (24 * 60 * 60 * 1000));
            return `${days}d ago`;
        }
        
        // Otherwise, show full date
        return date.toLocaleDateString();
    },

    sanitizeText(text) {
        return text
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .trim();
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            setTimeout(() => errorDiv.remove(), 300);
        }, 5000);
    },

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        document.body.appendChild(successDiv);
        setTimeout(() => {
            successDiv.style.opacity = '0';
            setTimeout(() => successDiv.remove(), 300);
        }, 3000);
    },

    // Premium feature utilities
    getFreeUnlockedPosts() {
        try {
            return JSON.parse(localStorage.getItem('freeUnlockedPosts') || '[]');
        } catch (e) {
            console.error('Error getting free unlocked posts:', e);
            return [];
        }
    },

    getPaidUnlockedPosts() {
        try {
            return JSON.parse(localStorage.getItem('paidUnlockedPosts') || '[]');
        } catch (e) {
            console.error('Error getting paid unlocked posts:', e);
            return [];
        }
    },

    addFreeUnlockedPost(postId) {
        try {
            const arr = this.getFreeUnlockedPosts();
            if (!arr.includes(postId)) {
                arr.push(postId);
                localStorage.setItem('freeUnlockedPosts', JSON.stringify(arr));
            }
        } catch (e) {
            console.error('Error adding free unlocked post:', e);
        }
    },

    addPaidUnlockedPost(postId) {
        try {
            const arr = this.getPaidUnlockedPosts();
            if (!arr.includes(postId)) {
                arr.push(postId);
                localStorage.setItem('paidUnlockedPosts', JSON.stringify(arr));
            }
        } catch (e) {
            console.error('Error adding paid unlocked post:', e);
        }
    },

    getFreeUnlocksLeft() {
        try {
            return 3 - this.getFreeUnlockedPosts().length;
        } catch (e) {
            console.error('Error getting free unlocks left:', e);
            return 3;
        }
    },

    // Check for unlocked posts from Stripe success
    checkForUnlockedPosts() {
        const params = new URLSearchParams(window.location.search);
        const unlockedPostId = params.get('unlocked');
        if (unlockedPostId) {
            this.addPaidUnlockedPost(unlockedPostId);
            // Clean up URL
            const newUrl = window.location.pathname + window.location.hash;
            window.history.replaceState({}, document.title, newUrl);
            // Show success message
            this.showSuccess('Post replies unlocked! You can now view all messages for this post.');
        }
    },

    // Update unread message badge on My Posts button
    async updateUnreadBadge() {
        try {
            if (!window.PostService) {
                console.error('PostService not available');
                return;
            }

            const unreadCount = await window.PostService.getUnreadReplyCount();
            const myPostsBtn = document.querySelector('.letitout-my-posts-btn-global');
            
            if (myPostsBtn) {
                // Remove existing badge if any
                const existingBadge = myPostsBtn.querySelector('.unread-badge');
                if (existingBadge) {
                    existingBadge.remove();
                }

                // Add badge if there are unread messages
                if (unreadCount > 0) {
                    const badge = document.createElement('span');
                    badge.className = 'unread-badge';
                    badge.textContent = unreadCount > 99 ? '99+' : unreadCount.toString();
                    myPostsBtn.appendChild(badge);
                }
            }
        } catch (error) {
            console.error('Error updating unread badge:', error);
        }
    }
};

// Detect incognito/private mode
function detectIncognito() {
    return new Promise((resolve) => {
        const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
        if (!fs) {
            // Not supported, assume not incognito
            resolve(false);
        } else {
            fs(window.TEMPORARY, 100, () => resolve(false), () => resolve(true));
        }
    });
}

// Initialize utilities globally
window.LetItOutUtils = Utils;
window.Utils = Utils; // For backwards compatibility
window.LetItOutIncognito = detectIncognito;

// Debug logging
console.log('Utils initialized:', {
    LetItOutUtils: window.LetItOutUtils,
    hasGetFreeUnlockedPosts: typeof window.LetItOutUtils?.getFreeUnlockedPosts,
    hasGetPaidUnlockedPosts: typeof window.LetItOutUtils?.getPaidUnlockedPosts,
    hasAddFreeUnlockedPost: typeof window.LetItOutUtils?.addFreeUnlockedPost,
    hasAddPaidUnlockedPost: typeof window.LetItOutUtils?.addPaidUnlockedPost,
    hasGetFreeUnlocksLeft: typeof window.LetItOutUtils?.getFreeUnlocksLeft,
    hasCheckForUnlockedPosts: typeof window.LetItOutUtils?.checkForUnlockedPosts
});