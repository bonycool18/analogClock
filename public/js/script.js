"use strict";

var $slider = $(".slideshow .slider"), maxItems = $(".item", $slider).length, dragging = false, tracking, rightTracking;

// Clone the slideshow and reverse the items for the right side
var $sliderRight = $(".slideshow").clone().addClass("slideshow-right").appendTo($(".splitSlideshow"));

var rightItems = $(".item", $sliderRight).toArray(), reverseItems = rightItems.reverse();

// Clear the right slider and append reversed items
$(".slider", $sliderRight).html("");

for (var i = 0; i < maxItems; i++) {
    $(reverseItems[i]).appendTo($(".slider", $sliderRight));
}

$slider.addClass("slideshow-left"); // Initialize the left slider with auto-scrolling

var isMobile = window.innerWidth <= 768; // Detect if it's a mobile device or mobile viewport

$(".slideshow-left")
    .slick({
        vertical: true,
        verticalSwiping: true,
        arrows: false,
        infinite: true,
        dots: true,
        dragging: false,
        speed: 1000,
        autoplay: true, // Enable auto-scrolling
        autoplaySpeed: 3000, // Auto-scroll every 3 seconds
        cssEase: "cubic-bezier(0.7, 0, 0.3, 1)"
    })
    .on("beforeChange", function (event, slick, currentSlide, nextSlide) {
        if (currentSlide > nextSlide && nextSlide === 0 && currentSlide === maxItems - 1) {
            $(".slideshow-right .slider").slick("slickGoTo", -1);
            $(".slideshowText").slick("slickGoTo", maxItems);
        } else if (currentSlide < nextSlide && currentSlide === 0 && nextSlide === maxItems - 1) {
            $(".slideshow-right .slider").slick("slickGoTo", maxItems);
            $(".slideshowText").slick("slickGoTo", -1);
        } else {
            $(".slideshow-right .slider").slick("slickGoTo", maxItems - 1 - nextSlide);
            $(".slideshowText").slick("slickGoTo", nextSlide);
        }
    });

// Only allow dragging on non-mobile view
if (!isMobile) {
    $(".slideshow-left")
        .on("mousedown touchstart", function () {
            dragging = true;
            tracking = $(".slick-track", $slider).css("transform");
            tracking = tracking ? parseInt(tracking.split(",")[5]) : 0;
            rightTracking = $(".slideshow-right .slick-track").css("transform");
            rightTracking = rightTracking ? parseInt(rightTracking.split(",")[5]) : 0;
        })
        .on("mousemove touchmove", function () {
            if (dragging) {
                var newTracking = $(".slideshow-left .slick-track").css("transform");
                newTracking = newTracking ? parseInt(newTracking.split(",")[5]) : 0;
                var diffTracking = newTracking - tracking;
                $(".slideshow-right .slick-track").css({
                    transform: "matrix(1, 0, 0, 1, 0, " + (rightTracking - diffTracking) + ")"
                });
            }
        })
        .on("mouseleave touchend mouseup", function () {
            dragging = false;
        });
}

// Initialize the right slider (no scroll needed)
$(".slideshow-right .slider").slick({
    swipe: false,
    vertical: true,
    arrows: false,
    infinite: true,
    dragging: false,
    speed: 950,
    cssEase: "cubic-bezier(0.7, 0, 0.3, 1)",
    initialSlide: maxItems - 1
});

// Initialize the slideshow text
$(".slideshowText").slick({
    swipe: false,
    vertical: true,
    arrows: false,
    infinite: true,
    dragging: false,
    speed: 900,
    cssEase: "cubic-bezier(0.7, 0, 0.3, 1)"
});

// Dynamic data for second and third-level menus
// const dynamicMainNavigationData = {
//     services: [
//         {
//             text: 'CUSTOM SOFTWARE DEVELOPMENT',
//             href: 'javascript:void(0)',
//             subMenu: [{
//                     text: 'SAAS DEVELOPMENT',
//                     href: 'javascript:void(0)'
//                 },
//                 {
//                     text: 'PHP DEVELOPMENT',
//                     href: 'javascript:void(0)'
//                 },
//                 {
//                     text: 'ASPNET DEVELOPMENT',
//                     href: 'javascript:void(0)'
//                 },
//             ]
//         },
//         {
//             text: 'USER INTERFACE DESIGN',
//             href: 'javascript:void(0)',
//             subMenu: [{
//                     text: 'WEB DESIGN',
//                     href: 'javascript:void(0)'
//                 },
//                 {
//                     text: 'MOBILE DESIGN',
//                     href: 'javascript:void(0)'
//                 },
//                 {
//                     text: 'MOBILE VERSIONS',
//                     href: 'javascript:void(0)'
//                 },
//             ]
//         },
//         {
//             text: 'MOBILE APPLICATION DEVELOPMENT',
//             href: 'javascript:void(0)',
//             subMenu: [{
//                     text: 'IOS APP DEVELOPMENT',
//                     href: 'javascript:void(0)'
//                 },
//                 {
//                     text: 'ANDROID APP DEVELOPMENT',
//                     href: 'javascript:void(0)'
//                 },
//                 {
//                     text: 'TABLET APP DEVELOPMENT',
//                     href: 'javascript:void(0)'
//                 },
//                 {
//                     text: 'ENTERPRISE MOBILITY',
//                     href: 'javascript:void(0)'
//                 },
//             ]
//         },
//         {
//             text: 'ECOMMERCE DEVELOPMENT',
//             href: 'javascript:void(0)',
//             subMenu: [{
//                     text: 'MAGENTO DEVELOPMENT',
//                     href: 'javascript:void(0)'
//                 },
//             ]
//         },
//         {
//             text: 'IT CONSULTING',
//             href: 'javascript:void(0)'
//         },
//         {
//             text: 'DEDICATED TEAM SETUPS',
//             href: 'javascript:void(0)'
//         },
//     ]
// };

