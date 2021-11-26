let form = document.querySelector("form");

let namee = form[0];
let surname = form[1];
let email = form[2];
let password = form[3];
let repPassword = form[4];
let botton = form[5];

let nameCompleto = false;
let surnameCompleto = false;
let emailCompleto = false;
let passCompleto = false;
let recPassCompleto = false;

let loginRegister = [];

let mensajeErr = []


botton.setAttribute("disabled","true");

function validate(){
    if(isCompletField()){
        
        activarBoton();
    }else{
        desactivarBoton();
        //aca modria mostrar un mensaje datos incompletos
    }
}

const minCarField = 4;
const maxCarField = 10;


namee.addEventListener('keyup',function(e){
    nameCompleto = isStringField(e.key, namee.value.length, minCarField, maxCarField);
    validate();
});

surname.addEventListener('keyup',function(e){
    surnameCompleto = isStringField(e.key, surname.value.length, minCarField, maxCarField);
    validate();
});

email.addEventListener('keyup',function(){
    emailCompleto = isLengthField(email.value.length, minCarField, maxCarField);
    validate();
});
password.addEventListener('keyup',function(){
    passCompleto = isLengthField(password.value.length, minCarField, maxCarField);
    recPassCompleto = (password.value == repPassword.value);
    validate();
});
repPassword.addEventListener('keyup',function(){
    passCompleto = isLengthField(password.value.length, minCarField, maxCarField);
    recPassCompleto = (password.value == repPassword.value);
    validate();
});

form.addEventListener('submit',function(e){
    e.preventDefault();

    const url = "https://ctd-todo-api.herokuapp.com/v1/users";
    
    if(!isValidnameAndSurname() || !isValidEmail() || !isValidPass() ){
        console.log("Datos Invalidos");
    }else{
        const user = {
            firstName : namee.value,
            lastName: surname.value,
            email: email.value,
            password: password.value
        }

        const settings ={
            method : 'POST',
            body: JSON.stringify(user),
            headers:{
                "Content-type" :"application/json; charset=UTF-8",
            }
        };

        fetch(url,settings)
        .then((response) => {
            console.log(response);
            return response.json();
        })
        .then((data) => {
            console.log(data);
            if(data.jwt){
                // const usuario ={
                //     jwt : data.jwt,
                //     user : user
                // }
                // localStorage.setItem('user',JSON.stringify(usuario)); // si quiero guardar al usuario en el LOCAL
                location.href = "index.html";
                
            }

        });

        // location.href = "mis-tareas.html";
    }

});


//---------------------- Funciones ------------------------

function isValidnameAndSurname(){
    if (nameCompleto && surnameCompleto){
        namee.value = namee.value.toLowerCase();
        namee.value = namee.value.charAt(0).toUpperCase() + namee.value.slice(1);
        surname.value = surname.value.toLowerCase();
        surname.value = surname.value.charAt(0).toUpperCase() + surname.value.slice(1);
        return true;
    }else{

        //setTimeout(function(){ alert("Hello"); }, 3000);
        return false;
    }
    
}

function isValidEmail(){
    let refex = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$");
    
    if(emailCompleto && refex.test(email.value)){
        email.value = email.value.toLowerCase();
        return true;
    }else{
        //email.style.color = "red";
        return false;
    }
    
}

function isValidPass(){
    let refex = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])");

    if(passCompleto && refex.test(password.value)){
        return true;
    }else{
        //password.style.color = "red";
        return false;
    }
    
}

//--------------- Funciones Adicionales ---------

function isStringField(key, length, min, max){
    return (isNaN(key) && isLengthField(length, min, max));
}

function isLengthField(length, min, max){
    return (length >=min && length <= max);
}

function isCompletField(){
    return nameCompleto && surnameCompleto && emailCompleto && passCompleto && recPassCompleto;
}

function activarBoton(){
    botton.removeAttribute("disabled");
    botton.style.backgroundColor= "blue";
}

function desactivarBoton(){
    botton.setAttribute("disabled","true");
    botton.style.backgroundColor="#7898FF";
}

/*
Los datos validados ingresados se consideraron de manera escalar
1. La primera validacion es de cantidad de caracteres y tipo de caracteres segun los campos,
    tambien se validaron las condiciones trivialesde contraseña. por ejemplo que se ponga la misma contraseña
    en ambos campos. Una vez validado esto, recien se activa el boton.

2. La segunda validacion es con respecto a los al formato de las cosas que se completan en el campo
    por ejemplo que el nombre y Apellido se ponga todo en minuscula salvo la primera letra
    Que el mail tenga formato de mail "algo@algo.com"
    Y que la contraseña tenga valores alfanumericos.
    Una vez validado recien esto en el evento de "submit", si esta todo okey se envia al enlace.
    O se hace un arreglo de errores para mostrar.

Requisitos
    Nombre y Apellido

    Email

    Password
        entre 4 y 10 caracteres.
        por lo menos 1 en mayuscula, una en minusculas y un numero*.
*/



