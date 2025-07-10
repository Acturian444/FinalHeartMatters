// Premium Packs Module
class PremiumPacks {
    constructor() {
        this.premiumPacks = {
            "breakup": {
                id: "breakup",
                title: "Healing After a Breakup",
                subtitle: "Let go of the past, feel your feelings, and rebuild your heart one truth at a time.",
                stripePriceId: "price_1Rd1blQ1hjqBwoa0kjXwrfFi",
                prompts: [
                    "What did you need from them that you never received?",
                    "What part of the relationship are you still holding onto?",
                    "What do you miss that you know wasn't healthy for you?",
                    "What truth did you avoid facing while you were with them?",
                    "What version of yourself did you lose in the relationship?",
                    "What do you blame yourself for that isn't your fault?",
                    "What would you say to them now if you could?",
                    "What do you wish they had said to you when it ended?",
                    "What are you afraid of feeling now that it's over?",
                    "What part of you is ready to begin again?"
                ]
            },
            "grief": {
                id: "grief",
                title: "Grief & Letting Go",
                subtitle: "Say what was never said. Honor what you lost. Begin to release what still hurts.",
                stripePriceId: "price_1Rd1eWQ1hjqBwoa0lhh9xMaZ",
                prompts: [
                    "What do you miss most about what you lost?",
                    "What memory still feels too heavy to carry?",
                    "What haven't you let yourself cry about yet?",
                    "What do you wish you could say to them today?",
                    "What part of your grief feels unacknowledged by others?",
                    "What are you scared will happen if you finally let go?",
                    "What moment changed everything?",
                    "What does closure look like to you, and why is it hard to find?",
                    "What lesson did this loss leave behind?",
                    "What do you want to carry forward with love?"
                ]
            },
            "anxiety": {
                id: "anxiety",
                title: "Anxiety & Overthinking",
                subtitle: "Slow the spiral. Quiet your mind. Put words to the weight you carry every day.",
                stripePriceId: "price_1Rd1f4Q1hjqBwoa0jQT4lhYA",
                prompts: [
                    "What fear keeps looping in your mind right now?",
                    "What's the worst-case scenario you're imagining, and what's most likely?",
                    "What are you trying to control that isn't yours to hold?",
                    "What expectation is weighing you down today?",
                    "What would it feel like to soften your grip and trust the process?",
                    "What does your inner critic say, and is it telling the truth?",
                    "What past moment are you stuck replaying, and why?",
                    "What are three things you can name that are okay right now?",
                    "What's something kind you wish someone told you?",
                    "What would the calmest version of you say right now?"
                ]
            }
        };

        this.storageKeys = {
            unlockedPacks: 'letitout_unlocked_packs',
            currentPack: 'letitout_current_pack',
            currentPromptIndex: 'letitout_current_prompt_index'
        };

        this.starterPack = {
            id: "starter",
            title: "Let It Out: Starter Pack",
            subtitle: "General prompts to help you begin your journey.",
            prompts: [
                "What's something you've never said out loud until now?",
                "What did you need, but never received?",
                "What emotion do you suppress the most and why?",
                "What boundary did someone cross that changed you?",
                "What story have you never told until now?",
                "What do you need to release before it consumes you?",
                "What's something you wish you could erase from your past?",
                "What memory do you keep revisiting?",
                "What old version of yourself are you ready to leave behind?",
                "What would your younger self say to you today?",
                "What guilt have you never forgiven yourself for?",
                "What do you carry that no one sees?",
                "What's the truth you're afraid to admit?",
                "What do you wish someone had said to you when you needed it?",
                "What do you want to let go of but can't?"
            ],
            defaultPrompt: "What's on your heart today?"
        };

        // MVP Mode: Manual unlock mode - packs unlock one by one
        if (window.MVP_CONFIG && window.MVP_CONFIG.MANUAL_UNLOCK_MODE) {
            // Don't auto-unlock - let users unlock manually for engagement
        }
    }

    // Get all unlocked packs
    getUnlockedPacks() {
        try {
            const unlocked = localStorage.getItem(this.storageKeys.unlockedPacks);
            return unlocked ? JSON.parse(unlocked) : [];
        } catch (error) {
            console.error('Error getting unlocked packs:', error);
            return [];
        }
    }

    // Check if a pack is unlocked
    isPackUnlocked(packId) {
        const unlockedPacks = this.getUnlockedPacks();
        return unlockedPacks.includes(packId);
    }

    // Unlock a pack
    unlockPack(packId) {
        try {
            const unlockedPacks = this.getUnlockedPacks();
            if (!unlockedPacks.includes(packId)) {
                unlockedPacks.push(packId);
                localStorage.setItem(this.storageKeys.unlockedPacks, JSON.stringify(unlockedPacks));
            }
            return true;
        } catch (error) {
            console.error('Error unlocking pack:', error);
            return false;
        }
    }

