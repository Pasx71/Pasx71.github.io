// info-page-loader.js
document.addEventListener('DOMContentLoaded', () => {
    function populateBlurbList(containerId, blurbsObject, objectTitle) {
        const container = document.getElementById(containerId);
        if (container && typeof blurbsObject === 'object' && blurbsObject !== null) {
            const ul = document.createElement('ul');
            for (const name in blurbsObject) {
                if (blurbsObject.hasOwnProperty(name)) {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${name}:</strong> ${blurbsObject[name]}`;
                    ul.appendChild(li);
                }
            }
            container.appendChild(ul);
        } else {
            if (container) container.innerHTML = `<p><em>Content for ${objectTitle || 'this section'} is currently unavailable. Ensure data.js is loaded and correct.</em></p>`;
            console.error(`Could not populate ${containerId} or ${objectTitle} blurbsObject was invalid/missing.`);
        }
    }

    // For archetypes.html
    if (document.getElementById('prefix-list-container')) {
        populateBlurbList('prefix-list-container', (typeof PREFIX_MODIFIERS_BLURBS !== 'undefined' ? PREFIX_MODIFIERS_BLURBS : null), 'Prefix Modifiers');
    }
    if (document.getElementById('core-list-container')) {
        populateBlurbList('core-list-container', (typeof CORE_PERSONALITIES_BLURBS !== 'undefined' ? CORE_PERSONALITIES_BLURBS : null), 'Core Personalities');
    }
    if (document.getElementById('suffix-list-container')) {
        populateBlurbList('suffix-list-container', (typeof SUFFIX_MODIFIERS_BLURBS !== 'undefined' ? SUFFIX_MODIFIERS_BLURBS : null), 'Suffix Modifiers');
    }
    if (document.getElementById('part4-list-container')) {
        populateBlurbList('part4-list-container', (typeof PART4_QUALIFIERS_BLURBS !== 'undefined' ? PART4_QUALIFIERS_BLURBS : null), 'Part 4 Qualifiers');
    }

    // For factors.html
    const factorsContainer = document.getElementById('factors-list-container');
    if (factorsContainer && (typeof TRAIT_DESCRIPTIONS === 'object' && TRAIT_DESCRIPTIONS !== null) && (typeof ALL_SCORABLE_AXES_DEFINITIONS === 'object' && ALL_SCORABLE_AXES_DEFINITIONS !== null)) {
        const ul = document.createElement('ul');
        // Iterate in the order of PERSONALITY_CODE_AXES_ORDER for consistency
        if (typeof PERSONALITY_CODE_AXES_ORDER !== 'undefined' && Array.isArray(PERSONALITY_CODE_AXES_ORDER)) {
            PERSONALITY_CODE_AXES_ORDER.forEach(traitCode => {
                if (TRAIT_DESCRIPTIONS.hasOwnProperty(traitCode)) {
                    const traitData = TRAIT_DESCRIPTIONS[traitCode];
                    const traitFullName = ALL_SCORABLE_AXES_DEFINITIONS[traitCode] || traitCode;

                    const li = document.createElement('li');
                    li.innerHTML = `<h3>${traitFullName} (${traitCode.toUpperCase()})</h3>
                                    <p><strong>High:</strong> ${traitData.High || 'N/A'}</p>
                                    <p><strong>Moderate:</strong> ${traitData.Moderate || 'N/A'}</p>
                                    <p><strong>Low:</strong> ${traitData.Low || 'N/A'}</p>`;
                    ul.appendChild(li);
                }
            });
        } else {
            // Fallback if PERSONALITY_CODE_AXES_ORDER is not available
            for (const traitCode in TRAIT_DESCRIPTIONS) {
                 if (TRAIT_DESCRIPTIONS.hasOwnProperty(traitCode)) {
                    const traitData = TRAIT_DESCRIPTIONS[traitCode];
                    const traitFullName = ALL_SCORABLE_AXES_DEFINITIONS[traitCode] || traitCode;
                    const li = document.createElement('li');
                    li.innerHTML = `<h3>${traitFullName} (${traitCode.toUpperCase()})</h3>
                                    <p><strong>High:</strong> ${traitData.High || 'N/A'}</p>
                                    <p><strong>Moderate:</strong> ${traitData.Moderate || 'N/A'}</p>
                                    <p><strong>Low:</strong> ${traitData.Low || 'N/A'}</p>`;
                    ul.appendChild(li);
                }
            }
        }
        factorsContainer.appendChild(ul);
    } else {
        if (factorsContainer) factorsContainer.innerHTML = "<p><em>Factor descriptions are currently unavailable. Ensure data.js is loaded and TRAIT_DESCRIPTIONS is defined correctly.</em></p>";
        console.error("Could not populate factors-list-container or TRAIT_DESCRIPTIONS/ALL_SCORABLE_AXES_DEFINITIONS missing.");
    }
});
