document.addEventListener('DOMContentLoaded', () => {

    
    const textPath = document.querySelector('.title-svg textPath');
    const svg = document.querySelector('.title-svg');
    
    function updateTextPosition() {
        // Use a fixed scroll distance (e.g., 1000px) instead of percentage
        const scrollDistance = 600; // pixels to scroll for full animation
        const scrollPercent = Math.min((window.scrollY / scrollDistance) * 100, 60);
        textPath.setAttribute('startOffset', `${scrollPercent}%`);
    }

    window.addEventListener('scroll', updateTextPosition);
    updateTextPosition(); // Initial position
}); 

