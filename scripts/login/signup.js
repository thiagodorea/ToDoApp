let imputNome = document.getElementById("imputNome");
let imputSobreNome = document.getElementById("imputSobreNome");
let imputEmail = document.getElementById("imputEmail");
let imputSenha = document.getElementById("imputSenha");
let imputRepeteSenha = document.getElementById("imputRepeteSenha");
let btnCriar = document.getElementById("btnCriarConta");

let validacaoNome = document.getElementById("validacaoNome");
let validacaoSobreNome = document.getElementById("validacaoSobreNome");
let validacaoEmail = document.getElementById("validacaoEmail");
let validacaoSenha = document.getElementById("validacaoSenha");
let validacaoRepeteSenha = document.getElementById("validacaoRepeteSenha");

const toastLive = document.getElementById('toast');
const msgToast = document.getElementById('toastBody')
const toast = new bootstrap.Toast(toastLive);

let dadosUsuario = {
    firstName:"",
    lastName:"",
    email:"",
    password:""
};

btnCriar.addEventListener("click", function(evento){
    if(formularioValido(imputNome.value,imputSobreNome.value,imputEmail.value,imputSenha.value)){
        evento.preventDefault();

        dadosUsuario.firstName = retiraEspacos(imputNome.value);
        dadosUsuario.lastName = retiraEspacos(imputSobreNome.value);
        dadosUsuario.email = retiraEspacos(imputEmail.value);
        dadosUsuario.password = retiraEspacos(imputSenha.value);
        let usuarioJson = JSON.stringify(dadosUsuario);

        //Comunicação com a API
        let configRequest = {
            method: "POST",
            headers:{
                "Content-type":'Application/Json',
                "Access-Control-Allow-Origin": "*"
            },
            body:usuarioJson
        }
        fetch(`${BASE_URL}/users`,configRequest)
        .then( res => {
            if(res.status == 200 || res.status == 201) {
                return res.json();
            }else{
                throw res;
            }
        })
        .then(
            res => {
                toastAlert("Usuário criado com sucesso","success");
                loginSucesso();
            }
        )
        .catch(
            erro => {
                if(erro.status == 400 || erro.status == 404){
                    toastAlert("Usuário já existe","danger");
                }else{
                    toastAlert(erro,"danger");
                }
            }
        )
    }else{
        toastAlert("Falha ao enviar os dados.","danger");
    };
});

imputNome.addEventListener("keyup", () =>{
    validaCampo(validacaoNome,imputNome,campoObrigatorio);
    formularioValido(imputNome.value,imputSobreNome.value,imputEmail.value,imputSenha.value)
});

imputSobreNome.addEventListener("keyup", () =>{
    validaCampo(validacaoSobreNome,imputSobreNome,campoObrigatorio);
    formularioValido(imputNome.value,imputSobreNome.value,imputEmail.value,imputSenha.value)
});

imputEmail.addEventListener("keyup", () =>{
    validaCampo(validacaoEmail,imputEmail,campoObrigatorio);
    formularioValido(imputNome.value,imputSobreNome.value,imputEmail.value,imputSenha.value)
});


imputSenha.addEventListener("keyup", () =>{
    validaCampo(validacaoSenha,imputSenha,campoObrigatorio);
    formularioValido(imputNome.value,imputSobreNome.value,imputEmail.value,imputSenha.value)
});

imputRepeteSenha.addEventListener("keyup", () =>{
    conferiSenha();
    formularioValido(imputNome.value,imputSobreNome.value,imputEmail.value,imputSenha.value)
});


function formularioValido(nome,sobreNome,email,senha){
    if(nome && sobreNome && email && senha && emailIsValid(email,validacaoEmail,imputEmail) && conferiSenha()){
        btnCriar.removeAttribute("disabled");
        btnCriar.style.backgroundColor="#7898FF";
        btnCriar.style.color="#ffffff";
        return true;
    }else{
        btnCriar.setAttribute("disabled","disabled");
        btnCriar.style.backgroundColor="#F2F2F2";
        btnCriar.style.color="#808080";
        return false;
    }
};

function conferiSenha(){
    if(imputSenha.value !== imputRepeteSenha.value){
        validaCampo(validacaoRepeteSenha,imputRepeteSenha,senhaDiferente);
        return false
    }else{
        validaCampo(validacaoRepeteSenha,imputRepeteSenha,campoObrigatorio);
        return true
    }
};

function loginSucesso() {
    imputNome.value = '';
    imputSobreNome.value = '';
    imputEmail.value = '';
    imputSenha.value = '';
    imputRepeteSenha.value = '';
    setTimeout(() => {
        location.href = "index.html"
    },2000);
};