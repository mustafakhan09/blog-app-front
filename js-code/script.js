document.addEventListener('DOMContentLoaded', function() {
    const currentUrl = window.location.pathname;
    const navButtons = document.querySelectorAll('.nav-btn');

    // Remove 'active' background color from all buttons
    navButtons.forEach(button => button.classList.remove('bg-purple-400'));

    // Add 'bg-purple-400' to the correct button based on the URL
    if (currentUrl.endsWith('index.html')) {
        document.getElementById('homeBtn').classList.add('bg-purple-400');
    } else if (currentUrl.endsWith('post.html')) {
        document.getElementById('post-blogs').classList.add('bg-purple-400');
    } else if (currentUrl.endsWith('about.html')) {
        document.getElementById('aboutBtn').classList.add('bg-purple-400');
    }
});



document.getElementById('logout').addEventListener('click', function() {
    localStorage.removeItem('authToken');
    window.location.href =  'login-register.html';
  });



  // Select the sidebar button and the nav-links container (ul)
const sidebarBtn = document.getElementById('sidebarBtn');
const navLinksContainer = document.querySelector('.nav-links');

// Toggle visibility of the entire nav-links container on button click
sidebarBtn.onclick = () => {
    navLinksContainer.classList.toggle('hidden');
     // Add or remove 'hidden' to control display
    // navLinksContainer.classList.toggle('h-full'); // Add or remove 'hidden' to control display

};


if (!localStorage.getItem('authToken')) {
   window.location.href = 'login-register.html';
}