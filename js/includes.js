// Simple HTML include loader for static sites
(function() {
    // Calculate relative path from current page to root
    function getBasePath() {
        // Determine depth by looking at how the includes.js script was loaded
        // This is more reliable than parsing window.location.pathname
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            const script = scripts[i];
            // Check both src attribute and if it's the current script
            const src = script.src || (script.getAttribute && script.getAttribute('src'));
            if (src && src.includes('includes.js')) {
                // Extract the relative path to the script
                // If script src is "../js/includes.js", we're 1 level deep
                // If script src is "js/includes.js", we're at root
                if (src.includes('../js/includes.js') || 
                    (script.getAttribute && script.getAttribute('src') === '../js/includes.js')) {
                    return '../';
                }
                if (src.includes('../../js/includes.js') || 
                    (script.getAttribute && script.getAttribute('src') === '../../js/includes.js')) {
                    return '../../';
                }
                // If it's just "js/includes.js" or ends with "/js/includes.js", we're at root
                if (src.includes('/js/includes.js') && !src.includes('../')) {
                    return '';
                }
            }
        }
        
        // Fallback: try to determine from window.location.pathname
        const path = window.location.pathname;
        if (path && path !== '/') {
            const parts = path.split('/').filter(p => p && p !== '');
            const dirs = parts.filter(p => !p.endsWith('.html'));
            const depth = dirs.length;
            return depth > 0 ? '../'.repeat(depth) : '';
        }
        
        return '';
    }
    
    function injectHeadElements() {
        // Automatically inject common head elements if they don't already exist
        const head = document.querySelector('head');
        if (!head) return;
        
        const basePath = getBasePath();
        
        // Check if charset meta already exists
        if (!head.querySelector('meta[charset]')) {
            const charset = document.createElement('meta');
            charset.setAttribute('charset', 'utf-8');
            head.insertBefore(charset, head.firstChild);
        }
        
        // Check if CSS link already exists
        if (!head.querySelector('link[href*="rosehill.css"]')) {
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = basePath + 'rosehill.css';
            head.appendChild(cssLink);
        }
        
        // Note: includes.js script is already loaded, so we don't need to inject it
    }
    
    function fixPaths(html, basePath) {
        // Fix paths in included content to be relative to the current page
        // This handles cases where includes have paths like "icons/" or "../icons/"
        // Also handles template placeholders like {{ICON_PATH}}, {{BASE_PATH}}, and {{POLICY_PATH}}
        
        // Replace template placeholders with actual paths
        const iconPath = basePath + 'icons/';
        html = html.replace(/\{\{ICON_PATH\}\}/g, iconPath);
        html = html.replace(/\{\{BASE_PATH\}\}/g, basePath);
        
        // POLICY_PATH is for links within the policies directory
        // If we're in the policies directory, it's empty (same directory)
        // Otherwise, it's basePath + "policies/"
        const policyPath = basePath === '../' ? '' : basePath + 'policies/';
        html = html.replace(/\{\{POLICY_PATH\}\}/g, policyPath);
        
        if (!basePath) {
            // If we're at root, ensure paths are correct (no change needed for root-level paths)
            // But still handle any ../ that might be in the template
            html = html.replace(/src="\.\.\/+icons\//g, `src="icons/`);
            html = html.replace(/href="\.\.\/+([^"]+\.html)"/g, `href="$1"`);
            return html;
        }
        
        // Replace relative paths that start with icons/ (from root perspective in template)
        html = html.replace(/src="icons\//g, `src="${iconPath}`);
        // Also handle any existing relative paths and normalize them
        html = html.replace(/src="\.\.\/+icons\//g, `src="${iconPath}`);
        
        // Fix HTML file links that don't have relative paths
        // Match href="filename.html" (not starting with ../ or http)
        html = html.replace(/href="([^"\/\.]+\.html)"/g, `href="${basePath}$1"`);
        // Also handle links that already have ../ but need adjustment
        html = html.replace(/href="\.\.\/+([^"]+\.html)"/g, function(match, filename) {
            // Count how many ../ are in the match
            const depth = (match.match(/\.\.\//g) || []).length;
            const currentDepth = (basePath.match(/\.\.\//g) || []).length;
            // If depths don't match, adjust
            if (depth !== currentDepth) {
                return `href="${basePath}${filename}"`;
            }
            return match;
        });
        
        return html;
    }
    
    function createPdfButtons() {
        // Find all elements with data-pdf attribute and create PDF buttons
        const pdfElements = document.querySelectorAll('[data-pdf]');
        const basePath = getBasePath();
        
        pdfElements.forEach(function(element) {
            const pdfFilename = element.getAttribute('data-pdf');
            const pdfPath = basePath + '_archive_pdfs/' + pdfFilename;
            
            // Create the PDF button
            const button = document.createElement('a');
            button.href = pdfPath;
            button.target = '_blank';
            button.className = 'pdf-button';
            button.textContent = '📄 View/Download Original PDF';
            
            // Replace the element with the button
            element.parentNode.replaceChild(button, element);
        });
    }
    
    function loadIncludes() {
        // Inject common head elements first
        injectHeadElements();
        
        // Find all elements with data-include attribute
        const includes = document.querySelectorAll('[data-include]');
        const basePath = getBasePath();
        
        includes.forEach(function(element) {
            const file = element.getAttribute('data-include');
            const showPolicyNav = element.hasAttribute('data-show-policy-nav');
            const xhr = new XMLHttpRequest();
            
            xhr.open('GET', file, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        let content = xhr.responseText;
                        // Fix paths in the included content to be relative to current page
                        content = fixPaths(content, basePath);
                        element.innerHTML = content;
                        
                        // If this is nav.html and we need to show policy nav, make it visible
                        if (showPolicyNav && file.includes('nav.html')) {
                            const policyNav = element.querySelector('#policy-nav');
                            if (policyNav) {
                                policyNav.style.display = 'block';
                            }
                        }
                    } else {
                        console.error('Failed to load include: ' + file);
                    }
                }
            };
            xhr.send();
        });
        
        // Create PDF buttons after includes are loaded
        createPdfButtons();
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadIncludes);
    } else {
        loadIncludes();
    }
})();
