document.addEventListener('DOMContentLoaded', function () {
    // Handle HTML file upload
    document.getElementById('upload-html').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file && file.type === 'text/html') {
            const reader = new FileReader();
            reader.onload = function (e) {
                const content = e.target.result;
                extractVariables(content);
            };
            reader.readAsText(file);
        } else {
            alert('Please upload a valid HTML file.');
        }
    });

    // Extract variables from the uploaded HTML content
    function extractVariables(htmlContent) {
        // Create a temporary DOM element to parse the HTML content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;

        // Extract the <script> content from the HTML
        const scriptContent = tempDiv.querySelector('script').textContent;

        // Use regex to find and extract variable assignments
        // This regex accounts for single quotes, double quotes, and backticks
        const regex = /var\s+(\w+)\s*=\s*[`"'](.*?)['"`];/gs;
        let match;

        while ((match = regex.exec(scriptContent)) !== null) {
            const variableName = match[1];
            const variableValue = match[2];

            switch (variableName) {
                case 'title':
                    document.getElementById('title').value = variableValue;
                    break;
                case 'description':
                    document.getElementById('description').value = variableValue;
                    break;
                case 'url':
                    document.getElementById('url').value = variableValue;
                    break;
                case 'previewImage':
                    document.getElementById('preview-image').value = variableValue;
                    break;
                case 'publishDate':
                    document.getElementById('publish-date').value = variableValue;
                    break;
                case 'mainContent':
                    document.getElementById('main-content').value = variableValue;
                    break;
                case 'sidebarContent':
                    document.getElementById('sidebar-content').value = variableValue;
                    break;
                case 'breadcrumbs':
                    document.getElementById('breadcrumbs').value = variableValue;
                    break;
                case 'website-title':
                    document.getElementById('website-title').value = variableValue;
                    break;
                    case 'navigationMenu':
                    document.getElementById('navigation-menu').value = variableValue;
                    break;
                    case 'footerContent':
                    document.getElementById('footer-content').value = variableValue;
                    break;
                    case 'language':
                    document.getElementById('language').value = variableValue;
                    break;
                default:
                    console.warn(`Unrecognized variable: ${variableName}`);
            }
        }
    }

    // Load Variables button functionality
    document.getElementById('load-variables').addEventListener('click', function () {
        const fileInput = document.getElementById('upload-html');
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                const content = e.target.result;
                extractVariables(content);
            };
            reader.readAsText(file);
        } else {
            alert('Please upload an HTML file first.');
        }
    });
});

function convertBulletedLists(markup) {
    // Initialize an empty array to collect list items
    let listItems = [];
    let currentList = null;

    // Split the markup by newlines
    const lines = markup.split('\n');

    // Iterate over each line
    lines.forEach(line => {
        // Check if the line starts with a bullet point
        if (line.trim().startsWith('*')) {
            // Extract the list item text and clean up
            const itemText = line.replace(/^\*\s*/, '').trim();
            
            // If a current list exists, add the item to it
            if (currentList) {
                listItems.push(`<li>${itemText}</li>`);
            } else {
                // Start a new list
                if (listItems.length > 0) {
                    listItems.push('</ul>'); // Close the previous list
                }
                currentList = true;
                listItems.push('<ul>');
                listItems.push(`<li>${itemText}</li>`);
            }
        } else {
            // If the line doesn't start with a bullet point and there was an open list
            if (currentList) {
                listItems.push('</ul>'); // Close the list
                currentList = false;
            }
            listItems.push(line); // Add non-list lines as they are
        }
    });

    // If there was an open list at the end, close it
    if (currentList) {
        listItems.push('</ul>');
    }

    // Join the list items and other content back into a single string
    return listItems.join('\n');
}

