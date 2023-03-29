const botonRegistro = document.getElementById("registerButton");


botonRegistro.addEventListener("click",async(e)=>{
    e.preventDefault();
    const firstName = document.getElementById("userFirstName").value
    const lastName = document.getElementById("userLastName").value
    const email = document.getElementById("userEmailRegister").value
    const password1 = document.getElementById("userPasswordRegister1").value
    const password2 = document.getElementById("userPasswordRegister2").value
    const age = document.getElementById("userAge").value
    const mensajeRegistro = document.getElementById("mensajeRegistro");
    if (firstName.length>0 && lastName.length>0 && email.length>0 && password1.length>0 && password2.length>0 && age.length>0){
        if (password1!=password2){
            mensajeRegistro.innerText = "Las contraseñas deben ser iguales";
        }else{
            const response = await fetch(`/user/email/${email}`, {
                method: 'GET'     
            });
            try{
                const userFromResponse = await response.json();
                mensajeRegistro.innerText = "El email que ingresaste ya existe"
            }catch{
                const newUser= {
                    first_name:firstName,
                    last_name:lastName,
                    email:email,
                    age:parseInt(age),
                    rol:"User",
                    password:password1
                }
                await fetch('/user/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newUser),
                });
                mensajeRegistro.innerText = "Usuario creado correctamente"
                window.location.href = "/api/session/login"

            }
        }
    }else
    {
        mensajeRegistro.innerText = "Debe llenar todos los campos"
    }
})

const eventoMensaje = document.getElementById("mensajeRegistro");

document.getElementById("userFirstName").addEventListener("click",()=>{
    eventoMensaje.innerText="";
})

document.getElementById("userLastName").addEventListener("click",()=>{
    eventoMensaje.innerText="";
})


document.getElementById("userEmailRegister").addEventListener("click",()=>{
    eventoMensaje.innerText="";
})


document.getElementById("userPasswordRegister1").addEventListener("click",()=>{
    eventoMensaje.innerText="";
})


document.getElementById("userPasswordRegister2").addEventListener("click",()=>{
    eventoMensaje.innerText="";
})


document.getElementById("userAge").addEventListener("click",()=>{
    eventoMensaje.innerText="";
})


document.getElementById("goToLogin").addEventListener("click",(e)=>{
    e.preventDefault();
    window.location.href = "/api/session/login"
})