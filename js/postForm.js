// Post Form Handler
class PostForm {
    constructor() {
        this.form = document.createElement('form');
        this.form.className = 'letitout-form';
        this.setupForm();
    }

    setupForm() {
        // Curated prompts
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
            "What does \"healing\" actually look like for you right now?",
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
        this.currentPrompt = this.defaultPrompt;

        // Subtitle and shuffle
        const subtitleWrapper = document.createElement('div');
        subtitleWrapper.className = 'letitout-subtitle-bar';

        // Prompt area (title)
        const promptArea = document.createElement('div');
        promptArea.className = 'letitout-subtitle';
        promptArea.textContent = this.defaultPrompt;

        // Next arrow icon SVG
        const nextArrowIcon = document.createElement('span');
        nextArrowIcon.className = 'next-arrow-icon';
        nextArrowIcon.innerHTML = `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;margin-right:0.4em;"><path d="M7 4l6 6-6 6" stroke="#c10016" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

        // Shuffle button
        const shuffleBtn = document.createElement('button');
        shuffleBtn.type = 'button';
        shuffleBtn.className = 'letitout-shuffle-btn';
        shuffleBtn.appendChild(nextArrowIcon);
        shuffleBtn.appendChild(document.createTextNode(' Need a new question?'));

        // Reset button (initially hidden)
        const resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.className = 'letitout-reset-btn';
        resetBtn.textContent = 'Reset';
        resetBtn.style.marginLeft = '0.7em';
        resetBtn.style.display = 'none';
        resetBtn.addEventListener('click', () => {
            promptArea.textContent = this.defaultPrompt;
            resetBtn.style.display = 'none';
        });

        shuffleBtn.addEventListener('click', () => {
            const prompt = this.getRandomPrompt();
            promptArea.textContent = prompt;
            if (prompt !== this.defaultPrompt) {
                resetBtn.style.display = 'inline-flex';
            }
        });

        // Button row
        const buttonRow = document.createElement('div');
        buttonRow.style.display = 'flex';
        buttonRow.style.alignItems = 'center';
        buttonRow.style.justifyContent = 'center';
        buttonRow.appendChild(shuffleBtn);
        buttonRow.appendChild(resetBtn);

        subtitleWrapper.appendChild(promptArea);
        subtitleWrapper.appendChild(buttonRow);
        this.form.appendChild(subtitleWrapper);

        // Create wrapper for textarea and counter
        const textareaWrapper = document.createElement('div');
        textareaWrapper.className = 'textarea-wrapper';

        // Create textarea
        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Let it out here…';
        textarea.required = true;
        textarea.maxLength = 500;
        textarea.style.width = '100%';
        textarea.style.boxSizing = 'border-box';

        // Add character counter inside wrapper
        const counter = document.createElement('div');
        counter.className = 'char-counter-inside';
        counter.textContent = '0/500';
        counter.style.position = 'absolute';
        counter.style.bottom = '0.5rem';
        counter.style.right = '1rem';
        counter.style.fontSize = '0.95rem';
        counter.style.color = '#888';
        counter.style.background = 'rgba(255,255,255,0.85)';
        counter.style.padding = '0 0.4rem';
        counter.style.borderRadius = '1rem';
        counter.style.pointerEvents = 'none';

        textarea.addEventListener('input', () => {
            counter.textContent = `${textarea.value.length}/500`;
        });

        textareaWrapper.appendChild(textarea);
        textareaWrapper.appendChild(counter);

        // Create emotion tags
        const emotionTags = document.createElement('div');
        emotionTags.className = 'emotion-tags';
        
        const emotions = ['Happy', 'Sad', 'Angry', 'Anxious', 'Grateful', 'Hopeful'];
        emotions.forEach(emotion => {
            const tag = document.createElement('button');
            tag.type = 'button';
            tag.className = 'emotion-tag';
            tag.textContent = emotion;
            tag.onclick = () => this.toggleEmotion(tag);
            emotionTags.appendChild(tag);
        });

        // Create submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'letitout-submit';
        submitButton.textContent = 'Let It Out';

        // Assemble form
        this.form.appendChild(textareaWrapper);
        this.form.appendChild(emotionTags);
        this.form.appendChild(submitButton);

        // Handle form submission
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit(textarea, emotionTags);
        });
    }

    toggleEmotion(tag) {
        const isSelected = tag.classList.contains('selected');
        const allTags = this.form.querySelectorAll('.emotion-tag');
        
        allTags.forEach(t => t.classList.remove('selected'));
        
        if (!isSelected) {
            tag.classList.add('selected');
        }
    }

    async handleSubmit(textarea, emotionTags) {
        const content = textarea.value.trim();
        const selectedEmotion = this.form.querySelector('.emotion-tag.selected');

        if (!content) {
            window.LetItOutUtils.showError('Please write something before submitting.');
            return;
        }

        if (!selectedEmotion) {
            window.LetItOutUtils.showError('Please select an emotion.');
            return;
        }

        try {
            const submitButton = this.form.querySelector('.letitout-submit');
            submitButton.disabled = true;
            submitButton.textContent = 'Posting...';

            await window.PostService.createPost(content, selectedEmotion.textContent);

            // Reset form
            textarea.value = '';
            this.form.querySelector('.char-counter-inside').textContent = '0/500';
            selectedEmotion.classList.remove('selected');
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
        container.appendChild(this.form);
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