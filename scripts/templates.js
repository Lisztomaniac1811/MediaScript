function parseInfoboxEpisode(text, variableName, variableValue) {
    // Regular expression to match all occurrences of the infobox and its contents
    const infoboxPattern = /\{\{Infobox Episode\s+([\s\S]*?)\}\}/g;
    const keyValuePattern = /\|([^=\|\r\n]+)\s*=\s*([^\|\r\n]*)/g;
    let resultHTML = '';

    let infoboxMatch;
    while ((infoboxMatch = infoboxPattern.exec(text)) !== null) {
        const infoboxContent = infoboxMatch[1];
        let match;
        const values = {};
        while ((match = keyValuePattern.exec(infoboxContent)) !== null) {
            const key = match[1].trim();
            const value = match[2].trim();
            values[key] = value;
        }

        // Determine the default title from the external variable if provided
        let pageTitle = 'No Title';
        if (variableName === 'title' && variableValue) {
            pageTitle = variableValue;
        }

        // Extract values with default values if missing
        const {
            title = pageTitle,
            image = '',
            caption = '',
            season = '',
            episodeno = '',
            airdate = '',
            writer = '',
            director = '',
            previous = '',
            next = ''
        } = values;

        // Check if there are any values for "Episode Information" and "Episode Chronology" subsections
        const hasEpisodeInfo = season || episodeno || airdate || writer || director;
        const hasEpisodeChronology = previous || next;

        // Build HTML
        let infoboxHTML = `
            <aside class="infobox-episode">
                <h2 class="infobox-title">${title}</h2>
                ${image ? `<img src="images/resized/800px/${image}" alt="${caption}">` : ''}
        `;

        // Episode Information Section
        if (hasEpisodeInfo) {
            infoboxHTML += `
                <h2 class="infobox-subtitle">Episode Information</h2>
                <section>
                    <table>
                        <tbody>
                            <tr>
                                <td><a href="Season_${season}.html" title="Season ${season}">Season ${season}</a></td>
                                <td>Episode ${episodeno}</td>
                            </tr>
                        </tbody>
                    </table>
                    ${airdate ? `<div class="infobox-item"><h3>Airdate:</h3><div class="infobox-value">${airdate}</div></div>` : ''}
                    ${writer ? `<div class="infobox-item"><h3>Writer:</h3><div class="infobox-value">${writer.replace(/<br\s*\/?>/g, ', ')}</div></div>` : ''}
                    ${director ? `<div class="infobox-item"><h3>Director:</h3><div class="infobox-value">${director}</div></div>` : ''}
                </section>
            `;
        }

        // Episode Chronology Section
        if (hasEpisodeChronology) {
            infoboxHTML += `<h2 class="infobox-subtitle">Episode Chronology</h2><section><table><thead><tr>`;

            // Determine if we should display one or both columns
            if (previous && next) {
                infoboxHTML += `<th>← Previous</th><th>Next →</th></tr></thead><tbody><tr>`;
                infoboxHTML += `<td>${previous}</td><td>${next}</td>`;
            } else if (previous) {
                infoboxHTML += `<th colspan="2">← Previous</th></tr></thead><tbody><tr>`;
                infoboxHTML += `<td colspan="2">${previous}</td>`;
            } else if (next) {
                infoboxHTML += `<th colspan="2">Next →</th></tr></thead><tbody><tr>`;
                infoboxHTML += `<td colspan="2">${next}</td>`;
            }

            infoboxHTML += `</tr></tbody></table></section>`;
        }

        infoboxHTML += `</aside>`;
        resultHTML += infoboxHTML;
    }

    return resultHTML;
}


// Infobox Character

