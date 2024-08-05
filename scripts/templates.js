function parseInfoboxEpisode(text, variableName, variableValue) {
    // Regular expression to match all occurrences of the infobox and its contents
    const infoboxPattern = /\{\{Infobox Episode\s+([\s\S]*?)\}\}/g;
    const keyValuePattern = /\|([^=\|\r\n]+)\s*=\s*([^\|\r\n]*)/g;

    // This will hold the updated text with infoboxes replaced by HTML
    let resultHTML = text;

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

        // Replace the infobox in the original text with the generated HTML
        resultHTML = resultHTML.replace(infoboxMatch[0], infoboxHTML);
    }

    return resultHTML;
}



// Infobox Character

function parseInfoboxCharacter(text, variableName, variableValue) {
    // Regular expression to match all occurrences of the infobox and its contents
    const infoboxPattern = /\{\{Infobox Character\s+([\s\S]*?)\}\}/g;
    const keyValuePattern = /\|([^=\|\r\n]+)\s*=\s*([^\|\r\n]*)/g;
    let resultHTML = '';
    let lastIndex = 0; // To keep track of the position of the last matched infobox

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
            others = '',
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

        // Check if there are any values for various sections
        const hasBiographicalInfo = aliases || marital || born || birthPlace || home || age;
        const hasFate = status || died || deathPlace || CauseofDeath;
        const hasRelationships = family || significant || allies;
        const hasPhysicalDescription = species || gender || height || weight || eyes;
        const hasAppearances = actor || onlyappearance || first || last;

        // Build HTML for the infobox
        let infoboxHTML = `
            <aside class="infobox-character">
                <h2 class="infobox-title">${name}</h2>
                ${image ? `<img src="images/resized/800px/${image}" alt="${imagecaption}">` : ''}
        `;

        // Append sections if they have content
        if (hasBiographicalInfo) {
            infoboxHTML += `
                <h2 class="infobox-subtitle">Biographical Information</h2>
                <section>
                    ${aliases ? `<div class="infobox-item"><h3>Aliases:</h3><div class="infobox-value">${aliases}</div></div>` : ''}
                    ${marital ? `<div class="infobox-item"><h3>Marital status:</h3><div class="infobox-value">${marital}</div></div>` : ''}
                    ${born ? `<div class="infobox-item"><h3>Date of birth:</h3><div class="infobox-value">${born}</div></div>` : ''}
                    ${birthPlace ? `<div class="infobox-item"><h3>Place of birth:</h3><div class="infobox-value">${birthPlace}</div></div>` : ''}
                    ${home ? `<div class="infobox-item"><h3>Home:</h3><div class="infobox-value">${home}</div></div>` : ''}
                    ${age ? `<div class="infobox-item"><h3>Age:</h3><div class="infobox-value">${age}</div></div>` : ''}
                </section>
            `;
        }

        if (hasFate) {
            infoboxHTML += `
                <h2 class="infobox-subtitle">Fate</h2>
                <section>
                    ${status ? `<div class="infobox-item"><h3>Status:</h3><div class="infobox-value">${status}</div></div>` : ''}
                    ${died ? `<div class="infobox-item"><h3>Date of death:</h3><div class="infobox-value">${died}</div></div>` : ''}
                    ${deathPlace ? `<div class="infobox-item"><h3>Place of death:</h3><div class="infobox-value">${deathPlace}</div></div>` : ''}
                    ${CauseofDeath ? `<div class="infobox-item"><h3>Cause of death:</h3><div class="infobox-value">${CauseofDeath}</div></div>` : ''}
                </section>
            `;
        }

        if (hasRelationships) {
            infoboxHTML += `
                <h2 class="infobox-subtitle">Relationships</h2>
                <section>
                    ${family ? `<div class="infobox-item"><h3>Relatives:</h3><div class="infobox-value">${family}</div></div>` : ''}
                    ${significant ? `<div class="infobox-item"><h3>Significant Other(s):</h3><div class="infobox-value">${significant}</div></div>` : ''}
                    ${allies ? `<div class="infobox-item"><h3>Affiliation:</h3><div class="infobox-value">${allies}</div></div>` : ''}
                </section>
            `;
        }

        if (hasPhysicalDescription) {
            infoboxHTML += `
                <h2 class="infobox-subtitle">Physical Description</h2>
                <section>
                    ${species ? `<div class="infobox-item"><h3>Species:</h3><div class="infobox-value">${species}</div></div>` : ''}
                    ${gender ? `<div class="infobox-item"><h3>Gender:</h3><div class="infobox-value">${gender}</div></div>` : ''}
                    ${height ? `<div class="infobox-item"><h3>Height:</h3><div class="infobox-value">${height}</div></div>` : ''}
                    ${weight ? `<div class="infobox-item"><h3>Weight:</h3><div class="infobox-value">${weight}</div></div>` : ''}
                    ${eyes ? `<div class="infobox-item"><h3>Eye color:</h3><div class="infobox-value">${eyes}</div></div>` : ''}
                </section>
            `;
        }

        if (hasAppearances) {
            infoboxHTML += `
                <h2 class="infobox-subtitle">Appearances</h2>
                <section>
                    ${actor ? `<div class="infobox-item"><h3>Portrayed by:</h3><div class="infobox-value">${actor}</div></div>` : ''}
                    ${onlyappearance ? `<div class="infobox-item"><h3>Appears in:</h3><div class="infobox-value">${onlyappearance}</div></div>` : ''}
                    ${first ? `<div class="infobox-item"><h3>First appearance:</h3><div class="infobox-value">${first}</div></div>` : ''}
                    ${last ? `<div class="infobox-item"><h3>Last appearance:</h3><div class="infobox-value">${last}</div></div>` : ''}
                </section>
            `;
        }

        infoboxHTML += `</aside>`;
        resultHTML += infoboxHTML;
        
        // Track the end of the current infobox match
        lastIndex = infoboxPattern.lastIndex;
    }

    // Append any remaining text after the last infobox
    if (lastIndex < text.length) {
        resultHTML += text.slice(lastIndex);
    }

    return resultHTML;
}

