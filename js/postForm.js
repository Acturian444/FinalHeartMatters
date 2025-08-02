// Post Form Handler
class PostForm {
    constructor() {
        this.form = document.createElement('form');
        this.form.className = 'letitout-form';
        
        // Initialize premium packs with safety check
        if (window.PremiumPacks) {
            this.premiumPacks = new window.PremiumPacks();
        } else {
            console.warn('PremiumPacks module not available, using fallback behavior');
            this.premiumPacks = null;
        }
        
        this.setupForm();
    }

    setupForm() {
        // --- PROMPT STATE ---
        this.promptHistory = [];
        this.availablePrompts = [];
        this.currentHistoryIndex = -1;
        this.isInitialized = false;

        // --- DRAFT LOGIC ---
        this.draftKey = 'letitout_draft';

        // Prompt bank for all packs
        this.promptBank = {
            starter: [
                "Tell your story, your secret, your truth.",
                "What's on your heart today?",
                "What's something you've never said out loud until now?",
                "What did you need, but never received?",
                "What feeling do you hide from the world?",
                "What boundary did someone cross that changed you?",
                "What story have you never told until now?",
                "What do you need to release before it consumes you?",
                "What's something you wish you could erase from your past?",
                "What memory haunts you when you're alone?",
                "What old version of yourself are you ready to leave behind?",
                "What would you say to your younger self?",
                "What guilt still weighs on you?",
                "What do you carry that no one sees?",
                "What's the truth you're afraid to admit?",
                "What do you wish someone had said to you when you needed it?",
                "What do you want to let go of but can't?",
            ]
            // Premium pack prompts are managed by premiumPacks module
        };
        // Use promptBank for starter pack
        this.prompts = this.promptBank.starter;

        // Create the form content
        const formContent = document.createElement('div');
        formContent.className = 'letitout-form-content';

        // --- PROMPT TITLE, SHUFFLE, RESET ---
        // Create a wrapper for the prompt title and button row
        const promptBar = document.createElement('div');
        promptBar.className = 'letitout-prompt-bar';
        promptBar.style.display = 'flex';
        promptBar.style.flexDirection = 'column';
        promptBar.style.alignItems = 'center';
        promptBar.style.marginBottom = '1.2rem';

        // --- NEW PROMPT CONTROLS ---
        const promptControls = document.createElement('div');
        promptControls.className = 'prompt-controls';

        // Back button
        this.backBtn = document.createElement('button');
        this.backBtn.type = 'button';
        this.backBtn.className = 'prompt-nav-btn back-btn';
        this.backBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
        this.backBtn.onclick = () => this.handleBackClick();

        // Main prompt title
        this.promptTitle = document.createElement('div');
        this.promptTitle.className = 'letitout-subtitle';
        
        // Next button
        this.nextBtn = document.createElement('button');
        this.nextBtn.type = 'button';
        this.nextBtn.className = 'prompt-nav-btn next-btn';
        this.nextBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
        this.nextBtn.onclick = () => this.handleNextClick();

        promptControls.appendChild(this.backBtn);
        promptControls.appendChild(this.promptTitle);
        promptControls.appendChild(this.nextBtn);

        // --- PACK SELECTOR DROPDOWN ---
        if (this.premiumPacks) {
            this.createPackSelector(promptBar);
        }

        promptBar.appendChild(promptControls);

        // --- PREMIUM PACKS CTA BUTTON ---
        this.premiumCtaBtn = document.createElement('button');
        this.premiumCtaBtn.type = 'button';
        this.premiumCtaBtn.className = 'premium-packs-cta';
        // MVP Mode: Update button text based on MVP configuration
        if (window.MVP_CONFIG && window.MVP_CONFIG.MANUAL_UNLOCK_MODE) {
            this.premiumCtaBtn.textContent = 'Unlock More Prompts';
        } else {
        this.premiumCtaBtn.textContent = this.premiumPacks ? (this.premiumPacks.hasUnlockedPacks() ? 'Explore More Prompts' : 'Unlock Healing Prompts') : 'Unlock Healing Prompts';
        }
        this.premiumCtaBtn.onclick = () => this.openPremiumPacksModal();
        promptBar.appendChild(this.premiumCtaBtn);

        formContent.appendChild(promptBar);

        // Create wrapper for textarea and counter
        const textareaWrapper = document.createElement('div');
        textareaWrapper.className = 'textarea-wrapper';
        
        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Let it out anonymously…';
        textarea.maxLength = 500;
        textarea.required = true;
        
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.textContent = '0/500';
        
        textarea.addEventListener('input', () => {
            counter.textContent = `${textarea.value.length}/500`;
            this.saveDraft(); // Save draft on text change

            // Auto-expand textarea
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        });
        
        textareaWrapper.appendChild(textarea);
        formContent.appendChild(textareaWrapper);
        formContent.appendChild(counter);

        // --- EMOTION TAGGING UPGRADE ---
        // Emotion categories and sub-emotions
        this.emotionCategories = [
            {
                name: 'Pain & Pressure',
                emotions: [
                    'Abandonment', 'Alone', 'Anger', 'Anxiety', 'Bitterness', 'Confusion', 'Depression', 'Embarrassment', 'Emptiness', 'Envy', 'Exhausted', 'Fear', 'Frustration', 'Grief', 'Guilt', 'Heartbreak', 'Hopelessness', 'Insecurity', 'Jealousy', 'Loneliness', 'Overwhelm', 'Panic', 'Powerlessness', 'Rejection', 'Regret', 'Resentment', 'Sadness', 'Self-hate', 'Shame', 'Stuck'
                ]
            },
            {
                name: 'Unspoken & Unsaid',
                emotions: [
                    'What I can\'t forgive', 'What I can\'t tell anyone', 'What I carry in silence', 'What I hide behind my smile', 'What I miss', 'What I needed to hear', 'What I never believed I deserved', 'What I never got to say', 'What I still don\'t understand', 'What I want to scream', 'What I wish I could take back', 'What I\'m afraid to admit', 'What I\'ve never said', 'What\'s been eating me alive'
                ]
            },
            {
                name: 'Hope & Healing',
                emotions: [
                    'Acceptance', 'Clarity', 'Closure', 'Compassion', 'Courage', 'Faith', 'Forgiveness', 'Gratitude', 'Healing', 'Joy', 'Letting go', 'Lightness', 'Peace', 'Presence', 'Relief', 'Stillness', 'Surrender', 'Trust'
                ]
            },
            {
                name: 'Longing & Love',
                emotions: [
                    'Desire', 'I don\'t feel lovable', 'I loved them more than they knew', 'I miss someone', 'I need connection', 'I never said I loved them', 'I still love them', 'I want to feel loved', 'I\'m falling for someone', 'I\'m scared to love again', 'I feel unloved', 'Missed Connection'
                ]
            },
            {
                name: 'Identity & Self',
                emotions: [
                    'I crave touch', 'I don\'t know who I am', 'I feel invisible', 'I feel like not enough', 'I feel misunderstood', 'I feel too much', 'I hate who I used to be', 'I want to be authentic', 'I want to be seen', 'I want to feel chosen', 'I want to love myself', 'I want to start over', 'I\'m ashamed of who I am', 'I\'m learning to love myself', 'I\'m learning who I am', 'I\'m not okay', 'I\'m tired of pretending', 'I\'m trying to change'
                ]
            },
            {
                name: 'Transformation & Release',
                emotions: [
                    'I forgive myself', 'I made it through', 'I want to begin again', 'I want to heal', 'I\'m becoming someone new', 'I\'m finally saying it', 'I\'m letting it out', 'I\'m not who I was', 'I\'m ready to grow', 'I\'m ready to move on', 'I\'m still here', 'I\'ve been carrying this but I\'m ready to be free', 'I\'ve been holding this too long', 'It\'s time to let go', 'This is my turning point'
                ]
            },
            {
                name: 'Light & Alive',
                emotions: [
                    'Adventurous', 'Becoming me', 'Breakthrough', 'Celebration', 'Energized', 'Excitement', 'Freedom', 'Hope returned', 'I made it through', 'Peaceful inside', 'Pride', 'Safe now', 'Self-love'
                ]
            }
        ];
        this.selectedEmotions = [];
        this.selectedCity = null;
        this.customCity = null;
        this.isCustomCity = false;
        this.cityList = [
            'Atlanta, GA', 'Austin, TX', 'Bay Area, CA', 'Boston, MA', 'Chicago, IL', 'Denver, CO',
            'Houston, TX', 'Las Vegas, NV', 'Los Angeles, CA', 'Miami, FL', 'Minneapolis, MN',
            'Nashville, TN', 'New Orleans, LA', 'New York, NY', 'Orlando, FL', 'Philadelphia, PA',
            'Phoenix, AZ', 'Portland, OR', 'Salt Lake City, UT', 'San Diego, CA', 'San Francisco, CA',
            'San Jose, CA', 'Seattle, WA', 'Tampa, FL', 'Washington, DC'
        ];
        this.filteredCities = [...this.cityList];

        // Create emotion section
        const emotionSection = document.createElement('div');
        emotionSection.className = 'emotion-section';

        // Create button row
        const emotionBtnRow = document.createElement('div');
        emotionBtnRow.className = 'emotion-btn-row';

        // Emotion select button
        const emotionBtn = document.createElement('button');
        emotionBtn.type = 'button';
        emotionBtn.className = 'letitout-emotion-btn';
        emotionBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Tag a feeling
        `;
        emotionBtn.onclick = () => {
            this.openEmotionModal();
            this.saveDraft(); // Save draft when opening modal
        };
        // Blur after tap/click to prevent persistent focus on mobile
        emotionBtn.addEventListener('mouseup', function() { this.blur(); });
        emotionBtn.addEventListener('touchend', function() { this.blur(); });

        // --- CITY TAG BUTTON ---
        const cityBtn = document.createElement('button');
        cityBtn.type = 'button';
        cityBtn.className = 'letitout-city-btn';
        cityBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Tag City
        `;
        cityBtn.onclick = () => this.openCityModal();

        // Selected tags display
        this.selectedTagsDisplay = document.createElement('div');
        this.selectedTagsDisplay.className = 'letitout-selected-tags';

        // Selected city display
        this.selectedCityDisplay = document.createElement('div');
        this.selectedCityDisplay.className = 'letitout-selected-city';
        this.updateSelectedCity();

        // Error message
        this.emotionError = document.createElement('div');
        this.emotionError.className = 'letitout-emotion-error';
        this.emotionError.style.display = 'none';

        // Assemble emotion section
        emotionBtnRow.appendChild(emotionBtn);
        emotionBtnRow.appendChild(cityBtn);
        emotionSection.appendChild(emotionBtnRow);
        emotionSection.appendChild(this.selectedTagsDisplay);
        emotionSection.appendChild(this.selectedCityDisplay);
        emotionSection.appendChild(this.emotionError);
        formContent.appendChild(emotionSection);

        // Assemble form
        this.form.appendChild(formContent);

        // Modal skeleton
        this.emotionModal = document.createElement('div');
        this.emotionModal.className = 'letitout-emotion-modal-overlay';
        this.emotionModal.innerHTML = `
            <div class="letitout-emotion-modal">
                <div class="letitout-emotion-modal-header">
                    <div class="letitout-emotion-modal-title">Select Feelings (1-3)</div>
                    <button class="letitout-emotion-modal-close">&times;</button>
                </div>
                <div class="letitout-emotion-modal-content"></div>
                <div class="letitout-emotion-modal-footer">
                    <button class="letitout-emotion-modal-btn done" disabled>Done</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.emotionModal);

        // My Posts button - use existing button from HTML
        this.myPostsBtn = document.getElementById('my-posts-btn');
        if (this.myPostsBtn) {
            this.myPostsBtn.onclick = () => this.openMyPostsModal();
        }

        // Initialize the prompt system
        this.initializePrompts();
    }

    initializePrompts() {
        this.availablePrompts = [...Array(this.prompts.length).keys()];
        this.promptHistory = [];
        this.currentHistoryIndex = -1;
        this.updatePromptUI();
    }

    updatePromptUI() {
        if (!this.premiumPacks) {
            // Fallback to original logic
            if (this.currentHistoryIndex === -1) {
                this.promptTitle.textContent = this.prompts[0];
                this.backBtn.style.visibility = 'hidden';
            } else {
                const promptIndex = this.promptHistory[this.currentHistoryIndex];
                this.promptTitle.textContent = this.prompts[promptIndex];
                this.backBtn.style.visibility = 'visible';
            }
            this.nextBtn.style.visibility = 'visible';
            return;
        }
        const currentPack = this.premiumPacks.getCurrentPackData();
        if (currentPack.id === 'starter') {
            // Use prompt bank for starter pack
            this.prompts = this.promptBank.starter;
            if (this.currentHistoryIndex === -1) {
                this.promptTitle.textContent = this.prompts[0];
                this.backBtn.style.visibility = 'hidden';
            } else {
                const promptIndex = this.promptHistory[this.currentHistoryIndex];
                this.promptTitle.textContent = this.prompts[promptIndex];
                this.backBtn.style.visibility = 'visible';
            }
            this.nextBtn.style.visibility = 'visible';
        } else {
            // Only use premium pack state
            const currentIndex = this.premiumPacks.getCurrentPromptIndex();
            const prompts = currentPack.prompts;
            this.promptTitle.textContent = prompts[currentIndex] || prompts[0];
            this.backBtn.style.visibility = currentIndex > 0 ? 'visible' : 'hidden';
            this.nextBtn.style.visibility = currentIndex < prompts.length - 1 ? 'visible' : 'hidden';
        }
    }

    handleNextClick() {
        if (!this.premiumPacks) {
            // Fallback to original logic
        this.currentHistoryIndex++;

        if (this.currentHistoryIndex >= this.promptHistory.length) {
            if (this.availablePrompts.length === 0) {
                this.initializePrompts();
                return;
            }

            const randomIndex = Math.floor(Math.random() * this.availablePrompts.length);
            const newPromptIndex = this.availablePrompts.splice(randomIndex, 1)[0];
            this.promptHistory.push(newPromptIndex);
            }
            
            this.updatePromptUI();
            return;
        }

        const currentPack = this.premiumPacks.getCurrentPackData();
        
        if (currentPack.id === 'starter') {
            // Use existing logic for starter pack
            this.currentHistoryIndex++;

            if (this.currentHistoryIndex >= this.promptHistory.length) {
                if (this.availablePrompts.length === 0) {
                    this.initializePrompts();
                    return;
                }

                const randomIndex = Math.floor(Math.random() * this.availablePrompts.length);
                const newPromptIndex = this.availablePrompts.splice(randomIndex, 1)[0];
                this.promptHistory.push(newPromptIndex);
            }
        } else {
            // Use sequential logic for premium packs
            const currentIndex = this.premiumPacks.getCurrentPromptIndex();
            const prompts = currentPack.prompts;
            const nextIndex = Math.min(currentIndex + 1, prompts.length - 1);
            this.premiumPacks.setCurrentPromptIndex(nextIndex);
        }

        this.updatePromptUI();
    }

    handleBackClick() {
        if (!this.premiumPacks) {
            // Fallback to original logic
        if (this.currentHistoryIndex > -1) {
            this.currentHistoryIndex--;
            }
            this.updatePromptUI();
            return;
        }

        const currentPack = this.premiumPacks.getCurrentPackData();
        
        if (currentPack.id === 'starter') {
            // Use existing logic for starter pack
            if (this.currentHistoryIndex > -1) {
                this.currentHistoryIndex--;
            }
        } else {
            // Use sequential logic for premium packs
            const currentIndex = this.premiumPacks.getCurrentPromptIndex();
            const prevIndex = Math.max(currentIndex - 1, 0);
            this.premiumPacks.setCurrentPromptIndex(prevIndex);
        }

        this.updatePromptUI();
    }

    toggleEmotion(tag) {
        const isSelected = tag.classList.contains('selected');
        const allTags = this.form.querySelectorAll('.emotion-tag');
        
        allTags.forEach(t => t.classList.remove('selected'));
        
        if (!isSelected) {
            tag.classList.add('selected');
        }
    }

    async handleSubmit(textarea) {
        const content = textarea.value.trim();

        if (!content) {
            window.LetItOutUtils.showError('Please write something before submitting.');
            return;
        }

        // Emotion tags are now optional - no validation needed

        const submitButton = this.form.querySelector('.letitout-submit-btn');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Posting...';
        }

        let newPostId = null;
        try {
            // Create post and get ID
            const post = await window.PostService.createPost(
                content,
                this.selectedEmotions.join(', '),
                this.selectedCity,
                this.isCustomCity
            );
            newPostId = post.id;

            // Reset form
            textarea.value = '';
            this.form.querySelector('.char-counter').textContent = '0/500';
            this.selectedEmotions = [];
            this.selectedCity = null;
            this.customCity = null;
            this.isCustomCity = false;
            this.updateSelectedCity();
            this.clearDraft(); // Clear draft on successful post
            if (submitButton) {
                submitButton.textContent = 'Let It Out';
                submitButton.disabled = false;
            }

            // Show confirmation modal and redirect to wall with Truth number
            this.showConfirmationAndRedirect(newPostId, post.truthNumber);
        } catch (error) {
            window.LetItOutUtils.showError('Error posting. Please try again.');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Let It Out';
            }
        }
    }

    showConfirmationAndRedirect(newPostId, truthNumber) {
        this.showConfirmationModal(truthNumber);
        setTimeout(() => {
            this.hideConfirmationModal();
            // Redirect to Let It Out wall page with post highlight
            window.location.replace('letitout.html?post=' + encodeURIComponent(newPostId) + '#wall');
        }, 1500);
    }

    showConfirmationModal(truthNumber) {
        // Remove any existing overlay
        this.hideConfirmationModal();
        const overlay = document.createElement('div');
        overlay.className = 'letitout-confirmation-overlay';
        
        // Create the confirmation message with Truth number if available
        const truthLine = truthNumber ? `Truth #${truthNumber} is on the wall.` : 'Your truth is on the wall.';
        
        overlay.innerHTML = `
          <div class="letitout-confirmation-modal">
            <div class="letitout-confirmation-text">
              <span class="confirmation-title">You let it out.</span>
              <span class="confirmation-line">${truthLine}</span>
              <span class="confirmation-line">You're not alone here.</span>
            </div>
          </div>
        `;
        document.body.appendChild(overlay);
    }