function convertNumberedLists(markup) {
    // Initialize an empty array to collect list items
    let listItems = [];
    let currentList = null;
    let listNumber = 1;

    // Split the markup by newlines
    const lines = markup.split('\n');

    // Iterate over each line
    lines.forEach(line => {
        // Check if the line starts with a numbered point
        if (line.trim().startsWith('#')) {
            // Extract the list item text and clean up
            const itemText = line.replace(/^#\s*/, '').trim();
            
            // If a current list exists, add the item to it
            if (currentList) {
                listItems.push(`<li>${itemText}</li>`);
            } else {
                // Start a new list
                if (listItems.length > 0) {
                    listItems.push('</ol>'); // Close the previous list
                }
                currentList = true;
                listItems.push('<ol>');
                listItems.push(`<li>${itemText}</li>`);
            }
        } else {
            // If the line doesn't start with a numbered point and there was an open list
            if (currentList) {
                listItems.push('</ol>'); // Close the list
                currentList = false;
            }
            listItems.push(line); // Add non-list lines as they are
        }
    });

    // If there was an open list at the end, close it
    if (currentList) {
        listItems.push('</ol>');
    }

    // Join the list items and other content back into a single string
    return listItems.join('\n');
}

function convertInternalLinks(markup) {
    // Define a regular expression to match the link patterns
    const linkRegex = /\[\[([^\|\]]+)(?:\|([^|\]]+))?(?:\|([^|\]]+))?\]\]/g;

    // Replace the matched links with corresponding HTML
    return markup.replace(linkRegex, (match, link, title, display) => {
        // Convert spaces in the link to underscores for href
        let href = `${link.replace(/\s+/g, '_')}.html`; // Convert link to href with underscores
        
        // Use title if available, otherwise use link
        let linkTitle = title || link; 
        
        // Use display if available, otherwise use title
        let linkDisplay = display || linkTitle;
        
        // Return the HTML link
        return `<a href="${href}" title="${linkTitle}">${linkDisplay}</a>`;
    });
}

// Function to convert external links
function convertExternalLinks(markup) {
    const externalLinkRegex = /\[([^\s]+)(?:\s(.+?))?\]/g;

    return markup.replace(externalLinkRegex, (match, link, display) => {
        // Use the URL as the display and title if display text is missing
        let linkDisplay = display || link;
        return `<a href="${link}" title="${linkDisplay}">${linkDisplay}</a>`;
    });
}


