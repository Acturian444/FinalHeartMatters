// Post Card Component
class PostCard {
    static create(post) {
        const card = document.createElement('div');
        card.className = 'post-card';
        card.dataset.postId = post.id;

        // Create content area wrapper
        const contentArea = document.createElement('div');
        contentArea.className = 'post-content-area';

        const content = document.createElement('div');
        content.className = 'post-content';
        content.textContent = post.content;

        // City line with timestamp (Anonymous from [City] · 8h ago)
        const cityLine = document.createElement('div');
        cityLine.className = 'post-city-line';
        const timeString = window.LetItOutUtils.formatDate(post.timestamp);
        if (post.city) {
            cityLine.textContent = `Anonymous from ${post.city} · ${timeString}`;
        } else {
            cityLine.textContent = `Anonymous · ${timeString}`;
        }

        // Emotion tags (one per pill, small)
        const emotionTags = document.createElement('div');
        emotionTags.className = 'post-emotion-tags';
        if (Array.isArray(post.emotions) && post.emotions.length > 0) {
            post.emotions.forEach(emotion => {
                const tag = document.createElement('span');
                tag.className = 'emotion-tag emotion-tag-small';
                tag.textContent = emotion;
                emotionTags.appendChild(tag);
            });
        } else if (post.emotion) {
            // fallback for single emotion
            const tag = document.createElement('span');
            tag.className = 'emotion-tag emotion-tag-small';
            tag.textContent = post.emotion;
            emotionTags.appendChild(tag);
        }
        contentArea.appendChild(emotionTags);
        contentArea.appendChild(content);
        contentArea.appendChild(cityLine);

        const meta = document.createElement('div');
        meta.className = 'post-meta';

        const actions = document.createElement('div');
        actions.className = 'post-actions';

        // Felt It Button
        const feltItBtn = document.createElement('button');
        feltItBtn.className = 'felt-it-btn';
        feltItBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span class="felt-it-text">Felt It</span>
            ${post.feltCount >= 2 ? `<span class="felt-it-count">${post.feltCount}</span>` : ''}
        `;

        // Check if user has already felt it
        const hasFeltIt = this.checkIfUserFeltIt(post.id);
        if (hasFeltIt) {
            feltItBtn.classList.add('felt');
            feltItBtn.querySelector('.felt-it-text').textContent = 'Felt';
        }

        feltItBtn.onclick = () => this.handleFeltIt(post.id, feltItBtn);

        // Share Love Button
        const shareLoveBtn = document.createElement('button');
        shareLoveBtn.className = 'share-love-btn';
        shareLoveBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span class="share-love-text">Share Love</span>
        `;
        if (this.checkIfUserSentLove(post.id)) {
            shareLoveBtn.classList.add('sent');
            shareLoveBtn.innerHTML = 'Love Sent';
            shareLoveBtn.disabled = true;
        } else {
            shareLoveBtn.onclick = () => this.openReplyModal(post.id);
        }

        actions.appendChild(feltItBtn);
        actions.appendChild(shareLoveBtn);
        meta.appendChild(actions);

        contentArea.appendChild(meta);

        card.appendChild(contentArea);

        return card;
    }

    static checkIfUserFeltIt(postId) {
        const feltPosts = JSON.parse(localStorage.getItem('feltPosts') || '[]');
        return feltPosts.includes(postId);
    }

    static async handleFeltIt(postId, button) {
        if (this.checkIfUserFeltIt(postId)) {
            return; // Already felt it
        }

        try {
            // Add to felt posts in localStorage
            const feltPosts = JSON.parse(localStorage.getItem('feltPosts') || '[]');
            feltPosts.push(postId);
            localStorage.setItem('feltPosts', JSON.stringify(feltPosts));

            // Update UI
            button.classList.add('felt');
            button.querySelector('.felt-it-text').textContent = 'Felt';

            // Update count
            const countSpan = button.querySelector('.felt-it-count');
            const currentCount = parseInt(countSpan?.textContent || '0');
            const newCount = currentCount + 1;

            if (newCount >= 2) {
                if (!countSpan) {
                    const newCountSpan = document.createElement('span');
                    newCountSpan.className = 'felt-it-count';
                    newCountSpan.textContent = newCount;
                    button.appendChild(newCountSpan);
                } else {
                    countSpan.textContent = newCount;
                }
            }

            // Update in Firestore
            await window.PostService.incrementFeltCount(postId);
        } catch (error) {
            console.error('Error updating felt count:', error);
            window.LetItOutUtils.showError('Error updating felt count. Please try again.');
        }
    }

    static checkIfUserSentLove(postId) {
        const sentReplies = JSON.parse(localStorage.getItem('sentReplies') || '{}');
        return sentReplies[postId] === true;
    }

