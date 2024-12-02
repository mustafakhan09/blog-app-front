


async function dltblog(blogUser, blogId) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error("User is not authenticated. Please log in first.");
        return;
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
        return data.blogs; 
    } else {
        console.error('Error delete blogs:', response.status);
        return null;
    }
} catch (error) {
    console.error('Error:', error);
    return null;
}


}

dltblog()
