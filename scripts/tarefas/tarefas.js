const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

let sair = document.getElementById("closeApp");
let nomeUsuario = document.getElementById("nomeUsuario");
let userImage = document.getElementById("userImage");
let tarefasPendentes = document.getElementById("tarefasPendentes");
let tarefasTerminadas = document.getElementById("tarefasTerminadas");
let novaTarefa =document.getElementById("novaTarefa");
let btnNewTask = document.getElementById("btnNewTask");
let btnConcluido = document.getElementById("btnConcluido");

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
});

btnConcluido.addEventListener("click",() =>{
    btnConcluido.classList.toggle("done");
    tarefa.completed == false ? tarefa.completed = true : tarefa.completed = false;
});

btnNewTask.addEventListener("click",(evento) =>{
    evento.preventDefault();
    if(validaTask(retiraEspacos(novaTarefa.value))){
        tarefa.description = retiraEspacos(novaTarefa.value);
        let tarefaJson = JSON.stringify(tarefa);
        enviarTarefa(tarefaJson);
    };
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
        // resposta.sort((x,y) => {return  y.id - x.id})
        resposta.map( task =>{
            setTask(task);
        });
                
            // if(resposta.length == 0){
            //     tarefasPendentes.innerHTML = `<div class="alert alert-primary" role="alert"> Você não tem nenhuma tarefa pendente. </div>`;
            // }
        
    } catch(error){
        toastAlert(error,"danger");
    };
};

async function enviarTarefa(tarefaObj){
    btnSpinner();
    retiraEspacos(tarefaObj)
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
        let resp = await fetch(`${BASE_URL}/tasks/`,configRequest);
        let resposta = await resp.json();
        btnSpinner(resp.status);
        if (resp.status == 201 || resp.status == 200) {
            tarefasPendentes.innerHTML = '';
            tarefasTerminadas.innerHTML = '';
            novaTarefa.value = '';
            btnConcluido.classList.remove('done');
            buscarTask();
        } 
    } catch (error) {
        btnSpinner(resp.status);
        toastAlert(error,"danger");
    }
};

async function delTask(id){
    let configRequest ={
        method: "DELETE",
        headers:{
            "Content-type":'Application/Json',
            "Access-Control-Allow-Origin": "*",
            "Authorization": `${tokenJwt}`
        }
    };
    try {
        let resp = await fetch(`${BASE_URL}/tasks/${id}`,configRequest);
        if(resp.status == 200){ 
            tarefasPendentes.innerHTML = '';
            tarefasTerminadas.innerHTML = '';
            toastAlert("Atividade excluída.","success");
            buscarTask();
        }else if(resp.status == 400){
            toastAlert("Id inválido.","danger");
        }else if(resp.status == 401){
            toastAlert("Você não tem autorização.","danger");
        }else if(resp.status == 404){
            toastAlert("Tarefa inexistente","danger");
        }
    } catch (error) {
        toastAlert("Erro no Servidor, tente novamente","danger");
    }
};

async function taskDone(id){
    let configRequest= {
        headers: {
            "Content-type":'Application/Json',
            "Authorization": `${tokenJwt}`
        }
    }
    try{
        let resp = await fetch(`${BASE_URL}/tasks/${id}`,configRequest)
        let resposta = await resp.json();
        if(resp.status == 200){
            tarefasPendentes.innerHTML = '';
            tarefasTerminadas.innerHTML = '';
            resposta.completed == false ? tarefa.completed = true : tarefa.completed = false
            tarefa.description = resposta.description;
            let tarefaJson = JSON.stringify(tarefa);
            let configRequest ={
                method: "PUT",
                headers:{
                    "Content-type":'Application/Json',
                    "Authorization": `${tokenJwt}`
                },
                body:tarefaJson
            }
            try {
                let resp = await fetch(`${BASE_URL}/tasks/${id}`,configRequest);
                let resposta = await resp.json();
                if(resp.status == 200){ 
                    resposta.completed == true ? toastAlert("Atividade concluida.","success") :toastAlert("Atividade aberta novamente.","success")
                    buscarTask();
                }else if(resp.status == 400){
                    toastAlert("Id inválido.","danger");
                }else if(resp.status == 401){
                    toastAlert("Você não tem autorização.","danger");
                }else if(resp.status == 404){
                    toastAlert("Tarefa inexistente","danger");
                }
            } catch (error) {
                toastAlert("Erro no Servidor, tente novamente","danger");
            }
        };
    }catch(error){
        toastAlert("Erro ao recuperar dados","danger");
    };
} ;

function setName(dados){
    nomeUsuario.innerText = `Olá, ${dados.firstName} ${dados.lastName}`;
    userImage.style.backgroundImage ='url("../assets/face.png")';
};

function setTask(itenTask){
    if(itenTask.completed == false){
        tarefasPendentes.innerHTML +=
        `
        <li class="tarefa" id="tarefa ${itenTask.id}">
            <div class="not-done" onclick="taskDone(${itenTask.id})"></div>
            <div class="descricao">
                <p class="nome">${itenTask.description}</p>
                <p class="timestamp">Criada em: ${dataFormatada(itenTask.createdAt)}
                    <button class=" btn"><i class="fa-solid fa-pencil"></i><button>
                </p>
            </div>
        </li>
        `
    }else{
        tarefasTerminadas.innerHTML +=
        `
        <li class="tarefa" id="tarefa ${itenTask.id}">
            <div class="not-done done" onclick="taskDone(${itenTask.id})"></div>
            <div class="descricao">
                <p class="nome">${itenTask.description}</p>
                <p class="timestamp">Criada em: ${dataFormatada(itenTask.createdAt)}
                    <button class="btn" onclick="delTask(${itenTask.id})"><i class="fa-solid fa-trash"></i><button>
                </p>
            </div>
        </li>
        `
    };
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
};

function btnSpinner(status){
    if(status == undefined){
        btnNewTask.innerHTML=`
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        `
    }else{
        btnNewTask.innerHTML=`
        <i class="fa-solid fa-paper-plane fs-3"></i>
        `
    };
};