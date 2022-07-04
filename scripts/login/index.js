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
        btnSpinner();
        dadosLogin.email = retiraEspacos(inputEmail.value);
        dadosLogin.password = retiraEspacos(inputPassword.value);
        let usuarioJson = JSON.stringify(dadosLogin);

        //Comunicação com a API
        let configRequest = {
            method: "POST",
            headers:{
                "Content-type":'Application/Json'
            },
            body:usuarioJson
        }
        fetch(`${BASE_URL}/users/login`,configRequest)
        .then( res => {
            btnSpinner(res.status);
            if(res.status == 200 || res.status == 201) {
                return res.json();
            }else{
                throw res;
            }
        })
        .then(
            res => {
                loginSucesso(res);
            }
        )
        .catch(
            error => {
                btnSpinner(error.status);
                if(error.status == 400 ) {
                    toastAlert("Senha inválida","danger");
                }else if(error.status == 404){
                    toastAlert("E-mail inválido","danger");
                }else{
                    toastAlert(error,"danger");
                }
            }
        )
    }else{
        toastAlert("Login Inválido","danger");
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

function loginSucesso(res) {
    sessionStorage.setItem("jwt",res.jwt);
    location.href = "tarefas.html";
    inputEmail.value = "";
    inputPassword.value = "";
};

function btnSpinner(status){
    if(status == undefined){
        btnAcessar.innerHTML=`
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        `
    }else{
        btnAcessar.innerHTML=`
        Acessar <i class="fa-solid fa-right-to-bracket"></i>
        `
    };
};