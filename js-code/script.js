document.addEventListener('DOMContentLoaded', function() {
    const currentUrl = window.location.pathname;
    const navButtons = document.querySelectorAll('.nav-btn');

    navButtons.forEach(button => button.classList.remove('bg-purple-400'));

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




const sidebarBtn = document.getElementById('sidebarBtn');
const navLinksContainer = document.querySelector('.nav-links');

sidebarBtn.onclick = () => {
    navLinksContainer.classList.toggle('hidden');


};


if (!localStorage.getItem('authToken')) {
   window.location.href = 'login-register.html';
}
