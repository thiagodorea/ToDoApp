let BASE_URL = "https://ctd-todo-api.herokuapp.com/v1"

let inputEmail = document.getElementById("inputEmail");
let inputPassword = document.getElementById("inputPassword");
let btnAcessar = document.getElementById("btnAcessar");
let validacaoEmail = document.getElementById("validacaoEmail");
let validacaoPassword = document.getElementById("validacaoPassword");

const toastLive = document.getElementById('toastErro');
const msgToast = document.getElementById('toastBody')
const toastErro = new bootstrap.Toast(toastLive);

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
            erro => {
                if(erro.status == 400 ) {
                    loginFalha("Senha inválida");
                }else if(erro.status == 404){
                    loginFalha("E-mail inválido");
                }else{
                    loginFalha(erro);
                }
            }
        )
    }else{
        loginFalha("Login Inválido");
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
    console.log(res);
};

function loginFalha(res) {
    msgToast.innerHTML = `<i class="fa-regular fa-face-angry"> </i> ${res}`;
    toastErro.show();
};

