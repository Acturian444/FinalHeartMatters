// course.js - Main logic for Breakup Recovery Course page (Accordion Version)

(function () {
  const COURSE_ID = 'breakup';
  const UNLOCK_KEY = `courseUnlocked_${COURSE_ID}`;
  const PROGRESS_KEY = `courseProgress_${COURSE_ID}`;
  const VIEW_MODE_KEY = `courseViewMode_${COURSE_ID}`;
  const LAST_OPENED_DAY_KEY = `lastOpenedDay_${COURSE_ID}`;
  const ACCORDION_STATE_KEY = `accordionState_${COURSE_ID}`;
  const course = window.COURSES[COURSE_ID];

  // SVG icons
  const ICONS = {
    book: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 15.5V5.5C3.5 4.39543 4.39543 3.5 5.5 3.5H9.5C10.0523 3.5 10.5 3.94772 10.5 4.5V15.5M10.5 15.5V4.5C10.5 3.94772 10.9477 3.5 11.5 3.5H15.5C16.6046 3.5 17.5 4.39543 17.5 5.5V15.5M10.5 15.5C10.5 16.0523 10.0523 16.5 9.5 16.5H5.5C4.39543 16.5 3.5 15.6046 3.5 14.5V15.5M10.5 15.5C10.5 16.0523 10.9477 16.5 11.5 16.5H15.5C16.6046 16.5 17.5 15.6046 17.5 14.5V15.5" stroke="#ca0013" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    lock: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="7" width="10" height="6" rx="2" stroke="#bbb" stroke-width="1.5"/><path d="M5 7V5.5C5 3.567 6.567 2 8.5 2C10.433 2 12 3.567 12 5.5V7" stroke="#bbb" stroke-width="1.5" stroke-linecap="round"/></svg>',
    check: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#ca0013"/><path d="M5 8.5L7.2 11L11 6.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  // --- 1. Unlock logic from query string ---
  function checkUnlockFromQuery() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('unlocked') === 'true') {
      localStorage.setItem(UNLOCK_KEY, 'true');
      // Remove query param from URL for cleanliness
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  // --- 2. Access control ---
  function isCourseUnlocked() {
    return localStorage.getItem(UNLOCK_KEY) === 'true';
  }

  function showLockedMessage() {
    document.body.innerHTML = `
      <main style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#fffcf1;">
        <h1 style="font-family:'Anton',sans-serif;color:#ca0013;font-size:2rem;margin-bottom:1.5rem;">Course Locked</h1>
        <div style="font-family:'DM Sans',sans-serif;color:#555;font-size:1.1rem;margin-bottom:2rem;max-width:320px;text-align:center;">
          You need to purchase the course to access this page.<br><br>
          <a href="../product/breakup-course.html" style="color:#ca0013;font-weight:bold;text-decoration:underline;">Go to Course Page</a>
        </div>
      </main>
    `;
  }

  // --- 3. Progress tracking ---
  function getProgress() {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || { completedDays: [], lastUnlocked: 0 };
    } catch {
      return { completedDays: [], lastUnlocked: 0 };
    }
  }

  function setProgress(progress) {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Could not save progress to localStorage:', e);
    }
  }

  function markDayComplete(day) {
    const progress = getProgress();
    if (!progress.completedDays.includes(day)) {
      progress.completedDays.push(day);
      progress.lastUnlocked = Math.max(progress.lastUnlocked, day + 1);
      setProgress(progress);
    }
  }

  function isDayUnlocked(day) {
    if (day === 0) return true; // Day 0 is always unlocked
    const progress = getProgress();
    return progress.lastUnlocked >= day;
  }

  function isDayCompleted(day) {
    const progress = getProgress();
    return progress.completedDays.includes(day);
  }

  // --- 4. View mode management ---
  function getViewMode() {
    return localStorage.getItem(VIEW_MODE_KEY) || 'current';
  }

  function setViewMode(mode) {
    localStorage.setItem(VIEW_MODE_KEY, mode);
  }

  function toggleViewMode() {
    const currentMode = getViewMode();
    const newMode = currentMode === 'current' ? 'all' : 'current';
    setViewMode(newMode);
    renderWeeksAndDays();
  }

  // --- 5. State management ---
  function getAccordionState() {
    try {
      return JSON.parse(localStorage.getItem(ACCORDION_STATE_KEY)) || {
        intro: { accordion: true, before: true, day0: true },
        weeks: Array(course.weeks.length).fill(false), // Default to closed
        days: Array(course.days.length).fill(false) // Default to closed
      };
    } catch {
      return {
        intro: { accordion: true, before: true, day0: true },
        weeks: Array(course.weeks.length).fill(false),
        days: Array(course.days.length).fill(false)
      };
    }
  }

  function setAccordionState(state) {
    try {
      localStorage.setItem(ACCORDION_STATE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save accordion state to localStorage:', e);
    }
  }

  function updateAccordionState(type, key, value) {
    const state = getAccordionState();
    if (type === 'intro') {
      state.intro[key] = value;
    } else if (type === 'week') {
      state.weeks[key] = value;
    } else if (type === 'day') {
      state.days[key] = value;
    }
    setAccordionState(state);
  }

  // --- 6. Week management ---
  function getCurrentWeek() {
    const progress = getProgress();
    const lastCompleted = Math.max(...progress.completedDays, 0);
    
    for (let i = 0; i < course.weeks.length; i++) {
      const week = course.weeks[i];
      if (lastCompleted >= week.startDay && lastCompleted <= week.endDay) {
        return i;
      }
    }
    return 0; // Default to first week
  }

  function isWeekUnlocked(weekIndex) {
    const week = course.weeks[weekIndex];
    const progress = getProgress();
    return progress.lastUnlocked >= week.startDay;
  }

  // --- 7. Render functions ---
  function renderProgressBar() {
    const progress = getProgress();
    // Only count days > 0 (exclude Day 0 introduction)
    const completedCount = progress.completedDays.filter(day => day > 0).length;
    const totalDays = course.days.filter(d => d.day > 0).length;
    
    document.getElementById('courseProgressBar').innerHTML = `
      <div class="progress-bar-inner">
        Day ${completedCount} of ${totalDays}
      </div>
    `;
  }

  function renderLinearProgress() {
    const progress = getProgress();
    // Only count days > 0 (exclude Day 0 introduction)
    const completedCount = progress.completedDays.filter(day => day > 0).length;
    const totalDays = course.days.filter(d => d.day > 0).length;
    const percent = Math.round((completedCount / totalDays) * 100);
    document.getElementById('courseLinearProgress').innerHTML = `
      <div class="course-linear-bar" style="width: ${percent}%;"></div>
    `;
  }

  function renderReminder() {
    const progress = getProgress();
    // Only count days > 0 (exclude Day 0 introduction)
    const completedCount = progress.completedDays.filter(day => day > 0).length;
    const totalDays = course.days.filter(d => d.day > 0).length;

    let reminderText;
    if (completedCount === totalDays) {
      // All 22 days completed, with mobile line break after 'day.'
              reminderText = "You didn't just finish a course.<span class=\"mobile-br\"></span> You reclaimed your power.";
    } else {
      // Default message with mobile line break after 'again.'
      reminderText = "This is where you begin again.<span class=\"mobile-br\"></span> One day at a time.";
    }

    document.getElementById('courseReminder').innerHTML = `
      ${reminderText}
    `;
  }

  function renderViewToggle() {
    const currentMode = getViewMode();
    document.getElementById('courseViewToggle').innerHTML = `
      <div class="course-view-toggle">
        <button class="toggle-btn ${currentMode === 'current' ? 'active' : ''}" onclick="toggleViewMode()">
          ${currentMode === 'current' ? 'Show All' : 'Show Current Only'}
        </button>
      </div>
    `;
  }

  // State for intro accordion and sub-accordions
  const INTRO_ACCORDION_KEY = `introAccordionOpen_${COURSE_ID}`;
  let introAccordionOpen = (function() {
    const stored = localStorage.getItem(INTRO_ACCORDION_KEY);
    if (stored === null) return true; // default open
    return stored === 'true';
  })();
  let introOpen = window.__introOpen || { before: true, day0: true };
  function toggleIntroAccordion() {
    introAccordionOpen = !introAccordionOpen;
    localStorage.setItem(INTRO_ACCORDION_KEY, introAccordionOpen);
    window.__introAccordionOpen = introAccordionOpen;
    updateAccordionState('intro', 'accordion', introAccordionOpen);
    renderWeeksAndDays();
  }
  function toggleIntroSection(section) {
    introOpen[section] = !introOpen[section];
    window.__introOpen = introOpen;
    updateAccordionState('intro', section, introOpen[section]);
    renderWeeksAndDays();
  }

  function renderWeeksAndDays() {
    const weeksContainer = document.getElementById('courseWeeks');
    const currentWeek = getCurrentWeek();
    const accordionState = getAccordionState();
    let html = '';

    // Render Introduction (always visible)
    const intro = course.introduction;
    const progress = getProgress();
    const isDay0Completed = progress.completedDays.includes(0);
    // Split the introduction title into "Introduction:" and the actual title
    const introTitleParts = intro.title.split(': ');
    const introLabel = introTitleParts[0] + ':';
    const introName = introTitleParts[1];
    
    // Use saved state or default
    const introAccordionState = accordionState.intro.accordion !== undefined ? accordionState.intro.accordion : true;
    const introBeforeState = accordionState.intro.before !== undefined ? accordionState.intro.before : true;
    const introDay0State = accordionState.intro.day0 !== undefined ? accordionState.intro.day0 : true;
    
    html += `
      <div class="course-week-accordion">
        <div class="week-header" onclick="toggleIntroAccordion()">
          <div class="week-title"><span style="color: #000;">${introLabel}</span> <span style="color: #ca0013;">${introName}</span>${isDay0Completed ? '<span class=\"intro-checkmark\">' + ICONS.check + '</span>' : ''}</div>
          <div class="week-chevron ${introAccordionState ? 'expanded' : ''}" id="intro-chevron">˅</div>
        </div>
        <div class="week-content ${introAccordionState ? 'expanded' : ''}" id="intro-content">
          <div class="course-day-item">
            <div class="day-header unlocked" onclick="toggleIntroSection('before');event.stopPropagation()">
              <div class="day-icon">${isDay0Completed ? '<span class=\"intro-checkmark\">' + ICONS.check + '</span>' : ICONS.book}</div>
              <div class="day-title">Before You Begin</div>
              <div class="day-chevron ${introBeforeState ? 'expanded' : ''}">˅</div>
            </div>
            <div class="day-content ${introBeforeState ? 'expanded' : ''}">
              <div class="day-content-inner">
                <div class="day-section">
                  <div class="day-section-label">${intro.label}</div>
                  <div class="day-section-content">${intro.beforeBegin}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="course-day-item">
            <div class="day-header unlocked" onclick="toggleIntroSection('day0');event.stopPropagation()">
              <div class="day-icon">${isDay0Completed ? '<span class=\"intro-checkmark\">' + ICONS.check + '</span>' : ICONS.book}</div>
              <div class="day-title">${intro.day0.title}</div>
              <div class="day-chevron ${introDay0State ? 'expanded' : ''}">˅</div>
            </div>
            <div class="day-content ${introDay0State ? 'expanded' : ''}">
              <div class="day-content-inner">
                <div class="day-section"><div class="day-section-label">TODAY'S READING</div><div class="day-section-content">${intro.day0.reading}</div></div>
                <div class="day-section"><div class="day-section-label">YOUR TASK</div><div class="day-section-content">${intro.day0.task}</div></div>
                <div class="day-section"><div class="day-section-label">MORNING RITUAL</div><div class="day-section-content">${intro.day0.ritualMorning}</div></div>
                <div class="day-section"><div class="day-section-label">EVENING RITUAL</div><div class="day-section-content">${intro.day0.ritualEvening}</div></div>
                <div class="day-section"><div class="day-section-label">JOURNALING PROMPT</div><div class="day-section-prompt">${intro.day0.prompt}</div>
                  <div class="journal-textarea-container">
                    <button class="journal-toggle-btn" onclick="toggleJournalTextarea(0)">
                      <span class="journal-toggle-text">Write your response</span>
                      <span class="journal-toggle-icon">˅</span>
                    </button>
                    <div class="journal-textarea-wrapper" id="journal-wrapper-0" style="display: none;">
                      <textarea 
                        class="journal-textarea" 
                        id="journal-textarea-0" 
                        placeholder="Let it out..."
                        oninput="saveJournalEntry(0, this.value)"
                      ></textarea>
                    </div>
                  </div>
                </div>
                ${!isDay0Completed ? `<button class=\"day-complete-btn\" onclick=\"completeDay(0)\">Mark as Complete</button>` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Render weeks
    course.weeks.forEach((week, weekIndex) => {
      const isUnlocked = isWeekUnlocked(weekIndex);
      const isCurrentWeek = weekIndex === currentWeek;
      const isExpanded = isUnlocked || isCurrentWeek;
      const lockedClass = isUnlocked ? '' : 'locked';
      const lockIcon = isUnlocked ? '' : `<span class=\"lock-icon\">${ICONS.lock}</span>`;
      // Check if all days in the week are completed
      const allDaysCompleted = Array.from({length: week.endDay - week.startDay + 1}, (_, i) => week.startDay + i)
        .every(day => isDayCompleted(day));
      // Split the week title into "Week X:" and the actual title
      const weekTitleParts = week.title.split(': ');
      const weekNumber = weekTitleParts[0] + ':';
      const weekName = weekTitleParts[1];
      
      // Apply locked styling if week is locked
      const weekNumberColor = isUnlocked ? '#000' : '#bbb';
      const weekNameColor = isUnlocked ? '#ca0013' : '#bbb';
      
      // Use saved week state or default
      const weekState = accordionState.weeks[weekIndex] !== undefined ? accordionState.weeks[weekIndex] : isExpanded;
      
      html += `
        <div class=\"course-week-accordion\">
          <div class=\"week-header ${lockedClass}\" onclick=\"${isUnlocked ? `toggleWeek(${weekIndex})` : ''}\">
            ${lockIcon}<div class=\"week-title\"><span style=\"color: ${weekNumberColor};\">${weekNumber}</span> <span style=\"color: ${weekNameColor};\">${weekName}</span>${allDaysCompleted ? '<span class="week-checkmark">' + ICONS.check + '</span>' : ''}</div>
            <div class=\"week-chevron ${weekState ? 'expanded' : ''}\" id=\"week-${weekIndex}-chevron\">˅</div>
          </div>
          <div class=\"week-content ${weekState ? 'expanded' : ''}\" id=\"week-${weekIndex}-content\">
      `;
      // Render days in this week
      for (let day = week.startDay; day <= week.endDay; day++) {
        const dayData = course.days.find(d => d.day === day);
        if (!dayData) continue;
        const isUnlocked = isDayUnlocked(day);
        const isCompleted = isDayCompleted(day);
        const lockedClass = isUnlocked ? '' : 'locked';
        const lockIcon = isUnlocked ? '' : `<span class=\"lock-icon\">${ICONS.lock}</span>`;
        const checkIcon = isCompleted ? ICONS.check : ICONS.book;
        
        // Use saved day state or default to false (closed)
        const dayState = accordionState.days[day] !== undefined ? accordionState.days[day] : false;
        
        html += `
          <div class=\"course-day-item\" data-day=\"${day}\">
            <div class=\"day-header ${lockedClass}\" ${isUnlocked ? `onclick=\"toggleDay(${day})\"` : ''}>
              <div class=\"day-icon\">${checkIcon}</div>
              <div class=\"day-title\">Day ${day}</div>
              <div class=\"day-chevron ${dayState ? 'expanded' : ''}\" id=\"day-${day}-chevron\">˅</div>
            </div>
            ${isUnlocked ? `
              <div class=\"day-content\" id=\"day-${day}-content\">
                <div class=\"day-content-inner\">
                  <div class=\"day-section\">
                    <div class=\"day-section-label\">TODAY'S READING</div>
                    <div class=\"day-section-content\">${dayData.reading}</div>
                  </div>
                  <div class=\"day-section\">
                    <div class=\"day-section-label\">YOUR TASK</div>
                    <div class=\"day-section-content\">${dayData.task}</div>
                  </div>
                  <div class=\"day-section\">
                    <div class=\"day-section-label\">MORNING RITUAL</div>
                    <div class=\"day-section-content\">${dayData.ritualMorning}</div>
                  </div>
                  <div class=\"day-section\">
                    <div class=\"day-section-label\">EVENING RITUAL</div>
                    <div class=\"day-section-content\">${dayData.ritualEvening}</div>
                  </div>
                  <div class=\"day-section\">
                    <div class=\"day-section-label\">JOURNALING PROMPT</div>
                    <div class=\"day-section-prompt\">${dayData.prompt}</div>
                    <div class=\"journal-textarea-container\">
                      <button class=\"journal-toggle-btn\" onclick=\"toggleJournalTextarea(${day})\">
                        <span class=\"journal-toggle-text\">Write your response</span>
                        <span class=\"journal-toggle-icon\">˅</span>
                      </button>
                      <div class=\"journal-textarea-wrapper\" id=\"journal-wrapper-${day}\" style=\"display: none;\">
                        <textarea 
                          class=\"journal-textarea\" 
                          id=\"journal-textarea-${day}\" 
                          placeholder=\"Let it out...\"
                          oninput=\"saveJournalEntry(${day}, this.value)\"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  ${!isCompleted ? `<button class=\"day-complete-btn\" onclick=\"completeDay(${day})\">Mark as Complete</button>` : ''}
                </div>
              </div>
            ` : ''}
          </div>
        `;
      }
      html += `
          </div>
        </div>
      `;
    });
    weeksContainer.innerHTML = html;
  }

  // --- 8. Helper functions ---
  function getNextUnlockedDay() {
    const progress = getProgress();
    const lastCompleted = Math.max(...progress.completedDays, 0);
    const nextDay = lastCompleted + 1;
    
    if (nextDay < course.days.length && isDayUnlocked(nextDay)) {
      return nextDay;
    }
    return null;
  }

  // 3. Update toggleDay to save last opened day
  function toggleDay(day) {
    const content = document.getElementById(`day-${day}-content`);
    const chevron = document.getElementById(`day-${day}-chevron`);
    const isExpanded = content.classList.contains('expanded');
    
    if (isExpanded) {
      content.classList.remove('expanded');
      chevron.classList.remove('expanded');
      updateAccordionState('day', day, false);
    } else {
      content.classList.add('expanded');
      chevron.classList.add('expanded');
      updateAccordionState('day', day, true);
      // Save last opened day
      localStorage.setItem(LAST_OPENED_DAY_KEY, day);
      setTimeout(() => {
        const dayItem = document.querySelector(`.course-day-item[data-day='${day}']`);
        if (dayItem) {
          dayItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }

  // 4. Update renderLetItOutCTA to flex row with Continue button
  function renderLetItOutCTA() {
    let ctaContainer = document.querySelector('.course-cta');
    if (!ctaContainer) {
      ctaContainer = document.createElement('div');
      ctaContainer.className = 'course-cta';
      document.body.appendChild(ctaContainer);
    }
    ctaContainer.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; width: 100%;">
        <div style="display: flex; align-items: center; gap: 1.2rem;">
          <button class="course-cta-btn" onclick="window.location.href='../letitout.html'">
            Let It Out
          </button>
          <button class="course-cta-btn" id="continueBtn" style="background:#000;color:#fffcf1;border:2px solid #000;">
            Continue
          </button>
        </div>
      </div>
    `;
    // Attach event for Continue button
    setTimeout(() => {
      const btn = document.getElementById('continueBtn');
      if (btn) {
        btn.onclick = function() {
          const nextDay = getNextUnlockedDay();
          if (nextDay !== null) {
            // Expand and scroll to next unlocked/incomplete day
            toggleDay(nextDay);
          }
        };
      }
    }, 0);
  }

  // 5. On page load, auto-resume last opened day
  function autoResumeLastOpenedDay() {
    const progress = getProgress();
    const isDay0Completed = progress.completedDays.includes(0);
    const lastOpened = localStorage.getItem(LAST_OPENED_DAY_KEY);

    if (!isDay0Completed && (lastOpened === null || isNaN(Number(lastOpened)))) {
      // First-time user: let default UI auto-expand Introduction
      return;
    }

    if (isDay0Completed && (lastOpened === null || isNaN(Number(lastOpened)))) {
      // Returning user, all collapsed: do NOT auto-expand anything
      return;
    }

    // If there is a last opened day, auto-expand it
    if (lastOpened !== null && !isNaN(Number(lastOpened))) {
      setTimeout(() => {
        toggleDay(Number(lastOpened));
      }, 300);
    }
  }

  // --- 7. Accordion interaction functions ---
  function toggleWeek(weekIndex) {
    const content = document.getElementById(`week-${weekIndex}-content`);
    const chevron = document.getElementById(`week-${weekIndex}-chevron`);
    const isExpanded = content.classList.contains('expanded');
    
    if (isExpanded) {
      content.classList.remove('expanded');
      chevron.classList.remove('expanded');
      updateAccordionState('week', weekIndex, false);
    } else {
      content.classList.add('expanded');
      chevron.classList.add('expanded');
      updateAccordionState('week', weekIndex, true);
    }
  }

  function completeDay(day) {
    markDayComplete(day);
    // Save last opened day as the one just completed
    localStorage.setItem(LAST_OPENED_DAY_KEY, day);
    renderProgressBar();
    renderLinearProgress();
    renderWeeksAndDays();
    renderReminder(); // Ensure reminder updates immediately
  }

  // --- 8. Journal functionality ---
  const JOURNAL_KEY = `courseJournal_${COURSE_ID}`;
  
  function getJournalEntries() {
    try {
      return JSON.parse(localStorage.getItem(JOURNAL_KEY)) || {};
    } catch {
      return {};
    }
  }
  
  function saveJournalEntry(day, content) {
    const entries = getJournalEntries();
    entries[day] = content;
    try {
      localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
    } catch (e) {
      console.warn('Could not save journal entry to localStorage:', e);
    }
  }
  
  function loadJournalEntry(day) {
    const entries = getJournalEntries();
    return entries[day] || '';
  }
  
  function toggleJournalTextarea(day) {
    const wrapper = document.getElementById(`journal-wrapper-${day}`);
    const textarea = document.getElementById(`journal-textarea-${day}`);
    const toggleBtn = wrapper.previousElementSibling;
    const toggleText = toggleBtn.querySelector('.journal-toggle-text');
    const toggleIcon = toggleBtn.querySelector('.journal-toggle-icon');
    
    if (wrapper.style.display === 'none') {
      wrapper.style.display = 'block';
      toggleText.textContent = 'Hide response';
      toggleIcon.textContent = '˄';
      textarea.focus();
      
      // Load saved content
      textarea.value = loadJournalEntry(day);
    } else {
      wrapper.style.display = 'none';
      toggleText.textContent = 'Write your response';
      toggleIcon.textContent = '˅';
    }
  }

  // --- 9. Global functions for event handlers ---
  window.toggleWeek = toggleWeek;
  window.toggleDay = toggleDay;
  window.completeDay = completeDay;
  window.toggleViewMode = toggleViewMode;
  window.toggleIntroAccordion = toggleIntroAccordion;
  window.toggleIntroSection = toggleIntroSection;
  window.toggleJournalTextarea = toggleJournalTextarea;
  window.saveJournalEntry = saveJournalEntry;

  // --- 9. Main init ---
  function init() {
    checkUnlockFromQuery();
    
    if (!isCourseUnlocked()) {
      showLockedMessage();
      return;
    }

    // Render all UI components
    renderProgressBar();
    renderLinearProgress();
    renderReminder();
    renderWeeksAndDays();
    renderLetItOutCTA();
    autoResumeLastOpenedDay();

    // Tooltip popover logic
    const infoIcon = document.getElementById('progressInfoIcon');
    const popover = document.getElementById('progressInfoPopover');
    const closeBtn = popover ? popover.querySelector('.popover-close') : null;
    function showPopover() {
      if (popover) popover.style.display = 'flex';
      document.addEventListener('mousedown', handleOutsideClick);
    }
    function hidePopover() {
      if (popover) popover.style.display = 'none';
      document.removeEventListener('mousedown', handleOutsideClick);
    }
    function handleOutsideClick(e) {
      if (popover && !popover.contains(e.target) && e.target !== infoIcon) {
        hidePopover();
      }
    }
    if (infoIcon && popover) {
      infoIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        if (popover.style.display === 'flex') {
          hidePopover();
        } else {
          showPopover();
        }
      });
      if (closeBtn) closeBtn.addEventListener('click', hidePopover);
    }
  }

  // --- 10. Run on DOMContentLoaded ---
  document.addEventListener('DOMContentLoaded', init);
})(); 