function parseInfoboxCharacter(text, variableName, variableValue) {
    // Regular expression to match all occurrences of the infobox and its contents
    const infoboxPattern = /\{\{Infobox Character\s+([\s\S]*?)\}\}/g;
    const keyValuePattern = /\|([^=\|\r\n]+)\s*=\s*([^\|\r\n]*)/g;
    let resultHTML = '';

    let infoboxMatch;
    while ((infoboxMatch = infoboxPattern.exec(text)) !== null) {
        const infoboxContent = infoboxMatch[1];
        let match;
        const values = {};
        while ((match = keyValuePattern.exec(infoboxContent)) !== null) {
            const key = match[1].trim();
            const value = match[2].trim();
            values[key] = value;
        }

        // Determine the default title from the external variable if provided
        let pageTitle = 'No Title';
        if (variableName === 'name' && variableValue) {
            pageTitle = variableValue;
        }

        // Extract values with default values if missing
        const {
            name = pageTitle,
            image = '',
            imagecaption = '',
            aliases = '',
            significant = '',
            family = '',
            profession = '',
            allies = '',
            marital = '',
            born = '',
            birthPlace = '',
            died = '',
            deathPlace = '',
            CauseofDeath = '',
            home = '',
            age = '',
            status = '',
            species = '',
            gender = '',
            height = '',
            weight = '',
            eyes = '',
            actor = '',
            onlyappearance = '',
            first = '',
            last = ''
        } = values;

        // Build HTML
        let infoboxHTML = `
            <aside class="infobox-character">
                <h2 class="infobox-title">${name}</h2>
                ${image ? `<img src="images/resized/800px/${image}" alt="${imagecaption}">` : ''}
        `;

        // Biographical Information Section
        let hasBiographicalInfo = aliases || significant || family || profession || home || age;
        if (hasBiographicalInfo) {
            infoboxHTML += `
                <h2 class="infobox-subtitle">Biographical Information</h2>
                <section>
                    ${aliases ? `<div class="infobox-item"><h3>Aliases:</h3><div class="infobox-value">${aliases}</div></div>` : ''}
                    ${marital ? `<div class="infobox-item"><h3>Marital Status:</h3><div class="infobox-value">${marital}</div></div>` : ''}
                    ${born ? `<div class="infobox-item"><h3>Date of Birth:</h3><div class="infobox-value">${born}</div></div>` : ''}
                    ${birthPlace ? `<div class="infobox-item"><h3>Place of Birth:</h3><div class="infobox-value">${birthPlace}</div></div>` : ''}
                    ${home ? `<div class="infobox-item"><h3>Home:</h3><div class="infobox-value">${home}</div></div>` : ''}
                    ${age ? `<div class="infobox-item"><h3>Age:</h3><div class="infobox-value">${age}</div></div>` : ''}
                </section>
            `;
        }

        // Fate Section
        let hasFateInfo = status || died || deathPlace || CauseofDeath;
        if (hasFateInfo) {
            infoboxHTML += `
                <h2 class="infobox-subtitle">Fate</h2>
                <section>
                    ${status ? `<div class="infobox-item"><h3>Status:</h3><div class="infobox-value">${status}</div></div>` : ''}
                    ${died ? `<div class="infobox-item"><h3>Date of Death:</h3><div class="infobox-value">${died}</div></div>` : ''}
                    ${deathPlace ? `<div class="infobox-item"><h3>Place of Death:</h3><div class="infobox-value">${deathPlace}</div></div>` : ''}
                    ${CauseofDeath ? `<div class="infobox-item"><h3>Cause of Death:</h3><div class="infobox-value">${CauseofDeath}</div></div>` : ''}
                </section>
            `;
        }

        // Relationships Section
        let hasRelationshipsInfo = family || significant || allies;
        if (hasRelationshipsInfo) {
            infoboxHTML += `
                <h2 class="infobox-subtitle">Relationships</h2>
                <section>
                    ${family ? `<div class="infobox-item"><h3>Relatives:</h3><div class="infobox-value">${family}</div></div>` : ''}
                    ${significant ? `<div class="infobox-item"><h3>Significant Other(s):</h3><div class="infobox-value">${significant}</div></div>` : ''}
                    ${allies ? `<div class="infobox-item"><h3>Allies:</h3><div class="infobox-value">${allies}</div></div>` : ''}
                </section>
            `;
        }

        // Physical Description Section
        let hasPhysicalDescriptionInfo = species || gender || height || weight || eyes;
        if (hasPhysicalDescriptionInfo) {
            infoboxHTML += `
                <h2 class="infobox-subtitle">Physical Description</h2>
                <section>
                    ${species ? `<div class="infobox-item"><h3>Species:</h3><div class="infobox-value">${species}</div></div>` : ''}
                    ${gender ? `<div class="infobox-item"><h3>Gender:</h3><div class="infobox-value">${gender}</div></div>` : ''}
                    ${height ? `<div class="infobox-item"><h3>Height:</h3><div class="infobox-value">${height}</div></div>` : ''}
                    ${weight ? `<div class="infobox-item"><h3>Weight:</h3><div class="infobox-value">${weight}</div></div>` : ''}
                    ${eyes ? `<div class="infobox-item"><h3>Eye Color:</h3><div class="infobox-value">${eyes}</div></div>` : ''}
                </section>
            `;
        }

        // Appearances Section
        let hasAppearancesInfo = actor || onlyappearance || first || last;
        if (hasAppearancesInfo) {
            infoboxHTML += `
                <h2 class="infobox-subtitle">Appearances</h2>
                <section>
                    ${actor ? `<div class="infobox-item"><h3>Portrayed by:</h3><div class="infobox-value">${actor}</div></div>` : ''}
                    ${onlyappearance ? `<div class="infobox-item"><h3>Appears in:</h3><div class="infobox-value">${onlyappearance}</div></div>` : ''}
                    <h3>Appearances:</h3>
                    <table>
                        <thead><tr>
                            ${first ? `<th>First Appearance</th>` : ''}
                            ${last ? `<th>Last Appearance</th>` : ''}
                        </tr></thead>
                        <tbody><tr>
                            ${first ? `<td>${first}</td>` : `<td colspan="2">${last}</td>`}
                            ${last ? `<td>${last}</td>` : ''}
                        </tr></tbody>
                    </table>
                </section>
            `;
        }

        infoboxHTML += `</aside>`;
        resultHTML += infoboxHTML;
    }

    return resultHTML;
}
