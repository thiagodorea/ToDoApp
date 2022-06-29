let sair = document.getElementById("closeApp");
let nomeUsuario = document.getElementById("nomeUsuario");
let userImage = document.getElementById("userImage");
let tarefasPendentes = document.getElementById("tarefasPendentes");

let tokenJwt;

onload = function(){
    tokenJwt = this.sessionStorage.getItem("jwt");
    !tokenJwt ? location.href = "index.html": buscarInfoUsuario();
};

sair.addEventListener("click",() =>{
    sessionStorage.removeItem("jwt");
    location.href = "index.html"
});


async function buscarInfoUsuario(){
    let configRequest = {
        method: "GET",
        headers: {
            "Content-type":'Application/Json',
            "Authorization": `${tokenJwt}`
        }
    }
    try{
        let resp = await fetch(`${BASE_URL}/users/getMe`,configRequest)
        let resposta = resp.json();
        resposta.then(res => {
            nomeUsuario.innerText = `Olá, ${res.firstName} ${res.lastName}`
            userImage.style.backgroundImage ='url("../assets/face.png")';
            buscarTask(res.id)
        });
    } catch(error){
        console.log(error);
    }
}

async function buscarTask(id){
    let configRequest = {
        method: "GET",
        headers: {
            "Content-type":'Application/Json',
            "Authorization": `${tokenJwt}`
        }
    }
    try{
        let resp = await fetch(`${BASE_URL}/tasks/`,configRequest)
        let resposta = resp.json();
        resposta.then(lista => {
            if(lista.length == 0){
                tarefasPendentes.innerHTML += `<div class="alert alert-primary" role="alert"> Você não tem nenhuma tarefa pendente. </div>`
            }else{
                for (item  of lista) {
                    tarefasPendentes.innerHTML +=
                    `
                    <li class="tarefa">
                    <div class="not-done"></div>
                    <div class="descricao">
                    <p class="nome">${item.description}</p>
                    <p class="timestamp">Criada em: ${dataFormatada(item.createdAt)}</p>
                    </div>
                    </li>
                    `
                }
            }
        });
    } catch(error){
        console.log(error);
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