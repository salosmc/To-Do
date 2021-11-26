//declamos variables

let form = document.querySelector('form');
let email = document.querySelector('#inputEmail');
let password = document.querySelector('#inputPassword');
const url = "https://ctd-todo-api.herokuapp.com/v1/users/login";

/* Implementamos proceso al evento submit del form */

form.addEventListener('submit',function(e){
    e.preventDefault();

    isUserExists();

});

async function postApi(url,user){
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

async function isUserExists(){
    const user ={
        email : email.value,
        password : password.value
    };

    let res = await postApi(url,user);

    if(res.jwt){
        console.log(res);
        // localStorage.setItem('jwt',res.jwt);
        // location.href = "mis-tareas.html";
    }
    else{
        //informar el error 
        console.log(res);
    }

}