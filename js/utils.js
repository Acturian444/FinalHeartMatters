// Utility Functions
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
        document.getElementById('letitout-main').prepend(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    }
};

// Detect incognito/private mode
// Returns a Promise that resolves to true if incognito, false otherwise
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

// Export for use in other modules
window.LetItOutUtils = Utils;
window.LetItOutIncognito = detectIncognito; 