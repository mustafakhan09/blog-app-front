// Toggle between login and register forms
var x = document.getElementById("login");
var y = document.getElementById("Register");
var z = document.getElementById("btn");

function Register() {
    x.style.left = "-400px";
    y.style.left = "50px";
    z.style.left = "110px";
}

function login() {
    x.style.left = "50px";
    y.style.left = "450px";
    z.style.left = "0px";
}



// Fetch API to handle registration
document.querySelector("#Register").addEventListener("submit", async function (e) {
    e.preventDefault();
    // Get the input values
    const username = document.querySelector("#Register input[type='text']").value;
    const password = document.querySelector("#Register input[type='password']").value;
    const email = document.querySelector("#Register input[type='Email']").value;
    const RegisterMessage = document.querySelector("#Register"); 

    RegisterMessage.textContent = "";
    RegisterMessage.style.display = "none";


    try {
        const response = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password,
                email: email
            })
        });

        // Process response
        const data = await response.json();
        if (response.ok) {
            console.log(data); // Handle the response data
            RegisterMessage.textContent = "Registration successful! Please log in.";
            RegisterMessage.style.display = "block";   
             
        } else {
            console.error(data); // Handle error
        }
    } catch (error) {
        console.error("Error:", error);
    }
});


document.querySelector("#login").addEventListener("submit", async function (e) {
    e.preventDefault();
   
    // Get the input values
    const username = document.querySelector("#login input[type='text']").value;
    const password = document.querySelector("#login input[type='password']").value;
    const errorMessage = document.querySelector("#error-message"); 

    errorMessage.textContent = "";
    errorMessage.style.display = "none";

    
    try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        // Process response
        const data = await response.json();

        if (response.ok) {
            const token = data.token; 
            

            if (token) {
        
                localStorage.setItem('authToken', token);
                console.log(data);
                window.location.href = "index.html";
            } else {
                errorMessage.textContent = "Login failed: Token not found.";
                errorMessage.style.display = "block";       
            
            }
        } else {
            errorMessage.textContent = data.message || "Login failed: Invalid username or password.";
            errorMessage.style.display = "block";
        }
    } catch (error) {
        console.error("Error:", error);
    }
});


window.onload = function() {
    // Check if a token exists in localStorage
    const token = sessionStorage.getItem('Token');
    
    // If the token exists, redirect to the main page
    if (token) {
      window.location.href = 'blog.html';  // Replace 'main.html' with the URL of your main page
    }
  };
  