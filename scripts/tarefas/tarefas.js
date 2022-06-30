const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

let sair = document.getElementById("closeApp");
let nomeUsuario = document.getElementById("nomeUsuario");
let userImage = document.getElementById("userImage");
let tarefasPendentes = document.getElementById("tarefasPendentes");
let novaTarefa =document.getElementById("novaTarefa");
let btnNewTask = document.getElementById("btnNewTask");

let tokenJwt;
let tarefa = {
    description: "",
    completed: false
}

onload = function(){
    tokenJwt = this.sessionStorage.getItem("jwt");
    !tokenJwt ? location.href = "index.html": buscarInfoUsuario();
};

sair.addEventListener("click",() =>{
    sessionStorage.removeItem("jwt");
    location.href = "index.html";
});

novaTarefa.addEventListener("keyup", () =>{
    validaTask(retiraEspacos(novaTarefa.value));
})

btnNewTask.addEventListener("click",(evento) =>{
    evento.preventDefault();
    if(validaTask(retiraEspacos(novaTarefa.value))){
        tarefa.description = retiraEspacos(novaTarefa.value)
        let tarefaJson = JSON.stringify(tarefa);
        console.log(tarefaJson);
        enviarTarefa(tarefaJson);
    }
})


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
        toastAlert("Erro ao recuperar dados","danger");
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
            tarefasPendentes.innerHTML = `<div class="alert alert-primary" role="alert"> Você não tem nenhuma tarefa pendente. </div>`;
        }else{
            tarefasPendentes.innerHTML = '';
            for (item  of resposta) {
                setTask(item);
            }
        }
    } catch(error){
        toastAlert(error,"danger");
    };
};

async function enviarTarefa(tarefaObj){
    console.log(tarefaObj)
    let configRequest = {
        method: "POST",
        headers: {
            "Content-type":'Application/Json',
            "Access-Control-Allow-Origin": "*",
            "Authorization": `${tokenJwt}`
        },
        body:tarefaObj
    } 
    try {
        let resp = await fetch(`${BASE_URL}/tasks/`,configRequest)
        let resposta = await resp.json();
        if (resp.status == 201 || resp.status == 200) {
            novaTarefa.value = '';
            validaTask(novaTarefa.value);
            GbuscarTask();
        } 
    } catch (error) {
        toastAlert(error,"danger");
    }
}

function setName(dados){
    nomeUsuario.innerText = `Olá, ${dados.firstName} ${dados.lastName}`;
    userImage.style.backgroundImage ='url("../assets/face.png")';
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

function validaTask(task){
    if(task.length > 4 ){
        btnNewTask.removeAttribute("disabled");
        btnNewTask.style.cursor = "pointer";
        btnNewTask.style.color = "var(--secondary)";
        return true;
    }else{
        btnNewTask.setAttribute("disabled","disabled");
        btnNewTask.style.cursor = "no-drop";
        btnNewTask.style.color = "#B7B7B7";
        return false;
    }
}