let sair = document.getElementById("closeApp");
let nomeUsuario = document.getElementById("nomeUsuario");
let userImage = document.getElementById("userImage");
let tarefasPendentes = document.getElementById("tarefasPendentes");

const exampleEl = document.getElementById('example')
const tooltip = new bootstrap.Tooltip(exampleEl, options)

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
        headers: {
            "Content-type":'Application/Json',
            "Authorization": `${tokenJwt}`
        }
    }
    try{
        let resp = await fetch(`${BASE_URL}/users/getMe`,configRequest)
        let resposta = await resp.json();
        if(resp.status == 200){
            setName(resposta);
            buscarTask();
        }
    } catch(error){
        showError(error);
    }
}

async function buscarTask(){
    let configRequest = {
        headers: {
            "Content-type":'Application/Json',
            "Authorization": `${tokenJwt}`
        }
    }
    try{
        let resp = await fetch(`${BASE_URL}/tasks/`,configRequest)
        let resposta = await resp.json();
        if(resposta.length == 0){
            tarefasPendentes.innerHTML += `<div class="alert alert-primary" role="alert"> Você não tem nenhuma tarefa pendente. </div>`;
        }else{
            for (item  of resposta) {
                setTask(item);
            }
        }
    } catch(error){
        showError(error);
    };
};

function setName(dados){
    nomeUsuario.innerText = `Olá, ${dados.firstName} ${dados.lastName}`;
    userImage.style.backgroundImage ='url("../assets/face.png")';
};

function showError(msg){
    tarefasPendentes.innerHTML += `<div class="alert alert-danger" role="alert"> Erro: ${msg} </div>`
};

function setTask(itenTask){
    tarefasPendentes.innerHTML +=
    `
    <li class="tarefa">
    <div class="not-done"></div>
    <div class="descricao">
    <p class="nome">${itenTask.description}</p>
    <p class="timestamp">Criada em: ${dataFormatada(itenTask.createdAt)}</p>
    </div>
    </li>
    `
};

function newTask(task){
    console.log(task);
}