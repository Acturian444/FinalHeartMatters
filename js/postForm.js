// Post Form Handler
class PostForm {
    constructor() {
        this.form = document.createElement('form');
        this.form.className = 'letitout-form';
        this.setupForm();
    }

    setupForm() {
        // Create textarea
        const textarea = document.createElement('textarea');
        textarea.placeholder = 'What\'s on your heart?';
        textarea.required = true;
        textarea.maxLength = 500;

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

        // Add character counter
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.textContent = '0/500';

        textarea.addEventListener('input', () => {
            counter.textContent = `${textarea.value.length}/500`;
        });

        // Assemble form
        this.form.appendChild(textarea);
        this.form.appendChild(emotionTags);
        this.form.appendChild(counter);
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
            this.form.querySelector('.char-counter').textContent = '0/500';
            selectedEmotion.classList.remove('selected');
            submitButton.textContent = 'Let It Out';
            submitButton.disabled = false;

        } catch (error) {
            window.LetItOutUtils.showError('Error posting. Please try again.');
            submitButton.disabled = false;
            submitButton.textContent = 'Let It Out';
        }
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