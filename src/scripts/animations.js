// Initialize scramble animation after DOM and GSAP are ready
function initScrambleAnimation() {
    // Wait for GSAP to be available
    if (typeof gsap === 'undefined') {
        setTimeout(initScrambleAnimation, 50);
        return;
    }

    const animation = gsap.timeline({id:"ScrambleText" });
    const items = gsap.utils.toArray(".scrambled");
    
    if (items.length === 0) {
        console.warn("No elements with class 'scrambled' found");
        return;
    }
    
    items.forEach((element, index) => {
        let text = element.innerText; // grab text from ".scrambled"
        element.innerText = ""; // clear text from ".scrambled"
        let tl = gsap.timeline()
            .to(element, {duration:0.01, opacity: 1 })
            .to(element, {
                duration: 1,
                ease:"none",
                scrambleText: {
                    text: text
                }
            }, "<");
        animation.add(tl, index * 0.2);
    });
}


// Initialize bouncing arrow animation
function initBouncingArrow() {
    // Wait for GSAP to be available
    if (typeof gsap === 'undefined') {
        setTimeout(initBouncingArrow, 50);
        return;
    }
    
    const arrow = document.getElementById('bouncing-arrow');
    if (!arrow) {
        console.warn("Bouncing arrow element not found");
        return;
    }
    
    // Hide arrow initially
    arrow.style.opacity = 0;
    
    // Create bouncing animation timeline
    const bounceAnimation = gsap.timeline({ repeat: -1, repeatDelay: 1, paused: true, delay: 10});
    bounceAnimation
    .to(arrow, {opacity: 1, duration: 0})
    .to(arrow, {
        duration: 0.8,
        y: -10,
        ease: "power2.out"
    })
    .to(arrow, {
        duration: 0.8,
        y: 0,
        ease: "power1.in"
    });
    
    // Function to check scroll position and toggle arrow visibility
    function checkScrollPosition() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const isAtTop = scrollTop < 50; // Show arrow when within 50px of top
        
        if (isAtTop) {
            bounceAnimation.play();
        } else {
            arrow.style.opacity = 0;
            bounceAnimation.pause();
        }
    }
    
    // Check initial scroll position
    checkScrollPosition();
    
    // Listen for scroll events
    window.addEventListener('scroll', checkScrollPosition, { passive: true });
}

// Initialize scramble animation after DOM and GSAP are ready
function initTitleAnimation() {
    // Wait for GSAP to be available
    if (typeof gsap === 'undefined') {
        setTimeout(initTitleAnimation, 50);
        return;
    }

    const animation = gsap.timeline({id:"TitleAnimation" });
    const title = document.getElementById('title');
    
    if (title === null) {
        console.warn("Title element not found");
        return;
    }
    
    let tl = gsap.timeline()
        .to(title, {
            duration: 1,
            ease:"none",
        }, "<");
}

// initialize animations
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrambleAnimation);
} else {
    setTimeout(initScrambleAnimation, 100);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBouncingArrow);
} else {
    setTimeout(initBouncingArrow, 100);
}

