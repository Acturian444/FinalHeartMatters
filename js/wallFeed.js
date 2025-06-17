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
        
        // Subscribe to posts
        this.subscribeToPosts();
    }

    createLocationFilter() {
        const locationFilter = document.createElement('div');
        locationFilter.className = 'wall-location-filter';
        
        const locationBtn = document.createElement('button');
        locationBtn.className = 'wall-location-btn';
        locationBtn.innerHTML = `
            <i class="fas fa-globe"></i>
            <span>${this.currentCity}</span>
            <i class="fas fa-chevron-down"></i>
        `;
        
        locationBtn.onclick = () => this.openLocationModal();
        
        locationFilter.appendChild(locationBtn);
        return locationFilter;
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
                <div class="wall-location-list">
                    <button class="location-option ${this.currentCity === 'Global' ? 'selected' : ''}" data-city="Global">
                        <i class="fas fa-globe"></i> Global
                    </button>
                    ${this.getCityList().map(city => `
                        <button class="location-option ${this.currentCity === city ? 'selected' : ''}" data-city="${city}">
                            ${city}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle city selection
        const cityButtons = modal.querySelectorAll('.location-option');
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
            const cityButtons = modal.querySelectorAll('.location-option');
            cityButtons.forEach(btn => {
                const city = btn.dataset.city;
                btn.style.display = city.toLowerCase().includes(searchTerm) ? 'block' : 'none';
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
        modal.className = 'wall-filter-modal';
        modal.innerHTML = `
            <div class="wall-filter-modal-content">
                <div class="wall-filter-modal-header">
                    <h3>Filter by Emotion</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="wall-filter-search">
                    <input type="text" placeholder="Search emotions..." class="wall-filter-search-input">
                </div>
                <div class="wall-filter-tabs">
                    ${this.getEmotionCategories().map(category => `
                        <button class="filter-tab ${category === this.getEmotionCategories()[0] ? 'active' : ''}" 
                                data-category="${category}">
                            ${category}
                        </button>
                    `).join('')}
                </div>
                <div class="wall-filter-options">
                    ${this.getEmotionCategories().map(category => `
                        <div class="filter-options ${category === this.getEmotionCategories()[0] ? 'active' : ''}" 
                             data-category="${category}">
                            ${this.getSubEmotions(category).map(emotion => `
                                <button class="filter-option ${this.currentFilter === emotion ? 'selected' : ''}" 
                                        data-emotion="${emotion}">
                                    ${emotion}
                                </button>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
                <div class="wall-filter-footer">
                    <button class="clear-filter-btn">Clear Filter</button>
                    <button class="apply-filter-btn">Apply</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle tab switching
        const tabs = modal.querySelectorAll('.filter-tab');
        tabs.forEach(tab => {
            tab.onclick = () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const options = modal.querySelectorAll('.filter-options');
                options.forEach(opt => opt.classList.remove('active'));
                modal.querySelector(`.filter-options[data-category="${tab.dataset.category}"]`).classList.add('active');
            };
        });
        
        // Handle emotion selection
        const emotionButtons = modal.querySelectorAll('.filter-option');
        emotionButtons.forEach(btn => {
            btn.onclick = () => {
                emotionButtons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            };
        });
        
        // Handle search
        const searchInput = modal.querySelector('.wall-filter-search-input');
        searchInput.oninput = (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const emotionButtons = modal.querySelectorAll('.filter-option');
            emotionButtons.forEach(btn => {
                const emotion = btn.dataset.emotion;
                btn.style.display = emotion.toLowerCase().includes(searchTerm) ? 'block' : 'none';
            });
        };
        
        // Handle clear filter
        const clearBtn = modal.querySelector('.clear-filter-btn');
        clearBtn.onclick = () => {
            emotionButtons.forEach(btn => btn.classList.remove('selected'));
        };
        
        // Handle apply filter
        const applyBtn = modal.querySelector('.apply-filter-btn');
        applyBtn.onclick = () => {
            const selectedEmotion = modal.querySelector('.filter-option.selected')?.dataset.emotion;
            this.currentFilter = selectedEmotion || null;
            this.updateFeed();
            modal.remove();
        };
        
        // Handle close
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.onclick = () => modal.remove();
        
        // Close on outside click
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }

    handleSearch() {
        const searchInput = document.querySelector('.wall-search-input');
        this.currentSearch = searchInput.value.trim();
        this.updateFeed();
    }

    updateLocationButton() {
        const locationBtn = document.querySelector('.wall-location-btn span');
        if (locationBtn) {
            locationBtn.textContent = this.currentCity;
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
            filteredPosts = filteredPosts.filter(post => post.emotion === this.currentFilter);
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
            'Joy & Gratitude',
            'Love & Connection',
            'Fear & Anxiety',
            'Anger & Frustration',
            'Sadness & Grief',
            'Loneliness & Isolation',
            'Hope & Inspiration',
            'Confusion & Uncertainty',
            'Pride & Achievement',
            'Regret & Remorse',
            'Peace & Contentment',
            'Excitement & Anticipation'
        ];
    }

    getSubEmotions(category) {
        const emotions = {
            'Joy & Gratitude': ['Happy', 'Grateful', 'Excited', 'Proud', 'Blessed', 'Thankful', 'Joyful', 'Content'],
            'Love & Connection': ['Loved', 'Connected', 'Supported', 'Cherished', 'Valued', 'Appreciated', 'Cared for', 'Understood'],
            'Fear & Anxiety': ['Anxious', 'Scared', 'Worried', 'Nervous', 'Overwhelmed', 'Stressed', 'Panicked', 'Terrified'],
            'Anger & Frustration': ['Angry', 'Frustrated', 'Irritated', 'Annoyed', 'Resentful', 'Furious', 'Outraged', 'Disgusted'],
            'Sadness & Grief': ['Sad', 'Heartbroken', 'Devastated', 'Depressed', 'Mourning', 'Grieving', 'Hurt', 'Disappointed'],
            'Loneliness & Isolation': ['Lonely', 'Isolated', 'Alone', 'Abandoned', 'Rejected', 'Excluded', 'Unwanted', 'Disconnected'],
            'Hope & Inspiration': ['Hopeful', 'Inspired', 'Motivated', 'Optimistic', 'Encouraged', 'Empowered', 'Determined', 'Confident'],
            'Confusion & Uncertainty': ['Confused', 'Uncertain', 'Lost', 'Doubtful', 'Indecisive', 'Perplexed', 'Bewildered', 'Disoriented'],
            'Pride & Achievement': ['Proud', 'Accomplished', 'Successful', 'Achieved', 'Victorious', 'Triumphant', 'Elated', 'Gratified'],
            'Regret & Remorse': ['Regretful', 'Remorseful', 'Guilty', 'Ashamed', 'Embarrassed', 'Humbled', 'Penitent', 'Contrite'],
            'Peace & Contentment': ['Peaceful', 'Content', 'Calm', 'Serene', 'Tranquil', 'Relaxed', 'Satisfied', 'Fulfilled'],
            'Excitement & Anticipation': ['Excited', 'Eager', 'Enthusiastic', 'Thrilled', 'Anticipating', 'Looking forward', 'Pumped', 'Stoked']
        };
        return emotions[category] || [];
    }
}

// Only export WallFeed to window
window.WallFeed = WallFeed; 