    hideConfirmationModal() {
        const overlay = document.querySelector('.letitout-confirmation-overlay');
        if (overlay) overlay.remove();
    }

    getRandomPrompt() {
        let prompt;
        do {
            prompt = this.prompts[Math.floor(Math.random() * this.prompts.length)];
        } while (prompt === this.currentPrompt && this.prompts.length > 1);
        this.currentPrompt = prompt;
        return prompt;
    }

    render(container) {
        // Remove button from form if present
        if (this.buttonContainer && this.buttonContainer.parentNode === this.form) {
            this.form.removeChild(this.buttonContainer);
        }
        // Add the form
        container.appendChild(this.form);
        
        // Load draft after form is in the DOM
        this.loadDraft();
        
        // Add My Posts button to global container
        this.renderMyPostsButton();
        
        // Add the button container after the form
        if (!this.buttonContainer) {
            this.buttonContainer = document.createElement('div');
            this.buttonContainer.className = 'letitout-cta-container';
            this.buttonContainer.style.display = 'flex';
            this.buttonContainer.style.flexDirection = 'column';
            this.buttonContainer.style.alignItems = 'center';
            const submitButton = document.createElement('button');
            submitButton.type = 'button';
            submitButton.className = 'letitout-submit-btn';
            submitButton.textContent = 'Let It Out';
            submitButton.onclick = (e) => {
                e.preventDefault();
                this.form.requestSubmit();
            };
            this.buttonContainer.appendChild(submitButton);

            // Add info text below the CTA button
            const infoText = document.createElement('div');
            infoText.className = 'letitout-info-text';
            infoText.style.marginTop = '1.5rem';
            infoText.textContent = 'Your words hold power. Your truth matters.';
            this.buttonContainer.appendChild(infoText);

            // Add "Need Support" button
            const supportButton = document.createElement('button');
            supportButton.type = 'button';
            supportButton.className = 'support-link-btn';
            supportButton.textContent = 'Need support right now?';
            supportButton.onclick = () => this.openSupportModal();
            this.buttonContainer.appendChild(supportButton);

        } else {
            // Always update the reference in case of re-render
            this.submitButton = this.buttonContainer.querySelector('.letitout-submit-btn');
        }
        container.appendChild(this.buttonContainer);
        // Ensure form submit event is set up
        if (!this.form._submitHandlerSet) {
            this.form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleSubmit(this.form.querySelector('textarea'));
            });
            this.form._submitHandlerSet = true;
        }
    }

    openMyPostsModal() {
        // Remove any existing modal
        this.closeMyPostsModal();
        const localId = window.LocalIdManager.getId();
        const modal = document.createElement('div');
        modal.className = 'letitout-my-posts-modal-overlay';
        modal.innerHTML = `
          <div class="letitout-my-posts-modal">
            <button class="letitout-my-posts-close">&times;</button>
            <div class="letitout-my-posts-title">${localId}</div>
            <div class="letitout-my-posts-tabs">
              <button class="my-posts-tab active">My Journals <span class="my-posts-notification-dot" style="display:none;"></span></button>
            </div>
            <div class="letitout-my-posts-content"></div>
          </div>
        `;
        document.body.appendChild(modal);
        // Close logic
        modal.querySelector('.letitout-my-posts-close').onclick = () => this.closeMyPostsModal();
        // Render default
        this.renderMyPosts(modal.querySelector('.letitout-my-posts-content'), modal);
    }
    closeMyPostsModal() {
        const modal = document.querySelector('.letitout-my-posts-modal-overlay');
        if (modal) modal.remove();
    }
    async renderMyPosts(container, modal) {
        const localId = window.LocalIdManager.getId();
        const posts = await window.PostService.getPostsByUser(localId, 'localId');
        let html = '';
        let hasUnreadReplies = false;
        
        for (const post of posts) {
            let replyLine = '';
            let hasReplies = post.replies && post.replies.length;
            let unreadReplies = hasReplies ? post.replies.filter(r => !r.viewed).length : 0;
            const replyLineClass = hasReplies && unreadReplies > 0 ? 'my-post-reply-line unread' : 'my-post-reply-line';
            let buttonHtml = '';
            if (hasReplies) {
                const buttonText = unreadReplies > 0 ? 'View New Messages' : 'View Messages';
                const replyWord = post.replies.length === 1 ? 'reply' : 'replies';
                replyLine = `<div class="${replyLineClass}">${post.replies.length} ${replyWord} received – <button class="view-messages-btn" data-post-id="${post.id}">${buttonText}</button></div>`;
            } else {
                replyLine = `<div class="${replyLineClass}"><button class="view-messages-btn" data-post-id="${post.id}" disabled style="opacity:0.6;cursor:not-allowed;">No replies yet</button></div>`;
            }
            
            // Format timestamp with Truth number
            let date;
            if (post.timestamp && typeof post.timestamp.toDate === 'function') {
                date = post.timestamp.toDate();
            } else {
                date = new Date(post.timestamp);
            }
            const formattedDate = !isNaN(date) ? date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '';
            
            // Add Truth number to timestamp if available
            let timestamp;
            if (post.truthNumber) {
                // Extract just the date part (before the time)
                // Handle format like "Aug 2, 2025, 10:15 AM" -> get "Aug 2, 2025"
                const parts = formattedDate.split(',');
                const dateOnly = parts.length >= 2 ? `${parts[0]},${parts[1]}` : formattedDate;
                timestamp = `${dateOnly} · Truth #${post.truthNumber}`;
            } else {
                timestamp = formattedDate;
            }
            
            // Render emotion tags if present, using WallFeed markup
            let emotionsHtml = '';
            if (Array.isArray(post.emotions) && post.emotions.length) {
                emotionsHtml = `<div class="post-emotions">${post.emotions.map(e => `<span class="emotion-tag">${e}</span>`).join(' ')}</div>`;
            } else if (post.emotion && typeof post.emotion === 'string') {
                // If emotion is a comma-separated string, split and render each as a tag
                const emotionArr = post.emotion.includes(',') ? post.emotion.split(',').map(e => e.trim()) : [post.emotion];
                emotionsHtml = `<div class="post-emotions">${emotionArr.map(e => `<span class="emotion-tag">${e}</span>`).join(' ')}</div>`;
            }
            
            // Generate a unique id for the post card
            const postId = post.id || Math.random().toString(36).substr(2, 9);
            html += `<div class="my-post-card" data-post-id="${postId}">
                ${emotionsHtml}
                <div class="my-post-message" data-expanded="false">${post.content}</div>
                <a href="#" class="my-post-read-more" style="display:none;">Read more</a>
                <div class="my-post-timestamp" style="font-size:0.97rem;color:#888;margin-top:0.3rem;font-weight:400;letter-spacing:0.01em;line-height:1.4;">${timestamp}</div>
                ${replyLine}
            </div>`;
        }
        
        if (!posts.length) {
            html = '<div class="empty-state"><div class="inbox-empty-state-title">No posts yet.</div><div class="inbox-empty-state-text">These are the things you let out.</div></div>';
        }
        
        container.innerHTML = html;
        
        // After rendering, apply truncation and expand/collapse logic
        const cards = container.querySelectorAll('.my-post-card');
        cards.forEach(card => {
            const message = card.querySelector('.my-post-message');
            const readMore = card.querySelector('.my-post-read-more');
            if (!message) return;
            
            // Create a temporary element to measure line count
            const temp = document.createElement('div');
            temp.style.position = 'absolute';
            temp.style.visibility = 'hidden';
            temp.style.pointerEvents = 'none';
            temp.style.width = message.offsetWidth + 'px';
            temp.style.font = window.getComputedStyle(message).font;
            temp.style.lineHeight = window.getComputedStyle(message).lineHeight;
            temp.style.whiteSpace = 'pre-line';
            temp.textContent = message.textContent;
            document.body.appendChild(temp);
            
            // Estimate line count
            const lineHeight = parseFloat(window.getComputedStyle(message).lineHeight);
            const maxLines = 3;
            const maxHeight = lineHeight * maxLines;
            
            if (temp.offsetHeight > maxHeight) {
                // Truncate
                message.style.display = '-webkit-box';
                message.style.webkitBoxOrient = 'vertical';
                message.style.webkitLineClamp = maxLines;
                message.style.overflow = 'hidden';
                readMore.style.display = 'inline';
                readMore.textContent = 'Read more';
                message.setAttribute('data-expanded', 'false');
            }
            document.body.removeChild(temp);
            
            // Expand/collapse logic
            readMore?.addEventListener('click', e => {
                e.preventDefault();
                const expanded = message.getAttribute('data-expanded') === 'true';
                if (!expanded) {
                    message.style.webkitLineClamp = 'unset';
                    message.style.overflow = 'visible';
                    message.setAttribute('data-expanded', 'true');
                    readMore.textContent = 'Show less';
                } else {
                    message.style.webkitLineClamp = maxLines;
                    message.style.overflow = 'hidden';
                    message.setAttribute('data-expanded', 'false');
                    readMore.textContent = 'Read more';
                }
            });
        });
        
        // Show notification dot if unread replies
        if (modal) {
            const notificationDot = modal.querySelector('.my-posts-notification-dot');
            if (notificationDot) {
                if (hasUnreadReplies) {
                    notificationDot.style.display = 'inline-block';
                } else {
                    notificationDot.style.display = 'none';
                }
            }
        }
        
        // After rendering, bind click handlers
        const viewMessagesBtns = container.querySelectorAll('.view-messages-btn');
        viewMessagesBtns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const postId = btn.getAttribute('data-post-id');
                if (postId) {
                    const modalElement = document.querySelector('.letitout-my-posts-modal-overlay');
                    const modalContent = modalElement?.querySelector('.letitout-my-posts-modal');
                    if (modalContent) {
                        await this.showRepliesView(modalContent.querySelector('.letitout-my-posts-content'), modalElement, postId);
                    }
                }
            });
        });
    }

    async showRepliesView(container, modal, postId) {
        if (!container || !modal || !postId) {
            console.error('Missing required parameters for showRepliesView');
            return;
        }

        try {
            // Check if utilities are available
            if (!window.LetItOutUtils) {
                console.error('LetItOutUtils not initialized');
                return;
            }

            // Debug logging
            if (window.DEBUG_MODE) console.log('showRepliesView debug:', {
                LetItOutUtils: window.LetItOutUtils,
                hasGetFreeUnlockedPosts: typeof window.LetItOutUtils.getFreeUnlockedPosts,
                hasGetPaidUnlockedPosts: typeof window.LetItOutUtils.getPaidUnlockedPosts,
                hasAddFreeUnlockedPost: typeof window.LetItOutUtils.addFreeUnlockedPost,
                hasAddPaidUnlockedPost: typeof window.LetItOutUtils.addPaidUnlockedPost,
                hasGetFreeUnlocksLeft: typeof window.LetItOutUtils.getFreeUnlocksLeft,
                hasCheckForUnlockedPosts: typeof window.LetItOutUtils.checkForUnlockedPosts
            });

            const localId = window.LocalIdManager.getId();
            const posts = await window.PostService.getPostsByUser(localId, 'localId');
            const post = posts.find(p => p.id === postId);
            
            if (!post || !post.replies || !post.replies.length) {
                return;
            }

            // --- Premium unlock logic ---
            const freeUnlocked = window.LetItOutUtils.getFreeUnlockedPosts();
            const paidUnlocked = window.LetItOutUtils.getPaidUnlockedPosts();
            const isFreeUnlocked = freeUnlocked.includes(postId);
            const isPaidUnlocked = paidUnlocked.includes(postId);
            const freeUnlocksLeft = window.LetItOutUtils.getFreeUnlocksLeft();

            if (window.DEBUG_MODE) console.log('Unlock logic debug:', {
                postId,
                freeUnlocked,
                paidUnlocked,
                isFreeUnlocked,
                isPaidUnlocked,
                freeUnlocksLeft,
                freeUnlockedLength: freeUnlocked.length
            });

            // MVP Mode: Skip unlock checks if MVP mode is enabled
            if (window.MVP_CONFIG && window.MVP_CONFIG.FREE_POST_UNLOCKS) {
                if (window.DEBUG_MODE) console.log('MVP Mode: Skipping unlock checks, showing replies immediately');
                // Continue to show replies without any unlock logic
            } else {
                // Check unlock status (original logic)
            if (isFreeUnlocked || isPaidUnlocked) {
                if (window.DEBUG_MODE) console.log('Post already unlocked, continuing...');
                // Already unlocked, continue to show replies
            } else if (freeUnlocked.length < 3) {
                if (window.DEBUG_MODE) console.log('Adding free unlock for post:', postId);
                window.LetItOutUtils.addFreeUnlockedPost(postId);
                this.showFreeUnlockBanner(2 - freeUnlocked.length);
            } else {
                if (window.DEBUG_MODE) console.log('Showing paywall for post:', postId);
                this.showPaywallModal(postId);
                return;
                }
            }

            // Mark replies as read
            const unreadReplies = post.replies.filter(r => !r.viewed);
            if (unreadReplies.length > 0) {
                await window.PostService.markRepliesAsRead(postId);
                
                // Update unread badge after marking replies as read
                if (window.LetItOutUtils && window.LetItOutUtils.updateUnreadBadge) {
                    window.LetItOutUtils.updateUnreadBadge();
                }
            }

            // Format timestamps and prepare HTML
            let postDate = post.timestamp?.toDate?.() || new Date(post.timestamp);
            const postTimestamp = !isNaN(postDate) ? postDate.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '';

            // Render emotion tags
            let emotionsHtml = '';
            if (Array.isArray(post.emotions) && post.emotions.length) {
                emotionsHtml = `<div class="post-emotions">${post.emotions.map(e => `<span class="emotion-tag">${e}</span>`).join(' ')}</div>`;
            } else if (post.emotion && typeof post.emotion === 'string') {
                const emotionArr = post.emotion.includes(',') ? post.emotion.split(',').map(e => e.trim()) : [post.emotion];
                emotionsHtml = `<div class="post-emotions">${emotionArr.map(e => `<span class="emotion-tag">${e}</span>`).join(' ')}</div>`;
            }

            // Render replies
            let repliesHtml = '';
            post.replies.forEach(reply => {
                let replyDate = reply.timestamp?.toDate?.() || new Date(reply.timestamp);
                const replyTimestamp = !isNaN(replyDate) ? replyDate.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '';
                repliesHtml += `
                    <div class="reply-card">
                        <div class="reply-content">${reply.content}</div>
                        <div class="reply-timestamp">${replyTimestamp}</div>
                    </div>
                `;
            });

            // Update modal content
            const modalContent = modal.querySelector('.letitout-my-posts-modal');
            if (!modalContent) {
                throw new Error('Modal content container not found');
            }

            modalContent.innerHTML = `
                <button class="back-to-posts-btn">← My Journals</button>
                <div class="letitout-my-posts-title">Replies</div>
                <div class="letitout-my-posts-content">
                    <div class="original-post-card">
                        ${emotionsHtml}
                        <div class="original-post-message">${post.content}</div>
                        <div class="original-post-timestamp">${postTimestamp}</div>
                    </div>
                    <div class="replies-section">
                        <div class="replies-header">${post.replies.length} Message${post.replies.length > 1 ? 's' : ''}</div>
                        <div class="replies-list">
                            ${repliesHtml}
                        </div>
                    </div>
                </div>
            `;

            // Bind event listeners
            const closeBtn = modalContent.querySelector('.letitout-my-posts-close');
            const backBtn = modalContent.querySelector('.back-to-posts-btn');
            
            if (closeBtn) {
                closeBtn.onclick = () => this.closeMyPostsModal();
            }
            
            if (backBtn) {
                backBtn.onclick = () => this.openMyPostsModal();
            }

            // Update notification dot
            const notificationDot = modal.querySelector('.my-posts-notification-dot');
            if (notificationDot) {
                notificationDot.style.display = 'none';
            }

        } catch (error) {
            console.error('Error in showRepliesView:', error);
            window.LetItOutUtils.showError('Something went wrong. Please try again.');
        }
    }

    showFreeUnlockBanner(left) {
        const banner = document.createElement('div');
        banner.className = 'free-unlock-banner';
        banner.innerHTML = `
            You've unlocked replies for this post! You have <b>${left}</b> free reply view${left === 1 ? '' : 's'} left.
            <button class="close-btn" style="position: absolute; right: 1.2rem; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 1.2rem; color: #ca0013; cursor: pointer; padding: 0.5rem; line-height: 1;">&times;</button>
        `;
        const modalContent = document.querySelector('.letitout-my-posts-modal');
        if (modalContent) {
            modalContent.prepend(banner);
            
            // Add close functionality
            const closeBtn = banner.querySelector('.close-btn');
            if (closeBtn) {
                closeBtn.onclick = () => {
                    banner.style.opacity = '0';
                    banner.style.transform = 'translateY(-20px)';
                    setTimeout(() => banner.remove(), 300);
                };
            }
            // Auto-dismiss after 4 seconds
            setTimeout(() => {
                if (banner.parentNode) {
                    banner.style.opacity = '0';
                    banner.style.transform = 'translateY(-20px)';
                    setTimeout(() => banner.remove(), 300);
                }
            }, 4000);
        }
    }

    showPaywallModal(postId) {
        // Always close the My Posts modal if open
        if (typeof this.closeMyPostsModal === 'function') {
            this.closeMyPostsModal();
        }

        // Remove any existing paywall modal
        const existing = document.querySelector('.paywall-modal-overlay');
        if (existing) {
            existing.remove();
        }

        const overlay = document.createElement('div');
        overlay.className = 'paywall-modal-overlay';
        
        const modalDiv = document.createElement('div');
        modalDiv.className = 'paywall-modal';
        modalDiv.innerHTML = `
            <div class="paywall-modal-title">They replied to your post.<br>See what they said.</div>
            <div class="paywall-modal-subtitle">To read the replies:</div>
            <div class="paywall-modal-price">$4.99 – Unlock This Post</div>
            <button class="paywall-unlock-btn">View Replies</button>
            <div class="paywall-modal-info">This one-time purchase unlocks all replies to this post forever.</div>
            <button class="paywall-cancel-btn">Maybe Later</button>
        `;

        overlay.appendChild(modalDiv);
        document.body.appendChild(overlay);
        
        // Add visible class after a brief delay for animation
        setTimeout(() => {
            overlay.classList.add('visible');
        }, 10);

        // Cancel button
        modalDiv.querySelector('.paywall-cancel-btn').onclick = () => {
            overlay.classList.remove('visible');
            setTimeout(() => overlay.remove(), 300);
        };

        // Unlock button
        modalDiv.querySelector('.paywall-unlock-btn').onclick = async () => {
            try {
                // Check if Stripe is available
                if (typeof Stripe === 'undefined') {
                    throw new Error('Stripe is not available');
                }

                const stripePublicKey = 'pk_test_51RaP4RQ1hjqBwoa0ZnOuoRygvmNsfrRQmGG5wXIjcVhyKebi1CFfcG00pIQCceYu8pqlzFhAuJeNGz2dw5wlAcbD00wooUWDOR';
                const stripe = Stripe(stripePublicKey);
                
                // Create a Checkout Session
                const response = await fetch('/create-checkout-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        postId: postId,
                        priceId: 'price_1RaPPMQ1hjqBwoa0vVLHNXO1', // $4.99 one-off unlock
                        type: 'post_unlock',
                        priceAmount: 499, // $4.99 in cents (optional, for backend validation)
                        successUrl: window.location.origin + window.location.pathname + `?unlocked=${postId}`,
                        cancelUrl: window.location.origin + window.location.pathname,
                    }),
                });

                const session = await response.json();

                if (session.error) {
                    throw new Error(session.error);
                }

                // Redirect to Checkout
                const result = await stripe.redirectToCheckout({
                    sessionId: session.id
                });

                if (result.error) {
                    throw new Error(result.error.message);
                }
            } catch (error) {
                console.error('Payment error:', error);
                window.LetItOutUtils.showError('Payment setup failed. Please try again.');
            }
        };
    }

    openEmotionModal() {
        const modal = this.emotionModal;
        const content = modal.querySelector('.letitout-emotion-modal-content');
        const doneBtn = modal.querySelector('.letitout-emotion-modal-btn.done');
        const closeBtn = modal.querySelector('.letitout-emotion-modal-close');
        // Remove the cancel button if it exists
        const cancelBtn = modal.querySelector('.letitout-emotion-modal-btn.cancel');
        if (cancelBtn) cancelBtn.remove();

        // Clear previous content
        content.innerHTML = '';

        // --- Add search input ---
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'emotion-search-input';
        searchInput.placeholder = 'Search feelings...';
        searchInput.autocomplete = 'off';
        searchInput.style.marginBottom = '18px';
        content.appendChild(searchInput);

        // Container for all categories
        const categoriesContainer = document.createElement('div');
        categoriesContainer.className = 'emotion-categories-container';
        content.appendChild(categoriesContainer);

        // Helper to render categories and emotions
        const renderEmotions = (filter = '') => {
            categoriesContainer.innerHTML = '';
            const filterVal = filter.trim().toLowerCase();
            this.emotionCategories.forEach(category => {
                // Filter emotions in this category
                const filteredEmotions = filterVal
                    ? category.emotions.filter(e => e.toLowerCase().includes(filterVal))
                    : category.emotions;
                if (filteredEmotions.length === 0) return; // Hide category if no emotions

                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'emotion-category';

                const categoryTitle = document.createElement('div');
                categoryTitle.className = 'emotion-category-title';
                categoryTitle.textContent = category.name;

                const subTagsDiv = document.createElement('div');
                subTagsDiv.className = 'emotion-subtags';

                filteredEmotions.forEach(emotion => {
                    const subTag = document.createElement('button');
                    subTag.className = 'emotion-subtag';
                    subTag.textContent = emotion;
                    if (this.selectedEmotions.includes(emotion)) {
                        subTag.classList.add('selected');
                    }

                    subTag.onclick = () => {
                        if (subTag.classList.contains('selected')) {
                            subTag.classList.remove('selected');
                            this.selectedEmotions = this.selectedEmotions.filter(e => e !== emotion);
                        } else if (this.selectedEmotions.length < 3) {
                            subTag.classList.add('selected');
                            this.selectedEmotions.push(emotion);
                        }
                        this.updateSelectedTags();
                        doneBtn.disabled = false; // Emotions are now optional
                        // Re-render to update selected state
                        renderEmotions(searchInput.value);
                    };

                    subTagsDiv.appendChild(subTag);
                });

                categoryDiv.appendChild(categoryTitle);
                categoryDiv.appendChild(subTagsDiv);
                categoriesContainer.appendChild(categoryDiv);
            });
        };

        // Initial render
        renderEmotions();

        // Search handler
        searchInput.oninput = () => {
            renderEmotions(searchInput.value);
        };

        // --- Add Clear Filters button ---
        let clearBtn = modal.querySelector('.letitout-emotion-modal-btn.clear');
        if (!clearBtn) {
            clearBtn = document.createElement('button');
            clearBtn.className = 'letitout-emotion-modal-btn clear';
            clearBtn.textContent = 'Clear Filters';
            clearBtn.style.position = '';
            clearBtn.style.right = '';
            clearBtn.style.bottom = '';
            clearBtn.onclick = () => {
                this.selectedEmotions = [];
                this.updateSelectedTags();
                doneBtn.disabled = true;
                renderEmotions(searchInput.value);
                // Also unselect any .selected emotion-subtag buttons in the modal
                const selectedTags = modal.querySelectorAll('.emotion-subtag.selected');
                selectedTags.forEach(tag => tag.classList.remove('selected'));
            };
            // Insert as the first button in the modal footer
            const footer = modal.querySelector('.letitout-emotion-modal-footer');
            if (footer) {
                footer.insertBefore(clearBtn, footer.firstChild);
            }
        }

        // Show modal
        modal.classList.add('visible');

        // Close handlers
        const closeModal = () => {
            modal.classList.remove('visible');
        };

        closeBtn.onclick = closeModal;
        doneBtn.onclick = () => {
            this.updateSelectedTags();
            this.saveDraft();
            closeModal();
        };

        // Click outside to close
        modal.onclick = (e) => {
            if (e.target === modal) {
                closeModal();
            }
        };
    }

    updateSelectedTags() {
        this.selectedTagsDisplay.innerHTML = '';
        this.selectedEmotions.forEach(emotion => {
            const tag = document.createElement('div');
            tag.className = 'emotion-tag';
            tag.innerHTML = `
                ${emotion}
                <span class="remove-tag">&times;</span>
            `;

            tag.querySelector('.remove-tag').onclick = () => {
                this.selectedEmotions = this.selectedEmotions.filter(e => e !== emotion);
                this.updateSelectedTags();
                this.saveDraft(); // Save draft when a tag is removed
            };

            this.selectedTagsDisplay.appendChild(tag);
        });

        // Update error message - emotions are now optional
        if (this.selectedEmotions.length === 0) {
            this.emotionError.textContent = 'Tag a feeling to help others feel it too.';
            this.emotionError.style.display = 'block';
        } else {
            this.emotionError.style.display = 'none';
        }
    }

    showRandomPrompt() {
        if (!this.prompts || !this.prompts[0]) return;
        const prompt = this.prompts[Math.floor(Math.random() * this.prompts.length)];
        // Find the prompt display element
        const promptDisplay = this.form.querySelector('.letitout-prompt-display');
        if (promptDisplay) {
            promptDisplay.textContent = prompt;
        }
        // Show the reset button if not default
        const resetButton = this.form.querySelector('.letitout-reset-btn');
        if (resetButton) {
            resetButton.style.display = (prompt !== this.prompts[0]) ? 'inline-flex' : 'none';
        }
    }

    updateSelectedCity() {
        this.selectedCityDisplay.innerHTML = '';
        if (this.selectedCity) {
            const tag = document.createElement('div');
            tag.className = 'city-tag';
            tag.innerHTML = `
                ${this.selectedCity}
                <span class="remove-tag">&times;</span>
            `;
            tag.querySelector('.remove-tag').onclick = () => {
                this.selectedCity = null;
                this.customCity = null;
                this.isCustomCity = false;
                this.updateSelectedCity();
                this.saveDraft(); // Save draft when city is removed
            };
            this.selectedCityDisplay.appendChild(tag);
        }
    }

    openCityModal() {
        if (!this.cityModal) {
            this.cityModal = document.createElement('div');
            this.cityModal.className = 'letitout-city-modal-overlay';
            this.cityModal.innerHTML = `
                <div class="letitout-city-modal">
                    <div class="letitout-city-modal-header">
                        <div class="letitout-city-modal-title">Tag Your City (Optional)</div>
                        <button class="letitout-city-modal-close">&times;</button>
                    </div>
                    <div class="letitout-city-modal-content">
                        <input type="text" class="city-search-input" placeholder="Search cities..." autocomplete="off" />
                        <div class="city-suggested-list"></div>
                        <div class="city-other-section">
                            <label for="city-other-input">Add your city</label>
                            <input type="text" class="city-other-input" placeholder="Enter your city" />
                            <button class="city-other-btn">Add</button>
                        </div>
                    </div>
                    <div class="letitout-city-modal-footer">
                        <button class="letitout-city-modal-btn cancel">Cancel</button>
                        <button class="letitout-city-modal-btn done" disabled>Done</button>
                    </div>
                </div>
            `;
            document.body.appendChild(this.cityModal);
        }
        const modal = this.cityModal;
        const content = modal.querySelector('.letitout-city-modal-content');
        const doneBtn = modal.querySelector('.letitout-city-modal-btn.done');
        const closeBtn = modal.querySelector('.letitout-city-modal-close');
        const cancelBtn = modal.querySelector('.letitout-city-modal-btn.cancel');
        const searchInput = modal.querySelector('.city-search-input');
        const suggestedList = modal.querySelector('.city-suggested-list');
        const otherInput = modal.querySelector('.city-other-input');
        const otherBtn = modal.querySelector('.city-other-btn');

        // Reset state
        searchInput.value = '';
        otherInput.value = '';
        this.filteredCities = [...this.cityList];
        this.isCustomCity = false;
        this.customCity = null;
        this.renderCitySuggestions(suggestedList, doneBtn);
        doneBtn.disabled = !this.selectedCity;

        // Search logic
        searchInput.oninput = () => {
            const val = searchInput.value.trim().toLowerCase();
            this.filteredCities = this.cityList.filter(city => city.toLowerCase().includes(val));
            this.renderCitySuggestions(suggestedList, doneBtn);
        };

        // Other/city not listed logic
        otherBtn.onclick = (e) => {
            e.preventDefault();
            const val = otherInput.value.trim();
            if (val) {
                this.selectedCity = val;
                this.customCity = val;
                this.isCustomCity = true;
                this.updateSelectedCity();
                this.saveDraft();
                closeModal();
            }
        };

        // Modal close logic
        const closeModal = () => {
            modal.classList.remove('visible');
        };
        closeBtn.onclick = closeModal;
        cancelBtn.onclick = closeModal;
        doneBtn.onclick = () => {
            this.updateSelectedCity();
            this.saveDraft();
            closeModal();
        };
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };

        // Show modal
        modal.classList.add('visible');
    }

    renderCitySuggestions(container, doneBtn) {
        container.innerHTML = '';
        this.filteredCities.forEach(city => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'city-suggestion-btn';
            btn.textContent = city;
            if (this.selectedCity === city && !this.isCustomCity) btn.classList.add('selected');
            btn.onclick = () => {
                this.selectedCity = city;
                this.customCity = null;
                this.isCustomCity = false;
                this.renderCitySuggestions(container, doneBtn);
                doneBtn.disabled = false;
            };
            container.appendChild(btn);
        });
    }

    // --- DRAFT FUNCTIONS ---
    saveDraft() {
        const draft = {
            content: this.form.querySelector('textarea').value,
            emotions: this.selectedEmotions,
            city: this.selectedCity,
            isCustomCity: this.isCustomCity,
        };
        sessionStorage.setItem(this.draftKey, JSON.stringify(draft));
    }

    loadDraft() {
        const draftJSON = sessionStorage.getItem(this.draftKey);
        if (!draftJSON) return;

        try {
            const draft = JSON.parse(draftJSON);
            const textarea = this.form.querySelector('textarea');
            
            textarea.value = draft.content || '';
            this.selectedEmotions = draft.emotions || [];
            this.selectedCity = draft.city || null;
            this.isCustomCity = draft.isCustomCity || false;

            // Trigger updates to reflect loaded data
            textarea.dispatchEvent(new Event('input', { bubbles: true })); // Updates counter and auto-expands
            this.updateSelectedTags();
            this.updateSelectedCity();

        } catch (error) {
            console.error("Error loading draft:", error);
            this.clearDraft();
        }
    }

    clearDraft() {
        sessionStorage.removeItem(this.draftKey);
    }

    openSupportModal() {
        // Remove any existing modal to prevent duplicates
        const existingModal = document.querySelector('.support-modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }

        const overlay = document.createElement('div');
        overlay.className = 'support-modal-overlay';

        overlay.innerHTML = `
            <div class="support-modal">
                <button class="support-modal-close">&times;</button>
                <h3 class="support-modal-title">You're not alone.</h3>
                <p class="support-modal-body">If you're in immediate danger or feel overwhelmed, you can call or text 988 for 24/7 free and confidential support.</p>
                <div class="support-modal-actions">
                    <a href="tel:988" class="support-modal-btn call-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <span>Call 988</span>
                    </a>
                    <a href="sms:988" class="support-modal-btn text-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <span>Text 988</span>
                    </a>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Add visibility for animation
        setTimeout(() => overlay.classList.add('visible'), 10);

        // Add close listeners
        const closeModal = () => {
            overlay.classList.remove('visible');
            setTimeout(() => overlay.remove(), 300);
        };

        overlay.querySelector('.support-modal-close').onclick = closeModal;
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        };
    }

    // --- PREMIUM PACKS METHODS ---

    createPackSelector(container) {
        const packSelector = document.createElement('div');
        packSelector.className = 'pack-selector';

        const currentPack = this.premiumPacks.getCurrentPackData();
        const packTitle = currentPack.title;

        const packBtn = document.createElement('button');
        packBtn.type = 'button';
        packBtn.className = 'pack-selector-btn';
        packBtn.innerHTML = `
            ${packTitle}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        `;
        packBtn.onclick = () => this.togglePackDropdown(packSelector);

        const packDropdown = document.createElement('div');
        packDropdown.className = 'pack-dropdown';
        this.renderPackDropdown(packDropdown);

        packSelector.appendChild(packBtn);
        packSelector.appendChild(packDropdown);
        container.appendChild(packSelector);

        this.packSelector = packSelector;
        this.packBtn = packBtn;
        this.packDropdown = packDropdown;
    }

    renderPackDropdown(dropdown) {
        dropdown.innerHTML = '';
        const currentPackId = this.premiumPacks.getCurrentPack();
        // Add starter pack if not current
        const starterPack = this.premiumPacks.starterPack;
        if (currentPackId !== 'starter') {
            const starterItem = document.createElement('div');
            starterItem.className = 'pack-dropdown-item';
            starterItem.textContent = starterPack.title;
            starterItem.onclick = () => this.switchPack('starter');
            dropdown.appendChild(starterItem);
        }
        // Add unlocked premium packs except current
        const unlockedPacks = this.premiumPacks.getUnlockedPacks();
        unlockedPacks.forEach(packId => {
            if (packId !== currentPackId) {
                const pack = this.premiumPacks.premiumPacks[packId];
                if (pack) {
                    const packItem = document.createElement('div');
                    packItem.className = 'pack-dropdown-item';
                    packItem.textContent = pack.title;
                    packItem.onclick = () => this.switchPack(packId);
                    dropdown.appendChild(packItem);
                }
            }
        });
    }

    togglePackDropdown(selector) {
        const dropdown = selector.querySelector('.pack-dropdown');
        const btn = selector.querySelector('.pack-selector-btn');
        
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
            btn.classList.remove('open');
        } else {
            dropdown.classList.add('show');
            btn.classList.add('open');
        }
    }

    switchPack(packId) {
        // Show brief loading state
        if (this.promptTitle) {
            this.promptTitle.textContent = 'Switching prompts...';
        }

        // Clear form data
        const textarea = this.form.querySelector('textarea');
        if (textarea) {
            textarea.value = '';
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
        // Clear emotion tags and city
        this.selectedEmotions = [];
        this.selectedCity = null;
        this.customCity = null;
        this.isCustomCity = false;
        this.updateSelectedTags();
        this.updateSelectedCity();
        // Clear draft
        this.clearDraft();

        // Switch pack
        this.premiumPacks.setCurrentPack(packId);

        // --- STRICT STATE RESET FOR SELECTED PACK ---
        const currentPack = this.premiumPacks.getCurrentPackData();
        if (currentPack.id === 'starter') {
            // Reset all starter pack state, never reference premium state/localStorage
            this.prompts = this.promptBank.starter;
            this.currentHistoryIndex = -1;
            this.promptHistory = [];
            this.availablePrompts = [...Array(this.prompts.length).keys()];
        } else {
            // For premium packs, set prompt index in localStorage and clear starter state
            this.premiumPacks.setCurrentPromptIndex(0);
            this.currentHistoryIndex = null;
            this.promptHistory = null;
            this.availablePrompts = null;
        }

        // Only call updatePromptUI after all state is set
        this.updatePromptUI();
        this.updatePackSelector();
        if (this.packDropdown) {
            this.packDropdown.classList.remove('show');
            this.packBtn.classList.remove('open');
        }
        this.saveDraft();
    }

    updatePackSelector() {
        if (!this.packSelector) return;
        
        const currentPack = this.premiumPacks.getCurrentPackData();
        const packTitle = currentPack.title;
        
        this.packBtn.innerHTML = `
            ${packTitle}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        `;
        
        this.renderPackDropdown(this.packDropdown);
    }

    openPremiumPacksModal() {
        // Remove any existing modal
        const existing = document.querySelector('.premium-packs-modal-overlay');
        if (existing) {
            existing.remove();
        }

        const overlay = document.createElement('div');
        overlay.className = 'premium-packs-modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'premium-packs-modal';
        modal.innerHTML = `
            <button class="premium-packs-modal-close">&times;</button>
            <div class="premium-packs-modal-title">Choose Your Prompt Pack</div>
            <div class="premium-packs-modal-subtitle">Each pack includes 10 therapist-inspired prompts to help you explore different aspects of healing.</div>
            <div class="premium-packs-level">Level 1</div>
            <div class="premium-packs-grid"></div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Render pack cards
        this.renderPremiumPackCards(modal.querySelector('.premium-packs-grid'));

        // Add event listeners
        modal.querySelector('.premium-packs-modal-close').onclick = () => {
            overlay.classList.remove('visible');
            setTimeout(() => overlay.remove(), 300);
        };

        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('visible');
                setTimeout(() => overlay.remove(), 300);
            }
        };

        // Show modal
        setTimeout(() => overlay.classList.add('visible'), 10);
    }

    renderPremiumPackCards(grid) {
        const allPacks = this.premiumPacks.getAllPacks();
        const unlockedPacks = this.premiumPacks.getUnlockedPacks();

        Object.values(allPacks).forEach(pack => {
            if (pack.id === 'starter') return; // Skip starter pack in modal

            // MVP Mode: Manual unlock mode - check actual unlock status
            const isUnlocked = unlockedPacks.includes(pack.id);
            const card = document.createElement('div');
            card.className = `premium-pack-card ${isUnlocked ? 'unlocked' : 'locked'}`;
            
            card.innerHTML = `
                <div class="premium-pack-header">
                    <div>
                        <div class="premium-pack-title">${pack.title}</div>
                        <div class="premium-pack-subtitle">${pack.subtitle}</div>
                    </div>
                    <div class="premium-pack-status ${isUnlocked ? 'unlocked' : 'locked'}">
                        ${isUnlocked ? 
                            '<span style="display:inline-flex;align-items:center;"><svg class="premium-pack-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" style="margin-right:4px;"><polyline points="4 11 9 16 16 5"></polyline></svg>Unlocked</span>' :
                            '<svg class="premium-pack-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><circle cx="12" cy="16" r="1"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
                        }
                        ${!isUnlocked && !(window.MVP_CONFIG && window.MVP_CONFIG.MANUAL_UNLOCK_MODE) ? '<span class="premium-pack-price">$2.99</span>' : ''}
                    </div>
                </div>
            `;

            card.onclick = () => {
                if (isUnlocked) {
                    this.selectUnlockedPack(pack.id);
                } else {
                    // MVP Mode: Free unlock for engagement
                    if (window.MVP_CONFIG && window.MVP_CONFIG.MANUAL_UNLOCK_MODE) {
                        this.unlockPackForFree(pack.id);
                } else {
                    this.purchasePack(pack);
                    }
                }
            };

            grid.appendChild(card);
        });
    }

    selectUnlockedPack(packId) {
        // Close modal
        const overlay = document.querySelector('.premium-packs-modal-overlay');
        if (overlay) {
            overlay.classList.remove('visible');
            setTimeout(() => overlay.remove(), 300);
        }

        // Switch to the pack
        this.switchPack(packId);
    }

    unlockPackForFree(packId) {
        // Unlock the pack for free
        this.premiumPacks.unlockPack(packId);
        
        // Close modal
        const overlay = document.querySelector('.premium-packs-modal-overlay');
        if (overlay) {
            overlay.classList.remove('visible');
            setTimeout(() => overlay.remove(), 300);
        }

        // Switch to the newly unlocked pack
        this.switchPack(packId);
        
        // Update dropdown to show new pack
        this.updatePackSelector();
    }

    async purchasePack(pack) {
        try {
            // Check if Stripe is available
            if (typeof Stripe === 'undefined') {
                throw new Error('Stripe is not available');
            }

            // Show loading state
            const card = event.target.closest('.premium-pack-card');
            if (card) {
                card.innerHTML = `
                    <div class="premium-pack-loading">
                        <div class="spinner"></div>
                        Processing payment...
                    </div>
                `;
            }

            const stripePublicKey = 'pk_test_51RaP4RQ1hjqBwoa0ZnOuoRygvmNsfrRQmGG5wXIjcVhyKebi1CFfcG00pIQCceYu8pqlzFhAuJeNGz2dw5wlAcbD00wooUWDOR';
            const stripe = Stripe(stripePublicKey);
            
            // Create a Checkout Session for pack purchase
            const response = await fetch('/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    packId: pack.id,
                    priceId: pack.stripePriceId,
                    priceAmount: 299, // $2.99 in cents
                    successUrl: window.location.origin + window.location.pathname + `?pack_unlocked=${pack.id}`,
                    cancelUrl: window.location.origin + window.location.pathname,
                    type: 'pack_purchase'
                }),
            });

            const session = await response.json();

            if (session.error) {
                throw new Error(session.error);
            }

            // Redirect to Checkout
            const result = await stripe.redirectToCheckout({
                sessionId: session.id
            });

            if (result.error) {
                throw new Error(result.error.message);
            }
        } catch (error) {
            console.error('Pack purchase error:', error);
            
            // Restore card to original state
            if (card) {
                this.renderPremiumPackCards(document.querySelector('.premium-packs-grid'));
            }
            
            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'premium-pack-error';
            errorDiv.textContent = '⚠ Payment failed. Please try again.';
            
            const modal = document.querySelector('.premium-packs-modal');
            if (modal) {
                modal.appendChild(errorDiv);
                setTimeout(() => errorDiv.remove(), 5000);
            }
        }
    }

    renderMyPostsButton() {
        // Ensure the button exists and has the event handler
        if (!this.myPostsBtn) {
            this.myPostsBtn = document.getElementById('my-posts-btn');
            if (this.myPostsBtn) {
                this.myPostsBtn.onclick = () => this.openMyPostsModal();
            }
        }
        
        // Update unread badge
        if (window.LetItOutUtils && window.LetItOutUtils.updateUnreadBadge) {
            window.LetItOutUtils.updateUnreadBadge();
        }
    }

    cleanup() {
        // Close any open modals
        this.closeMyPostsModal();
        
        // Remove event listeners from form
        if (this.form && this.form._submitHandlerSet) {
            this.form.removeEventListener('submit', this.form._submitHandler);
            this.form._submitHandlerSet = false;
        }
        
        // Clear any timers or intervals
        if (this.confirmationTimer) {
            clearTimeout(this.confirmationTimer);
        }
    }
}

window.PostForm = PostForm; 