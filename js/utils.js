// Shared site utilities (lightweight; safe to load on any page)
const Utils = {
    sanitizeText(text) {
        return String(text || '')
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
    }
};

window.Utils = Utils;
