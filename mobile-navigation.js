/**
 * QUANTUM TOOLS - Simplified Mobile Navigation
 * Clean and minimal mobile menu implementation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Basic elements
    const navMenu = document.querySelector('.nav-links');
    const body = document.body;
    
    // Initialize two-line navigation structure
    const header = document.querySelector('header');
    const container = header ? header.querySelector('.container') : null;
    
    // Set up the current menu title
    const menuTitle = document.querySelector('.current-menu-title');
    if (menuTitle) {
        menuTitle.textContent = 'Main Menu';
    }
    
    // Find all dropdowns
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // 1. MAIN MENU TOGGLE
    // Menu button toggle code removed
    // ...existing code...
    // Handle window resize for responsive behavior
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // In desktop view, ensure proper display
            if (navMenu) navMenu.classList.remove('active');
            body.style.overflow = '';
            resetAllDropdowns();
        }
    });

    // 4. CLOSE WHEN CLICKING OUTSIDE
    // Menu button reference removed from click outside logic
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active') && 
            !navMenu.contains(e.target)) {
            // Close the menu
            navMenu.classList.remove('active');
            body.style.overflow = '';
            resetAllDropdowns();
            if (menuTitle) {
                menuTitle.textContent = 'Main Menu';
            }
        }
    });    // Find dropdown items and add toggle functionality
    const dropdownItems = document.querySelectorAll('.nav-links .dropdown');
    
    dropdownItems.forEach(item => {
        const link = item.querySelector('a');
        const subMenu = item.querySelector('.dropdown-menu');
        
        // Add click event to toggle dropdown only on mobile
        if (link) {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Toggle dropdown active state
                    item.classList.toggle('active');
                    
                    // Update menu title with current dropdown name
                    if (menuTitle) {
                        // If dropdown is being activated (opened)
                        if (item.classList.contains('active')) {
                            menuTitle.textContent = link.textContent.trim().replace(/[▼▶]/g, '');
                        } else {
                            menuTitle.textContent = 'Main Menu';
                        }
                    }
                    
                    // Close other dropdowns at the same level
                    const siblings = Array.from(item.parentNode.children).filter(child => 
                        child.classList.contains('dropdown') && child !== item
                    );
                    
                    siblings.forEach(sibling => {
                        sibling.classList.remove('active');
                    });
                }
            });
        }
    });
      // Function to handle submenu dropdowns
    const submenus = document.querySelectorAll('.dropdown-submenu');
    
    submenus.forEach(submenu => {
        const submenuLink = submenu.querySelector('a');
        const submenuContent = submenu.querySelector('.dropdown-submenu-content');
        
        if (submenuLink && submenuContent) {
            submenuLink.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Toggle submenu
                    submenu.classList.toggle('active');
                    
                    // Update menu title with current submenu name
                    if (menuTitle && submenu.classList.contains('active')) {
                        menuTitle.textContent = submenuLink.textContent.trim().replace(/[▼▶]/g, '');
                    }
                }
            });
        }    });
    
    // Reset all dropdowns function
    function resetAllDropdowns() {
        const allDropdowns = document.querySelectorAll('.dropdown');
        const allSubmenus = document.querySelectorAll('.dropdown-submenu');
        
        allDropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
        
        allSubmenus.forEach(submenu => {
            submenu.classList.remove('active');
        });
    }
    
    // 3. UTILITY FUNCTIONS
    function addBackButton(submenu) {
        // Create back button
        const backButton = document.createElement('li');
        backButton.classList.add('back-button');
        
        const backLink = document.createElement('a');
        backLink.href = '#';
        backLink.innerHTML = '← Back';
        backButton.appendChild(backLink);
        
        // Add it to the menu
        submenu.insertBefore(backButton, submenu.firstChild);
        
        // Handle back button click
        backLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Hide the submenu
            submenu.classList.remove('active');
            
            // Reset title
            if (menuTitle) {
                menuTitle.textContent = 'Main Menu';
            }
        });
    }
    
    function resetAllDropdowns() {
        // Hide all dropdown menus
        const allDropdowns = document.querySelectorAll('.dropdown-menu');
        allDropdowns.forEach(function(dropdown) {
            dropdown.classList.remove('active');
        });
    }
    
    // Add back buttons to submenus
    function addBackButtons() {
        // Find all dropdown menus
        const dropdownMenus = document.querySelectorAll('.dropdown-menu');
        
        dropdownMenus.forEach(menu => {
            // Check if this menu already has a back button
            if (!menu.querySelector('.back-button')) {
                // Get parent section name
                const parentLink = menu.closest('.dropdown').querySelector('a');
                const parentSection = parentLink ? parentLink.innerText.trim().replace('▼', '').trim() : 'Main Menu';
                
                // Create back button
                const backButton = document.createElement('li');
                backButton.classList.add('back-button');
                
                // Create back button link
                const backLink = document.createElement('a');
                backLink.href = '#';
                backLink.innerHTML = `<span class="back-arrow">←</span> Back to ${parentSection}`;
                backButton.appendChild(backLink);
                
                // Insert at the beginning of the menu
                if (menu.firstChild) {
                    menu.insertBefore(backButton, menu.firstChild);
                } else {
                    menu.appendChild(backButton);
                }
                  // Add click event for back button
                backLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Navigate back to parent menu
                    navigateToParentMenu(menu);
                });
            }
        });
    }

    // Call after DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Wait for a bit to ensure all dynamic content is loaded
        setTimeout(addBackButtons, 300);
    });
    
    // Handle scroll behavior
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow and background when scrolling down
        if (scrollTop > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide header when scrolling down, show when scrolling up
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Update header styling on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            // Reset mobile menu state on desktop
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
            
            // Reset dropdowns
            dropdownMenus.forEach(menu => {
                if (menu.classList.contains('active')) {
                    menu.classList.remove('active');
                    if (menu.previousElementSibling) {
                        menu.previousElementSibling.classList.remove('active');
                    }
                }
            });
        }
    });
    
    // Function to track navigation path
function updateMobileNavigationState() {
    const navLinks = document.querySelector('.nav-links');
    const menuTitle = document.querySelector('.current-menu-title');
    
    if (!navLinks || !menuTitle) return;
    
    // Initialize menu title if empty
    if (!menuTitle.textContent) {
        menuTitle.textContent = 'Main Menu';
    }
    
    // Track active menu path
    let activeMenuPath = [];
    let currentActiveMenu = document.querySelector('.dropdown-menu.active');
    
    if (currentActiveMenu) {
        // Find the parent menu name
        const parentLink = currentActiveMenu.closest('.dropdown').querySelector('a');
        if (parentLink) {
            const parentName = parentLink.textContent.replace('▼', '').trim();
            activeMenuPath.unshift(parentName);
            menuTitle.textContent = parentName;
        }
    } else {
        menuTitle.textContent = 'Main Menu';
    }
}

// Add event listener for menu state change
document.addEventListener('click', function(e) {
    // Wait a bit for DOM updates
    setTimeout(updateMobileNavigationState, 10);
});

// Initialize menu state on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateMobileNavigationState, 300);
});

// Track submenu state for body class
function updateSubmenuState() {
    const body = document.body;
    const anySubmenuOpen = document.querySelector('.dropdown-menu.active');
    
    if (anySubmenuOpen) {
        body.classList.add('submenu-open');
    } else {
        body.classList.remove('submenu-open');
    }
}

// Add event listeners to update submenu state
document.addEventListener('click', function() {
    setTimeout(updateSubmenuState, 10);
});

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateSubmenuState, 300);
});

// Function to navigate back to parent menu
function navigateToParentMenu(currentMenu) {
    if (!currentMenu) return;
    
    console.log("Navigating back to parent menu");
    
    // Hide the current submenu
    currentMenu.classList.remove('active');
    
    // Show the parent menu
    const parentDropdown = currentMenu.closest('.dropdown');
    if (parentDropdown) {
        const parentToggle = parentDropdown.querySelector('a');
        if (parentToggle) {
            parentToggle.classList.remove('active');
        }
        
        // If this is a nested dropdown, ensure parent menu is visible
        const parentMenu = parentDropdown.closest('.dropdown-menu');
        if (parentMenu) {
            parentMenu.classList.add('active');
            
            // Update menu title to parent menu title
            const grandparentDropdown = parentMenu.closest('.dropdown');
            if (grandparentDropdown) {
                const grandparentLink = grandparentDropdown.querySelector('a');
                if (grandparentLink && document.querySelector('.current-menu-title')) {
                    document.querySelector('.current-menu-title').textContent = 
                        grandparentLink.textContent.replace('▼', '').trim();
                }
            }
        } else {
            // We're going back to main menu
            if (document.querySelector('.current-menu-title')) {
                document.querySelector('.current-menu-title').textContent = 'Main Menu';
            }
        }
    }
    
    // Update menu state
    setTimeout(() => {
        updateSubmenuState();
        updateMobileNavigationState();
    }, 10);
}

// Handle orientation changes
window.addEventListener('orientationchange', function() {    // Reset UI for orientation changes
    if (window.innerWidth > 768) {
        // Reset mobile UI elements for desktop view
        const navMenu = document.querySelector('.nav-links');
        
        if (navMenu) navMenu.classList.remove('active');
        
        // Reset body scrolling
        document.body.style.overflow = '';
    }
});
});
