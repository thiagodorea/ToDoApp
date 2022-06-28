

function retiraEspacos(texto){
    return texto.trim()
};

function emailIsValid(email, campo, input) {
    let emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    let isValid = emailRegex.test(email);
    if(isValid){
        campo.innerText = "" ;
        input.style.border = formatoValido;
    }else {
        campo.innerText = emailInvalido;
        input.style.border = formatoInvalido;
    }
    return emailRegex.test(email);
};

function validaCampo(campo,input,mensagem){
    if(input.value !== "" && mensagem === senhaDiferente){
        campo.innerText = mensagem;
        input.style.border = formatoInvalido;
    }else if(input.value){
        campo.innerText = "" ;
        input.style.border = formatoValido;
    }else {
        campo.innerText = mensagem;
        input.style.border = formatoInvalido;
    }
}

