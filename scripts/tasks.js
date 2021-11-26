// window.onload = function (){

// que raro, no hace falta el onload si dejo como atributo el "defer"

// }

let nameUser = document.querySelector(".user-info p");
//console.log(nameUser.innerText);
let form = document.querySelector("form");
//console.log(form);
let newTarea = document.querySelector("#nuevaTarea");

/* aca consulto el nombre del usuario y lo muestro en el HTML */
const url = 'https://ctd-todo-api.herokuapp.com/v1/users/getMe';

const settings ={
    method : 'GET',
    //body: JSON.stringify(user),
    headers:{
        "authorization" : localStorage.getItem('jwt'),
        "Content-type" :"application/json; charset=UTF-8"
    }
};


fetch(url, settings)
.then(response => {
    console.log(response);
    if(response.ok){
        return response.json();
    }
    else{
        console.log("Error con response");
    }
})
.then(data =>{
    console.log(data);
    if(data){
        nameUser.innerText = data.firstName + " " + data.lastName;
    }
    
});

/* Creo que deberia renderizar primero las tareas que estan en la API de mi usuario*/

let tareasPendientes = document.querySelector(".tareas-pendientes");
let tareasTerminadas = document.querySelector(".tareas-terminadas");

const promesa = new Promise ((resolve, reject)=>{
    fetch('https://ctd-todo-api.herokuapp.com/v1/tasks',
        {
        method : 'GET',
        headers:{
            "authorization" : localStorage.getItem('jwt'),
            "Content-type" :"application/json; charset=UTF-8"
        }
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        //console.log(data);

        data.forEach(element => {
            if(element.completed == false){  
                if (element){
                    renderizarPendientes(element);
                    resolve(element);
                }else{
                    reject("error no hay datos pendientes para renderizar");
                }

            }else if((element.completed == true)){
                if (element){
                    renderizarTerminadas(element);
                    resolve(element);
                }else{
                    reject("error no hay datos terminados para renderizar");
                }
            }
        //renderizar

        });
    })
})

/* Aca ingreso una nueva tarea a la APi y la pongo en la lista de tareas pendientes */

form.addEventListener('submit',function(e){
    e.preventDefault();
    if(isNaN(newTarea.value)){
        const user = {       
        "description": newTarea.value,
        "completed": false
        }
        fetch('https://ctd-todo-api.herokuapp.com/v1/tasks',
        {
            method : 'POST',
            body: JSON.stringify(user),
            headers:{
                "authorization" : localStorage.getItem('jwt'),
                "Content-type" :"application/json; charset=UTF-8"
            }
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data){
                
                //animacion de load (pendiente)
                /*
                let load = document.createElement("i");
                form.appendChild(load);
                load.setAttribute("class","fas fa-spinner");
                */

                renderizarPendientes(data);
            }
        })
      
    }else{
        console.log("Error, tarea incorrecta");
    }

});



promesa.then(res => {

    /*Aca muevo la tarea de listas pendientes a termiandas y actualizo la api */

    let checkTareas = document.querySelectorAll(".not-done");
    console.log(checkTareas);
    checkTareas.forEach(function(checkTarea){
        checkTarea.addEventListener("click", ()=>{
            if(confirm("Termino esta tarea?")){
                fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${checkTarea.id}`,
                {
                    method : 'PUT',
                    body: JSON.stringify({"completed":true}),
                    headers:{
                        "authorization" : localStorage.getItem('jwt'),
                        "Content-type" :"application/json; charset=UTF-8"
                    }
                })
                .then(response => {
                    if(response.ok){
                        location.reload();
                    }else{
                        console.log("error al terminar tarea");
                    }
                    //return response.json();
                });
            }
        });
    });


    /*Aca elimno Tareas y actualizo la API */
    let delTareas = document.querySelectorAll(".fa-trash-alt");

    delTareas.forEach(function(delTarea){
        delTarea.addEventListener("click",()=>{
            if(confirm("Desea eliminar esta Tarea?")){
                fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${delTarea.id}`,
                {
                    method : 'DELETE',
                    headers:{
                        "authorization" : localStorage.getItem('jwt'),
                        "Content-type" :"application/json; charset=UTF-8"
                    }
                })
                .then(response => {
                    if(response.ok){
                        //averiguar como renderizar en vivo. es una porqueria tener que recargar todo.
                        location.reload();
                    }else{
                        console.log("error al eliminar la tarea");
                    }
                    //return response.json();
                });
            }
        })

        /*Aca restauro Tareas Terminadas actualizando la Api y renderizo nuevamente */
        let resTareas = document.querySelectorAll(".fa-undo-alt");

        resTareas.forEach(function(resTarea){
            resTarea.addEventListener("click", ()=>{
                if(confirm("Desea restablecer esta tarea?")){
                    fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${resTarea.id}`,
                    {
                        method : 'PUT',
                        body: JSON.stringify({"completed":false}),
                        headers:{
                            "authorization" : localStorage.getItem('jwt'),
                            "Content-type" :"application/json; charset=UTF-8"
                        }
                    })
                    .then(response => {
                        if(response.ok){
                            location.reload();
                        }else{
                            console.log("error al restablecer tarea");
                        }
                        //return response.json();
                    });
                }
            });
        });


    });

});

let cerrarSesion = document.querySelector("#closeApp");
cerrarSesion.addEventListener("click", ()=>{
    localStorage.clear();
    location.href = "index.html";
})



function renderizarPendientes(data){
    tareasPendientes.innerHTML += `
        <li class="tarea">
        <div class="not-done change" id="${data.id}""></div>
        <div class="descripcion">
        <p class="nombre">${data.description}</p>
        <p class="timestamp"><i class="far
        fa-calendar-alt"></i>${data.createdAt}</p>
        </div>
        </li>`;
}

function renderizarTerminadas(data){
    tareasTerminadas.innerHTML +=`
        <li class="tarea">
        <div class="done"></div>
        <div class="descripcion">
        <p class="nombre">${data.description}</p>
        <div>
        <button><i id="${data.id}" class="fas
        fa-undo-alt change"></i></button>
        <button><i id="${data.id}" class="far
        fa-trash-alt"></i></button>
        </div>
        </d`;
}



// let div = document.createElement("div");
// let boton = document.createElement("button");
// let i = document.createElement("i");
// boton.appendChild(i);
// div.appendChild(boton);
// tareas[0].appendChild(div);

// let nombre = tareas[0].querySelector(".nombre");
// let conteiner = tareas[0].querySelector(".not-done");

// conteiner.setAttribute("class", "done");
// nombre.innerText = "fulanito";
// console.log(nombre);



