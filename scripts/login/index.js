let email = document.getElementById("inputEmail");
let password = document.getElementById("inputPassword");
let btnAcessar = document.getElementById("btnAcessar");
let validacaoEmail = document.getElementById("validacaoEmail");
let validacaoPassword = document.getElementById("validacaoPassword");

let dadosLogin = {
    email:"",
    password:""
};

btnAcessar.addEventListener("click", function(evento){
    if(validaLogin(email.value, password.value)){
        evento.preventDefault();
        email = retiraEspacos(email.value);
        password = retiraEspacos(password.value);
    
        dadosLogin.email = email;
        dadosLogin.password = password;
        let usuarioJson = JSON.stringify(dadosLogin);
        console.log(usuarioJson);
    };
});

email.addEventListener("blur", ()=>{
    if(email.value.length > 0 ){
        if(emailValido(email.value)){
            validacaoEmail.innerText = "" ;
            email.style.border = formatoValido;
        }else {
            validacaoEmail.innerText = emailInvalido;
            email.style.border = formatoInvalido;
        }
        validaLogin(email.value, password.value);
    };
});

email.addEventListener("keyup", () =>{
    if(email.value){
        validacaoEmail.innerText = "" ;
        email.style.border = formatoValido;
    }else {
        validacaoEmail.innerText = campoObrigatorio;
        email.style.border = formatoInvalido;
    }
    validaLogin(email.value, password.value);
}); 

password.addEventListener("keyup", () =>{
    if(password.value) {
        validacaoPassword.innerText = "" ;
        password.style.border = formatoValido;
    }else {
        validacaoPassword.innerText = campoObrigatorio;
        password.style.border = formatoInvalido;
    }
    validaLogin(password.value, password.value);
}) ;


function validaLogin(email, password){
    if(emailValido(email) && password){
        btnAcessar.removeAttribute("disabled");
        btnAcessar.style.backgroundColor="#7898FF";
        btnAcessar.style.color="#ffffff";
        return true;
    }else{
        btnAcessar.setAttribute("disabled","disabled");
        btnAcessar.style.backgroundColor="#F2F2F2";
        btnAcessar.style.color="#808080";
        return false;
    }
};

