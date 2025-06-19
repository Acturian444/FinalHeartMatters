// Wall Feed Handler
class WallFeed {
    constructor() {
        this.feed = document.createElement('div');
        this.feed.className = 'wall-feed';
        this.unsubscribe = null;
        this.currentCity = localStorage.getItem('selectedCity') || 'Global';
        this.currentSort = 'newest';
        this.currentFilter = null;
        this.currentSearch = '';
        this.posts = [];
    }

    render(container) {
        // Create controls section
        const controls = document.createElement('div');
        controls.className = 'wall-controls';
        
        // Location filter
        const locationFilter = this.createLocationFilter();
        controls.appendChild(locationFilter);

        // Search and filter row
        const searchFilterRow = document.createElement('div');
        searchFilterRow.className = 'wall-search-filter-row';
        
        // Search bar
        const searchBar = this.createSearchBar();
        searchFilterRow.appendChild(searchBar);
        
        // Filter button
        const filterBtn = this.createFilterButton();
        searchFilterRow.appendChild(filterBtn);
        
        controls.appendChild(searchFilterRow);

        // Add controls to container
        container.appendChild(controls);

        // Sort dropdown (left-aligned, with label)
        const sortDropdown = this.createSortDropdown();
        // Remove centering margin if present
        sortDropdown.style.margin = '';
        container.appendChild(sortDropdown);
        
        // Add feed
        container.appendChild(this.feed);
        
        // Add My Posts button to global container
        this.addMyPostsButton();
        
        // Subscribe to posts
        this.subscribeToPosts();
    }

    createLocationFilter() {
        const locationFilter = document.createElement('div');
        locationFilter.className = 'wall-location-filter';
        
        const locationBtn = document.createElement('button');
        locationBtn.className = 'wall-location-btn';
        locationBtn.innerHTML = this.getLocationButtonHTML();
        
        locationBtn.onclick = () => this.openLocationModal();
        
        locationFilter.appendChild(locationBtn);
        return locationFilter;
    }

    getLocationButtonHTML() {
        const isGlobal = this.currentCity === 'Global';
        const hasEmotionFilter = this.currentFilter;
        
        let icon, locationText, emotionText;
        
        if (isGlobal) {
            icon = '<i class="fas fa-map-marker-alt"></i>';
            locationText = 'Global';
        } else {
            icon = '<i class="fas fa-map-marker-alt"></i>';
            locationText = this.currentCity;
        }
        
        if (hasEmotionFilter) {
            emotionText = this.currentFilter;
        } else {
            emotionText = 'All Feelings';
        }
        
        return `
            <span>${icon} ${locationText} — ${emotionText}</span>
            <i class="fas fa-chevron-down"></i>
        `;
    }

    createSearchBar() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'wall-search-container';
        
        const searchForm = document.createElement('form');
        searchForm.className = 'wall-search-form';
        searchForm.onsubmit = (e) => {
            e.preventDefault();
            this.handleSearch();
        };
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'wall-search-input';
        searchInput.placeholder = 'Search Wall...';
        searchInput.value = this.currentSearch;
        
        const searchButton = document.createElement('button');
        searchButton.type = 'submit';
        searchButton.className = 'wall-search-button';
        searchButton.innerHTML = '<i class="fas fa-search"></i>';
        
        searchForm.appendChild(searchInput);
        searchForm.appendChild(searchButton);
        searchContainer.appendChild(searchForm);
        
