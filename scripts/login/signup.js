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

let dadosUsuario = {
    nome:"",
    sobreNome:"",
    email:"",
    senha:""
};

btnCriar.addEventListener("click", function(evento){
    if(formularioValido(imputNome.value,imputSobreNome.value,imputEmail.value,imputSenha.value)){
        evento.preventDefault();
        
        nome = retiraEspacos(imputNome.value);
        sobreNome = retiraEspacos(imputSobreNome.value);
        email = retiraEspacos(imputEmail.value);
        senha = retiraEspacos(imputSenha.value);
    
        dadosUsuario.nome = nome;
        dadosUsuario.sobreNome = sobreNome;
        dadosUsuario.email = email;
        dadosUsuario.senha = senha;
        let usuarioJson = JSON.stringify(dadosUsuario);
        console.log(usuarioJson);
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

    // validaCampo(validacaoSenha,imputSenha,campoObrigatorio);
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
    console.log("Conferindo senha")
    if(imputSenha.value !== imputRepeteSenha.value && imputRepeteSenha.value.length > 0){
        validaCampo(validacaoRepeteSenha,imputRepeteSenha,senhaDiferente);
        return false
    }else{
        validaCampo(validacaoRepeteSenha,imputRepeteSenha,campoObrigatorio);
        return true
    }
};