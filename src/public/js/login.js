const botonLogin = document.getElementById("loginButton");
botonLogin.addEventListener("click",async(e)=>{
    e.preventDefault()
    const email = document.getElementById("userEmailLogin").value;
    const password = document.getElementById("userPasswordLogin").value;
    const datosLogin = {email,password}

    try {
        const response = await fetch('/api/session/testLogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify(datosLogin),          
        });
        location.href = response.url;
    }
    catch(error){
        return error
    }
})



document.getElementById("goToRegister").addEventListener("click",(e)=>{
    e.preventDefault();
    window.location.href = "/user/register"
})