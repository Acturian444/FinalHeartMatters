// Post Form Handler
class PostForm {
    constructor() {
        this.form = document.createElement('form');
        this.form.className = 'letitout-form';
        this.setupForm();
    }

    setupForm() {
        // Restore prompt bank and default prompt
        this.prompts = [
            "What's something you've never said out loud until now?",
            "What memory still haunts you even though you pretend you're over it?",
            "What do you wish you could scream but never dared to?",
            "What's the one thing you hope they never find out?",
            "Who hurt you but never apologized?",
            "What's a secret you've carried for too long?",
            "What would you tell them if there were no consequences?",
            "What part of your past are you still healing from?",
            "What's something you regret but can't take back?",
            "What version of you are you trying to bury?",
            "What do you miss but won't admit to anyone?",
            "What truth are you tired of hiding?",
            "Who do you wish had fought for you?",
            "What's a conversation you replay in your head?",
            "What did they say that you'll never forget?",
            "What still breaks your heart when no one's looking?",
            "What's something you felt deeply but never said?",
            "What's the moment everything changed for you?",
            "What have you forgiven that you're still angry about?",
            "What's something you pretend doesn't bother you?",
            "What memory changed how you trust people?",
            "What pain are you still carrying in silence?",
            "What's the lie you tell yourself the most?",
            "Who were you before the world told you who to be?",
            "What's a fear you've never put into words?",
            "What's something you never got closure for?",
            "What's the real reason you stayed so long?",
            "What's something you wish they understood about you?",
            "What triggers you—but you don't talk about it?",
            "What's the hardest goodbye you've ever had to say?",
            "What makes you feel like you're not enough?",
            "What's something you still cry about when you're alone?",
            "What does 'healing' actually look like for you right now?",
            "What's a wound you've learned to live with?",
            "What part of yourself do you still hide from others?",
            "Who do you miss even though they don't deserve it?",
            "What are you ashamed to admit?",
            "What are you tired of pretending to be okay about?",
            "What do you wish more people knew about you?",
            "What's a moment you'll never fully get over?",
            "What do you want to let go of but can't?",
            "Who do you blame for the way you are?",
            "What does your inner voice say that no one else hears?",
            "What's something you wish you'd said when you had the chance?",
            "What's something you need to forgive yourself for?",
            "What's something you feel guilty about—but shouldn't?",
            "What's the scariest thing you've survived?",
            "What are you still waiting to hear from someone?",
            "What's something they'll never understand about you?",
            "What part of your story feels unfinished?",
            "What did you lose that you're still grieving?",
            "What's something you wish someone would finally ask you?",
            "What's the hardest part of being you right now?",
            "What are you still hoping will happen?",
            "What's something you're proud of but haven't told anyone?",
            "What would you write if this was your last entry?",
            "What do you carry that no one sees?",
            "What's something you survived that others wouldn't believe?",
            "What would your younger self say to you today?",
            "What's something you wish you could erase from your past?",
            "What pain do you downplay to keep others comfortable?",
            "What do you wish someone had said to you when you needed it?",
            "What's something you still don't have words for?",
            "What story have you never told—until now?",
            "What's something you'll always feel deeply about?",
            "What do you need to let out before it eats you alive?",
            "What have you outgrown but can't seem to leave behind?",
            "What's something you want to move on from but can't?",
            "What's a memory that still feels too loud?",
            "What's something you've always wanted to say but never knew how?",
            "What's the truth you're afraid to admit?",
            "What would you say if you knew they'd listen?",
            "What's the thing you wish you didn't feel?",
            "What part of you still feels broken?",
            "When was the last time you felt seen?",
            "What's your biggest emotional scar?",
            "If your heart could speak freely, what would it say?",
            "What's the hardest truth you've had to accept?",
            "What's something you still can't forgive?",
            "What's something that shaped you—but broke you first?",
            "What's the one thing you wish never happened?",
            "What's something beautiful you found in pain?",
            "What are you still healing from?",
            "What would your younger self cry to hear?",
            "What did you need, but never received?",
            "What's a story you've never shared?",
            "What's your unspoken goodbye?",
            "What's something you had to survive alone?",
            "What do you mourn that's still alive?",
            "If you could scream one thing and be heard, what would it be?",
            "What part of your story have you been too scared to tell?",
            "What do you still blame yourself for?",
            "What's a toxic belief you're trying to unlearn?",
            "What guilt have you never forgiven yourself for?",
            "What's something that traumatized you but was never acknowledged?",
            "What version of you did you have to kill to survive?",
            "What emotion do you suppress the most, and why?",
            "Who do you feel emotionally unsafe around, and why?",
            "What do you remember too clearly but wish you didn't?",
            "What scares you about being truly seen?",
            "What role did silence play in your pain?",
            "What anger have you swallowed for too long?",
            "What boundary did someone cross that changed you?",
            "What shame do you carry that doesn't belong to you?",
            "What part of your healing feels impossible right now?",
            "What's something you need to scream into the void?",
            "When was the last time you felt truly alive?",
            "If today was your last day, what would you regret not saying?",
            "What are you scared to admit — even to yourself?",
            "What memory do you keep revisiting?",
            "What part of you still feels unseen?",
            "What are you tired of pretending doesn't hurt?"
        ];
        this.defaultPrompt = "What's on your heart today?";

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

        // Main prompt title
        const subtitle = document.createElement('div');
        subtitle.className = 'letitout-subtitle';
        subtitle.textContent = this.defaultPrompt;
        subtitle.style.fontWeight = '700';
        subtitle.style.fontSize = '1.35rem';
        subtitle.style.color = '#222';
        subtitle.style.textAlign = 'center';
        subtitle.style.marginBottom = '0.2rem';

        // Button row for shuffle/reset
        const buttonRow = document.createElement('div');
        buttonRow.className = 'letitout-button-row';
        buttonRow.style.display = 'flex';
        buttonRow.style.alignItems = 'center';
        buttonRow.style.justifyContent = 'center';
        buttonRow.style.gap = '0.7em';
        buttonRow.style.marginBottom = '0.2rem';

        // Shuffle button
        const shuffleBtn = document.createElement('button');
        shuffleBtn.type = 'button';
        shuffleBtn.className = 'letitout-shuffle-btn';
        shuffleBtn.innerHTML = '<span class="next-arrow-icon" style="display:inline-flex;align-items:center;margin-right:0.4em;"><svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 4l6 6-6 6" stroke="#c10016" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Need a new question?';

        // Reset button
        const resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.className = 'letitout-reset-btn';
        resetBtn.textContent = 'Reset';
        resetBtn.style.display = 'none';

        // Shuffle logic
        shuffleBtn.onclick = () => {
            const prompt = this.getRandomPrompt();
            subtitle.textContent = prompt;
            resetBtn.style.display = 'inline-flex';
        };
        // Reset logic
        resetBtn.onclick = () => {
            subtitle.textContent = this.defaultPrompt;
            resetBtn.style.display = 'none';
        };

        buttonRow.appendChild(shuffleBtn);
        buttonRow.appendChild(resetBtn);
        promptBar.appendChild(subtitle);
        promptBar.appendChild(buttonRow);
        formContent.appendChild(promptBar);

        // Create wrapper for textarea and counter
        const textareaWrapper = document.createElement('div');
        textareaWrapper.className = 'textarea-wrapper';
        
        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Let it out here…';
        textarea.maxLength = 500;
        textarea.required = true;
        
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.textContent = '0/500';
        
        textarea.addEventListener('input', () => {
            counter.textContent = `${textarea.value.length}/500`;

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
                    'Grief', 'Shame', 'Guilt', 'Anger', 'Loneliness', 'Anxiety', 'Fear', 'Depression', 'Jealousy', 'Resentment', 'Emptiness', 'Heartbreak', 'Regret', 'Hopelessness', 'Insecurity', 'Sadness', 'Frustration', 'Bitterness', 'Confusion', 'Panic', 'Overwhelm', 'Embarrassment', 'Rejection', 'Envy', 'Abandonment', 'Self-hate', 'Powerlessness', 'Exhausted', 'Alone', 'Stuck'
                ]
            },
            {
                name: 'Unspoken & Unsaid',
                emotions: [
                    'What I\'ve never said', 'What I never got to say', 'What I\'m afraid to admit', 'What I wish I could take back', 'What I carry in silence', 'What I want to scream', 'What I can\'t tell anyone', 'What I hide behind my smile', 'What I still don\'t understand', 'What I miss', 'What I can\'t forgive', 'What\'s been eating me alive', 'What I needed to hear', 'What I never believed I deserved'
                ]
            },
            {
                name: 'Hope & Healing',
                emotions: [
                    'Faith', 'Forgiveness', 'Gratitude', 'Relief', 'Acceptance', 'Letting go', 'Joy', 'Healing', 'Clarity', 'Compassion', 'Surrender', 'Presence', 'Trust', 'Peace', 'Closure', 'Stillness', 'Lightness', 'Courage'
                ]
            },
            {
                name: 'Longing & Love',
                emotions: [
                    'Missed Connection', 'Desire', 'I miss someone', 'I want to feel loved', 'I need connection', 'I feel unloved', 'I\'m falling for someone', 'I still love them', 'I never said I loved them', 'I loved them more than they knew', 'I\'m scared to love again', 'I don\'t feel lovable'
                ]
            },
            {
                name: 'Identity & Self',
                emotions: [
                    'I don\'t know who I am', 'I feel too much', 'I feel like not enough', 'I\'m trying to change', 'I\'m tired of pretending', 'I hate who I used to be', 'I want to start over', 'I want to be seen', 'I\'m not okay', 'I\'m learning to love myself', 'I\'m ashamed of who I am', 'I feel invisible', 'I want to love myself', 'I crave touch', 'I want to feel chosen', 'I\'m learning who I am', 'I want to be authentic', 'I feel misunderstood'
                ]
            },
            {
                name: 'Transformation & Release',
                emotions: [
                    'It\'s time to let go', 'I\'m ready to grow', 'This is my turning point', 'I\'ve been holding this too long', 'I want to begin again', 'I want to heal', 'I forgive myself', 'I\'m finally saying it', 'I\'m letting it out', 'I\'m still here', 'I\'m ready to move on', 'I\'m not who I was', 'I\'m becoming someone new', 'I\'ve been carrying this but I\'m ready to be free'
                ]
            },
            {
                name: 'Light & Alive',
                emotions: [
                    'Freedom', 'Excitement', 'Pride', 'Celebration', 'Breakthrough', 'I made it through', 'Hope returned', 'Becoming me', 'Safe now', 'Self-love', 'Adventurous', 'Energized', 'Peaceful inside'
                ]
            }
        ];
        this.selectedEmotions = [];
        this.selectedCity = null;
        this.customCity = null;
        this.isCustomCity = false;
        this.cityList = [
            'Los Angeles, CA', 'New York, NY', 'Chicago, IL', 'Miami, FL', 'Atlanta, GA', 'Houston, TX',
            'San Francisco, CA', 'San Jose, CA', 'Bay Area, CA', 'Phoenix, AZ', 'Austin, TX', 'Seattle, WA',
            'Denver, CO', 'Las Vegas, NV', 'San Diego, CA', 'Philadelphia, PA', 'Washington, DC', 'Portland, OR',
            'Orlando, FL', 'Minneapolis, MN', 'Nashville, TN', 'Boston, MA', 'Tampa, FL', 'Salt Lake City, UT', 'New Orleans, LA'
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
        emotionBtn.innerHTML = '+ Add Feeling';
        emotionBtn.onclick = () => this.openEmotionModal();
        // Blur after tap/click to prevent persistent focus on mobile
        emotionBtn.addEventListener('mouseup', function() { this.blur(); });
        emotionBtn.addEventListener('touchend', function() { this.blur(); });

        // --- CITY TAG BUTTON ---
        const cityBtn = document.createElement('button');
        cityBtn.type = 'button';
        cityBtn.className = 'letitout-city-btn';
        cityBtn.innerHTML = '+ Tag City';
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

        // My Posts button
        this.myPostsBtn = document.createElement('button');
        this.myPostsBtn.className = 'letitout-my-posts-btn';
        this.myPostsBtn.innerHTML = '<span class="my-posts-icon" style="display:inline-flex;align-items:center;"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="4" rx="2"/><path d="M3 7v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7"/><path d="M9 12h6"/></svg></span>';
        this.myPostsBtn.setAttribute('aria-label', 'My Posts & Inbox');
        this.myPostsBtn.onclick = () => this.openMyPostsModal();
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
            if (submitButton) {
                submitButton.textContent = 'Let It Out';
                submitButton.disabled = false;
            }

            // Show confirmation modal
            window.LetItOutIncognito().then(isIncognito => {
                this.showConfirmationModal(isIncognito);
                setTimeout(() => {
                    this.hideConfirmationModal();
                    // Switch to Wall tab (simulate click)
                    const wallTab = document.getElementById('wall-tab');
                    if (wallTab) wallTab.click();
                    // Wait for wall to render, then scroll to top and highlight post
                    setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        // Highlight the new post if possible
                        const wallFeed = document.querySelector('.wall-feed');
                        if (wallFeed && newPostId) {
                            const postCard = wallFeed.querySelector(`[data-post-id="${newPostId}"]`);
                            if (postCard) {
                                postCard.classList.add('letitout-highlight-post');
                                setTimeout(() => postCard.classList.remove('letitout-highlight-post'), 1600);
                            }
                        }
                    }, 500);
                }, 1700);
            });
        } catch (error) {
            window.LetItOutUtils.showError('Error posting. Please try again.');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Let It Out';
            }
        }
    }

    showConfirmationModal(isIncognito) {
        // Remove any existing overlay
        this.hideConfirmationModal();
        const overlay = document.createElement('div');
        overlay.className = 'letitout-confirmation-overlay';
        overlay.innerHTML = `
          <div class="letitout-confirmation-modal">
            <div class="letitout-confirmation-heart">
              <svg viewBox="0 0 8 7" width="54" height="48" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
                <rect x="1" y="1" width="2" height="1" fill="#c10016"/>
                <rect x="5" y="1" width="2" height="1" fill="#c10016"/>
                <rect x="0" y="2" width="4" height="1" fill="#c10016"/>
                <rect x="4" y="2" width="4" height="1" fill="#c10016"/>
                <rect x="0" y="3" width="8" height="1" fill="#c10016"/>
                <rect x="1" y="4" width="6" height="1" fill="#c10016"/>
                <rect x="2" y="5" width="4" height="1" fill="#c10016"/>
                <rect x="3" y="6" width="2" height="1" fill="#c10016"/>
              </svg>
            </div>
            <div class="letitout-confirmation-text">
              <span class="confirmation-line">Your post is live.</span>
              <span class="confirmation-line">You let it out.</span>
              <span class="confirmation-line">You're not alone.</span>
            </div>
            ${isIncognito ? '<div class="letitout-confirmation-note">Your post won\'t be saved to "My Posts" in this session.</div>' : ''}
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
        
        // Add My Posts button to global container
        const globalContainer = document.getElementById('letitout-my-posts-container');
        if (globalContainer && this.myPostsBtn) {
            this.myPostsBtn.classList.add('letitout-my-posts-btn-global');
            // Clear existing content and add the button
            globalContainer.innerHTML = '';
            globalContainer.appendChild(this.myPostsBtn);
            
            // Update unread badge
            if (window.LetItOutUtils && window.LetItOutUtils.updateUnreadBadge) {
                window.LetItOutUtils.updateUnreadBadge();
            }
        }
        
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
            infoText.textContent = 'Release it. This is your space. Always anonymous.';
            this.buttonContainer.appendChild(infoText);
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
            if (post.replies && post.replies.length) {
                const unreadReplies = post.replies.filter(r => !r.viewed).length;
                const replyLineClass = unreadReplies > 0 ? 'my-post-reply-line unread' : 'my-post-reply-line';
                const buttonText = unreadReplies > 0 ? 'View New Messages' : 'View Messages';

                if (unreadReplies > 0) {
                    hasUnreadReplies = true;
                }
                const replyWord = post.replies.length === 1 ? 'reply' : 'replies';
                replyLine = `<div class="${replyLineClass}">${post.replies.length} ${replyWord} received – <button class="view-messages-btn" data-post-id="${post.id}">${buttonText}</button></div>`;
            }
            
            // Format timestamp
            let date;
            if (post.timestamp && typeof post.timestamp.toDate === 'function') {
                date = post.timestamp.toDate();
            } else {
                date = new Date(post.timestamp);
            }
            const timestamp = !isNaN(date) ? date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '';
            
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
            console.log('showRepliesView debug:', {
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

            console.log('Unlock logic debug:', {
                postId,
                freeUnlocked,
                paidUnlocked,
                isFreeUnlocked,
                isPaidUnlocked,
                freeUnlocksLeft,
                freeUnlockedLength: freeUnlocked.length
            });

            // Check unlock status
            if (isFreeUnlocked || isPaidUnlocked) {
                console.log('Post already unlocked, continuing...');
                // Already unlocked, continue to show replies
            } else if (freeUnlocked.length < 3) {
                console.log('Adding free unlock for post:', postId);
                window.LetItOutUtils.addFreeUnlockedPost(postId);
                this.showFreeUnlockBanner(2 - freeUnlocked.length);
            } else {
                console.log('Showing paywall for post:', postId);
                this.showPaywallModal(postId);
                return;
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
                <div class="letitout-my-posts-title">Messages</div>
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
            <button class="close-btn" style="position: absolute; right: 1.2rem; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 1.2rem; color: #c10016; cursor: pointer; padding: 0.5rem; line-height: 1;">&times;</button>
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
                        priceAmount: 499, // $4.99 in cents
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
                        doneBtn.disabled = this.selectedEmotions.length === 0;
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
            };

            this.selectedTagsDisplay.appendChild(tag);
        });

        // Update error message
        if (this.selectedEmotions.length === 0) {
            this.emotionError.textContent = 'Please select at least one feeling';
            this.emotionError.style.display = 'block';
        } else {
            this.emotionError.style.display = 'none';
        }
    }

    showRandomPrompt() {
        if (!this.prompts || !this.defaultPrompt) return;
        const prompt = this.getRandomPrompt();
        // Find the prompt display element
        const promptDisplay = this.form.querySelector('.letitout-prompt-display');
        if (promptDisplay) {
            promptDisplay.textContent = prompt;
        }
        // Show the reset button if not default
        const resetButton = this.form.querySelector('.letitout-reset-btn');
        if (resetButton) {
            resetButton.style.display = (prompt !== this.defaultPrompt) ? 'inline-flex' : 'none';
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
                this.renderCitySuggestions(suggestedList, doneBtn);
                doneBtn.disabled = false;
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
}

window.PostForm = PostForm; 