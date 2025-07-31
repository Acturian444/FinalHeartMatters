// Post Card Component
class PostCard {
    static create(post) {
        const card = document.createElement('div');
        card.className = 'post-card';
        card.dataset.postId = post.id;

        const moreOptionsButton = document.createElement('button');
        moreOptionsButton.className = 'more-options-button';
        moreOptionsButton.innerHTML = '&#x22EE;'; // Vertical ellipsis (⋮)

        const optionsMenu = document.createElement('div');
        optionsMenu.className = 'options-menu';
        optionsMenu.innerHTML = `
            <a href="#" class="copy-link-button">Copy Link</a>
            <a href="#" class="share-post-button">Share</a>
            <a href="#" class="report-post-button">Report Post</a>
        `;

        card.appendChild(moreOptionsButton);
        card.appendChild(optionsMenu);

        // Create content area wrapper
        const contentArea = document.createElement('div');
        contentArea.className = 'post-content-area';

        // --- PREVIEW/EXPAND LOGIC ---
        const content = document.createElement('div');
        content.className = 'post-content';
        const fullText = post.content;
        const previewLimit = 200;
        const needsPreview = fullText.length > previewLimit;
        let expanded = false;

        // For smooth expand/collapse
        content.style.overflow = 'hidden';
        content.style.transition = 'max-height 0.3s cubic-bezier(0.4,0,0.2,1)';
        content.style.maxHeight = needsPreview ? '4.8em' : 'none'; // ~3 lines
        content.style.display = '-webkit-box';
        content.style.webkitBoxOrient = 'vertical';
        content.style.webkitLineClamp = needsPreview ? '3' : 'unset';
        content.style.whiteSpace = 'pre-line';

        // Always set the full text content. The CSS will handle truncation.
        content.textContent = fullText;

        // Emotion tags (one per pill, small)
        const emotionTags = document.createElement('div');
        emotionTags.className = 'post-emotion-tags';
        if (post.isInbox) {
            // This is logic for the "My Posts" view, not the main wall.
            // It won't run here but is kept for component consistency.
        } else if (Array.isArray(post.emotions) && post.emotions.length > 0) {
            post.emotions.forEach(emotion => {
                emotion.split(',').map(e => e.trim()).forEach(e => {
                    if (e) {
                        const tag = document.createElement('span');
                        tag.className = 'emotion-tag emotion-tag-small';
                        tag.textContent = e;
                        emotionTags.appendChild(tag);
                    }
                });
            });
        } else if (post.emotion) {
             // Fallback for older data structure
            post.emotion.split(',').map(e => e.trim()).forEach(e => {
                if (e) {
                    const tag = document.createElement('span');
                    tag.className = 'emotion-tag emotion-tag-small';
                    tag.textContent = e;
                    emotionTags.appendChild(tag);
                }
            });
        }
        
        contentArea.appendChild(emotionTags);
        contentArea.appendChild(content);

        // Read more/less link is now a sibling to the content
        if (needsPreview) {
            const readMoreLink = document.createElement('a');
            readMoreLink.href = '#';
            readMoreLink.className = 'post-read-more';
            readMoreLink.textContent = 'Read more';
            
            readMoreLink.onclick = (e) => {
                e.preventDefault();
                expanded = !expanded;
                if (expanded) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    content.style.webkitLineClamp = 'unset';
                    readMoreLink.textContent = 'Show less';
                    setTimeout(() => {
                        content.style.maxHeight = 'none';
                    }, 300);
                } else {
                    content.style.maxHeight = '4.8em';
                    content.style.webkitLineClamp = '3';
                    readMoreLink.textContent = 'Read more';
                }
            };
            
            contentArea.appendChild(readMoreLink);
        }

        // City line with timestamp (Anonymous from [City] · 8h ago)
        const cityLine = document.createElement('div');
        cityLine.className = 'post-city-line';
        const timeString = window.LetItOutUtils.formatDate(post.timestamp);
        if (post.city) {
            cityLine.textContent = `Anonymous from ${post.city} · ${timeString}`;
        } else {
            cityLine.textContent = `Anonymous · ${timeString}`;
        }
        contentArea.appendChild(cityLine);

        const meta = document.createElement('div');
        meta.className = 'post-meta';

        const actions = document.createElement('div');
        actions.className = 'post-actions';

        // Felt It Button
        // Only show on public wall posts (not in inbox)
        if (!post.isInbox) {
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
            }

