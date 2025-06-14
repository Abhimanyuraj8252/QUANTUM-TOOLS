/**
 * OMNIFORMA - Simplified Mobile Navigation
 * Clean and minimal mobile menu implementation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Basic elements
    const menuButton = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-links');
    const body = document.body;    
    // Set up the current menu title
    const menuTitle = document.querySelector('.current-menu-title');
    if (menuTitle) {
        menuTitle.textContent = 'Main Menu';
    }
    
    // Find all dropdowns
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // 1. MAIN MENU TOGGLE
    if (menuButton && navMenu) {
        menuButton.addEventListener('click', function() {
            // Toggle classes
            menuButton.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Control body scrolling
            if (navMenu.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
            
            // Reset all dropdowns when opening main menu
            if (navMenu.classList.contains('active')) {
                resetAllDropdowns();
                if (menuTitle) menuTitle.textContent = 'Main Menu';
            }
        });
    }
      // 4. CLOSE WHEN CLICKING OUTSIDE
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            menuButton && !menuButton.contains(e.target)) {
            
            // Close the menu
            navMenu.classList.remove('active');
            menuButton.classList.remove('active');
              // Reset body
            body.style.overflow = '';
            
            // Reset all dropdowns
            resetAllDropdowns();
            
            // Reset menu title
            if (menuTitle) {
                menuTitle.textContent = 'Main Menu';
            }
        }
    });    // Find dropdown items and add toggle functionality
    const dropdownItems = document.querySelectorAll('.nav-links .dropdown');
    
    dropdownItems.forEach(item => {
        const link = item.querySelector('a');
        const subMenu = item.querySelector('.dropdown-menu');
        
        // Convert links to dropdown toggles
        if (link && !link.classList.contains('dropdown-toggle')) {
            link.classList.add('dropdown-toggle');
            
            // Add down arrow icon
            const arrow = document.createElement('span');
            arrow.innerHTML = '▼';
            arrow.classList.add('dropdown-arrow');
            arrow.style.fontSize = '12px';
            arrow.style.marginLeft = '5px';
            link.appendChild(arrow);
        }
        
        // Add click event to toggle dropdown
        if (link) {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Dropdown toggle clicked');
                    
                    // If this dropdown is already active, return to parent level
                    if (link.classList.contains('active') && subMenu && subMenu.classList.contains('active')) {
                        link.classList.remove('active');
                        subMenu.classList.remove('active');
                        
                        // If this is a nested dropdown, show parent
                        const parentDropdown = item.closest('.dropdown-menu');
                        if (parentDropdown) {
                            parentDropdown.classList.add('active');
                        }
                        return;
                    }
                    
                    // Close other dropdowns
                    dropdownItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            const otherSubMenu = otherItem.querySelector('.dropdown-menu');
                            const otherLink = otherItem.querySelector('a');
                            if (otherSubMenu) otherSubMenu.classList.remove('active');
                            if (otherLink) otherLink.classList.remove('active');
                        }
                    });
                    
                    // Toggle current dropdown
                    if (subMenu) {
                        subMenu.classList.toggle('active');
                        link.classList.toggle('active');
                        
                        // Add breadcrumb navigation
                        const menuTitle = document.querySelector('.current-menu-title');
                        if (menuTitle) {
                            menuTitle.textContent = link.innerText.replace('▼', '').trim();
                        }
                        
                        // Add back button if not already present
                        addBackButtons();
                    }
                }
            });
        }
    });
    
    // 2. DROPDOWN HANDLING
    dropdowns.forEach(function(dropdown) {
        // Find the link that triggers the dropdown
        const link = dropdown.querySelector('.dropdown-link');
        // Find the dropdown menu
        const menu = dropdown.querySelector('.dropdown-menu');
        // Get menu name for the title
        const menuName = link.textContent.trim();
        
        if (link && menu) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Activate this dropdown
                menu.classList.add('active');
                
                // Update menu title
                if (menuTitle) {
                    menuTitle.textContent = menuName;
                }
            });
        }
    });
    
    // 3. BACK BUTTON HANDLING
    const backButtons = document.querySelectorAll('.back-button');
    
    backButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Find the parent dropdown menu
            const parentMenu = button.closest('.dropdown-menu');
            if (parentMenu) {
                // Hide this menu
                parentMenu.classList.remove('active');
                
                // Update title to Main Menu or parent menu name
                if (menuTitle) {
                    // If this is a submenu, find the parent menu name
                    const parentLi = parentMenu.closest('li.dropdown');
                    if (parentLi && parentLi.closest('.dropdown-menu')) {
                        const parentDropdownLink = parentLi.querySelector('.dropdown-link');
                        if (parentDropdownLink) {
                            menuTitle.textContent = parentDropdownLink.textContent.trim();
                        }
                    } else {
                        // Back to main menu
                        menuTitle.textContent = 'Main Menu';
                    }
                }
            }
        });
    });
    
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
window.addEventListener('orientationchange', function() {
    // Wait for orientation change to complete
    setTimeout(function() {
        // Reset UI if needed based on new screen size
        if (window.innerWidth > 768) {
            // Reset mobile UI elements for desktop view
            const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
            const navMenu = document.querySelector('.nav-links');
            
            if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            
            // Reset all dropdown menus
            const dropdownMenus = document.querySelectorAll('.dropdown-menu');
            dropdownMenus.forEach(menu => menu.classList.remove('active'));
            
            // Reset body classes
            document.body.classList.remove('menu-open');
            document.body.classList.remove('submenu-open');
            document.body.style.overflow = '';
        }
        
        // Update menu state
        updateSubmenuState();
        updateMobileNavigationState();
    }, 300);
});
});