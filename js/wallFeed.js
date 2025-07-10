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
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Listener for all clicks within the feed
        this.feed.addEventListener('click', this.handleFeedClick.bind(this));
        // Listener to close menu when clicking outside
        document.addEventListener('click', this.handleDocumentClick.bind(this));
    }

    handleFeedClick(e) {
        const moreOptionsButton = e.target.closest('.more-options-button');
        const copyLinkButton = e.target.closest('.copy-link-button');
        const shareButton = e.target.closest('.share-post-button');
        const reportButton = e.target.closest('.report-post-button');

        if (moreOptionsButton) {
            e.preventDefault();
            this.handleMoreOptionsClick(moreOptionsButton);
        } else if (copyLinkButton) {
            e.preventDefault();
            this.handleCopyLinkClick(copyLinkButton);
        } else if (shareButton) {
            e.preventDefault();
            this.handleShareClick(shareButton);
        } else if (reportButton) {
            e.preventDefault();
            this.handleReportClick(reportButton);
        }
    }

    handleMoreOptionsClick(button) {
        const menu = button.nextElementSibling;
        const isVisible = menu.classList.contains('visible');
        // Close all menus first
        this.closeAllOptionMenus();
        // If the menu wasn't visible, show it
        if (!isVisible) {
            menu.classList.add('visible');
        }
    }
    
    handleDocumentClick(e) {
        // If the click is not on a more-options-button or inside a menu, close all menus.
        if (!e.target.closest('.more-options-button') && !e.target.closest('.options-menu')) {
            this.closeAllOptionMenus();
        }
    }

    closeAllOptionMenus() {
        this.feed.querySelectorAll('.options-menu.visible').forEach(openMenu => {
            openMenu.classList.remove('visible');
        });
    }

    handleCopyLinkClick(button) {
        const postCard = button.closest('.post-card');
        const postId = postCard.dataset.postId;
        if (!postId) return;

        const url = `${window.location.origin}${window.location.pathname}?post=${postId}`;
        navigator.clipboard.writeText(url).then(() => {
            this.showToast('Link copied!');
        }).catch(err => {
            console.error('Failed to copy link: ', err);
            this.showToast('Failed to copy link.', 'error');
        });
        this.closeAllOptionMenus();
    }

    handleShareClick(button) {
        const postCard = button.closest('.post-card');
        const postId = postCard.dataset.postId;
        if (!postId) return;

        const post = this.posts.find(p => p.id === postId);
        if (!post) {
            console.error('Post data not found for sharing.');
            this.showToast('Could not share post.', 'error');
            return;
        }

        this.showToast('Creating shareable image...');
        this.generateShareImage(post);
        this.closeAllOptionMenus();
    }

    handleReportClick(button) {
        const card = button.closest('.post-card');
        const postId = card.dataset.postId;
        const post = this.posts.find(p => p.id === postId);

        if (post) {
            this.openReportModal(post);
        } else {
            console.error('Could not find post to report:', postId);
            this.showToast('Something went wrong. Could not report post.', 'error');
        }
    }

    openReportModal(post) {
        const modalOverlay = document.getElementById('report-modal-overlay');
        const modal = document.getElementById('report-modal');
        const reasonsContainer = document.getElementById('report-reasons');
        const submitBtn = document.getElementById('report-submit-btn');
        const closeBtn = document.getElementById('report-modal-close');
    
        const reasons = [
            {
                title: "Hate Speech",
                description: "Promotes prejudice or discrimination toward a group."
            },
            {
                title: "Harassment or Bullying",
                description: "Targets or attacks someone personally."
            },
            {
                title: "Threat of Violence",
                description: "Expresses or implies harm to others."
            },
            {
                title: "Promoting Self-Harm or Suicide",
                description: "Encourages or glorifies harm to self."
            },
            {
                title: "Inappropriate or Offensive Content",
                description: "Sexual, graphic, or unsuitable for this space."
            },
            {
                title: "Spam or Irrelevant",
                description: "Not genuine or emotionally disruptive to the wall."
            },
            {
                title: "Urgent Mental Health Concern",
                description: "Flag this if someone may be in immediate danger."
            }
        ];
    
        reasonsContainer.innerHTML = '';
        reasons.forEach(reason => {
            const reasonEl = document.createElement('div');
            reasonEl.className = 'report-reason';
            reasonEl.dataset.reason = reason.title;
            reasonEl.innerHTML = `
                <strong class="report-reason-title">${reason.title}</strong>
                <p class="report-reason-description">${reason.description}</p>
            `;
            reasonsContainer.appendChild(reasonEl);
        });
    
        modalOverlay.classList.add('visible');
    
        let selectedReason = null;
    
        const reasonElements = reasonsContainer.querySelectorAll('.report-reason');
        reasonElements.forEach(el => {
            el.onclick = () => {
                reasonElements.forEach(innerEl => innerEl.classList.remove('selected'));
                el.classList.add('selected');
                selectedReason = el.dataset.reason;
                submitBtn.disabled = false;
            };
        });
    
        const closeModal = () => {
            modalOverlay.classList.remove('visible');
            submitBtn.disabled = true;
            selectedReason = null;
        };
    
        closeBtn.onclick = closeModal;
        modalOverlay.onclick = (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        };
    
        submitBtn.onclick = async () => {
            if (!selectedReason) return;
    
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
    
            try {
                await window.PostService.submitReport(post, selectedReason);
                this.showToast('Report submitted. Thank you for helping keep this space safe.');
            } catch (error) {
                console.error("Error submitting report:", error);
                this.showToast('Could not submit report. Please try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Report';
                closeModal();
            }
        };
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.add('visible');
        }, 10);

        // Animate out and remove
        setTimeout(() => {
            toast.classList.remove('visible');
            toast.addEventListener('transitionend', () => toast.remove());
        }, 3000);
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
        this.feed.innerHTML = '';
        if (posts.length > 0) {
            posts.forEach(post => {
                const card = PostCard.create(post);
                this.feed.appendChild(card);
            });
        } else {
            this.feed.innerHTML = '<p class="wall-empty-message">No posts found. Try adjusting your filters.</p>';
        }
        this.highlightPostFromUrl();
    }

    highlightPostFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const postIdFromUrl = urlParams.get('post');
        if (!postIdFromUrl) return;

        const postCard = this.feed.querySelector(`.post-card[data-post-id="${postIdFromUrl}"]`);
        if (postCard) {
            postCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            postCard.classList.add('highlight-glow');
            setTimeout(() => {
                postCard.classList.remove('highlight-glow');
            }, 2500);
            
            // Remove the post param after a delay to ensure highlighting is complete
            setTimeout(() => {
                const url = new URL(window.location);
                url.searchParams.delete('post');
                window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
            }, 3000);
        }
    }

    async generateShareImage(post) {
        // --- Dark Mode Check ---
        const isDarkMode = document.body.classList.contains('dark-mode');

        const shareContainer = document.createElement('div');
        shareContainer.id = 'share-image-container';
        
        // --- Main Canvas Styling (1080x1350px) ---
        Object.assign(shareContainer.style, {
            position: 'absolute',
            left: '-9999px',
            top: '0px',
            width: '1080px',
            height: '1350px',
            backgroundColor: isDarkMode ? '#1e1e1e' : '#fffcf1', // THEME AWARE
            padding: '80px 60px',
            boxSizing: 'border-box',
            fontFamily: '"DM Sans", sans-serif',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between' // Positions header at top, footer at bottom
        });

        // --- Container for all top-aligned content ---
        const topWrapper = document.createElement('div');
        Object.assign(topWrapper.style, {
            width: '100%',
            textAlign: 'center'
        });

        // --- Header (Title & Signature) ---
        const header = document.createElement('div');
        header.style.textAlign = 'center';
        
        const title = document.createElement('h1');
        title.textContent = 'LET IT OUT';
        Object.assign(title.style, {
            fontFamily: '"Anton", sans-serif',
            color: isDarkMode ? '#D4D4D4' : '#ca0013', // THEME AWARE
            fontSize: '96px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            margin: '0'
        });

        const signature = document.createElement('p');
        signature.textContent = post.city ? `Anonymous from ${post.city}` : 'Anonymous';
        Object.assign(signature.style, {
            fontSize: '28px',
            color: isDarkMode ? '#888' : '#888', // No change needed, but explicit for clarity
            margin: '10px 0 0 0'
        });

        header.append(title, signature);

        // --- Main Content ---
        const mainContent = document.createElement('div');
        Object.assign(mainContent.style, {
            width: '100%',
            marginTop: '80px' // Creates space between signature and tags
        });

        const tagsContainer = document.createElement('div');
        Object.assign(tagsContainer.style, {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '50px'
        });

        let allEmotions = [];
        if (Array.isArray(post.emotions) && post.emotions.length > 0) {
            allEmotions = post.emotions.join(',').split(',').map(e => e.trim()).filter(e => e);
        } else if (typeof post.emotion === 'string' && post.emotion) { // Fallback for older data
            allEmotions = post.emotion.split(',').map(e => e.trim()).filter(e => e);
        }

        // --- New Tag Display Logic ---
        const STRONG_EMOTIONS = ["What I never said"];
        let tagsToDisplay = [];
        const strongEmotion = allEmotions.find(e => STRONG_EMOTIONS.includes(e));

        if (strongEmotion) {
            tagsToDisplay = [strongEmotion];
        } else if (allEmotions.length === 1) {
            tagsToDisplay = allEmotions;
        } else if (allEmotions.length === 3) {
            const totalLength = allEmotions.reduce((acc, tag) => acc + tag.length, 0);
            // Heuristic to show 3 tags only if they are short enough to fit on one line
            if (totalLength < 45) {
                tagsToDisplay = allEmotions;
            } else {
                tagsToDisplay = allEmotions.slice(0, 2);
            }
        } else { // Handles 0, 2, or 4+ emotions
            tagsToDisplay = allEmotions.slice(0, 2);
        }
        
        if (tagsToDisplay.length > 0) {
            tagsToDisplay.forEach(e => {
                const tag = document.createElement('span');
                tag.textContent = e;
                Object.assign(tag.style, {
                    backgroundColor: isDarkMode ? '#ca0013' : '#fff0f2', // THEME AWARE
                                          color: isDarkMode ? '#ffffff' : '#ca0013', // THEME AWARE
                    borderRadius: '30px',
                    padding: '12px 24px',
                    fontSize: '24px',
                    fontWeight: '600'
                });
                tagsContainer.appendChild(tag);
            });
        }
        
        const content = document.createElement('p');
        content.textContent = post.content;
        Object.assign(content.style, {
            fontSize: '42px',
            color: isDarkMode ? '#D4D4D4' : 'black', // THEME AWARE
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            textAlign: 'center',
            margin: '0'
        });
        
        mainContent.append(tagsContainer, content);
        
        // --- Footer (Watermark) ---
        const footer = document.createElement('div');
        footer.style.textAlign = 'center';

        const watermark = document.createElement('p');
        watermark.innerHTML = 'Heart Matters &nbsp;&middot;&nbsp; wereheartmatters.com';
        Object.assign(watermark.style, {
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '24px',
            color: isDarkMode ? '#666' : '#aaa', // THEME AWARE
            fontWeight: '500',
            margin: '0'
        });
        
        footer.appendChild(watermark);

        // --- Assemble and Render ---
        topWrapper.append(header, mainContent);
        shareContainer.append(topWrapper, footer);
        document.body.appendChild(shareContainer);

        try {
            const canvas = await html2canvas(shareContainer, {
                useCORS: true,
                scale: 1, // Use 1x scale as we've defined exact dimensions
                backgroundColor: null,
                width: 1080,
                height: 1350,
                scrollX: 0,
                scrollY: -window.scrollY // Fix for capturing off-screen content
            });
            
            document.body.removeChild(shareContainer);

            const dataUrl = canvas.toDataURL('image/png');

            if (navigator.share && navigator.canShare) {
                const blob = await (await fetch(dataUrl)).blob();
                const file = new File([blob], 'heart-matters-post.png', { type: blob.type });
                await navigator.share({
                    files: [file],
                    title: 'Someone opened up on Let It Out. Read their journal.',
                });
            } else {
                this.showShareModal(dataUrl);
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Share action was canceled by the user.');
            } else {
                console.error('Error generating share image:', error);
                this.showToast('Could not create image.', 'error');
            }
            
            if(document.body.contains(shareContainer)) {
                document.body.removeChild(shareContainer);
            }
        }
    }

    showShareModal(dataUrl) {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'share-modal-overlay';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'share-modal-content';

        const closeButton = document.createElement('button');
        closeButton.className = 'share-modal-close';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = () => document.body.removeChild(modalOverlay);

        const heading = document.createElement('h3');
        heading.textContent = 'Share this Post';

        const image = document.createElement('img');
        image.src = dataUrl;
        image.style.width = '100%';
        image.style.borderRadius = '8px';
        image.style.border = '1px solid #eee';

        const downloadLink = document.createElement('a');
        downloadLink.href = dataUrl;
        downloadLink.download = 'heart-matters-post.png';
        downloadLink.className = 'share-modal-download-button';
        downloadLink.textContent = 'Download Image';

        modalContent.append(closeButton, heading, image, downloadLink);
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        
        modalOverlay.onclick = (e) => {
            if (e.target === modalOverlay) {
                document.body.removeChild(modalOverlay);
            }
        };
    }

    cleanup() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    destroy() {
        this.cleanup();
        // Remove event listeners
        if (this.feed) {
            this.feed.removeEventListener('click', this.handleFeedClick.bind(this));
        }
        document.removeEventListener('click', this.handleDocumentClick.bind(this));
    }

    getCityList() {
        return [
            'Atlanta, GA', 'Austin, TX', 'Bay Area, CA', 'Boston, MA', 'Chicago, IL', 'Denver, CO',
            'Houston, TX', 'Las Vegas, NV', 'Los Angeles, CA', 'Miami, FL', 'Minneapolis, MN',
            'Nashville, TN', 'New Orleans, LA', 'New York, NY', 'Orlando, FL', 'Philadelphia, PA',
            'Phoenix, AZ', 'Portland, OR', 'Salt Lake City, UT', 'San Diego, CA', 'San Francisco, CA',
            'San Jose, CA', 'Seattle, WA', 'Tampa, FL', 'Washington, DC'
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
                'Abandonment', 'Alone', 'Anger', 'Anxiety', 'Bitterness', 'Confusion', 'Depression', 'Embarrassment', 'Emptiness', 'Envy', 'Exhausted', 'Fear', 'Frustration', 'Grief', 'Guilt', 'Heartbreak', 'Hopelessness', 'Insecurity', 'Jealousy', 'Loneliness', 'Overwhelm', 'Panic', 'Powerlessness', 'Rejection', 'Regret', 'Resentment', 'Sadness', 'Self-hate', 'Shame', 'Stuck'
            ],
            'Unspoken & Unsaid': [
                "What I can't forgive", "What I can't tell anyone", "What I carry in silence", "What I hide behind my smile", "What I miss", "What I needed to hear", "What I never believed I deserved", "What I never got to say", "What I still don't understand", "What I want to scream", "What I wish I could take back", "What I'm afraid to admit", "What I've never said", "What's been eating me alive"
            ],
            'Hope & Healing': [
                'Acceptance', 'Clarity', 'Closure', 'Compassion', 'Courage', 'Faith', 'Forgiveness', 'Gratitude', 'Healing', 'Joy', 'Letting go', 'Lightness', 'Peace', 'Presence', 'Relief', 'Stillness', 'Surrender', 'Trust'
            ],
            'Longing & Love': [
                'Desire', 'I don\'t feel lovable', 'I loved them more than they knew', 'I miss someone', 'I need connection', 'I never said I loved them', 'I still love them', 'I want to feel loved', 'I\'m falling for someone', 'I\'m scared to love again', 'I feel unloved', 'Missed Connection'
            ],
            'Identity & Self': [
                'I crave touch', 'I don\'t know who I am', 'I feel invisible', 'I feel like not enough', 'I feel misunderstood', 'I feel too much', 'I hate who I used to be', 'I want to be authentic', 'I want to be seen', 'I want to feel chosen', 'I want to love myself', 'I want to start over', 'I\'m ashamed of who I am', 'I\'m learning to love myself', 'I\'m learning who I am', 'I\'m not okay', 'I\'m tired of pretending', 'I\'m trying to change'
            ],
            'Transformation & Release': [
                'I forgive myself', 'I made it through', 'I want to begin again', 'I want to heal', 'I\'m becoming someone new', 'I\'m finally saying it', 'I\'m letting it out', 'I\'m not who I was', 'I\'m ready to grow', 'I\'m ready to move on', 'I\'m still here', 'I\'ve been carrying this but I\'m ready to be free', 'I\'ve been holding this too long', 'It\'s time to let go', 'This is my turning point'
            ],
            'Light & Alive': [
                'Adventurous', 'Becoming me', 'Breakthrough', 'Celebration', 'Energized', 'Excitement', 'Freedom', 'Hope returned', 'I made it through', 'Peaceful inside', 'Pride', 'Safe now', 'Self-love'
            ]
        };
        return emotions[category] || [];
    }
}

window.WallFeed = WallFeed;