            feltItBtn.onclick = async () => {
                const hasFeltIt = this.checkIfUserFeltIt(post.id);
                const countSpan = feltItBtn.querySelector('.felt-it-count');
                let currentCount = parseInt(countSpan?.textContent || '0');
                if (hasFeltIt) {
                    // Remove reaction
                    feltItBtn.classList.remove('felt');
                    let feltPosts = JSON.parse(localStorage.getItem('feltPosts') || '[]');
                    feltPosts = feltPosts.filter(pid => pid !== post.id);
                    localStorage.setItem('feltPosts', JSON.stringify(feltPosts));
                    if (countSpan) {
                        const newCount = Math.max(currentCount - 1, 0);
                        if (newCount < 2) {
                            countSpan.remove();
                        } else {
                            countSpan.textContent = newCount;
                        }
                    }
                    await window.PostService.decrementFeltCount(post.id);
                } else {
                    feltItBtn.classList.add('felt');
                    let feltPosts = JSON.parse(localStorage.getItem('feltPosts') || '[]');
                    feltPosts.push(post.id);
                    localStorage.setItem('feltPosts', JSON.stringify(feltPosts));
                    if (countSpan) {
                        const newCount = currentCount + 1;
                        countSpan.textContent = newCount;
                    } else {
                        const newCountSpan = document.createElement('span');
                        newCountSpan.className = 'felt-it-count';
                        newCountSpan.textContent = '2';
                        feltItBtn.appendChild(newCountSpan);
                    }
                    await window.PostService.incrementFeltCount(post.id);
                }
            };

