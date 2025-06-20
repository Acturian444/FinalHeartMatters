document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const menuOverlay = document.getElementById('menuOverlay');
    const closeBtn = document.querySelector('.menu-overlay .close-btn');

    const openMenu = () => {
        if (menuOverlay) {
            menuOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeMenu = () => {
        if (menuOverlay) {
            menuOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    const toggleMenu = () => {
        if (menuOverlay && menuOverlay.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }

    // Close menu when clicking on the overlay background
    if (menuOverlay) {
        menuOverlay.addEventListener('click', (e) => {
            if (e.target === menuOverlay) {
                closeMenu();
            }
        });
    }

    // Optional: Close menu when clicking on a menu link
    const menuLinks = document.querySelectorAll('.menu-overlay nav a');
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}); 