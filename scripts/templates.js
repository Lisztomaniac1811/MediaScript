function parseInfoboxEpisode(text, variableName, variableValue) {
    const mainContentraw = document.getElementById('main-content').value;
    const { mediaItems } = extractMediaItems(mainContentraw);

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

        // Find the image number in the mediaItems list
        const imgIndex = mediaItems.findIndex(item => item.name === image);
        const imgNum = imgIndex !== -1 ? imgIndex + 1 : ''; // Add 1 to make it 1-based index

        // Build HTML
        let infoboxHTML = `
            <aside class="infobox-episode">
                <h2 class="infobox-title">${title}</h2>
                ${image ? `<img src="images/resized/800px/${image}" alt="${caption}" onclick="openModal();currentSlide(${imgNum});scrollthebar();pauseYouTubeVideo();">` : ''}
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
    const mainContentraw = document.getElementById('main-content').value;
    const { mediaItems } = extractMediaItems(mainContentraw);

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

        // Find the image number in the mediaItems list
        const imgIndex = mediaItems.findIndex(item => item.name === image);
        const imgNum = imgIndex !== -1 ? imgIndex + 1 : ''; // Add 1 to make it a 1-based index

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
                ${image ? `<img src="images/resized/800px/${image}" alt="${imagecaption}" onclick="openModal();currentSlide(${imgNum});scrollthebar();pauseYouTubeVideo();">` : ''}
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

function parseGallery(text) {
    const mainContentraw = document.getElementById('main-content').value;
    const { mediaItems } = extractMediaItems(mainContentraw);

    // Regular expression to match the <gallery>...</gallery> block
    const galleryPattern = /<gallery>([\s\S]*?)<\/gallery>/g;
    let resultText = '';
    let lastIndex = 0; // To keep track of the position of the last matched gallery

    let match;
    let galleryCounter = 0; // Counter to differentiate multiple galleries

    // Find all <gallery>...</gallery> blocks
    while ((match = galleryPattern.exec(text)) !== null) {
        const [fullMatch, galleryContent] = match;
        const galleryItems = galleryContent.trim().split('\n');

        // Create gallery HTML structure
        let galleryHTML = `<div id="GalleryRow${galleryCounter}" class="GalleryRow">\n`;
        galleryItems.forEach(item => {
            const [url, caption = ''] = item.split('|');
            const imageUrl = url.trim();
            const imageCaption = caption.trim();

            // Find the image number in the mediaItems list
            const imgIndex = mediaItems.findIndex(mediaItem => mediaItem.name === imageUrl);
            const imgNum = imgIndex !== -1 ? imgIndex + 1 : ''; // Add 1 to make it a 1-based index

            // Determine if the image is an online picture or a local file
            const finalUrl = imageUrl.startsWith('https://') ? imageUrl : `images/resized/800px/${imageUrl}`;

            galleryHTML += `
                <div class="GalleryColumn">
                    <img src="${finalUrl}" style="width:100%" onclick="openModal();currentSlide(${imgNum});scrollthebar()" class="hover-shadow cursor" alt="${imageCaption}">
                </div>\n`;
        });
        galleryHTML += `</div>\n`;

        // Replace gallery block with generated HTML
        resultText += text.slice(lastIndex, match.index) + galleryHTML;
        lastIndex = galleryPattern.lastIndex;
        galleryCounter++;
    }

    // Append any remaining text after the last gallery block
    resultText += text.slice(lastIndex);

    return resultText;
}


function parseFiles(text) {
    const mainContentraw = document.getElementById('main-content').value;
    const { mediaItems } = extractMediaItems(mainContentraw);
    
    // Regular expression to match the [[File:fileurl.jpg|...|]] syntax
    const filePattern = /\[\[File:(.*?)\|(.*?)\]\]/g;
    let resultText = '';
    let lastIndex = 0; // To keep track of the position of the last matched file

    let match;

    // Find all [[File:fileurl.jpg|...|]] blocks
    while ((match = filePattern.exec(text)) !== null) {
        const [fullMatch, fileUrl, params] = match;
        
        // Split the parameters
        const paramArray = params.split('|').map(param => param.trim());
        const imageUrl = fileUrl.trim();

        // Initialize variables
        let imgWidth = '200px'; // Default width
        let floatStyle = '';
        let caption = '';
        let finalImageUrl = '';
        let imgNum = '';

        // Process parameters
        paramArray.forEach(param => {
            if (/^\d+px$/.test(param)) {
                imgWidth = param; // Detect width
            } else if (param === 'left' || param === 'right') {
                floatStyle = `float:${param};`; // Detect float direction
            } else {
                caption = param; // Anything else is considered caption
            }
        });

        // Process image URL
        finalImageUrl = imageUrl.startsWith('https://') ? imageUrl : `images/resized/800px/${imageUrl}`;

        // Find the image number in the mediaItems list
        const imgIndex = mediaItems.findIndex(item => item.name === imageUrl);
        imgNum = imgIndex !== -1 ? imgIndex + 1 : ''; // Add 1 to make it 1-based index

        // Create the HTML structure
        let figureHTML = `<figure style="width:calc(${imgWidth} + 20px); ${floatStyle}">\n`;
        figureHTML += `<img src="${finalImageUrl}" alt="${caption || ''}" style="width:${imgWidth};" onclick="openModal();currentSlide(${imgNum});scrollthebar();pauseYouTubeVideo();">\n`;
        if (caption) {
            figureHTML += `<figcaption>${caption}</figcaption>\n`;
        }
        figureHTML += `</figure>\n`;

        // Replace file block with generated HTML
        resultText += text.slice(lastIndex, match.index) + figureHTML;
        lastIndex = filePattern.lastIndex;
    }

    // Append any remaining text after the last file block
    resultText += text.slice(lastIndex);

    return resultText;
}


function parseYouTube(text) {
    const mainContentraw = document.getElementById('main-content').value;
    const { mediaItems } = extractMediaItems(mainContentraw);

    // Regular expression to match the <youtube>...</youtube> block
    const youtubePattern = /<youtube>([\s\S]*?)<\/youtube>/g;
    let resultText = '';
    let lastIndex = 0; // To keep track of the position of the last matched YouTube block

    let match;

    // Find all <youtube>...</youtube> blocks
    while ((match = youtubePattern.exec(text)) !== null) {
        const [fullMatch, youtubeContent] = match;
        const videoEntries = youtubeContent.trim().split('\n');

        // Create gallery HTML structure
        let galleryHTML = `<div id="GalleryRow">\n`;

        videoEntries.forEach(entry => {
            const [url, caption = ''] = entry.split('|');
            const trimmedUrl = url.trim();
            const videoCaption = caption ? caption.trim() : '';

            // Find the video number in the mediaItems list
            const vidIndex = mediaItems.findIndex(mediaItem => mediaItem.name === trimmedUrl);
            const vidNum = vidIndex !== -1 ? vidIndex + 1 : ''; // Add 1 to make it a 1-based index

            // Generate thumbnail URL using the video ID extracted from the URL
            const videoId = extractVideoId(trimmedUrl);
            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

            // Create HTML for each video
            galleryHTML += `
                <div class="wikia-gallery-item">
                    <div class="thumb">
                        <div class="gallery-image-wrapper accent" id="${videoCaption}" style="position: relative;">
                            <a class="image lightbox video video-thumbnail xsmall" onclick="openModal();currentSlide(${vidNum});scrollthebar()" title="${videoCaption}">
                                <span class="thumbnail-play-icon-container">
                                    <svg class="thumbnail-play-icon">
                                        <use xlink:href="#wds-player-icon-play"></use>
                                    </svg>
                                </span>
                                <noscript>
                                    <img style="" src="${thumbnailUrl}" title="${videoCaption}">
                                </noscript>
                                <img style="" src="${thumbnailUrl}" title="${videoCaption}" alt="${videoCaption}" onclick="openModal();currentSlide(${vidNum});scrollthebar()" class="hover-shadow cursor">
                            </a>
                        </div>
                    </div>
                    <div class="title">${videoCaption}</div>
                </div>\n`;
        });

        galleryHTML += `</div>\n`;

        // Replace YouTube block with generated HTML
        resultText += text.slice(lastIndex, match.index) + galleryHTML;
        lastIndex = youtubePattern.lastIndex;
    }

    // Append any remaining text after the last YouTube block
    resultText += text.slice(lastIndex);

    return resultText;
}

// Function to extract YouTube video ID from different URL formats
function extractVideoId(url) {
    // Match video ID from full URL, shortened URL, or standalone ID
    const videoIdPattern = /(?:https?:\/\/(?:www\.)?youtube\.com\/watch\?v=|https?:\/\/youtu\.be\/|^)([a-zA-Z0-9_-]{11})/;
    const match = url.match(videoIdPattern);
    return match ? match[1] : '';
}



// function extractMediaItems(text) {
//     const mediaItems = new Map(); // Map to store unique media items

//     // Helper function to check if a string is a valid width (e.g., '200px')
//     function isWidth(str) {
//         return /^\d+px$/.test(str);
//     }

//     // Helper function to check if a string is a valid float direction ('left' or 'right')
//     function isFloatDirection(str) {
//         return str === 'left' || str === 'right';
//     }

//     // Extract gallery items
//     const galleryPattern = /<gallery>([\s\S]*?)<\/gallery>/g;
//     let match;

//     while ((match = galleryPattern.exec(text)) !== null) {
//         const galleryContent = match[1];
//         const galleryItems = galleryContent.trim().split('\n');

//         galleryItems.forEach(item => {
//             const [name, caption] = item.split('|');
//             const itemName = name.trim();
//             const itemCaption = caption ? caption.trim() : '';

//             if (mediaItems.has(itemName)) {
//                 if (itemCaption) {
//                     const existingItem = mediaItems.get(itemName);
//                     if (!existingItem.caption) {
//                         existingItem.caption = itemCaption;
//                     }
//                 }
//             } else {
//                 mediaItems.set(itemName, { name: itemName, caption: itemCaption });
//             }
//         });
//     }

//     // Extract File items
//     const filePattern = /\[\[File:(.*?)\]\]/g;

//     while ((match = filePattern.exec(text)) !== null) {
//         const fileContent = match[1].split('|');
//         const name = fileContent[0].trim();
//         let caption = '';

//         fileContent.slice(1).forEach(param => {
//             const trimmedParam = param.trim();
//             if (!isWidth(trimmedParam) && !isFloatDirection(trimmedParam)) {
//                 caption = trimmedParam;
//             }
//         });

//         if (mediaItems.has(name)) {
//             const existingItem = mediaItems.get(name);
//             if (!existingItem.caption) {
//                 existingItem.caption = caption;
//             }
//         } else {
//             mediaItems.set(name, { name: name, caption: caption });
//         }
//     }

//     // Extract YouTube items
//     const youtubePattern = /<youtube>([\s\S]*?)<\/youtube>/g;

//     while ((match = youtubePattern.exec(text)) !== null) {
//         const youtubeContent = match[1];
//         const youtubeItems = youtubeContent.trim().split('\n');

//         youtubeItems.forEach(item => {
//             const [url, caption] = item.split('|');
//             const videoId = extractVideoId(url.trim());
//             const itemCaption = caption ? caption.trim() : '';

//             if (videoId) {
//                 if (mediaItems.has(videoId)) {
//                     const existingItem = mediaItems.get(videoId);
//                     if (!existingItem.caption) {
//                         existingItem.caption = itemCaption;
//                     }
//                 } else {
//                     mediaItems.set(videoId, { name: videoId, caption: itemCaption });
//                 }
//             }
//         });
//     }

//     const uniqueMediaItems = Array.from(mediaItems.values());
//     const totalMediaCount = uniqueMediaItems.length;

//     return { mediaItems: uniqueMediaItems, totalMediaCount };
// }
 
function extractGalleryItems(text) {
    const galleryPattern = /<gallery>([\s\S]*?)<\/gallery>/g;
    const mediaItems = new Map();
    let match;

    while ((match = galleryPattern.exec(text)) !== null) {
        const galleryContent = match[1].trim().split('\n');
        galleryContent.forEach(item => {
            const [name, caption] = item.split('|');
            const itemName = name.trim();
            const itemCaption = caption ? caption.trim() : '';
            if (!mediaItems.has(itemName)) {
                mediaItems.set(itemName, { name: itemName, caption: itemCaption });
            }
        });
    }

    return mediaItems;
}

// Function to extract items from [[File:...]] syntax
function extractFileItems(text) {
    const filePattern = /\[\[File:(.*?)\]\]/g;
    const mediaItems = new Map();
    let match;

    while ((match = filePattern.exec(text)) !== null) {
        const fileContent = match[1].split('|');
        const name = fileContent[0].trim();
        let caption = '';

        fileContent.slice(1).forEach(param => {
            const trimmedParam = param.trim();
            if (!/^\d+px$/.test(trimmedParam) && trimmedParam !== 'left' && trimmedParam !== 'right') {
                caption = trimmedParam;
            }
        });

        if (!mediaItems.has(name)) {
            mediaItems.set(name, { name: name, caption: caption });
        } else {
            const existingItem = mediaItems.get(name);
            if (!existingItem.caption) {
                existingItem.caption = caption;
            }
        }
    }

    return mediaItems;
}

// Function to extract items from <youtube> tags
function extractYouTubeItems(text) {
    const youtubePattern = /<youtube>([\s\S]*?)<\/youtube>/g;
    const mediaItems = new Map();
    let match;

    while ((match = youtubePattern.exec(text)) !== null) {
        const youtubeContent = match[1].trim().split('\n');
        youtubeContent.forEach(item => {
            const [url, caption] = item.split('|');
            const itemUrl = url.trim();  // Use full URL
            const itemCaption = caption ? caption.trim() : '';

            if (itemUrl) {
                if (!mediaItems.has(itemUrl)) {
                    mediaItems.set(itemUrl, { name: itemUrl, caption: itemCaption });
                } else {
                    const existingItem = mediaItems.get(itemUrl);
                    if (!existingItem.caption) {
                        existingItem.caption = itemCaption;
                    }
                }
            }
        });
    }

    return mediaItems;
}

// Function to combine and remove duplicate media items
function combineMediaItems(galleryItems, fileItems, youtubeItems) {
    const combinedItems = new Map();

    // Combine gallery items
    galleryItems.forEach((value, key) => {
        if (!combinedItems.has(key)) {
            combinedItems.set(key, value);
        }
    });

    // Combine file items
    fileItems.forEach((value, key) => {
        if (!combinedItems.has(key)) {
            combinedItems.set(key, value);
        } else {
            const existingItem = combinedItems.get(key);
            if (!existingItem.caption && value.caption) {
                existingItem.caption = value.caption;
            }
        }
    });

    // Combine YouTube items
    youtubeItems.forEach((value, key) => {
        if (!combinedItems.has(key)) {
            combinedItems.set(key, value);
        } else {
            const existingItem = combinedItems.get(key);
            if (!existingItem.caption && value.caption) {
                existingItem.caption = value.caption;
            }
        }
    });

    return Array.from(combinedItems.values());
}

// Main function to extract all media items
function extractMediaItems(text) {
    const galleryItems = extractGalleryItems(text);
    const fileItems = extractFileItems(text);
    const youtubeItems = extractYouTubeItems(text);
    const uniqueMediaItems = combineMediaItems(galleryItems, fileItems, youtubeItems);
    const totalMediaCount = uniqueMediaItems.length;

    return { mediaItems: uniqueMediaItems, totalMediaCount };
}

// Function to create and display a gallery modal
function createGalleryModal(text) {
    // Extract media items using the provided functions
    const { mediaItems, totalMediaCount } = extractMediaItems(text);
    
    // Initialize HTML strings
    let slidesHtml = '';
    let thumbnailsHtml = '';
    let currentIndex = 1;

    // Helper function to determine if a URL is a YouTube video
    const isYouTubeUrl = (url) => {
        const youtubePatterns = [
            /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
            /^(https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
            /^([a-zA-Z0-9_-]{11})$/  // Assuming a valid video ID without extension
        ];

        for (const pattern of youtubePatterns) {
            const match = url.match(pattern);
            if (match) {
                return match[3] || match[2] || match[1];
            }
        }
        return null;
    };

    // Iterate through media items to build slides and thumbnails
    mediaItems.forEach(item => {
        const videoId = isYouTubeUrl(item.name);
        const isVideo = !!videoId;
        const isOnlineImage = item.name.startsWith('https://') && !isVideo;

        // Determine URL based on whether it is a video or image
        const url = isVideo
            ? item.name
            : isOnlineImage
            ? item.name
            : `images/resized/800px/${item.name}`;

        const embedUrl = isVideo
            ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1`
            : '';

        // Create slide HTML
        slidesHtml += `
            <div class="GallerySlides" style="display: none;">
                <div class="Gallerynumbertext">${currentIndex}/${totalMediaCount}</div>
                <div class="Galleryviewfullimage">
                    ${isVideo ? `<a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">View</a> | <a style="color:gray">Download</a>` : `<a href="${url}" target="_blank">View</a> | <a href="${url}" download="">Download</a>`}
                </div>
                ${isVideo ? `<iframe id="youtube_video" src="${embedUrl}" allowfullscreen="1" frameborder="0"></iframe>` : `<img src="${url}">`}
            </div>
        `;
        
        // Create thumbnail HTML
        const thumbnailUrl = isVideo
            ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            : isOnlineImage
            ? item.name
            : `images/resized/800px/${item.name}`;

        thumbnailsHtml += `
            <div class="GalleryColumn1" id="galleryitem-${currentIndex}">
                <img class="Gallery1Demo cursor" src="${thumbnailUrl}" style="width:auto" onclick="currentSlide(${currentIndex});pauseYouTubeVideo()" alt="${item.caption}">
            </div>
        `;

        currentIndex++;
    });

    // Generate the final HTML code for the Gallery Modal
    const galleryModalHtml = `
        <div id="GalleryModal" style="display: none;">
            <span class="GalleryClose cursor" onclick="closeModal();pauseYouTubeVideo();" accesskey="esc">✕</span>
            <div class="modal-content">
                ${slidesHtml}
                <a class="prev" onclick="plusSlides(-1);scrollthebar();pauseYouTubeVideo()">❮</a>
                <a class="next" onclick="plusSlides(1);scrollthebar();pauseYouTubeVideo()">❯</a>
                <div class="gallery-caption">
                    <p id="GalleryCaption"></p>
                </div>
                <div class="scrollablegallerylist">
                    ${thumbnailsHtml}
                </div>
            </div>
        </div>
    `;

    return galleryModalHtml;
}
function replaceTocPlaceholder(text) {
    const tocPlaceholder = '__TOC__';
    const tocDiv = '<div id="toc"></div>';

    // Replace all instances of __TOC__ with <div id="toc"></div>
    return text.replace(new RegExp(tocPlaceholder, 'g'), tocDiv);
}

function createTableOfContents(htmlText) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    const tocDiv = document.getElementById('toc');
    if (!tocDiv) return; // Exit if there's no <div id="toc">

    const tocList = [];
    const headers = doc.querySelectorAll('h2, h3, h4, h5, h6');
    let currentLevel = 2;
    let currentList = tocList;

    headers.forEach(header => {
        const level = parseInt(header.tagName[1], 10);

        if (level === 1) return; // Skip <h1> tags

        // Adjust the current list to the correct level
        while (currentLevel < level) {
            const lastItem = currentList[currentList.length - 1];
            if (!lastItem || !lastItem.children) {
                const newSubList = [];
                lastItem.children = newSubList;
                currentList = newSubList;
            } else {
                currentList = lastItem.children;
            }
            currentLevel++;
        }
        while (currentLevel > level) {
            currentList = currentList.parent;
            currentLevel--;
        }

        // Create the TOC item
        const text = header.textContent;
        const id = header.id;
        const tocItem = {
            text: text,
            id: id,
            children: [],
            parent: currentList
        };
        currentList.push(tocItem);
    });

    // Helper function to render TOC items into HTML
    function renderTocItems(items, depth = 1) {
        let html = `<ul>`;
        items.forEach((item, index) => {
            const tocNumber = index + 1;
            const itemNumber = `${depth}.${tocNumber}`;
            html += `
                <li>
                    <a href="#${item.id}">
                        <span class="tocnumber">${itemNumber}</span>
                        <span class="toctext">${item.text}</span>
                    </a>
                    ${item.children.length > 0 ? renderTocItems(item.children, itemNumber) : ''}
                </li>
            `;
        });
        html += `</ul>`;
        return html;
    }

    // Generate the final HTML code for the TOC
    const tocHtml = `
        <input type="checkbox" role="button" id="toctogglecheckbox" class="toctogglecheckbox" style="display:none">
        <div class="toctitle" id="toctitle">
            <h2>
                <svg>
                    <path id="bulleted-list-tiny" d="M1.29 9.277c-.181.19-.29.45-.29.71 0 .26.109.52.29.71.189.18.45.29.71.29.26 0 .519-.11.71-.29.18-.19.29-.45.29-.71 0-.26-.11-.52-.29-.71-.38-.37-1.05-.37-1.42 0M10 9H6a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2M6 3h4a1 1 0 1 0 0-2H6a1 1 0 1 0 0 2m4 2H6a1 1 0 1 0 0-2h4a1 1 0 1 0 0-2M1.29 1.277c.37-.37 1.04-.37 1.42 0 .18.19.29.45.29.71 0 .26-.11.52-.29.71-.191.18-.45.29-.71.29-.26 0-.521-.11-.71-.29-.181-.19-.29-.45-.29-.71 0-.26.109-.52.29-.71zM2.55 5.17c.06.03.11.08.16.12.18.19.29.45.29.71 0 .26-.11.521-.29.71-.05.04-.1.09-.16.12a.559.559 0 0 1-.17.09c-.06.03-.12.05-.19.06-.06.01-.13.02-.19.02-.26 0-.52-.11-.71-.29A1.05 1.05 0 0 1 1 6c0-.26.11-.52.29-.71.24-.23.58-.34.9-.269a.6.6 0 0 1 .19.058c.06.021.12.051.17.091z" fill-rule="evenodd"></path>
                </svg> სარჩევი
            </h2>
            <span class="toctogglespan">
                <label class="toctogglelabel" for="toctogglecheckbox" onclick="toggletoc()"></label>
            </span>
        </div>
        ${renderTocItems(tocList)}
    `;

    // Inject TOC HTML into the existing <div id="toc">
    tocDiv.innerHTML = tocHtml;
}