let inputEmail = document.getElementById("inputEmail");
let inputPassword = document.getElementById("inputPassword");
let btnAcessar = document.getElementById("btnAcessar");
let validacaoEmail = document.getElementById("validacaoEmail");
let validacaoPassword = document.getElementById("validacaoPassword");

let dadosLogin = {
    email:"",
    password:""
};

btnAcessar.addEventListener("click", function(evento){
    if(validaLogin(inputEmail.value, inputPassword.value)){
        evento.preventDefault();
        email = retiraEspacos(inputEmail.value);
        password = retiraEspacos(inputPassword.value);
    
        dadosLogin.email = email;
        dadosLogin.password = password;
        let usuarioJson = JSON.stringify(dadosLogin);
        console.log(usuarioJson);
    };
});

inputEmail.addEventListener("keyup", () =>{
    validaCampo(validacaoEmail,inputEmail,campoObrigatorio);
    validaLogin(inputEmail.value, inputPassword.value);
}); 

inputPassword.addEventListener("keyup", () =>{
    validaCampo(validacaoPassword,inputPassword,campoObrigatorio);
    validaLogin(inputEmail.value, inputPassword.value);
});


function validaLogin(email, password){
    if(email && password && emailIsValid(email,validacaoEmail,inputEmail)){
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