// Function to parse references
function parseReferences(text) {
    // Regular expression to match the reference format {{ref|url|title|display}}
    const refPattern = /\{\{ref\|([^\|\}]+)\|([^\|\}]+)\|([^\}\}]+)\}\}/g;
    const refList = [];
    let resultText = '';
    let lastIndex = 0; // To keep track of the position of the last matched reference

    let match;
    let refCounter = 1; // Counter for generating reference numbers

    // Find all references and replace them with superscript numbers
    while ((match = refPattern.exec(text)) !== null) {
        const [fullMatch, url, title, display] = match;
        // Add reference to the list
        refList.push(`<li id="ref-${refCounter}"><a href="${url}" title="${title}">${display}</a> ${title ? `<i>${title}</i>` : ''} <a href="#ref-link-${refCounter}" class="back-to-text">↑</a></li>`);
        // Replace reference with square bracketed number
        resultText += text.slice(lastIndex, match.index) + `<sup><a id="ref-link-${refCounter}" href="#ref-${refCounter}">[${refCounter}]</a></sup>`;
        lastIndex = refPattern.lastIndex;
        refCounter++;
    }

    // Append any remaining text after the last reference
    resultText += text.slice(lastIndex);

    // Create the references section if {{references}} is found
    resultText = resultText.replace(/\{\{references\}\}/g, '<div id="references"><ol>' + refList.join('\n') + '</ol></div>');

    return resultText;
}

// Function to parse notes
function parseNotes(text) {
    // Regular expression to match the notes format {{notes|text}}
    const notesPattern = /\{\{notes\|([^\}\}]+)\}\}/g;
    const notesList = [];
    let resultText = '';
    let lastIndex = 0; // To keep track of the position of the last matched note

    let match;
    let noteCounter = 0; // Counter for generating alphabetic note labels

    // Function to generate alphabetic labels like a, b, c, ..., z, aa, ab, ...
    function getAlphabeticLabel(index) {
        let label = '';
        index++;
        while (index > 0) {
            label = String.fromCharCode((index - 1) % 26 + 'a'.charCodeAt(0)) + label;
            index = Math.floor((index - 1) / 26);
        }
        return label;
    }

    // Find all notes and replace them with alphabetic labels
    while ((match = notesPattern.exec(text)) !== null) {
        const [fullMatch, textContent] = match;
        // Add note to the list with <li> tags
        const label = getAlphabeticLabel(noteCounter);
        notesList.push(`<li id="note-${label}">${textContent} <a href="#note-link-${label}" class="back-to-text">↑</a></li>`);
        // Replace note with alphabetic label
        resultText += text.slice(lastIndex, match.index) + `<sup><a id="note-link-${label}" href="#note-${label}">[${label}]</a></sup>`;
        lastIndex = notesPattern.lastIndex;
        noteCounter++;
    }

    // Append any remaining text after the last note
    resultText += text.slice(lastIndex);

    // Create the notes section if {{notes}} is found
    resultText = resultText.replace(/\{\{notes\}\}/g, '<div id="notes"><ol type="a">' + notesList.join('\n') + '</ol></div>');

    return resultText;
}

// Function to combine references and notes into their respective sections
function parseContent(text) {
    let parsedText = parseReferences(text);
    parsedText = parseNotes(parsedText);
    return parsedText;
}