    // Get current pack
    getCurrentPack() {
        try {
            const currentPack = localStorage.getItem(this.storageKeys.currentPack);
            return currentPack || 'starter';
        } catch (error) {
            console.error('Error getting current pack:', error);
            return 'starter';
        }
    }

    // Set current pack
    setCurrentPack(packId) {
        try {
            localStorage.setItem(this.storageKeys.currentPack, packId);
            // Reset prompt index when switching packs
            localStorage.setItem(this.storageKeys.currentPromptIndex, '0');
            return true;
        } catch (error) {
            console.error('Error setting current pack:', error);
            return false;
        }
    }

    // Get current prompt index
    getCurrentPromptIndex() {
        try {
            const index = localStorage.getItem(this.storageKeys.currentPromptIndex);
            return index ? parseInt(index) : 0;
        } catch (error) {
            console.error('Error getting current prompt index:', error);
            return 0;
        }
    }

    // Set current prompt index
    setCurrentPromptIndex(index) {
        try {
            localStorage.setItem(this.storageKeys.currentPromptIndex, index.toString());
            return true;
        } catch (error) {
            console.error('Error setting current prompt index:', error);
            return false;
        }
    }

    // Get current pack data
    getCurrentPackData() {
        const currentPackId = this.getCurrentPack();
        if (currentPackId === 'starter') {
            return this.starterPack;
        }
        return this.premiumPacks[currentPackId] || this.starterPack;
    }

    // Get current prompt
    getCurrentPrompt() {
        const currentPack = this.getCurrentPackData();
        const currentIndex = this.getCurrentPromptIndex();
        
        if (currentPack.id === 'starter') {
            // For starter pack, use the existing random/shuffle logic
            return currentPack.defaultPrompt;
        } else {
            // For premium packs, use sequential prompts
            const prompts = currentPack.prompts;
            return prompts[currentIndex] || prompts[0];
        }
    }

    // Get next prompt
    getNextPrompt() {
        const currentPack = this.getCurrentPackData();
        const currentIndex = this.getCurrentPromptIndex();
        
        if (currentPack.id === 'starter') {
            // For starter pack, return default (random logic handled elsewhere)
            return currentPack.defaultPrompt;
        } else {
            // For premium packs, go to next sequential prompt
            const prompts = currentPack.prompts;
            const nextIndex = Math.min(currentIndex + 1, prompts.length - 1);
            this.setCurrentPromptIndex(nextIndex);
            return prompts[nextIndex];
        }
    }

    // Get previous prompt
    getPreviousPrompt() {
        const currentPack = this.getCurrentPackData();
        const currentIndex = this.getCurrentPromptIndex();
        
        if (currentPack.id === 'starter') {
            // For starter pack, return default (back logic handled elsewhere)
            return currentPack.defaultPrompt;
        } else {
            // For premium packs, go to previous sequential prompt
            const prompts = currentPack.prompts;
            const prevIndex = Math.max(currentIndex - 1, 0);
            this.setCurrentPromptIndex(prevIndex);
            return prompts[prevIndex];
        }
    }

    // Check if user has any unlocked packs
    hasUnlockedPacks() {
        return this.getUnlockedPacks().length > 0;
    }

    // Get all available packs (for modal display)
    getAllPacks() {
        return {
            starter: this.starterPack,
            ...this.premiumPacks
        };
    }

    // Get premium packs only
    getPremiumPacks() {
        return this.premiumPacks;
    }

    // Clear all premium pack data (for testing/reset)
    clearAllData() {
        try {
            localStorage.removeItem(this.storageKeys.unlockedPacks);
            localStorage.removeItem(this.storageKeys.currentPack);
            localStorage.removeItem(this.storageKeys.currentPromptIndex);
            return true;
        } catch (error) {
            console.error('Error clearing premium pack data:', error);
            return false;
        }
    }

    // MVP Mode: Unlock all premium packs
    unlockAllPacks() {
        try {
            const allPackIds = Object.keys(this.premiumPacks);
            const unlockedPacks = this.getUnlockedPacks();
            
            allPackIds.forEach(packId => {
                if (!unlockedPacks.includes(packId)) {
                    unlockedPacks.push(packId);
                }
            });
            
            localStorage.setItem(this.storageKeys.unlockedPacks, JSON.stringify(unlockedPacks));
            return true;
        } catch (error) {
            console.error('Error unlocking all packs:', error);
            return false;
        }
    }
}

// Export for global use
window.PremiumPacks = PremiumPacks; 