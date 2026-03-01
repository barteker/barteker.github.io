document.addEventListener('DOMContentLoaded', () => {
    const textPath = document.querySelector('.title-svg textPath');
    const svg = document.querySelector('.title-svg');
    if (!textPath || !svg) return;

    function updateTextPosition() {
        const scrollDistance = 600;
        const scrollPercent = Math.min((window.scrollY / scrollDistance) * 100, 60);
        textPath.setAttribute('startOffset', `${scrollPercent}%`);
    }

    window.addEventListener('scroll', updateTextPosition);
    updateTextPosition();
}); 

