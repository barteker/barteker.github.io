/**
 * Inject this script once; it renders the nav based on the current path.
 */
(function () {
    // Array of nav items, in order top to bottom
    var navItems = [
        { label: 'HOME', path: '', section: 'home' },
        { label: 'VISUAL', path: 'visual/', section: 'visual' },
        { label: 'WEB', path: 'web/', section: 'web' },
        { label: 'AUDIO', path: 'audio/', section: 'audio' },
        { label: 'ABOUT', path: 'about/', section: 'about' }
    ];

    // Get the current pathname
    var pathname = (typeof window !== 'undefined' && window.location && window.location.pathname) ? window.location.pathname : '';
    // Split the pathname into segments
    var pathSegments = pathname.replace(/^\//, '').replace(/\/$/, '').split('/').filter(Boolean);
    // If the last segment is 'index.html', remove it
    if (pathSegments[pathSegments.length - 1] === 'index.html') {
        pathSegments.pop();
    }
    // Get the depth of the path
    var depth = pathSegments.length;
    // Get the current section
    var currentSection = pathSegments[0] || 'home';
    // Get the base path
    var base = depth > 0 ? Array(depth + 1).join('../') : '';
    // Create the ul element

    var ul = document.createElement('ul');
    ul.setAttribute('role', 'menubar');

    // Loop through the nav items
    navItems.forEach(function (item) {
        var isActive = item.section === currentSection;
        var href;
        // If the item is active, set the href to the base path
        if (isActive) {
            href = depth <= 1 ? './' : '../';
        } else {
            // If the item is not active, set the href to the base path
            if (item.section === 'home') {
                href = base || './';
            } else {
                // If the item is not active and not the home section, set the href to the base path and the item path
                href = base + item.path;
            }
        }
        var li = document.createElement('li');
        li.setAttribute('role', 'none');
        var a = document.createElement('a');
        a.setAttribute('href', href);
        a.setAttribute('role', 'menuitem');
        a.textContent = item.label;
        if (isActive) {
            a.className = 'active';
        } else {
            a.className = 'scrambled';
        }
        li.appendChild(a);
        ul.appendChild(li);
    });

    var el = document.getElementById('site-nav');
    if (el) {
        el.appendChild(ul);
    }
})();
