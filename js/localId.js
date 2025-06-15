// Anonymous ID Management
const LOCAL_ID_KEY = 'letitout_anonymous_id';

const EMOTIONAL_WORDS = [
    'Clarity', 'Truth', 'Grace', 'Resilience', 'Peace', 'Authenticity', 'Hope', 'Courage', 'Compassion', 'Strength',
    'Light', 'Wisdom', 'Kindness', 'Bravery', 'Patience', 'Joy', 'Healing', 'Growth', 'Serenity', 'Faith',
    'Radiance', 'Harmony', 'Inspiration', 'Freedom', 'Balance', 'Empathy', 'Purpose', 'Wonder', 'Calm', 'Unity'
];

const TRAIT_NOUNS = [
    'Heart', 'Soul', 'Light', 'Voice', 'Mind', 'Spirit', 'Dream', 'Journey', 'Vision', 'Path',
    'Fire', 'River', 'Sky', 'Stone', 'Star', 'Bloom', 'Root', 'Wing', 'Song', 'Echo',
    'Aura', 'Pulse', 'Wave', 'Rise', 'Shine', 'Quest', 'Bridge', 'Haven', 'Field', 'Summit'
];

class LocalIdManager {
    static generateId() {
        const firstWord = EMOTIONAL_WORDS[Math.floor(Math.random() * EMOTIONAL_WORDS.length)];
        const secondWord = TRAIT_NOUNS[Math.floor(Math.random() * TRAIT_NOUNS.length)];
        const number = Math.floor(1000 + Math.random() * 9000); // 4-digit number
        return `${firstWord}${secondWord}${number}`;
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

// Utility function to get the anonymous user ID
function getAnonymousUserId() {
    return LocalIdManager.getId();
}

// Export for use in other modules
window.LocalIdManager = LocalIdManager;
window.getAnonymousUserId = getAnonymousUserId; 