document.addEventListener('DOMContentLoaded', function () {
    // Function to convert markup to HTML
    function convertMarkupToHTML(markup) {
  // Convert ========Text======== to <h6 id="Text">Text</h6>
  markup = markup.replace(/======(.+?)======/g, '<h6 id="$1">$1</h6>');
    
  // Convert ======Text====== to <h5 id="Text">Text</h5>
  markup = markup.replace(/=====(.+?)=====/g, '<h5 id="$1">$1</h5>');
  
  // Convert ======Text===== to <h4 id="Text">Text</h4>
  markup = markup.replace(/====(.+?)====/g, '<h4 id="$1">$1</h4>');
  
  // Convert ====Text==== to <h3 id="Text">Text</h3>
  markup = markup.replace(/===(.+?)===/g, '<h3 id="$1">$1</h3>');
  
  // Convert ===Text=== to <h2 id="Text">Text</h2>
  markup = markup.replace(/==(.+?)==/g, '<h2 id="$1">$1</h2>');
  
  // Convert ==Text== to <h1 id="Text">Text</h1>
  markup = markup.replace(/=(.+?)=/g, '<h1 id="$1">$1</h1>');

      
    // Convert '''Bold''' to <b>Bold</b>
    markup = markup.replace(/'''(.+?)'''/g, '<b>$1</b>');

    // Convert ''Italic'' to <i>Italic</i>
    markup = markup.replace(/''(.+?)''/g, '<i>$1</i>');

        // Convert ----- to <hr>
        markup = markup.replace(/^-{5,}$/gm, '<hr>');

        markup = convertBulletedLists(markup);

        markup = convertNumberedLists(markup);

        markup = convertInternalLinks(markup);

        markup = convertExternalLinks(markup);

        markup = parseInfoboxEpisode(markup);

        markup = parseInfoboxCharacter(markup);

        markup = parseReferences(markup);

        markup = parseNotes(markup);

        markup = parseContent(markup);

        // Convert * Bullet Point to <ul><li>Bullet Point</li></ul>
        // markup = markup.replace(/^\*\s(.+)/gm, '<ul><li>$1</li></ul>'); 

        // Convert ** Bullet Point to <ol><li>Bullet Point</li></ol>
        markup = markup.replace(/^\*\*\s(.+)/gm, '<ol><li>$1</li></ol>');



        return markup;
    }

    // Function to generate HTML code from fields
    function generateHTML() {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const url = document.getElementById('url').value;
        const previewImage = document.getElementById('preview-image').value;
        const publishDate = document.getElementById('publish-date').value;
        const mainContentraw = document.getElementById('main-content').value;
        let mainContent = document.getElementById('main-content').value;
        const sidebarContent = document.getElementById('sidebar-content').value;
        const navigationMenu = document.getElementById('navigation-menu').value;
        const footerContent = document.getElementById('footer-content').value;
        const breadcrumbs = document.getElementById('breadcrumbs').value;
        const websiteTitle = document.getElementById('website-title').value;
        const language = document.getElementById('language').value;        



          // Determine the <title> content based on the presence of websiteTitle
         const fullTitle = websiteTitle ? `${title} | ${websiteTitle}` : title;


        // Convert mainContent from markup to HTML
        mainContent = convertMarkupToHTML(mainContent);

        // HTML structure template
//         const htmlTemplate = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>${title}</title>
//     <meta name="description" content="${description}">
//     <meta property="og:title" content="${title}">
//     <meta property="og:description" content="${description}">
//     <meta property="og:image" content="${previewImage}">
//     <meta property="og:url" content="${url}">
//     <meta name="publish-date" content="${publishDate}">
//     <link rel="stylesheet" href="styles/main.css"> <!-- Link to external CSS file -->
// </head>
// <body>
//     <header>
//         <h1>${title}</h1>
//         ${navigationMenu === 'yes' ? '<nav><p>Navigation content example.</p></nav>' : ''}
//     </header>
//     <main>
//         ${breadcrumbs ? `<nav class="breadcrumbs">${breadcrumbs}</nav>` : ''}
//         <section id="main-content">
//             ${mainContent}
//         </section>
//         ${sidebarContent ? `<aside id="sidebar">${sidebarContent}</aside>` : ''}
//     </main>
//      ${FooterContent === 'yes' ? '<footer><p>Footer content example.</p></footer>' : ''}
// </body>
// </html>
// `;

let htmlTemplate = `
<!DOCTYPE html>
<html lang="${language}">
<head>
    <script>
        var language = "${language}";
        var title = "${title}";
        var description = "${description}";
        var url = "${url}";
        var previewImage = "${previewImage}";
        var publishDate = "${publishDate}";
        var navigationMenu = "${navigationMenu}";
        var breadcrumbs = "${breadcrumbs}";
        var footerContent = "${footerContent}";
        var mainContent = \`${mainContentraw}\`;
    </script>
    <script src="script-pack.js"></script>
    <script src="variables.js"></script>
    <!--Meta tags start here-->
    <!--General-->
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="title" content="${title}">
    <meta name="description" content="${description}">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${fullTitle}</title>
    <!--Facebook-->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${previewImage}">
    <!--Twitter-->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${url}">
    <meta property="twitter:title" content="${title}">
    <meta property="twitter:description" content="${description}">
    <meta property="twitter:image" content="${previewImage}">
    <!--Meta tags end here-->
    <!--Link tags start here-->
    <link rel="shortcut icon" href="favicon.ico">
    <link rel="stylesheet" href="styles/css.css">
    <!--Link tags end here-->
</head>
<body
 ${navigationMenu === 'yes' ? '<nav id="dropdown-navigation" style="top: -64px;"></nav><nav id="mobile-banner"></nav>' : ''}
    <main>
     ${navigationMenu === 'yes' ? '<nav id="wiki-header-nav"></nav>' : ''}
      ${breadcrumbs ? `<nav class="breadcrumbs">${breadcrumbs}</nav>` : ''}
     <div class="wiki-page-title-header">
            <h1>${title}</h1>
            <hr class="page-separator">
        </div>
        <div class="content">${mainContent}</div>
    </main>
     ${sidebarContent ? `<div id="sidebar">${sidebarContent}</div>` : ''}
     ${footerContent === 'yes' ? '<footer><p>Footer content example.</p></footer>' : ''}
</body>
</html>
`;

        // Display generated HTML code
        const generatedCodeTextarea = document.getElementById('generated-code');
        generatedCodeTextarea.value = htmlTemplate;
        document.getElementById('generated-code-section').style.display = 'block';
    }

    // Generate HTML code on button click
    document.getElementById('generate-code').addEventListener('click', generateHTML);

    // Preview button functionality
    document.getElementById('preview-button').addEventListener('click', function () {
        const generatedCode = document.getElementById('generated-code').value;
        const previewFrame = document.getElementById('preview-frame');
        const blob = new Blob([generatedCode], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        previewFrame.src = url;
        document.getElementById('preview-section').style.display = 'block';
    });

    // Download HTML button functionality
    document.getElementById('download-html').addEventListener('click', function () {
        const title = document.getElementById('title').value || 'Untitled';
        const generatedCode = document.getElementById('generated-code').value;
        const blob = new Blob([generatedCode], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});