            // Always append Felt It button first
            actions.appendChild(feltItBtn);
        }

        // Send Love Button - Only show if not user's own post
        const isOwnPost = post.userId === window.firebaseUserId;
        if (!isOwnPost) {
            const shareLoveBtn = document.createElement('button');
            shareLoveBtn.className = 'share-love-btn';
            shareLoveBtn.setAttribute('type', 'button');
            shareLoveBtn.setAttribute('tabindex', '0');
            shareLoveBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="5" width="18" height="14" rx="3"/>
                    <polyline points="3 7 12 13 21 7"/>
                </svg>
                <span class="share-love-text">Send Love</span>
            `;
            const sentLove = this.checkIfUserSentLove(post.id);
            if (sentLove) {
                shareLoveBtn.classList.add('sent');
                shareLoveBtn.innerHTML = 'Love Sent';
                shareLoveBtn.disabled = true;
                shareLoveBtn.style.background = '#f5f5f5';
                shareLoveBtn.style.color = '#888';
                shareLoveBtn.style.cursor = 'not-allowed';
                shareLoveBtn.style.boxShadow = 'none';
                // Tooltip for desktop
                shareLoveBtn.setAttribute('title', "You've already sent a message to this post");
                // Label for mobile
                const mobileLabel = document.createElement('div');
                mobileLabel.className = 'share-love-mobile-label';
                mobileLabel.textContent = "You've already sent a message to this post";
                shareLoveBtn.after(mobileLabel);
            } else {
                shareLoveBtn.onclick = () => this.openReplyModal(post.id);
            }
            actions.appendChild(shareLoveBtn);
        }
        meta.appendChild(actions);

        contentArea.appendChild(meta);

        card.appendChild(contentArea);

        // Add styles for the Love Received pill
        if (post.isInbox) {
            const style = document.createElement('style');
            style.textContent = `
                .love-received-pill {
                    display: inline-block;
                    background: #ffe5e9;
                    color: #ca0013;
                    border-radius: 1.2em;
                    padding: 0.32em 1.1em 0.32em 0.9em;
                    font-size: 1.01em;
                    font-weight: 600;
                    letter-spacing: 0.01em;
                    margin-bottom: 0.5em;
                    margin-right: 0.2em;
                    box-shadow: 0 1px 4px rgba(193,0,22,0.04);
                    border: none;
                }
            `;
            document.head.appendChild(style);
        }

        if (post.isInbox) {
            // Apply different styling for light vs dark mode
            const isDarkMode = document.body.classList.contains('dark-mode');
            
            if (isDarkMode) {
                // Dark mode: light grey border
                card.style.border = '1.5px solid #e0e0e0';
                card.style.backgroundColor = '#2f2f2f';
            } else {
                // Light mode: light background color, no border
                card.style.border = 'none';
                card.style.backgroundColor = '#f8f9fa';
            }

            // --- Add original post preview and reply message ---
            while (contentArea.firstChild) contentArea.removeChild(contentArea.firstChild);

            // Love Received pill with no extra top margin or padding
            emotionTags.style.marginTop = '0';
            emotionTags.style.paddingTop = '0';
            emotionTags.style.marginBottom = '1.2em';
            contentArea.appendChild(emotionTags);

            // You posted: preview
            const youPostedLine = document.createElement('div');
            youPostedLine.style.color = '#888';
            youPostedLine.style.fontSize = '1em';
            youPostedLine.style.marginBottom = '0.45em';
            youPostedLine.style.fontWeight = '500';
            const postPreview = (post.content && post.content.length > 60)
                ? post.content.slice(0, 60).trim() + '…'
                : (post.content || '');
            const youPostedText = document.createElement('span');
            youPostedText.style.color = '#111';
            youPostedText.style.fontWeight = '400';
            youPostedText.textContent = `"${postPreview}"`;
            youPostedLine.textContent = 'You posted: ';
            youPostedLine.appendChild(youPostedText);
            contentArea.appendChild(youPostedLine);

            // Someone replied: message
            const someoneRepliedLine = document.createElement('div');
            someoneRepliedLine.style.color = '#888';
            someoneRepliedLine.style.fontSize = '1em';
            someoneRepliedLine.style.marginTop = '0.5em';
            someoneRepliedLine.style.marginBottom = '1.1em';
            someoneRepliedLine.style.fontWeight = '500';
            const replyText = (post.replies && post.replies.length > 0 && post.replies[0].content)
                ? post.replies[0].content : '';
            const someoneRepliedText = document.createElement('span');
            someoneRepliedText.style.color = '#111';
            someoneRepliedText.style.fontWeight = '400';
            someoneRepliedText.textContent = `"${replyText}"`;
            someoneRepliedLine.textContent = 'Someone replied: ';
            someoneRepliedLine.appendChild(someoneRepliedText);
            contentArea.appendChild(someoneRepliedLine);

            // Timestamp with no extra bottom margin or padding
            const replyTimestamp = post.replies && post.replies.length > 0 && post.replies[0].timestamp
                ? new Date(post.replies[0].timestamp.seconds ? post.replies[0].timestamp.seconds * 1000 : post.replies[0].timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
                : '';
            if (replyTimestamp) {
                const replyTimeLine = document.createElement('div');
                replyTimeLine.className = 'reply-timestamp-line';
                replyTimeLine.textContent = replyTimestamp;
                replyTimeLine.style.fontSize = '0.97rem';
                replyTimeLine.style.color = '#888';
                replyTimeLine.style.marginTop = '0.1rem';
                replyTimeLine.style.marginBottom = '0';
                replyTimeLine.style.paddingBottom = '0';
                replyTimeLine.style.fontWeight = '400';
                replyTimeLine.style.letterSpacing = '0.01em';
                replyTimeLine.style.lineHeight = '1.4';
                contentArea.appendChild(replyTimeLine);
            }
        }

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
            // Always show 'Felt It', do not change to 'Felt'
            // button.querySelector('.felt-it-text').textContent = 'Felt';

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
            // Do nothing: button should be disabled and only show tooltip/label
            return;
        }

        const overlay = document.createElement('div');
        overlay.className = 'reply-modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'reply-modal';
        modal.innerHTML = `
            <div class="reply-modal-header">
                <div class="reply-modal-title">Send a message of support</div>
            </div>
            <textarea class="reply-textarea" placeholder="Write a message to remind them they're not alone..." maxlength="250"></textarea>
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
        try {
            if (window.DEBUG_MODE) console.log('Sending reply for post:', postId, 'with content:', content);
            
        const reply = {
            postId,
                content: content,  // Changed from replyText to content
            timestamp: new Date().toISOString(),
                anonymousId: window.firebaseUserId,  // Changed from feltBy to anonymousId
            read: false
        };

            if (window.DEBUG_MODE) {
                console.log('Reply data structure:', reply);
                console.log('Firebase user ID:', window.firebaseUserId);
            }

        await window.PostService.addReply(postId, reply);
            if (window.DEBUG_MODE) console.log('Reply sent successfully');
        } catch (error) {
            console.error('Error in sendReply:', error); // Keep error logging
            throw error;
        }
    }

    static showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'reply-success-message';
        message.innerHTML = 'Your love was sent anonymously.<br>You won\'t be able to see it again.';
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
}
