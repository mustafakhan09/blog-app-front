let blogUser = sessionStorage.getItem('blogUser');
let blogId = sessionStorage.getItem('blogId');

console.log('User:', blogUser, 'and ID:', blogId);
async function loadBlogData(blogUser, blogId) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert("User is not authenticated. Please log in first.");
        return; 
    }

    try {
        // Correct the URL construction
        const response = await fetch(`http://localhost:3000/api/blog/${blogUser}/${blogId}`, {
            method: 'GET',
            headers: {
                'Authorization' : `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Fetched blog:', data);
            const blog = data.blogs[0];
            document.getElementById('subtitleInput').value = blog.title || "";
            quill.root.innerHTML = blog.content || "";
        } else {
            alert("Error fetching blog details.");
        }
    } catch (error) {
        console.error('Error fetching blog:', error);
    }
}                           

document.getElementById('editForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    let blogUser = sessionStorage.getItem('blogUser');
    let blogId = sessionStorage.getItem('blogId');
    const title = document.getElementById('subtitleInput').value;
    const content = quill.root.innerHTML; // Get content from Quill editor as HTML
    const token = localStorage.getItem('authToken');

    if (!title || !content) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/blog/${blogUser}/${blogId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                content: content,
            })
        });

        if (response.ok) {
            window.location.href = `post.html`; // Redirect to the main page after editing
        } 
    } catch (error) {
        console.error('Error updating blog:', error);
        alert("Error occurred while updating.");
    }
});


// Load the blog data when the page loads

if (blogId && blogUser) {
    loadBlogData(blogUser, blogId); 
}


const toolbarOptions = [
    // font options
    [{ font: [] }],
  
    //   header options
    [{ header: [1, 2, 3] }],
  
    // text utilities
    ["bold", "italic", "underline", "strike"],
  
    // text colors and bg colors
    [{ color: [] }, { background: [] }],
  
    // lists
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  
    // block quotes and code blocks
    ["blockquote", "code-block"],
  
    // media
    ["link", "image"],
  
    // alignment
    [{ align: [] }],
  ];


let quill = new Quill('#editor', {
    theme: 'snow',  // or 'bubble'
    modules: {
      toolbar: toolbarOptions
    }
  });
  