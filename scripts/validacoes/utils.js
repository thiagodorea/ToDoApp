let BASE_URL = "https://ctd-todo-api.herokuapp.com/v1"

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

function dataFormatada(dt){
    var data = new Date(dt),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
}