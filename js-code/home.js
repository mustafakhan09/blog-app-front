
let currentPage = 1; // This tracks which page the user is currently viewing.
const blogsPerPage = 5; // This determines how many blogs are fetched per page.
async function getData(page) {
    const token = localStorage.getItem('authToken'); 
    if (!token) {
        alert("User is not authenticated. Please log in first.");
        return null; 
    }
    const apiUrl = `http://localhost:3000/api/blog?page=${page}&limit=${blogsPerPage}`;
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
}

getData()


async function handleBlogs(page = 1) {
    const blogs = await getData(page); // Fetch default blogs
    const blogContainer = document.getElementById('Get-blogs');
    const searchInput = document.getElementById('searchInput');

    // Function to render the blogs
    function renderBlogs(filteredBlogs) {
        let blogsHTML = '';

        // If there are no blogs to render, show no blogs message
        if (filteredBlogs.length === 0) {
            blogsHTML = '<p class="no-blogs text-[5vw] flex justify-center align-center">No Blogs Found.</p>';
        } else {
            filteredBlogs.forEach(blog => {
                const blogId = blog._id;
                const blogUsername = blog.userid;
                const image = blog.image;

                blogsHTML += `
                   <div class="blog-box flex flex-col sm:flex-row p-4 m-4  mx-4 bg-purple-100 rounded-lg shadow-lg  2xs:flex-col 2xs:flex  items-center ">
                        <div class="blog-img">
                            <img alt="blog" src="${image}" class="md:w-60 max-w-60 h-48 object-cover 2xs:w-[100]  2xs:max-w-[70vw] 2xs:h-48 mb-5">
                        </div>
                        <div class="lg:blog-text flex flex-col  justify-between pl-4 text-purple-900" data-username=${blogUsername} id=${blogId}>
                            <a href="#" class="blog-title text-lg font-semibold text-purple-800 hover:underline ">
                                ${blog.title}
                            </a>
                            <p class="blog_content mt-2 text-purple-700">${blog.content}.....</p>
                                <div>
                                    <button class="mt-4   px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition" onclick="redirectToReadPage('66fbf79c9177d02a0909518a', '67124dcb013ccba7cb7f458f')" fdprocessedid="kgjwka">
                            
                                    <i class="fa-regular fa-pen-to-square text-white pr-1"></i>
                                        Read more
                                    </button>
                                </div>   
                        </div>
                    </div>

                `;
            });
        }           

        blogContainer.innerHTML = blogsHTML;
        setupPagination(page, blogs.length); // Setup pagination after rendering
    }

    // Initially render all blogs
    if (blogs && blogs.length > 0) {
        renderBlogs(blogs);

        // Add event listener for the search input
        searchInput.addEventListener('input', async function () {
            const searchTerm = searchInput.value.toLowerCase();
            const token = localStorage.getItem('authToken');

            // Check if the search term is empty (clear search)
            if (searchTerm === '') {
                // Fetch original blogs if search input is cleared
                const allBlogs = await getData(page); // Fetch the original paginated blogs
                renderBlogs(allBlogs); // Render all blogs
                setupPagination(page, allBlogs.length); // Setup pagination for all blogs
                return;
            }

            // If search term is not empty, fetch filtered blogs
            try {
                const response = await fetch(`http://localhost:3000/api/blog/filterBlog?keyword=${searchTerm}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    const filteredBlogs = data.paginatedBlog;
                    renderBlogs(filteredBlogs);  
                    setupPagination(page, data.totalPages); // Adjust pagination based on filtered results
                } else {
                    blogContainer.innerHTML = '<p class="no-blogs">No Blogs Found.</p>';
                }
            } catch (error) {
                console.error('Error fetching filtered blogs:', error);
            }
        });
    } else {
        blogContainer.innerHTML = '<p class="no-blogs">No Blogs Found.</p>';
    }
}


    // Function to load the next page
    function nextPage() {
        currentPage += 1;
        handleBlogs(currentPage); // Load the next page of blogs
    }
    
    // Function to load the previous page
    function prevPage() {
        if (currentPage > 1) {
            currentPage -= 1;
            handleBlogs(currentPage); // Load the previous page of blogs
        }
    }
    
    // Function to set up pagination buttons (you can expand this based on your needs)
    function setupPagination(page, blogsCount) {
        const prevButton = document.getElementById('prevPage');
        const nextButton = document.getElementById('nextPage');
    
        // Disable the "Previous" button if on the first page
        prevButton.disabled = page === 1;
        prevButton.classList.toggle('opacity-50', page === 1); // Apply reduced opacity when disabled
        prevButton.classList.toggle('cursor-not-allowed', page === 1); // Change cursor style when disabled
    
        // Disable the "Next" button if fewer than blogsPerPage blogs are returned or no blogs
        const noMoreBlogs = blogsCount < blogsPerPage || blogsCount === 0;
        nextButton.disabled = noMoreBlogs;
        nextButton.classList.toggle('opacity-50', noMoreBlogs);
        nextButton.classList.toggle('cursor-not-allowed', noMoreBlogs);
    }
    

handleBlogs();


function redirectToReadPage(blogUser, blogId) {
    window.location.href = `read.html`;
    sessionStorage.setItem('blogUser', blogUser);
    sessionStorage.setItem('blogId', blogId);
    
}