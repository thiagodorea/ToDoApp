

function retiraEspacos(texto){
    return texto.trim()
};

function emailValido(email) {
    var emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return emailRegex.test(email);
}
