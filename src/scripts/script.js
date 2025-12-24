const fonts = [
    { name: 'Clash Grotesk', designer: 'Indian Type Foundry', foundry: 'Indian Type Foundry' },
    { name: 'Aktura', designer: 'Indian Type Foundry', foundry: 'Indian Type Foundry' },
    { name: 'Chillax', designer: 'Indian Type Foundry', foundry: 'Indian Type Foundry' },
    { name: 'Nippo', designer: 'Indian Type Foundry', foundry: 'Indian Type Foundry' },
    { name: 'Cabinet Grotesk', designer: 'Indian Type Foundry', foundry: 'Indian Type Foundry' },
    { name: 'PubliFluorChrystelise', designer: 'Chrystel Crickx', foundry: 'OSP Foundry' },
    { name: 'Sans Guilt Wafer', designer: 'OSP Foundry', foundry: 'OSP Foundry' },
    { name: 'Poppins', designer: 'Jonny Pinhorn & Ninad Kale', foundry: 'Indian Type Foundry' },
    { name: 'Terminal Grotesque', designer: 'Raphaël Bastide & Jérémy Landes', foundry: 'Use & Modify' },
    { name: 'Bocalupo', designer: 'Ambre Ruggeri', foundry: 'XCicéro' },
    { name: 'Young Serif', designer: 'Bastien Sozeau', foundry: 'upload.fr' },
    { name: 'Array', designer: 'Indian Type Foundry', foundry: 'Indian Type Foundry' },
    { name: 'jgs Font', designer: 'Adel Faure', foundry: 'Velvetyne' },
    { name: 'Basteleur', designer: 'Keussel', foundry: 'Velvetyne' },
    { name: 'Sage Grotesk', designer: 'Konrad Łukasiak', foundry: 'Typophobia Studio'}
];

const isMobile = window.matchMedia("(max-width: 768px)").matches;
let lastScrollPosition = 0;
let scrollTimeout;
let lastFontChange = Date.now();

let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

const title = document.querySelector('.title');
const credits = document.querySelector('.font-credits');
let currentFont = 0;
let fontInterval;
const baseSize = vw * 0.1; //matches font size of h1

title.addEventListener('mouseenter', () => {
    if (!isMobile) {  // Only run hover effect on desktop
        fontInterval = setInterval(() => {
            currentFont = (currentFont + 1) % fonts.length;
            updateFont();
        }, 100);
    }
});

title.addEventListener('mouseleave', () => {
    clearInterval(fontInterval);
    updateCredits();
});

function updateFont() {
    const font = fonts[currentFont];
    title.style.fontFamily = `${font.name}, sans-serif`;
    // fallback to prevent FOUT (Flash of Unstyled Text)
    if (!document.fonts.check(`1em "${font.name}"`)) {
        console.log(`Loading font: ${font.name}`);
    }
}

function updateCredits() {
    const font = fonts[currentFont];
    credits.textContent = `Currently using ${font.name} by ${font.designer} (${font.foundry})`;
}

function checkFontCreditsPosition() {
  // No need to toggle position anymore - keep it fixed
  if (isMobile) {
    const fontCredits = document.querySelector('.font-credits');
    fontCredits.style.position = 'fixed';
    fontCredits.style.top = '0';
  }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCredits();
    // Add lazy loading for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
        img.decoding = 'async';
    });

    // Preload and wait for all fonts to be ready
    Promise.all(fonts.map(font => document.fonts.load(`1em "${font.name}"`)))
        .then(() => {
            console.log('All fonts loaded and ready for animation');
        })
        .catch(error => {
            console.warn('Some fonts failed to load:', error);
        });

    // Handle resize events to update isMobile
    window.addEventListener('resize', () => {
        isMobile = window.matchMedia("(max-width: 768px)").matches;
    });

    // Initial check for font credits position
    checkFontCreditsPosition();

    // Set initial position for font credits
    if (isMobile) {
        const fontCredits = document.querySelector('.font-credits');
        fontCredits.style.position = 'fixed';
        fontCredits.style.top = '0';
    }
});

window.addEventListener('scroll', () => {
    if (isMobile) {
        clearTimeout(scrollTimeout);
        
        const currentTime = Date.now();
        const currentScroll = window.scrollY;
        
        // Only change font if enough time has passed
        if (currentTime - lastFontChange >= 100) {
            currentFont = (currentFont + 1) % fonts.length;
            updateFont();
            lastFontChange = currentTime;
        }
        
        lastScrollPosition = currentScroll;
        
        // Check font credits position during scroll
        checkFontCreditsPosition();
        
        scrollTimeout = setTimeout(() => {
            updateCredits();
        }, 150);
    }
});

