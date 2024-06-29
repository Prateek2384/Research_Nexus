// JavaScript for dynamic functionality
document.addEventListener('DOMContentLoaded', function() {
    // Function to update subtopics based on selected topic
    function updateSubtopics() {
        var topic = document.getElementById('articleTopic').value;
        var subtopicSelect = document.getElementById('articleSubtopic');
        subtopicSelect.innerHTML = '';

        // Define subtopics based on selected topic
        var subtopics = [];
        switch(topic) {
            case 'Science':
                subtopics = ['Physics', 'Chemistry', 'Biology', 'Astronomy'];
                break;
            case 'History':
                subtopics = ['Ancient History', 'Medieval History', 'Modern History'];
                break;
            case 'Technology':
                subtopics = ['Computer Science', 'Information Technology', 'Robotics'];
                break;
            case 'Health':
                subtopics = ['Nutrition', 'Fitness', 'Mental Health', 'Medicine'];
                break;
            case 'Education':
                subtopics = ['Primary Education', 'Secondary Education', 'Higher Education'];
                break;
            case 'Sports':
                subtopics = ['Football', 'Basketball', 'Tennis', 'Swimming'];
                break;
            case 'Arts':
                subtopics = ['Visual Arts', 'Performing Arts', 'Literature', 'Music'];
                break;
            case 'Politics':
                subtopics = ['International Relations', 'Political Theory', 'Public Policy'];
                break;
            case 'Economics':
                subtopics = ['Macroeconomics', 'Microeconomics', 'Development Economics'];
                break;
            case 'Travel':
                subtopics = ['Adventure Travel', 'Cultural Tourism', 'Budget Travel'];
                break;
            default:
                subtopics = [];
        }

        // Populate subtopic dropdown
        subtopics.forEach(function(subtopic) {
            var option = document.createElement('option');
            option.text = subtopic;
            option.value = subtopic.toLowerCase().replace(/\s+/g, '-'); // Convert to URL-friendly format
            subtopicSelect.appendChild(option);
        });
    }

    // Event listener for topic change
    document.getElementById('articleTopic').addEventListener('change', updateSubtopics);

    // Event listener for publish button
    document.getElementById('publishButton').addEventListener('click', function() {
        var articleName = document.getElementById('articleName').value;
        var articleContent = CKEDITOR.instances.articleContent.getData();
        var articleTopic = document.getElementById('articleTopic').value;
        var articleSubtopic = document.getElementById('articleSubtopic').value;

        // Validate inputs
        if (!articleName || !articleContent || !articleTopic || !articleSubtopic) {
            alert('Please fill in all fields.');
            return;
        }

        // Create article object
        var article = {
            name: articleName,
            content: articleContent,
            topic: articleTopic,
            subtopic: articleSubtopic
        };

        // Display published article (for demonstration)
        var articlesList = document.getElementById('articlesList');
        var articleElement = document.createElement('div');
        articleElement.classList.add('article');
        articleElement.innerHTML = `
            <div class="article-header">${article.name}</div>
            <div class="article-content">${article.content}</div>
            <button>Delete</button>
        `;
        articlesList.appendChild(articleElement);

        // Clear input fields
        document.getElementById('articleName').value = '';
        CKEDITOR.instances.articleContent.setData('');
        document.getElementById('articleTopic').value = '';
        document.getElementById('articleSubtopic').innerHTML = '<option value="" disabled selected>Select a subtopic</option>';

        alert('Article published successfully!');
    });

    
});





document.addEventListener("DOMContentLoaded", () => {
    const articleForm = document.getElementById('articleForm');
    const publishedArticles = document.getElementById('articlesList');
    const publishButton = document.getElementById('publishButton');

    // Fetch articles from the server
    fetch('/api/articles')
        .then(response => response.json())
        .then(articles => {
            articles.forEach(article => {
                addArticleToDOM(article);
            });
        });

    publishButton.addEventListener('click', (e) => {
        e.preventDefault();
        const articleName = document.getElementById('articleName').value;
        const articleTopic = document.getElementById('articleTopic').value;
        const articleSubtopic = document.getElementById('articleSubtopic').value;
        const articleContent = CKEDITOR.instances.articleContent.getData();

        fetch('/api/articles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: articleName, topic: articleTopic, subtopic: articleSubtopic, content: articleContent })
        })
        .then(response => response.json())
        .then(article => {
            addArticleToDOM(article);
            document.getElementById('articleName').value = '';
            document.getElementById('articleTopic').value = '';
            document.getElementById('articleSubtopic').value = '';
            CKEDITOR.instances.articleContent.setData('');
        });
    });

    function addArticleToDOM(article) {
        const articleElement = document.createElement('div');
        articleElement.classList.add('article', 'fade-in');
        articleElement.innerHTML = `
            <h3 class="article-header">${article.name}</h3>
            <p><strong>Topic:</strong> ${article.topic}</p>
            <p><strong>Subtopic:</strong> ${article.subtopic}</p>
            <div>${article.content}</div>
            <button class="delete-button">Delete</button>
        `;

        const deleteButton = articleElement.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => {
            fetch(`/api/articles/${article._id}`, {
                method: 'DELETE'
            })
            .then(() => {
                articleElement.remove();
            });
        });

        publishedArticles.appendChild(articleElement);
    }
});


