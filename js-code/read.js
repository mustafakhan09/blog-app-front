let blogUser = sessionStorage.getItem('blogUser');
let blogId = sessionStorage.getItem('blogId'); 
let token = localStorage.getItem('authToken');



if (token) {
    try {

    const decodedToken = jwt_decode(token);


    const userId = decodedToken._id;
    if(userId) {

        console.log('User ID:', userId);    
    } else {
         console.error('User Id  not found in the token');
    }
    } catch (error) {
        console.log(error)
    }
    
} 


async function loadBlogContent(blogUser, blogId) {
    const token = localStorage.getItem('authToken');

    const decodedToken = jwt_decode(token);

  
    const userId = decodedToken._id; 

    if (!token) {
        console.error('User not authenticated');
        document.getElementById('blog-content').innerHTML = '<p>User not authenticated.</p>';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/blog/${blogUser}/${blogId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
         
        });

        if (!response.ok) {
            throw new Error('Failed to fetch blog data');
        }

        const data = await response.json();
        const blog = data.blogs[0];


        document.getElementById('blog-title').innerText = blog.title;
        document.getElementById('blog-content').innerHTML = blog.content; 

        let imageUrl = blog.image;
        if (imageUrl) {
            setBackground(imageUrl);
        }


        const commentsContainer = document.getElementById('comments-container');
        const commentCount = document.getElementById('comment-headings');
        commentCount.innerText = `Comments (${blog.comments.length})`;

        commentsContainer.innerHTML = '';

        blog.comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('comment');
            commentDiv.classList.add('2xs:block','2xs:mr-[2vw]', 'lg:flex');

            commentDiv.innerHTML = `
            <div class="comment-div flex">
                <strong>${comment.username}:</strong> <p class="comment-text w-[55vw]">${comment.comments}</p>
            </div>`;

            const commentBtnContainer = document.createElement('div');
            commentBtnContainer.classList.add('comment-btn');
            commentBtnContainer.classList.add('2xs:block','2xs:mr-[2vw]', 'lg:flex');



            if (userId === comment.userid) { 
                console.log(blogUser);
                console.log(comment.userid);
                
                 const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('delete-btn');
                deleteBtn.innerText = 'Delete';
                commentBtnContainer.appendChild(deleteBtn);

                const editBtn = document.createElement('button');
                editBtn.classList.add('edit-btn');
                editBtn.innerText = 'Edit';
                commentBtnContainer.appendChild(editBtn);

               

              
                editBtn.onclick = function() {
                    const commentTextElement = commentDiv.querySelector('.comment-text');
                    const originalComment = commentTextElement.innerText;
                    
                  
                    commentTextElement.innerHTML = `
                        <textarea class="edit-comment-text w-[44vw] h-[30vh] resize-none">${originalComment}</textarea>
                        <button class="save-btn bg-purple-500 text-white p-2 rounded m-1">Save</button>
                        <button class="cancel-btn bg-purple-500 text-white p-2 rounded m-1">Cancel</button>
                    `;

                    const saveBtn = commentDiv.querySelector('.save-btn');
                    const cancelBtn = commentDiv.querySelector('.cancel-btn');
                    const editTextarea = commentDiv.querySelector('.edit-comment-text');

              
                    saveBtn.onclick = async function() {
                        const updatedComment = editTextarea.value;

                        try {
                            const editResponse = await fetch(`http://localhost:3000/api/blog/comments/${blogId}/${comment._id}`, {
                                method: 'PATCH',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    comments: updatedComment
                                })
                            });

                            if (editResponse.ok) {
                                alert('Comment updated');
                                commentTextElement.innerHTML = updatedComment; // Update the displayed comment
                            } else {
                                throw new Error('Failed to update comment');
                            }
                        } catch (error) {
                            console.error('Error updating comment:', error);
                        }
                    };

                  
                    cancelBtn.onclick = function() {
                        commentTextElement.innerHTML = originalComment; // Revert to the original comment
                    };
                };

                // Handle delete button click
                deleteBtn.onclick = async function() {
                    const confirmed = confirm('Are you sure you want to delete this comment?');
                    if (confirmed) {
                        try {
                            const deleteResponse = await fetch(`http://localhost:3000/api/blog/comments/${blogId}/${comment._id}`
, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                }
                            });

                            if (deleteResponse.ok) {
                                alert('Comment deleted');
                                commentDiv.remove(); // Remove comment from the DOM
                            } else {
                                throw new Error('Failed to delete comment');
                            }
                        } catch (error) {
                            console.error('Error deleting comment:', error);
                        }
                    }
                };
            }

            commentDiv.appendChild(commentBtnContainer);
            commentsContainer.appendChild(commentDiv);
        });

    } catch (error) {
        console.error('Error fetching blog content:', error);
    }
}


loadBlogContent(blogUser, blogId);


function goBack() {
    window.location.href = "index.html";
}


function setBackground(imageUrl) {
    const targetElement = document.getElementById('backgroundElement');
    targetElement.style.backgroundImage = `url('${imageUrl}')`;
    targetElement.style.backgroundSize = 'cover';
    targetElement.style.backgroundPosition = 'center';
}


// http://localhost:3000/api/blog/comments/${blogid}/${commentsid}
// http://localhost:3000/api/blog/${blogid}/comments




async function postContent(blogId) {
    const comment = document.getElementById('comment-input').value;
   
    const token = localStorage.getItem('authToken');
        if (!token) {
            alert("User is not authenticated. Please log in first.");
            return;
        }
    
        const apiUrl = `http://localhost:3000/api/blog/comments/${blogId}`;
        
    
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    comments: comment,
                })
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log("Success:", data);
           
                document.getElementById('comment-input').value = '';
                
             
    
            
            } else {
                const errorData = await response.json();
                alert("Error creating post: " + errorData.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error occurred while posting.");
        }  
        loadBlogContent(blogUser, blogId);

    }
    
    document.getElementById('submitBtn').addEventListener('click', () => postContent(blogId),);