        return searchContainer;
    }

    createFilterButton() {
        const filterBtn = document.createElement('button');
        filterBtn.className = 'wall-filter-btn';
        filterBtn.innerHTML = '<i class="fas fa-filter"></i>';
        filterBtn.onclick = () => this.openFilterModal();
        return filterBtn;
    }

    createSortDropdown() {
        const sortContainer = document.createElement('div');
        sortContainer.className = 'wall-sort-container custom-dropdown';
        sortContainer.setAttribute('role', 'group');

        // Custom dropdown trigger
        const trigger = document.createElement('button');
        trigger.className = 'wall-sort-trigger';
        trigger.id = 'wall-sort-trigger';
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-labelledby', 'wall-sort-trigger');
        trigger.type = 'button';
        trigger.tabIndex = 0;
        trigger.innerHTML = `${this.getSortText(this.currentSort)} <span class=\"dropdown-arrow\">▼</span>`;
        sortContainer.appendChild(trigger);

        // Dropdown list
        const dropdown = document.createElement('ul');
        dropdown.className = 'wall-sort-list';
        dropdown.setAttribute('role', 'listbox');
        dropdown.tabIndex = -1;
        dropdown.style.display = 'none';

        // Add dropdown label/header
        const dropdownLabel = document.createElement('li');
        dropdownLabel.className = 'wall-sort-label-dropdown';
        dropdownLabel.textContent = 'Sort by';
        dropdownLabel.setAttribute('aria-hidden', 'true');
        dropdown.appendChild(dropdownLabel);
        
        const options = [
            { value: 'newest', text: 'Newest' },
            { value: 'oldest', text: 'Oldest' },
            { value: 'mostFelt', text: 'Most Felt' }
        ];
        
        options.forEach(opt => {
            const li = document.createElement('li');
            li.className = 'wall-sort-option';
            li.setAttribute('role', 'option');
            li.setAttribute('data-value', opt.value);
            li.tabIndex = 0;
            li.textContent = opt.text;
            if (opt.value === this.currentSort) {
                li.classList.add('selected');
                li.setAttribute('aria-selected', 'true');
            }
            li.onclick = () => {
                this.currentSort = opt.value;
                trigger.innerHTML = `${opt.text} <span class=\"dropdown-arrow\">▼</span>`;
                // Remove 'selected' from all options
                dropdown.querySelectorAll('.wall-sort-option').forEach(optEl => {
                    optEl.classList.remove('selected');
                    optEl.removeAttribute('aria-selected');
        });
                // Add 'selected' to the clicked option
                li.classList.add('selected');
                li.setAttribute('aria-selected', 'true');
                dropdown.style.display = 'none';
                trigger.setAttribute('aria-expanded', 'false');
                this.updateFeed();
            };
            li.onkeydown = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    li.click();
                }
            };
            dropdown.appendChild(li);
        });
        sortContainer.appendChild(dropdown);

        // Toggle dropdown
        trigger.onclick = (e) => {
            e.stopPropagation();
            const expanded = trigger.getAttribute('aria-expanded') === 'true';
            trigger.setAttribute('aria-expanded', String(!expanded));
            dropdown.style.display = expanded ? 'none' : 'block';
            // Remove auto-focus on first option
        };
        // Close dropdown on outside click
        document.addEventListener('click', (e) => {
            if (!sortContainer.contains(e.target)) {
                dropdown.style.display = 'none';
                trigger.setAttribute('aria-expanded', 'false');
            }
        });
        // Keyboard navigation
        trigger.onkeydown = (e) => {
            if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                dropdown.style.display = 'block';
                trigger.setAttribute('aria-expanded', 'true');
                // Remove auto-focus on first option
            }
        };
        dropdown.onkeydown = (e) => {
            const options = Array.from(dropdown.querySelectorAll('.wall-sort-option'));
            const current = document.activeElement;
            let idx = options.indexOf(current);
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (idx < options.length - 1) options[idx + 1].focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (idx > 0) options[idx - 1].focus();
            } else if (e.key === 'Escape') {
                dropdown.style.display = 'none';
                trigger.setAttribute('aria-expanded', 'false');
                trigger.focus();
            }
        };
        return sortContainer;
    }

    getSortText(value) {
        switch (value) {
            case 'oldest': return 'Oldest';
            case 'mostFelt': return 'Most Felt';
            default: return 'Newest';
        }
    }

    openLocationModal() {
        // Create and show location modal
        const modal = document.createElement('div');
        modal.className = 'wall-location-modal';
        modal.innerHTML = `
            <div class="wall-location-modal-content">
                <div class="wall-location-modal-header">
                    <h3>Select Location</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="wall-location-search">
                    <input type="text" placeholder="Search cities..." class="wall-location-search-input">
                </div>
                <div class="wall-city-chip-list">
                    <button class="wall-city-chip ${this.currentCity === 'Global' ? 'selected' : ''}" data-city="Global">
                        ${this.currentCity === 'Global' ? '<i class="fas fa-map-marker-alt"></i> ' : ''}Global
                    </button>
                    ${this.getCityList().map(city => `
                        <button class="wall-city-chip ${this.currentCity === city ? 'selected' : ''}" data-city="${city}">
                            ${this.currentCity === city ? '<i class="fas fa-map-marker-alt"></i> ' : ''}${city}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Handle city selection
        const cityButtons = modal.querySelectorAll('.wall-city-chip');
        cityButtons.forEach(btn => {
            btn.onclick = () => {
                const city = btn.dataset.city;
                this.currentCity = city;
                localStorage.setItem('selectedCity', city);
                this.updateLocationButton();
                this.updateFeed();
                modal.remove();
            };
        });

        // Handle search
        const searchInput = modal.querySelector('.wall-location-search-input');
        searchInput.oninput = (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const cityButtons = modal.querySelectorAll('.wall-city-chip');
            cityButtons.forEach(btn => {
                const city = btn.dataset.city;
                btn.style.display = city.toLowerCase().includes(searchTerm) || city === 'Global' ? 'flex' : 'none';
            });
        };

        // Handle close
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.onclick = () => modal.remove();

        // Close on outside click
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }

    openFilterModal() {
        const modal = document.createElement('div');
        modal.className = 'wall-filter-modal visible';
        modal.innerHTML = `
            <div class="letitout-emotion-modal">
                <div class="letitout-emotion-modal-header">
                    <div class="letitout-emotion-modal-title">Filter by Feeling</div>
                    <button class="letitout-emotion-modal-close">&times;</button>
                </div>
                <div class="letitout-emotion-modal-content"></div>
                <div class="letitout-emotion-modal-footer">
                    <button class="letitout-emotion-modal-btn clear">Clear Filter</button>
                    <button class="letitout-emotion-modal-btn done">Apply</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const content = modal.querySelector('.letitout-emotion-modal-content');
        const doneBtn = modal.querySelector('.letitout-emotion-modal-btn.done');
        const clearBtn = modal.querySelector('.letitout-emotion-modal-btn.clear');
        const closeBtn = modal.querySelector('.letitout-emotion-modal-close');

        // Add search input
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'emotion-search-input';
        searchInput.placeholder = 'Search feelings...';
        searchInput.autocomplete = 'off';
        searchInput.style.marginBottom = '8px';
        content.appendChild(searchInput);

        // Container for all categories
        const categoriesContainer = document.createElement('div');
        categoriesContainer.className = 'emotion-categories-container';
        content.appendChild(categoriesContainer);

        // Helper to render categories and emotions
        const renderEmotions = (filter = '') => {
            categoriesContainer.innerHTML = '';
            const filterVal = filter.trim().toLowerCase();
            this.getEmotionCategories().forEach(category => {
                // Filter emotions in this category
                const filteredEmotions = filterVal
                    ? this.getSubEmotions(category).filter(e => e.toLowerCase().includes(filterVal))
                    : this.getSubEmotions(category);
                if (filteredEmotions.length === 0) return; // Hide category if no emotions

                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'emotion-category';

                const categoryTitle = document.createElement('div');
                categoryTitle.className = 'emotion-category-title';
                categoryTitle.textContent = category;

                const subTagsDiv = document.createElement('div');
                subTagsDiv.className = 'emotion-subtags';

                filteredEmotions.forEach(emotion => {
                    const subTag = document.createElement('button');
                    subTag.className = 'emotion-subtag';
                    subTag.textContent = emotion;
                    if (this.currentFilter === emotion) {
                        subTag.classList.add('selected');
                    }
                    subTag.onclick = () => {
                        // Only one can be selected
                        categoriesContainer.querySelectorAll('.emotion-subtag').forEach(t => t.classList.remove('selected'));
                        if (this.currentFilter === emotion) {
                            this.currentFilter = null;
                        } else {
                            subTag.classList.add('selected');
                            this.currentFilter = emotion;
                        }
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

        // Clear Filter button
        clearBtn.onclick = () => {
            this.currentFilter = null;
            this.updateLocationButton();
            renderEmotions(searchInput.value);
        };

        // Apply button
        doneBtn.onclick = () => {
            this.updateFeed();
            this.updateLocationButton();
            modal.remove();
        };

        // Close handlers
        const closeModal = () => {
            modal.remove();
        };
        closeBtn.onclick = closeModal;
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };
    }

    handleSearch() {
        const searchInput = document.querySelector('.wall-search-input');
        this.currentSearch = searchInput.value.trim();
        this.updateFeed();
    }

    updateLocationButton() {
        const locationBtn = document.querySelector('.wall-location-btn');
        if (locationBtn) {
            locationBtn.innerHTML = this.getLocationButtonHTML();
        }
    }

    updateFeed() {
        let filteredPosts = [...this.posts];
        
        // Apply city filter
        if (this.currentCity !== 'Global') {
            filteredPosts = filteredPosts.filter(post => post.city === this.currentCity);
        }
        
        // Apply emotion filter
        if (this.currentFilter) {
            filteredPosts = filteredPosts.filter(post => {
                if (!post.emotion) return false;
                // Handle comma-separated emotions
                const postEmotions = post.emotion.split(',').map(e => e.trim());
                return postEmotions.includes(this.currentFilter);
            });
        }
        
        // Apply search
        if (this.currentSearch) {
            const searchTerm = this.currentSearch.toLowerCase();
            filteredPosts = filteredPosts.filter(post => 
                post.content.toLowerCase().includes(searchTerm) ||
                post.emotion.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply sort
        switch (this.currentSort) {
            case 'oldest':
                filteredPosts.sort((a, b) => a.timestamp - b.timestamp);
                break;
            case 'mostFelt':
                filteredPosts.sort((a, b) => (b.feltCount || 0) - (a.feltCount || 0));
                break;
            default: // newest
                filteredPosts.sort((a, b) => b.timestamp - a.timestamp);
        }
        
        this.renderPosts(filteredPosts);
    }

    subscribeToPosts() {
        this.unsubscribe = window.PostService.subscribeToPosts(posts => {
            this.posts = posts;
            this.updateFeed();
        });
    }

    renderPosts(posts) {
        // Clear existing posts
        this.feed.innerHTML = '';

        if (posts.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.textContent = 'No posts found. Try adjusting your filters.';
            emptyState.style.textAlign = 'center';
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

    getCityList() {
        return [
            'Los Angeles, CA', 'New York, NY', 'Chicago, IL', 'Miami, FL', 'Atlanta, GA', 'Houston, TX',
            'San Francisco, CA', 'San Jose, CA', 'Bay Area, CA', 'Phoenix, AZ', 'Austin, TX', 'Seattle, WA',
            'Denver, CO', 'Las Vegas, NV', 'San Diego, CA', 'Philadelphia, PA', 'Washington, DC', 'Portland, OR',
            'Orlando, FL', 'Minneapolis, MN', 'Nashville, TN', 'Boston, MA', 'Tampa, FL', 'Salt Lake City, UT', 'New Orleans, LA'
        ];
    }

    getEmotionCategories() {
        return [
            'Pain & Pressure',
            'Unspoken & Unsaid',
            'Hope & Healing',
            'Longing & Love',
            'Identity & Self',
            'Transformation & Release',
            'Light & Alive'
        ];
    }

    getSubEmotions(category) {
        const emotions = {
            'Pain & Pressure': [
                'Grief', 'Shame', 'Guilt', 'Anger', 'Loneliness', 'Anxiety', 'Fear', 'Depression', 'Jealousy', 'Resentment', 'Emptiness', 'Heartbreak', 'Regret', 'Hopelessness', 'Insecurity', 'Sadness', 'Frustration', 'Bitterness', 'Confusion', 'Panic', 'Overwhelm', 'Embarrassment', 'Rejection', 'Envy', 'Abandonment', 'Self-hate', 'Powerlessness', 'Exhausted', 'Alone', 'Stuck'
            ],
            'Unspoken & Unsaid': [
                "What I've never said", "What I never got to say", "What I'm afraid to admit", "What I wish I could take back", "What I carry in silence", "What I want to scream", "What I can't tell anyone", "What I hide behind my smile", "What I still don't understand", "What I miss", "What I can't forgive", "What's been eating me alive", "What I needed to hear", "What I never believed I deserved"
            ],
            'Hope & Healing': [
                'Faith', 'Forgiveness', 'Gratitude', 'Relief', 'Acceptance', 'Letting go', 'Joy', 'Healing', 'Clarity', 'Compassion', 'Surrender', 'Presence', 'Trust', 'Peace', 'Closure', 'Stillness', 'Lightness', 'Courage'
            ],
            'Longing & Love': [
                'Missed Connection', 'Desire', 'I miss someone', 'I want to feel loved', 'I need connection', 'I feel unloved', "I'm falling for someone", "I still love them", "I never said I loved them", "I loved them more than they knew", "I'm scared to love again", "I don't feel lovable"
            ],
            'Identity & Self': [
                "I don't know who I am", "I feel too much", "I feel like not enough", "I'm trying to change", "I'm tired of pretending", "I hate who I used to be", "I want to start over", "I want to be seen", "I'm not okay", "I'm learning to love myself", "I'm ashamed of who I am", "I feel invisible", "I want to love myself", "I crave touch", "I want to feel chosen", "I'm learning who I am", "I want to be authentic", "I feel misunderstood"
            ],
            'Transformation & Release': [
                "It's time to let go", "I'm ready to grow", "This is my turning point", "I've been holding this too long", "I want to begin again", "I want to heal", "I forgive myself", "I'm finally saying it", "I'm letting it out", "I'm still here", "I'm ready to move on", "I'm not who I was", "I'm becoming someone new", "I've been carrying this but I'm ready to be free"
            ],
            'Light & Alive': [
                'Freedom', 'Excitement', 'Pride', 'Celebration', 'Breakthrough', 'I made it through', 'Hope returned', 'Becoming me', 'Safe now', 'Self-love', 'Adventurous', 'Energized', 'Peaceful inside'
            ]
        };
        return emotions[category] || [];
    }

    addMyPostsButton() {
        const globalContainer = document.getElementById('letitout-my-posts-container');
        if (globalContainer) {
            // Create My Posts button if it doesn't exist
            let myPostsBtn = globalContainer.querySelector('.letitout-my-posts-btn-global');
            if (!myPostsBtn) {
                myPostsBtn = document.createElement('button');
                myPostsBtn.className = 'letitout-my-posts-btn letitout-my-posts-btn-global';
                myPostsBtn.innerHTML = `
                  <span class="my-posts-icon" style="display:inline-flex;align-items:center;">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="3" width="18" height="4" rx="2"/>
                      <path d="M3 7v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7"/>
                      <path d="M9 12h6"/>
                    </svg>
                  </span>
                `;
                myPostsBtn.setAttribute('aria-label', 'My Posts & Inbox');
                myPostsBtn.onclick = () => this.openMyPostsModal();
            }
            
            // Clear existing content and add the button
            globalContainer.innerHTML = '';
            globalContainer.appendChild(myPostsBtn);
        }
    }

    openMyPostsModal() {
        // Remove any existing modal
        this.closeMyPostsModal();
        const modal = document.createElement('div');
        modal.className = 'letitout-my-posts-modal-overlay';
        modal.innerHTML = `
          <div class="letitout-my-posts-modal">
            <button class="letitout-my-posts-close">&times;</button>
            <div class="letitout-my-posts-tabs">
              <button class="my-posts-tab active">My Posts <span class="my-posts-notification-dot" style="display:none;"></span></button>
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
                if (unreadReplies > 0) {
                    hasUnreadReplies = true;
                }
                const replyWord = post.replies.length === 1 ? 'reply' : 'replies';
                replyLine = `<div class=\"my-post-reply-line\">${post.replies.length} ${replyWord} received – <span class=\"view-messages\" data-post-id=\"${post.id}\">View Messages</span></div>`;
            }
            html += `<div class="my-post-card">${post.content}${replyLine}</div>`;
        }
        
        if (!posts.length) {
            html = '<div class="empty-state">No posts yet. Your posts will appear here.</div>';
        }
        
        container.innerHTML = html;
        
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
        
        // Add click handler for "View Messages"
        const viewMessagesLinks = container.querySelectorAll('.view-messages');
        viewMessagesLinks.forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const postId = link.getAttribute('data-post-id');
                await this.showRepliesView(container, modal, postId);
            });
        });
    }

    async showRepliesView(container, modal, postId) {
        const localId = window.LocalIdManager.getId();
        const posts = await window.PostService.getPostsByUser(localId, 'localId');
        const post = posts.find(p => p.id === postId);
        
        if (!post || !post.replies || !post.replies.length) {
            return;
        }
        
        // Mark replies as read
        const unreadReplies = post.replies.filter(r => !r.viewed);
        if (unreadReplies.length > 0) {
            // Update the post in Firestore to mark replies as read
            await window.PostService.markRepliesAsRead(postId);
        }
        
        // Format the original post timestamp
        let postDate;
        if (post.timestamp && typeof post.timestamp.toDate === 'function') {
            postDate = post.timestamp.toDate();
        } else {
            postDate = new Date(post.timestamp);
        }
        const postTimestamp = !isNaN(postDate) ? postDate.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '';
        
        // Create the replies view HTML
        let repliesHtml = '';
        post.replies.forEach(reply => {
            let replyDate;
            if (reply.timestamp && typeof reply.timestamp.toDate === 'function') {
                replyDate = reply.timestamp.toDate();
            } else {
                replyDate = new Date(reply.timestamp);
            }
            const replyTimestamp = !isNaN(replyDate) ? replyDate.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '';
            
            repliesHtml += `
                <div class="reply-card">
                    <div class="reply-content">${reply.content}</div>
                    <div class="reply-timestamp">${replyTimestamp}</div>
                </div>
            `;
        });
        
        // Update the modal content
        const modalContent = modal.querySelector('.letitout-my-posts-modal');
        modalContent.innerHTML = `
            <button class="letitout-my-posts-close">&times;</button>
            <button class="back-to-posts-btn">← My Posts</button>
            <div class="letitout-my-posts-title">Messages</div>
            <div class="letitout-my-posts-content">
                <div class="original-post-card">
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
        
        // Add event listeners
        modal.querySelector('.letitout-my-posts-close').onclick = () => this.closeMyPostsModal();
        modal.querySelector('.back-to-posts-btn').onclick = () => {
            this.openMyPostsModal();
        };
        
        // Update notification dot since replies are now read
        const notificationDot = modal.querySelector('.my-posts-notification-dot');
        if (notificationDot) {
            notificationDot.style.display = 'none';
        }
    }
}

// Only export WallFeed to window
window.WallFeed = WallFeed; 