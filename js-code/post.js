const modal = document.getElementById("myModal");

  // Get buttons
  const openModalBtn = document.getElementById("openModalBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const submitBtn = document.getElementById("submitBtn");
  const spanClose = document.getElementsByClassName("close")[0];

  openModalBtn.onclick = function() {
    modal.style.display = "block";
  }

  closeModalBtn.onclick = function() {
    modal.style.display = "none";
  }

  spanClose.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  // Handle submit button click
  submitBtn.onclick = function() {
    const heading = document.getElementById("blogHeading").value;

    if (heading && content) {
      console.log("Heading:", heading);
      console.log("Content:", content);

      modal.style.display = "none";
    } else {
      alert("Please fill in both fields.");
    }
  }



async function postContent() {
const heading = document.getElementById('blogHeading').value;
const description  = quill.root.innerHTML;
const imageFile = document.getElementById('uploadFile').files[0];
// const description = document.getElementById('blogContent').value;

const token = localStorage.getItem('authToken');
    if (!token) {
        alert("User is not authenticated. Please log in first.");
        return;
    }

    const formData = new FormData(); 

    formData.append('title', heading);      
    formData.append('content', description);   
    
    if (imageFile) {
        formData.append('image', imageFile);   
    }

    const apiUrl = 'http://localhost:3000/api/blog';


    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Success:", data);
       
            document.getElementById('blogHeading').value = '';
            quill.root.innerHTML = '';    
            handleBlogs()

        
        } else {
            const errorData = await response.json();
            alert("Error creating post: " + errorData.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error occurred while posting.");
    }  
}

document.getElementById('submitBtn').addEventListener('click', postContent);



async function getData() {
    const token = localStorage.getItem('authToken'); 
    if (!token) {
        alert("User is not authenticated. Please log in first.");
        return null; 
    }
    const apiUrl = `http://localhost:3000/api/blog/user`;
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json(); 
            return data.blogs; 
        } else {
            console.error('Error fetching blogs:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
    dltblog
}

getData()



async function handleBlogs() {
    const blogs = await getData();

    if (blogs) {
        const blogContainer = document.getElementById('Get-blogs');
        let blogsHTML = '';

        blogs.forEach(blog => {
             // Extract id and username
             const blogId = blog._id;
             const blogUsername = blog.userid;
             const image = blog.image;
             const Username = blog.comments.username;

            blogsHTML += `
             
                   <div class="blog-box flex flex-col sm:flex-row p-4 m-4  mx-4 bg-purple-100 rounded-lg shadow-lg  2xs:flex-col 2xs:flex  items-center ">
                         <div class="blog-img">
                            <img alt="blog" src="${image}" class="md:w-60 max-w-60 h-48 object-cover 2xs:w-[100]  2xs:max-w-[70vw] 2xs:h-48 mb-5">
                        </div>
                        <div class="lg:blog-text flex flex-col  justify-between pl-4 text-purple-900" data-username=${blogUsername} id=${blogId}>
                            <a href="#" class="blog-title text-lg font-semibold text-purple-800 hover:underline">
                                ${blog.title}
                            </a>
                            <p class="blog_content mt-2 text-purple-700">${blog.content}.....</p>
                            <div class="flex gap-3">
                                <button 
                                    class="mt-4   px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition "
                                    onClick="redirectToReadPage('${blogUsername}', '${blogId}')"
                                >
                                <i class="fa-solid fa-book text-white pr-1 "></i>
                                    Read more
                                </button>
                                <button class="mt-4  px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition " onClick="deleteBlog('${blogUsername}', '${blogId}')">
                                <i class="fa-solid fa-trash text-white pr-1 "></i>
                                Delete</button> 
                                  <button class="mt-4  px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition "  onClick="redirectToEdit('${blogUsername}', '${blogId}')">
                                <i class="fa-regular fa-pen-to-square text-white pr-1   "></i>
                                  Edit</button>
                            </div>
                        </div>
                    </div>

           
            `;
        });

        blogContainer.innerHTML = blogsHTML; 

    } else {
        const blogContainer = document.getElementById('Get-blogs');
        let blogsHTML = ''; 

        blogsHTML += `
            <p class="no-blogs">No Blogs Found.</p>
            <h1 class="write-blogs">Write Blogs</h1>

        `;

        blogContainer.innerHTML = blogsHTML;
    }
    
}


handleBlogs()


function redirectToReadPage(blogUser, blogId) {
    window.location.href = `read.html`;
    sessionStorage.setItem('blogUser', blogUser);
    sessionStorage.setItem('blogId', blogId);
    sessionStorage.setItem('username', Username);

    
}

function redirectToEdit(blogUser, blogId) {
    window.location.href = `edit.html`;
    sessionStorage.setItem('blogUser', blogUser);
    sessionStorage.setItem('blogId', blogId);
    
}




async function deleteBlog(blogUser, blogId) {
    const confirmation = confirm("Are you sure you want to delete this blog?");
    if (confirmation) {
        const result = await dltblog(blogUser, blogId);
        if (result) {
            alert('Blog deleted successfully.');
            handleBlogs(); 
        } else {
            alert('Failed to delete the blog.');
        }
    }
}

async function dltblog(blogUser, blogId) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert("User is not authenticated. Please log in first.");
        return null;
    }
    
    try {
        const response = await fetch(`http://localhost:3000/api/blog/${blogUser}/${blogId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json(); 
            console.log('Blog deleted:', data);
            handleBlogs(); 
            return data;
        } else {
            console.error('Error deleting blog:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
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
    ["link", "image", "video"],
  
    // alignment
    [{ align: [] }],
  ];


let quill = new Quill('#editor', {
    theme: 'snow',  // or 'bubble'
    modules: {
      toolbar: toolbarOptions
    }
  });
  

 
