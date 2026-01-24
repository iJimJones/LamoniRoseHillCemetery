// Simple HTML include loader for static sites
(function() {
    function loadIncludes() {
        // Find all elements with data-include attribute
        const includes = document.querySelectorAll('[data-include]');
        
        includes.forEach(function(element) {
            const file = element.getAttribute('data-include');
            const xhr = new XMLHttpRequest();
            
            xhr.open('GET', file, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        element.innerHTML = xhr.responseText;
                    } else {
                        console.error('Failed to load include: ' + file);
                    }
                }
            };
            xhr.send();
        });
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadIncludes);
    } else {
        loadIncludes();
    }
})();
