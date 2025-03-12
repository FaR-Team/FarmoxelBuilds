// Replace with your GitHub username and repo
const GITHUB_USER = 'FaR-Team';
const GITHUB_REPO = 'Project-FaR';
const GITHUB_API = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/releases`;

// Fetch releases from GitHub API
async function fetchReleases() {
    try {
        const response = await fetch(GITHUB_API);
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        const releases = await response.json();
        
        // Custom sorting for releases - Alphas from 0-0.97 first, then Betas
        releases.sort((a, b) => {
            const nameA = a.name || a.tag_name;
            const nameB = b.name || b.tag_name;
            
            // Check if Alpha or Beta
            const isAlphaA = nameA.toLowerCase().includes('alpha');
            const isAlphaB = nameB.toLowerCase().includes('alpha');
            const isBetaA = nameA.toLowerCase().includes('beta');
            const isBetaB = nameB.toLowerCase().includes('beta');
            
            // If both are Alpha or both are Beta, sort by version number
            if ((isAlphaA && isAlphaB) || (isBetaA && isBetaB)) {
                // Extract version numbers if possible
                const versionA = extractVersionNumber(nameA);
                const versionB = extractVersionNumber(nameB);
                if (versionA !== null && versionB !== null) {
                    return versionB - versionA; // Newer versions first
                }
                // Fall back to date sorting if version extraction fails
                return new Date(b.published_at) - new Date(a.published_at);
            }
            
            // Beta comes after Alpha
            if (isAlphaA && isBetaB) return 1;
            if (isBetaA && isAlphaB) return -1;
            
            // Alphas first (in reverse order, so newer alphas appear first)
            if (isAlphaA) return 1;
            if (isAlphaB) return -1;
            
            // Default to date-based sorting for non-alpha/beta
            return new Date(b.published_at) - new Date(a.published_at);
        });
        
        displayLatestRelease(releases[0]);
        displayReleaseArchive(releases);
    } catch (error) {
        console.error('Error fetching releases:', error);
        document.getElementById('latest-release-content').innerHTML = 
            `<div class="error"><i class="fas fa-exclamation-circle"></i> Failed to load releases. ${error.message}</div>`;
        document.getElementById('archive-content').innerHTML = 
            `<div class="error"><i class="fas fa-exclamation-circle"></i> Failed to load releases. ${error.message}</div>`;
    }
}

// Extract date from release name and clean up the name
function extractDateAndCleanName(releaseName) {
    const result = {
        name: releaseName,
        date: null
    };
    
    // Check if the release name contains a date in parentheses
    const dateMatch = releaseName.match(/\((\d{1,2}\/\d{1,2}\/\d{2,4})\)/);
    if (dateMatch && dateMatch[1]) {
        // Extract the date
        result.date = dateMatch[1];
        // Remove the date part from the name
        result.name = releaseName.replace(/\s*\(\d{1,2}\/\d{1,2}\/\d{2,4}\)/, '').trim();
    }
    
    return result;
}

// Fetch releases from GitHub API
async function fetchReleases() {
    try {
        const response = await fetch(GITHUB_API);
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        const releases = await response.json();
    
        // Custom sorting for releases - Alphas from 0-0.97 first, then Betas
        releases.sort((a, b) => {
            const nameA = a.name || a.tag_name;
            const nameB = b.name || b.tag_name;
        
            // Check if Alpha or Beta
            const isAlphaA = nameA.toLowerCase().includes('alpha');
            const isAlphaB = nameB.toLowerCase().includes('alpha');
            const isBetaA = nameA.toLowerCase().includes('beta');
            const isBetaB = nameB.toLowerCase().includes('beta');
        
            // If both are Alpha or both are Beta, sort by version number
            if ((isAlphaA && isAlphaB) || (isBetaA && isBetaB)) {
                // Extract version numbers if possible
                const versionA = extractVersionNumber(nameA);
                const versionB = extractVersionNumber(nameB);
                if (versionA && versionB) {
                    // Compare each part of the version number
                    return compareVersions(versionB, versionA); // Newer versions first
                }
                // Fall back to date sorting if version extraction fails
                return new Date(b.published_at) - new Date(a.published_at);
            }
        
            // Beta comes after Alpha
            if (isAlphaA && isBetaB) return 1;
            if (isBetaA && isAlphaB) return -1;
        
            // Alphas first (in reverse order, so newer alphas appear first)
            if (isAlphaA) return 1;
            if (isAlphaB) return -1;
        
            // Default to date-based sorting for non-alpha/beta
            return new Date(b.published_at) - new Date(a.published_at);
        });
    
        displayLatestRelease(releases[0]);
        displayReleaseArchive(releases);
    } catch (error) {
        console.error('Error fetching releases:', error);
        document.getElementById('latest-release-content').innerHTML = 
            `<div class="error"><i class="fas fa-exclamation-circle"></i> Failed to load releases. ${error.message}</div>`;
        document.getElementById('archive-content').innerHTML = 
            `<div class="error"><i class="fas fa-exclamation-circle"></i> Failed to load releases. ${error.message}</div>`;
    }
}

// Extract date from release name and clean up the name
function extractDateAndCleanName(releaseName) {
    const result = {
        name: releaseName,
        date: null
    };

    // Check if the release name contains a date in parentheses
    const dateMatch = releaseName.match(/\((\d{1,2}\/\d{1,2}\/\d{2,4})\)/);
    if (dateMatch && dateMatch[1]) {
        // Extract the date
        result.date = dateMatch[1];
        // Remove the date part from the name
        result.name = releaseName.replace(/\s*\(\d{1,2}\/\d{1,2}\/\d{2,4}\)/, '').trim();
    }

    return result;
}

// Extract version number from a release name as an array of numbers
function extractVersionNumber(name) {
    const match = name.match(/(\d+(\.\d+)*)/);
    if (match && match[1]) {
        // Split by dots and convert each part to a number
        return match[1].split('.').map(part => parseInt(part, 10));
    }
    return null;
}

// Compare two version arrays (e.g. [0,0,36] > [0,0,34])
function compareVersions(versionA, versionB) {
    // Compare each segment of the version number
    for (let i = 0; i < Math.max(versionA.length, versionB.length); i++) {
        // If versionA doesn't have this segment, treat as 0
        const partA = i < versionA.length ? versionA[i] : 0;
        // If versionB doesn't have this segment, treat as 0
        const partB = i < versionB.length ? versionB[i] : 0;
    
        if (partA > partB) return 1;  // versionA is greater
        if (partA < partB) return -1; // versionB is greater
    }
    return 0; // versions are equal
}

// Display the latest release
function displayLatestRelease(release) {
    if (!release) {
        document.getElementById('latest-release-content').innerHTML = 
            '<div class="error"><i class="fas fa-exclamation-circle"></i> No releases found.</div>';
        return;
    }

    // Process release name and extract date if present
    const originalName = release.name || `v${release.tag_name}`;
    const { name: cleanName, date: extractedDate } = extractDateAndCleanName(originalName);
    
    // Use extracted date if available, otherwise use the published date
    const releaseDate = extractedDate || new Date(release.published_at).toLocaleDateString();
    
    let mainAsset = null;
    
    // Find the main asset (assuming it's the first or looking for specific file extensions)
    if (release.assets && release.assets.length > 0) {
        mainAsset = release.assets[0]; // Default to first asset
        
        // Optionally prioritize specific file types
        for (const asset of release.assets) {
            if (asset.name.endsWith('.zip') || asset.name.endsWith('.exe')) {
                mainAsset = asset;
                break;
            }
        }
    }

    let html = `
        <h3>${cleanName}</h3>
        <p><i class="far fa-calendar-alt"></i> Released on ${releaseDate}</p>
    `;

    if (mainAsset) {
        html += `
            <a href="${mainAsset.browser_download_url}" class="download-btn">
                <i class="fas fa-download"></i> Download ${mainAsset.name} (${formatFileSize(mainAsset.size)})
            </a>
        `;
    } else {
        html += '<p>No downloadable files found in this release.</p>';
    }

    if (release.body) {
        html += `
            <div class="release-notes">
                <h4><i class="fas fa-clipboard-list"></i> Release Notes:</h4>
                <p>${formatReleaseNotes(release.body)}</p>
            </div>
        `;
    }

    document.getElementById('latest-release-content').innerHTML = html;
}

// Display archive of previous releases
function displayReleaseArchive(releases) {
    if (!releases || releases.length === 0) {
        document.getElementById('archive-content').innerHTML = 
            '<div class="error"><i class="fas fa-exclamation-circle"></i> No releases found.</div>';
        return;
    }

    let html = '<ul class="release-list">';
    
    // Skip the first release if there are more than one (as it's already displayed as latest)
    const startIndex = releases.length > 1 ? 1 : 0;
    
    for (let i = startIndex; i < releases.length; i++) {
        const release = releases[i];
        
        // Process release name and extract date if present
        const originalName = release.name || `v${release.tag_name}`;
        const { name: cleanName, date: extractedDate } = extractDateAndCleanName(originalName);
        
        // Use extracted date if available, otherwise use the published date
        const releaseDate = extractedDate || new Date(release.published_at).toLocaleDateString();
        
        let mainAsset = null;
        if (release.assets && release.assets.length > 0) {
            mainAsset = release.assets[0];
        }

        html += `
            <li class="release-item">
                <div class="release-info">
                    <div class="release-title">${cleanName}</div>
                    <div class="release-date"><i class="far fa-calendar-alt"></i> ${releaseDate}</div>
                </div>
        `;

        if (mainAsset) {
            html += `
                <a href="${mainAsset.browser_download_url}" class="release-download">
                    <i class="fas fa-download"></i> Download ${formatFileSize(mainAsset.size)}
                </a>
            `;
        }

        html += '</li>';
    }

    html += '</ul>';
    document.getElementById('archive-content').innerHTML = html;
}

// Format file size to human-readable format
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format release notes (simple conversion of markdown line breaks to HTML)
function formatReleaseNotes(notes) {
    if (!notes) return '';
    return notes
        .replace(/\r\n/g, '<br>')
        .replace(/\n/g, '<br>');
}

// Load releases when the page loads
document.addEventListener('DOMContentLoaded', fetchReleases);
