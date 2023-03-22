const socket = io()

const botonChat = document.getElementById("btnChat")
const parrafosMensajes = document.getElementById("parrafosMensajes")
const nombreUsuario = document.getElementById("nombreUsuario")
const emailUsuario = document.getElementById("emailUsuario")
const mensaje = document.getElementById("textoUsuario")




botonChat.addEventListener("click", (e) => {
    e.preventDefault();
    if(mensaje.value.trim().length > 0) {
        const newMessage={
            nombre:nombreUsuario.value,
            email: emailUsuario.value,
            message: mensaje.value
        }
        mensaje.value="";
        socket.emit("message", newMessage)
        textoUsuario.value = "" 
    }else{
        console.error("Mensaje vacio")
    }
})

socket.on("allMessages", arrayMensajes => {
    parrafosMensajes.innerHTML = "" //Limpio lo que serian los parrafos
    arrayMensajes.forEach(mensaje => {
        parrafosMensajes.innerHTML += `<p><strong>${mensaje.nombre}</strong>(${mensaje.email}): ${mensaje.message} </p>`
    });
})