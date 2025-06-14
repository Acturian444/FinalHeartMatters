// Post Card Component
class PostCard {
    static create(post) {
        const card = document.createElement('div');
        card.className = 'post-card';
        card.dataset.postId = post.id;

        const content = document.createElement('div');
        content.className = 'post-content';
        content.textContent = post.content;

        const meta = document.createElement('div');
        meta.className = 'post-meta';

        const timestamp = document.createElement('span');
        timestamp.className = 'post-timestamp';
        timestamp.textContent = window.LetItOutUtils.formatDate(post.timestamp);

        const actions = document.createElement('div');
        actions.className = 'post-actions';

        const feltButton = document.createElement('button');
        feltButton.className = 'post-action felt-button';
        feltButton.innerHTML = `<i class="fas fa-heart"></i> <span>${post.feltCount || 0}</span>`;
        feltButton.onclick = () => this.handleFelt(post.id);

        const emotionTag = document.createElement('span');
        emotionTag.className = 'emotion-tag';
        emotionTag.textContent = post.emotion;

        // City tag
        if (post.city) {
            const cityTag = document.createElement('span');
            cityTag.className = 'city-tag';
            cityTag.textContent = post.city;
            meta.appendChild(cityTag);
        }

        actions.appendChild(feltButton);
        meta.appendChild(timestamp);
        meta.appendChild(emotionTag);
        meta.appendChild(actions);

        card.appendChild(content);
        card.appendChild(meta);

        return card;
    }

    static async handleFelt(postId) {
        try {
            await window.PostService.incrementFeltCount(postId);
        } catch (error) {
            window.LetItOutUtils.showError('Error updating felt count. Please try again.');
        }
    }
}

// Export for use in other modules
window.PostCard = PostCard; 