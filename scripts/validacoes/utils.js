let BASE_URL = "https://ctd-fe2-todo-v2.herokuapp.com/v1";

function retiraEspacos(texto){
    return texto.trim();
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
    };
};

function dataFormatada(dt){
    var data = new Date(dt),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
};

function toastAlert(res,tipo) {
    let body = document.body;
    if(document.querySelector('.toast-container') == null ){
    let toastDiv = document.createElement('div');
        toastDiv.className = "toast-container position-fixed top-0 end-0 p-3";
        body.appendChild(toastDiv);}
        document.querySelector('.toast-container').innerHTML = 
        `<div class="toast align-items-center text-white border-0" id="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body fs-6" id="toastBody"> </div>
                    <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>`

    const toastLive = document.getElementById('toast');
    const msgToast = document.getElementById('toastBody')
    const toast = new bootstrap.Toast(toastLive);

    if(tipo=="danger"){
        toastLive.classList.remove('bg-success'),
        toastLive.classList.add('bg-danger');
        msgToast.innerHTML = `<i class="fa-regular fa-thumbs-down"> </i> ${res}`;
    };
    if(tipo=="success"){
        toastLive.classList.remove('bg-danger');
        toastLive.classList.add('bg-success');
        msgToast.innerHTML = `<i class="fa-regular fa-thumbs-up"> </i> ${res}`;
    };

    toast.show();
};