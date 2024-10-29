// Define the category to filter
var categoryName = "Animals";

// Function to generate the category page
function generateCategoryPage() {
    var contentDiv = document.getElementById('content');
    var categoryData = {}; // Object to hold categorized pages

    // Process each page in the database
    database.forEach(function(page) {
        if (page.categories && page.categories.toLowerCase().includes(categoryName.toLowerCase())) {
            var firstLetter = page.title.charAt(0).toUpperCase();
            if (!categoryData[firstLetter]) {
                categoryData[firstLetter] = [];
            }
            categoryData[firstLetter].push({
                title: page.title,
                url: page.localUrl,
                description: page.description
            });
        }
    });

    // Generate HTML for each section
    Object.keys(categoryData).sort().forEach(function(letter) {
        var section = document.createElement('div');
        section.className = 'category-section';
        var header = document.createElement('h2');
        header.textContent = letter;
        section.appendChild(header);

        var list = document.createElement('ul');
        categoryData[letter].forEach(function(page) {
            var listItem = document.createElement('li');
            var link = document.createElement('a');
            link.href = page.url;
            link.title = page.description;
            link.textContent = page.title;
            listItem.appendChild(link);
            list.appendChild(listItem);
        });
        section.appendChild(list);
        contentDiv.appendChild(section);
    });
}

// Call the function to generate the category page
generateCategoryPage();