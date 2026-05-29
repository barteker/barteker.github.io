document.addEventListener('DOMContentLoaded', () => {
    initVideoPreviews();
    initMultiImageVariantPreviews();
});

function initVideoPreviews() {
    document.querySelectorAll('.video-preview-item').forEach(item => {
        const video = item.querySelector('.hover-preview');
        if (!video) return;

        item.addEventListener('mouseenter', () => {
            video.play();
        });

        item.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    });
}

function initMultiImageVariantPreviews() {
    document.querySelectorAll('.multi-image-variant-preview').forEach(item => {
        const image = item.querySelector('img');
        if (!image) return;

        const defaultSrc = item.dataset.defaultSrc || image.getAttribute('src');
        const variants = (item.dataset.variantSrcs || '')
            .split(',')
            .map(src => src.trim())
            .filter(Boolean);
        const intervalMs = Number(item.dataset.variantInterval) || 500;

        if (!defaultSrc || variants.length < 2) return;

        variants.forEach(src => {
            const preload = new Image();
            preload.src = src;
        });

        let variantIndex = 0;
        let cycleId;

        const showNextVariant = () => {
            variantIndex = (variantIndex + 1) % variants.length;
            image.src = variants[variantIndex];
        };

        item.addEventListener('mouseenter', () => {
            showNextVariant();
            cycleId = window.setInterval(showNextVariant, intervalMs);
        });

        item.addEventListener('mouseleave', () => {
            window.clearInterval(cycleId);
            variantIndex = 0;
            image.src = defaultSrc;
        });
    });
}
