// Wall Feed Handler
class WallFeed {
    constructor() {
        this.feed = document.createElement('div');
        this.feed.className = 'wall-feed';
        this.unsubscribe = null;
    }

    render(container) {
        container.appendChild(this.feed);
        this.subscribeToPosts();
    }

    subscribeToPosts() {
        this.unsubscribe = window.PostService.subscribeToPosts(posts => {
            this.renderPosts(posts);
        });
    }

    renderPosts(posts) {
        // Clear existing posts
        this.feed.innerHTML = '';

        if (posts.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.textContent = 'Be the first to share your feelings.';
            this.feed.appendChild(emptyState);
            return;
        }

        // Render each post
        posts.forEach(post => {
            const postCard = window.PostCard.create(post);
            this.feed.appendChild(postCard);
        });
    }

    cleanup() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
}

// Initialize wall feed when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const main = document.getElementById('letitout-main');
    if (main) {
        const wallFeed = new WallFeed();
        wallFeed.render(main);

        // Cleanup on page unload
        window.addEventListener('unload', () => {
            wallFeed.cleanup();
        });
    }
}); 