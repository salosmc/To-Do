
let form = document.querySelector("form");

let namee = {
    DOM : form.querySelector(".input-name"),
    complet : false,
    minCar : 4,
    maxCar : 10
};
let surname = {
    DOM : form.querySelector(".input-surname"),
    complet : false,
    minCar : 4,
    maxCar : 10
};
let email = {
    DOM : form.querySelector(".input-email"),
    complet : false,
    minCar : 4,
    maxCar : 10
}
let password = {
    DOM : form.querySelector(".input-password"),
    complet : false,
    minCar : 4,
    maxCar : 10
};
let repPassword = {
    DOM : form.querySelector(".input-repeatPassword"),
    complet : false,
    minCar : 4,
    maxCar : 10
}

let fieldsForm = [ namee, surname, email, password, repPassword ];

let loginRegister = [];
let mensajeErr = []

let botton = form.querySelector("button");
botton.setAttribute("disabled","true");

function validate(){
    if(isCompletField()){
        activarBoton();
    }else{
        desactivarBoton();
        //aca modria mostrar un mensaje datos incompletos
    }
}

fieldsForm.forEach(function(element){
    element.DOM.addEventListener('keyup', function(e){
        element.complet = isLengthField(element.DOM.value.length, element.minCar, element.maxCar);
        validate();
        borderFieldClear(element.DOM);
    })
})
// namee.addEventListener('keyup',function(e){
//     nameCompleto = isStringField(e.key, namee.value.length, minCarField, maxCarField);
//     validate();
// });

// surname.addEventListener('keyup',function(e){
//     surnameCompleto = isStringField(e.key, surname.value.length, minCarField, maxCarField);
//     validate();
// });

// email.addEventListener('keyup',function(){
//     emailCompleto = isLengthField(email.value.length, minCarField, maxCarField);
//     validate();
// });
// password.addEventListener('keyup',function(){
//     passCompleto = isLengthField(password.value.length, minCarField, maxCarField);
//     recPassCompleto = (password.value == repPassword.value);
//     validate();
// });
// repPassword.addEventListener('keyup',function(){
//     passCompleto = isLengthField(password.value.length, minCarField, maxCarField);
//     recPassCompleto = (password.value == repPassword.value);
//     validate();
// });

form.addEventListener('submit',function(e){
    e.preventDefault();

    //const url = "https://ctd-todo-api.herokuapp.com/v1/users";
    const url = "https://ctd-fe2-todo.herokuapp.com/v1/users";

    if(!isValidnameAndSurname() || !isValidEmail() || !isValidPass() ){
        console.log("Datos Invalidos");
    }else{
        const user = {
            firstName : namee.DOM.value,
            lastName: surname.DOM.value,
            email: email.DOM.value,
            password: password.DOM.value
        }

        postApi(url,user)
        .then( res => {
            console.log(res);
            if(res.jwt){
                console.log(res);
                // location.href = "index.html";
            }else{
                console.error(res);
            }
        });
    }
});


//---------------------- Funciones ------------------------


async function postApi(url, user){
    const settings ={
        method : 'POST',
        body: JSON.stringify(user),
        headers:{
            "Content-type" :"application/json; charset=UTF-8",
        }
    };

    return fetch(url,settings)
    .then(response => response.json());
}

function isValidnameAndSurname(){
    if (isNaN(namee.DOM.value) && isNaN(surname.DOM.value)){
        namee.DOM.value = namee.DOM.value.toLowerCase();
        namee.DOM.value = namee.DOM.value.charAt(0).toUpperCase() + namee.DOM.value.slice(1);
        surname.DOM.value = surname.DOM.value.toLowerCase();
        surname.DOM.value = surname.DOM.value.charAt(0).toUpperCase() + surname.DOM.value.slice(1);
        borderFieldOkey(namee.DOM);
        borderFieldOkey(surname.DOM);
        return true;
    }else{
        borderFieldFail(namee.DOM);
        borderFieldFail(surname.DOM);
        return false;
    }
    
}

function isValidEmail(){
    let refex = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$");
    
    if(email.complet && refex.test(email.DOM.value)){
        email.DOM.value = email.DOM.value.toLowerCase();
        borderFieldOkey(email.DOM);
        return true;
    }else{
        borderFieldFail(email.DOM);
        return false;
    }
    
}

function isValidPass(){
    let refex = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])");

    if(password.complet && refex.test(password.DOM.value) && (password.DOM.value == repPassword.DOM.value) ){
        borderFieldOkey(password.DOM);
        borderFieldOkey(repPassword.DOM);
        return true;
    }else{
        borderFieldFail(password.DOM);
        borderFieldFail(repPassword.DOM);
        return false;
    }
    
}

//--------------- Funciones Adicionales ---------

// function isStringField(key, length, min, max){
//     return (isNaN(key) && isLengthField(length, min, max));
// }

function isLengthField(length, min, max){
    return (length >=min && length <= max);
}

function isCompletField(){
    let status = true ;
    fieldsForm.forEach(function(element){
        status = status && element.complet;
    }) ;
    return status;
}

function activarBoton(){
    botton.removeAttribute("disabled");
    botton.style.backgroundColor= "blue";
}

function desactivarBoton(){
    botton.setAttribute("disabled","true");
    botton.style.backgroundColor="#7898FF";
}

function borderFieldOkey(dom){
    dom.style.border = "1px solid blue";
}
function borderFieldFail(dom){
    dom.style.border = "1px solid red ";
}
function borderFieldClear(dom){
    dom.style.border = "1px solid #F2F2F2 ";
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