// Function to dynamically update submenus inside respective li elements
// function updateSubMenu(menuItems, subMenuUl) {
//     subMenuUl.innerHTML = ''; // Clear existing submenu

//     menuItems.forEach(item => {
//         const li = document.createElement('li');
//         const a = document.createElement('a');
//         a.href = item.href;
//         a.textContent = item.text;
//         li.appendChild(a);

//         // Check if this item has a submenu (second or third level)
//         if (item.subMenu && item.subMenu.length > 0) {
//             const childMenuUl = document.createElement('ul');
//             childMenuUl.classList.add('thirdLevelMenuLists');
//             updateSubMenu(item.subMenu, childMenuUl); // Recursive call for nested menus
//             li.appendChild(childMenuUl);
//         }

//         subMenuUl.appendChild(li);
//     });
// }

// // Toggle function to show/hide submenus on click
// function toggleSubMenu(menuElement, menuItems) {
//     // const subMenuUl = menuElement.querySelector('ul');

//     // // Check if submenu is already active (visible)
//     // if (subMenuUl.classList.contains('active')) {
//     //     subMenuUl.classList.remove('active');
//     // } else {
//     //     updateSubMenu(menuItems, subMenuUl);  // Update submenu with dynamic data
//     //     subMenuUl.classList.add('active');
//     // }

//     const firstLevelMenuAnchor = menuElement.querySelector('ul li a');
//     const firstLevelMenuUl = menuElement.querySelector('ul li a + ul');

//     firstLevelMenuAnchor.addEventListener("click", function() {
//         if (firstLevelMenuUl.classList.contains('active')) {
//                 firstLevelMenuUl.classList.remove('active');
//             } else {
//                 updateSubMenu(menuItems, firstLevelMenuUl);
//                 firstLevelMenuUl.classList.add('active');
//             }
//     });
// }

// // Function to hide all submenus (hides second, third, fourth level menus)
// function hideSubMenus() {
//     const allSubMenus = document.querySelectorAll('.secondLevelMenuLists, .thirdLevelMenuLists');
//     allSubMenus.forEach(menu => {
//         menu.classList.remove('active');
//     });
// }

// // Event listeners for desktop (hover)
// function desktopEvents() {
//     const aboutLink = document.getElementById('aboutLink').parentElement;
//     const contactLink = document.getElementById('contactLink').parentElement;

//     aboutLink.addEventListener('mouseenter', () => {
//         hideSubMenus();  // Hide any other submenus
//         updateSubMenu(dynamicMainNavigationData.about, aboutLink.querySelector('ul'));  // Open submenu
//         // aboutLink.querySelector('ul').style.display = 'block';  // Display submenu
//     });

//     contactLink.addEventListener('mouseenter', () => {
//         hideSubMenus();  // Hide any other submenus
//         updateSubMenu(dynamicMainNavigationData.contact, contactLink.querySelector('ul'));  // Open submenu
//         // contactLink.querySelector('ul').style.display = 'block';  // Display submenu
//     });

//     document.querySelector('.mainHeader').addEventListener('mouseleave', hideSubMenus);
// }

// // Event listeners for mobile (click)
// function mobileEvents() {
//     const aboutLink = document.getElementById('aboutLink').parentElement;
//     const contactLink = document.getElementById('contactLink').parentElement;

//     document.getElementById('aboutLink').addEventListener('click', (e) => {
//         e.preventDefault();
//         toggleSubMenu(aboutLink, dynamicMainNavigationData.about);  // Toggle About submenu
//     });

//     document.getElementById('contactLink').addEventListener('click', (e) => {
//         e.preventDefault();
//         toggleSubMenu(contactLink, dynamicMainNavigationData.contact);  // Toggle Contact submenu
//     });

//     // Click anywhere outside to close
//     document.addEventListener('click', (e) => {
//         if (!e.target.closest('.mainNavigation')) {
//             hideSubMenus();  // Hide all submenus when clicking outside
//         }
//     });
// }

// // Function to set event listeners based on screen width
// function setEventsBasedOnScreenSize() {
//     const isMobile = window.innerWidth <= 768;

//     if (isMobile) {
//         mobileEvents();
//     } else {
//         desktopEvents();
//     }
// }

// // Reinitialize event listeners on window resize
// window.addEventListener('resize', () => {
//     hideSubMenus();  // Hide all menus before resetting
//     setEventsBasedOnScreenSize();  // Reset event listeners based on screen size
// });

// // Initialize with the correct event listeners on page load
// window.addEventListener('load', () => {
//     hideSubMenus();  // Initially hide all submenus
//     setEventsBasedOnScreenSize();  // Set up event listeners
// });

document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('mainHeader');

    window.addEventListener('scroll', () => {
        // Adjust the threshold value (e.g., 50px) for when the class is added
        if (window.scrollY > 50) {
            header.classList.add('mainHeader--scrolled');
        } else {
            header.classList.remove('mainHeader--scrolled');
        }
    });
});

const mainHeader = document.querySelector(".mainHeader");
const burgerMenuButton = document.querySelector(".mainHeader__burgerButtonBox");
const mainNavigation = document.querySelector(".mainHeader__navigation");

burgerMenuButton.addEventListener("click", function () {
    mainHeader.classList.toggle("mainHeader--menuOpened");
    burgerMenuButton.classList.toggle("opened");
    mainNavigation.classList.toggle("show");
});