    static async openReplyModal(postId) {
        // Check if user has already sent love
        if (this.checkIfUserSentLove(postId)) {
            this.showSentMessage(postId);
            return;
        }

        const overlay = document.createElement('div');
        overlay.className = 'reply-modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'reply-modal';
        modal.innerHTML = `
            <div class="reply-modal-header">
                <div class="reply-modal-title">Send a short note of support to the person who wrote this</div>
            </div>
            <textarea class="reply-textarea" placeholder="Write your message of support..." maxlength="250"></textarea>
            <div class="char-counter">0/250</div>
            <div class="reply-actions">
                <button class="cancel-btn">Cancel</button>
                <button class="send-btn" disabled>Send Love</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        setTimeout(() => overlay.classList.add('visible'), 10);

        const textarea = modal.querySelector('.reply-textarea');
        const counter = modal.querySelector('.char-counter');
        const sendBtn = modal.querySelector('.send-btn');
        
        textarea.oninput = () => {
            const length = textarea.value.trim().length;
            counter.textContent = `${length}/250`;
            if (length > 200) {
                counter.classList.add('near-limit');
            } else {
                counter.classList.remove('near-limit');
            }
            sendBtn.disabled = length === 0;
        };

        sendBtn.onclick = async () => {
            const content = textarea.value.trim();
            if (!content) return;

            try {
                await this.sendReply(postId, content);
                this.showSuccessMessage();
                this.updateShareLoveButton(postId);
                this.saveSentReply(postId);
                overlay.classList.remove('visible');
                setTimeout(() => overlay.remove(), 300);
            } catch (error) {
                window.LetItOutUtils.showError('Failed to send message. Please try again.');
            }
        };

        const cancelBtn = modal.querySelector('.cancel-btn');
        cancelBtn.onclick = () => {
            overlay.classList.remove('visible');
            setTimeout(() => overlay.remove(), 300);
        };

        // Close on overlay click
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('visible');
                setTimeout(() => overlay.remove(), 300);
            }
        };
    }

    static async sendReply(postId, content) {
        const reply = {
            postId,
            replyText: content,
            timestamp: new Date().toISOString(),
            feltBy: window.firebaseUserId,
            read: false
        };

        await window.PostService.addReply(postId, reply);
    }

    static showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'reply-success-message';
        message.textContent = 'Your love was sent anonymously.';
        document.body.appendChild(message);
        setTimeout(() => message.classList.add('visible'), 10);
        setTimeout(() => {
            message.classList.remove('visible');
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    static updateShareLoveButton(postId) {
        const button = document.querySelector(`[data-post-id="${postId}"] .share-love-btn`);
        if (button) {
            button.classList.add('sent');
            button.innerHTML = 'Love Sent';
        }
    }

    static saveSentReply(postId) {
        const sentReplies = JSON.parse(localStorage.getItem('sentReplies') || '{}');
        sentReplies[postId] = true;
        localStorage.setItem('sentReplies', JSON.stringify(sentReplies));
    }

    static async showSentMessage(postId) {
        const reply = await window.PostService.getUserReply(postId);
        if (!reply) return;

        const modal = document.createElement('div');
        modal.className = 'sent-message-modal';
        modal.innerHTML = `
            <div class="sent-message-content">${reply.replyText}</div>
            <button class="sent-message-close">Close</button>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('visible'), 10);

