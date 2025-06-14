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
            "What would you write if no one could see your name?",
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
            "What's something you need to scream into the void?"
        ];
        this.defaultPrompt = "What's on your heart today?";

        // Create submit button first
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'letitout-submit-btn';
        submitButton.textContent = 'Let It Out';
        submitButton.disabled = false;

        // Create container for the button
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'letitout-cta-container';
        buttonContainer.appendChild(submitButton);

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
        counter.className = 'char-counter-inside';
        counter.textContent = '0/500';
        
        textarea.addEventListener('input', () => {
            counter.textContent = `${textarea.value.length}/500`;
        });
        
        textareaWrapper.appendChild(textarea);
        textareaWrapper.appendChild(counter);
        formContent.appendChild(textareaWrapper);

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
                    'It\'s time to let go', 'I\'m ready to grow', 'This is my turning point', 'I\'ve been holding this too long', 'I want to begin again', 'I want to heal', 'I forgive myself', 'I\'m finally saying it', 'I\'m letting it out', 'I\'m still here', 'I\'m ready to move on', 'I\'m not who I was', 'I\'m becoming someone new', 'I\'m still carrying this — but I want to be free'
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
        emotionBtn.innerHTML = '+ Add Emotion';
        emotionBtn.onclick = () => this.openEmotionModal();

        // Selected tags display
        this.selectedTagsDisplay = document.createElement('div');
        this.selectedTagsDisplay.className = 'letitout-selected-tags';

        // Error message
        this.emotionError = document.createElement('div');
        this.emotionError.className = 'letitout-emotion-error';
        this.emotionError.style.display = 'none';

        // Assemble emotion section
        emotionBtnRow.appendChild(emotionBtn);
        emotionSection.appendChild(emotionBtnRow);
        emotionSection.appendChild(this.selectedTagsDisplay);
        emotionSection.appendChild(this.emotionError);
        formContent.appendChild(emotionSection);

        // Assemble form
        this.form.appendChild(formContent);

        // Handle form submission
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit(textarea);
        });

        // Modal skeleton
        this.emotionModal = document.createElement('div');
        this.emotionModal.className = 'letitout-emotion-modal-overlay';
        this.emotionModal.innerHTML = `
            <div class="letitout-emotion-modal">
                <div class="letitout-emotion-modal-header">
                    <div class="letitout-emotion-modal-title">Select Emotions (1-3)</div>
                    <button class="letitout-emotion-modal-close">&times;</button>
                </div>
                <div class="letitout-emotion-modal-content"></div>
                <div class="letitout-emotion-modal-footer">
                    <button class="letitout-emotion-modal-btn cancel">Cancel</button>
                    <button class="letitout-emotion-modal-btn done" disabled>Done</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.emotionModal);
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

        try {
            const submitButton = this.form.querySelector('.letitout-submit-btn');
            submitButton.disabled = true;
            submitButton.textContent = 'Posting...';

            await window.PostService.createPost(content, this.selectedEmotions.join(', '));

            // Reset form
            textarea.value = '';
            this.form.querySelector('.char-counter-inside').textContent = '0/500';
            this.selectedEmotions = [];
            submitButton.textContent = 'Let It Out';
            submitButton.disabled = false;

        } catch (error) {
            window.LetItOutUtils.showError('Error posting. Please try again.');
            submitButton.disabled = false;
            submitButton.textContent = 'Let It Out';
        }
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
        // Add the form first
        container.appendChild(this.form);

        // Then add the CTA button container after the form
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'letitout-cta-container';

        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'letitout-submit-btn';
        submitButton.textContent = 'Let It Out';
        submitButton.onclick = () => this.form.requestSubmit();

        buttonContainer.appendChild(submitButton);
        container.appendChild(buttonContainer);
    }

    openEmotionModal() {
        const modal = this.emotionModal;
        const content = modal.querySelector('.letitout-emotion-modal-content');
        const doneBtn = modal.querySelector('.letitout-emotion-modal-btn.done');
        const closeBtn = modal.querySelector('.letitout-emotion-modal-close');
        const cancelBtn = modal.querySelector('.letitout-emotion-modal-btn.cancel');

        // Clear previous content
        content.innerHTML = '';

        // Create emotion categories and sub-emotions
        this.emotionCategories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'emotion-category';

            const categoryTitle = document.createElement('div');
            categoryTitle.className = 'emotion-category-title';
            categoryTitle.textContent = category.name;

            const subTagsDiv = document.createElement('div');
            subTagsDiv.className = 'emotion-subtags';

            category.emotions.forEach(emotion => {
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
                };

                subTagsDiv.appendChild(subTag);
            });

            categoryDiv.appendChild(categoryTitle);
            categoryDiv.appendChild(subTagsDiv);
            content.appendChild(categoryDiv);
        });

        // Show modal
        modal.classList.add('visible');

        // Close handlers
        const closeModal = () => {
            modal.classList.remove('visible');
        };

        closeBtn.onclick = closeModal;
        cancelBtn.onclick = closeModal;
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
            this.emotionError.textContent = 'Please select at least one emotion';
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
}

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const main = document.getElementById('letitout-main');
    if (main) {
        const postForm = new PostForm();
        postForm.render(main);
    }
}); 