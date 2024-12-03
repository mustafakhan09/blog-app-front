
let currentPage = 1;
const blogsPerPage = 5; 
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
    const blogs = await getData(page);
    const blogContainer = document.getElementById('Get-blogs');
    const searchInput = document.getElementById('searchInput');

    function renderBlogs(filteredBlogs) {
        let blogsHTML = '';

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
        setupPagination(page, blogs.length);
    }

    if (blogs && blogs.length > 0) {
        renderBlogs(blogs);

        searchInput.addEventListener('input', async function () {
            const searchTerm = searchInput.value.toLowerCase();
            const token = localStorage.getItem('authToken');

            if (searchTerm === '') {
                const allBlogs = await getData(page);
                renderBlogs(allBlogs);
                setupPagination(page, allBlogs.length);
                return;
            }

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
                    setupPagination(page, data.totalPages); 
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


    function nextPage() {
        currentPage += 1;
        handleBlogs(currentPage); 
    }
    
    function prevPage() {
        if (currentPage > 1) {
            currentPage -= 1;
            handleBlogs(currentPage);
        }
    }
    
    function setupPagination(page, blogsCount) {
        const prevButton = document.getElementById('prevPage');
        const nextButton = document.getElementById('nextPage');
    
        prevButton.disabled = page === 1;
        prevButton.classList.toggle('opacity-50', page === 1); 
        prevButton.classList.toggle('cursor-not-allowed', page === 1); 
    
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