        const closeBtn = modal.querySelector('.sent-message-close');
        closeBtn.onclick = () => {
            modal.classList.remove('visible');
            setTimeout(() => modal.remove(), 300);
        };
    }

    render() {
        const { post, isInbox = false } = this.props;
        const { showReplyModal, replyText, isSubmitting, error } = this.state;
        const hasReplies = post.replies && post.replies.length > 0;
        const isPremiumUser = localStorage.getItem('premium') === 'true';
        const showAllReplies = isPremiumUser || (post.replies && post.replies.length <= 3);
        const visibleReplies = showAllReplies ? post.replies : post.replies.slice(0, 3);
        const hasMoreReplies = post.replies && post.replies.length > 3 && !isPremiumUser;
        const hasUnreadReplies = post.replies && post.replies.some(reply => !reply.read);

        return `
            <div class="post-card ${isInbox ? 'inbox-post' : ''}">
                <div class="post-header">
                    <div class="post-meta">
                        <span class="post-date">${this.formatDate(post.timestamp)}</span>
                        ${post.emotions ? `
                            <div class="post-emotions">
                                ${post.emotions.map(emotion => `
                                    <span class="emotion-tag">${emotion}</span>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                    ${isInbox && hasUnreadReplies ? `
                        <span class="unread-badge">New</span>
                    ` : ''}
                </div>
                
                <div class="post-content">${post.content}</div>
                
                ${isInbox ? `
                    <div class="reply-list">
                        ${hasReplies ? `
                            <div class="reply-list-header">
                                <div class="reply-list-title">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                    Replies
                                    ${hasUnreadReplies ? `
                                        <span class="unread-badge">New</span>
                                    ` : ''}
                                </div>
                                ${hasMoreReplies ? `
                                    <span class="reply-count">${post.replies.length} total</span>
                                ` : ''}
                            </div>
                            
                            ${visibleReplies.map(reply => `
                                <div class="inbox-reply-card ${!reply.read ? 'unread' : ''}">
                                    <div class="inbox-reply-content">${reply.content}</div>
                                    <div class="inbox-reply-timestamp">${this.formatDate(reply.timestamp)}</div>
                                </div>
                            `).join('')}
                            
                            ${hasMoreReplies ? `
                                <div class="premium-lock-card">
                                    <div class="premium-lock-title">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"></path>
                                        </svg>
                                        Premium Content
                                    </div>
                                    <div class="premium-lock-text">
                                        Unlock all ${post.replies.length} replies and get unlimited access to future responses.
                                    </div>
                                    <button class="premium-lock-cta" data-action="upgrade">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                        Upgrade to Premium
                                    </button>
                                </div>
                            ` : ''}
                        ` : `
                            <div class="inbox-empty-state">
                                <div class="inbox-empty-state-title">No replies yet</div>
                                <div class="inbox-empty-state-text">
                                    Share your post to get responses from the community.
                                </div>
                                <button class="inbox-empty-state-cta" data-action="share">
                                    Share your post
                                </button>
                            </div>
                        `}
                    </div>
                ` : `
                    <div class="post-actions">
                        <button class="share-love-btn" data-action="share-love">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            Share Love
                        </button>
                    </div>
                `}
                
                ${showReplyModal ? `
                    <div class="modal-overlay">
                        <div class="modal">
                            <div class="modal-header">
                                <h3>Share Your Love</h3>
                                <button class="modal-close" data-action="close-modal">×</button>
                            </div>
                            <div class="modal-body">
                                <textarea 
                                    class="reply-textarea" 
                                    placeholder="Write your message here (max 250 characters)..."
                                    maxlength="250"
                                >${replyText}</textarea>
                                <div class="char-counter">${replyText.length}/250</div>
                                ${error ? `<div class="error-message">${error}</div>` : ''}
                            </div>
                            <div class="modal-footer">
                                <button class="modal-cancel" data-action="close-modal">Cancel</button>
                                <button class="modal-submit" data-action="submit-reply" ${isSubmitting ? 'disabled' : ''}>
                                    ${isSubmitting ? 'Sending...' : 'Send Love'}
                                </button>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                ${this.state.showPremiumModal ? `
                    <div class="premium-modal-overlay">
                        <div class="premium-modal">
                            <div class="premium-modal-header">
                                <div class="premium-modal-title">Upgrade to Premium</div>
                                <div class="premium-modal-text">
                                    Get unlimited access to all replies and future responses.
                                </div>
                                <div class="premium-modal-price">$4.99/month</div>
                            </div>
                            <button class="premium-modal-cta" data-action="subscribe">
                                Subscribe Now
                            </button>
                            <button class="premium-modal-cancel" data-action="close-premium">
                                Maybe Later
                            </button>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    handleEvent(event) {
        const action = event.target.dataset.action;
        
        switch(action) {
            case 'share-love':
                this.setState({ showReplyModal: true });
                break;
                
            case 'close-modal':
                this.setState({ 
                    showReplyModal: false,
                    replyText: '',
                    error: null
                });
                break;
                
            case 'submit-reply':
                this.handleSubmitReply();
                break;
                
            case 'upgrade':
                this.setState({ showPremiumModal: true });
                break;
                
            case 'close-premium':
                this.setState({ showPremiumModal: false });
                break;
                
            case 'subscribe':
                this.handleSubscribe();
                break;
                
            case 'share':
                this.handleShare();
                break;
        }
    }

    async handleSubscribe() {
        try {
            const stripePublicKey = 'pk_test_51RaP4RQ1hjqBwoa0ZnOuoRygvmNsfrRQmGG5wXIjcVhyKebi1CFfcG00pIQCceYu8pqlzFhAuJeNGz2dw5wlAcbD00wooUWDOR';
            const stripe = Stripe(stripePublicKey);
            const priceId = 'price_XXXXXXXXXXXXXX'; // Replace with your test price ID
            await stripe.redirectToCheckout({
                lineItems: [{ price: priceId, quantity: 1 }],
                mode: 'subscription',
                successUrl: window.location.origin + '/letitout.html?premium=success',
                cancelUrl: window.location.origin + '/letitout.html?premium=cancel',
            });
        } catch (error) {
            console.error('Subscription error:', error);
        }
    }

    async handleShare() {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Heart Matters',
                    text: 'Check out my post on Heart Matters',
                    url: window.location.href
                });
            } else {
                // Fallback for browsers that don't support Web Share API
                const dummy = document.createElement('input');
                document.body.appendChild(dummy);
                dummy.value = window.location.href;
                dummy.select();
                document.execCommand('copy');
                document.body.removeChild(dummy);
                
                // Show copied message
                const shareBtn = this.element.querySelector('[data-action="share"]');
                const originalText = shareBtn.textContent;
                shareBtn.textContent = 'Link copied!';
                setTimeout(() => {
                    shareBtn.textContent = originalText;
                }, 2000);
            }
        } catch (error) {
            console.error('Share error:', error);
        }
    }
}

// Export for use in other modules
window.PostCard = PostCard;

// At the top of the file or inside a suitable init method
(function checkPremiumFlag() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('premium') === 'success') {
        localStorage.setItem('premium', 'true');
        // Optionally, show a toast or confirmation
        setTimeout(() => {
            window.location.replace(window.location.pathname); // Clean up query param
        }, 1000);
    }
})(); 