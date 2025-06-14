// Anonymous ID Management
const LOCAL_ID_KEY = 'letitout_anonymous_id';

class LocalIdManager {
    static generateId() {
        return 'anon_' + Math.random().toString(36).substr(2, 9);
    }

    static getId() {
        let id = localStorage.getItem(LOCAL_ID_KEY);
        if (!id) {
            id = this.generateId();
            localStorage.setItem(LOCAL_ID_KEY, id);
        }
        return id;
    }

    static resetId() {
        localStorage.removeItem(LOCAL_ID_KEY);
        return this.getId();
    }
}

// Export for use in other modules
window.LocalIdManager = LocalIdManager; 