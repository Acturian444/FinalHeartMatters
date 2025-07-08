// course.js - Main logic for Breakup Recovery Course page (Accordion Version)

(function () {
  const COURSE_ID = 'breakup';
  const UNLOCK_KEY = `courseUnlocked_${COURSE_ID}`;
  const PROGRESS_KEY = `courseProgress_${COURSE_ID}`;
  const VIEW_MODE_KEY = `courseViewMode_${COURSE_ID}`;
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

  // --- 5. Week management ---
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

  // --- 6. Render functions ---
  function renderProgressBar() {
    const progress = getProgress();
    const completedCount = progress.completedDays.length;
    const totalDays = course.days.length;
    
    document.getElementById('courseProgressBar').innerHTML = `
      <div class="progress-bar-inner">
        Day ${completedCount} of ${totalDays}
      </div>
    `;
  }

  function renderLinearProgress() {
    const progress = getProgress();
    const completedCount = progress.completedDays.length;
    const totalDays = course.days.length;
    const percent = Math.round((completedCount / totalDays) * 100);
    document.getElementById('courseLinearProgress').innerHTML = `
      <div class="course-linear-bar" style="width: ${percent}%;"></div>
    `;
  }

  function renderReminder() {
    document.getElementById('courseReminder').innerHTML = `
      Your healing journey starts here.
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
  let introAccordionOpen = window.__introAccordionOpen !== undefined ? window.__introAccordionOpen : true;
  let introOpen = window.__introOpen || { before: true, day0: true };
  function toggleIntroAccordion() {
    introAccordionOpen = !introAccordionOpen;
    window.__introAccordionOpen = introAccordionOpen;
    renderWeeksAndDays();
  }
  function toggleIntroSection(section) {
    introOpen[section] = !introOpen[section];
    window.__introOpen = introOpen;
    renderWeeksAndDays();
  }

  function renderWeeksAndDays() {
    const weeksContainer = document.getElementById('courseWeeks');
    const currentWeek = getCurrentWeek();
    let html = '';

    // Render Introduction (always visible)
    const intro = course.introduction;
    const progress = getProgress();
    const isDay0Completed = progress.completedDays.includes(0);
    html += `
      <div class="course-week-accordion">
        <div class="week-header" onclick="toggleIntroAccordion()">
          <div class="week-title">${intro.title}${isDay0Completed ? '<span class=\"intro-checkmark\">' + ICONS.check + '</span>' : ''}</div>
          <div class="week-chevron ${introAccordionOpen ? 'expanded' : ''}" id="intro-chevron">˅</div>
        </div>
        <div class="week-content ${introAccordionOpen ? 'expanded' : ''}" id="intro-content">
          <div class="course-day-item">
            <div class="day-header unlocked" onclick="toggleIntroSection('before');event.stopPropagation()">
              <div class="day-icon">${isDay0Completed ? '<span class=\"intro-checkmark\">' + ICONS.check + '</span>' : ICONS.book}</div>
              <div class="day-title">Before You Begin</div>
              <div class="day-chevron ${introOpen.before ? 'expanded' : ''}">˅</div>
            </div>
            <div class="day-content ${introOpen.before ? 'expanded' : ''}">
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
              <div class="day-chevron ${introOpen.day0 ? 'expanded' : ''}">˅</div>
            </div>
            <div class="day-content ${introOpen.day0 ? 'expanded' : ''}">
              <div class="day-content-inner">
                <div class="day-section"><div class="day-section-label">TODAY'S READING</div><div class="day-section-content">${intro.day0.reading}</div></div>
                <div class="day-section"><div class="day-section-label">YOUR TASK</div><div class="day-section-content">${intro.day0.task}</div></div>
                <div class="day-section"><div class="day-section-label">MORNING RITUAL</div><div class="day-section-content">${intro.day0.ritualMorning}</div></div>
                <div class="day-section"><div class="day-section-label">EVENING RITUAL</div><div class="day-section-content">${intro.day0.ritualEvening}</div></div>
                <div class="day-section"><div class="day-section-label">JOURNALING PROMPT</div><div class="day-section-prompt">${intro.day0.prompt}</div></div>
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
      html += `
        <div class=\"course-week-accordion\">
          <div class=\"week-header ${lockedClass}\" onclick=\"${isUnlocked ? `toggleWeek(${weekIndex})` : ''}\">
            ${lockIcon}<div class=\"week-title\">${week.title}${allDaysCompleted ? '<span class=\"intro-checkmark\">' + ICONS.check + '</span>' : ''}</div>
            <div class=\"week-chevron ${isExpanded ? 'expanded' : ''}\" id=\"week-${weekIndex}-chevron\">˅</div>
          </div>
          <div class=\"week-content ${isExpanded ? 'expanded' : ''}\" id=\"week-${weekIndex}-content\">
      `;
      // Render days in this week
      for (let day = week.startDay; day <= week.endDay; day++) {
        const dayData = course.days.find(d => d.day === day);
        if (!dayData) continue;
        const isUnlocked = isDayUnlocked(day);
        const isCompleted = isDayCompleted(day);
        const statusClass = isUnlocked ? '' : 'locked';
        // Always use the same checkmark icon as Introduction
        const statusIcon = isUnlocked ? (isCompleted ? '<span class=\"intro-checkmark\">' + ICONS.check + '</span>' : ICONS.book) : ICONS.lock;
        const clickHandler = isUnlocked ? `onclick=\"toggleDay(${day})\"` : '';
        html += `
          <div class=\"course-day-item\" data-day=\"${day}\">
            <div class=\"day-header ${statusClass}\" ${clickHandler}>
              <div class=\"day-icon\">${statusIcon}</div>
              <div class=\"day-title\">${dayData.title}</div>
              ${isUnlocked ? '<div class=\"day-chevron\" id=\"day-' + day + '-chevron\">˅</div>' : ''}
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

  function renderLetItOutCTA() {
    const ctaContainer = document.createElement('div');
    ctaContainer.className = 'course-cta';
    ctaContainer.innerHTML = `
      <span class="cta-label">Need to vent?</span>
      <button class="course-cta-btn" onclick="window.location.href='../letitout.html'">
        Let It Out
      </button>
    `;
    document.body.appendChild(ctaContainer);
  }

  // --- 7. Accordion interaction functions ---
  function toggleWeek(weekIndex) {
    const content = document.getElementById(`week-${weekIndex}-content`);
    const chevron = document.getElementById(`week-${weekIndex}-chevron`);
    
    if (content.classList.contains('expanded')) {
      content.classList.remove('expanded');
      chevron.classList.remove('expanded');
    } else {
      content.classList.add('expanded');
      chevron.classList.add('expanded');
    }
  }

  function toggleDay(day) {
    const content = document.getElementById(`day-${day}-content`);
    const chevron = document.getElementById(`day-${day}-chevron`);
    
    if (content.classList.contains('expanded')) {
      content.classList.remove('expanded');
      chevron.classList.remove('expanded');
    } else {
      content.classList.add('expanded');
      chevron.classList.add('expanded');
      // Scroll to the top of the newly opened day
      setTimeout(() => {
        const dayItem = document.querySelector(`.course-day-item[data-day='${day}']`);
        if (dayItem) {
          dayItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }

  function completeDay(day) {
    markDayComplete(day);
    renderProgressBar();
    renderWeeksAndDays();
  }

  // --- 8. Global functions for event handlers ---
  window.toggleWeek = toggleWeek;
  window.toggleDay = toggleDay;
  window.completeDay = completeDay;
  window.toggleViewMode = toggleViewMode;
  window.toggleIntroAccordion = toggleIntroAccordion;
  window.toggleIntroSection = toggleIntroSection;

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