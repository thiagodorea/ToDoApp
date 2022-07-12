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
let textoEditadodaTask ='';
let descricaoOriginal;
let tarefa = {
    description: "",
    completed: false
}

onload = function(){
    tokenJwt = this.sessionStorage.getItem("jwt");
    !tokenJwt ? location.href = "index.html": buscarInfoUsuario();

    renderizarSkeletons(2, ".tarefas-pendentes");
    renderizarSkeletons(2, ".tarefas-terminadas");
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
        let qtdCompleted = 0;
        let qtdNotCompleted = 0;
        let resp = await fetch(`${BASE_URL}/tasks/`,configRequest)
        let resposta = await resp.json();
        resposta.sort((x,y) => {return x.id - y.id})
        if(resp.status == 200){
            removerSkeleton(".tarefas-pendentes");
            removerSkeleton(".tarefas-terminadas");
            resposta.map( task =>{
                setTask(task);
                task.completed == true ? qtdCompleted++ : qtdNotCompleted++
            });
            if(qtdNotCompleted == 0){
                    tarefasPendentes.innerHTML = `<div class="alert alert-primary" role="alert"> Você não tem nenhuma tarefa pendente. </div>`;
            };
            if(qtdCompleted == 0){
                tarefasTerminadas.innerHTML = `<div class="alert alert-primary" role="alert"> Você não tem tarefa concluida. </div>`;
            };
        }else{
            toastAlert("Ocorreu um erro ao carregar as atividades","danger");
        }
    } catch(error){
        toastAlert(error,"danger");
    };
};

async function enviarTarefa(tarefaObj){
    btnSpinner();
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
        let resp = await fetch(`${BASE_URL}/tasks`,configRequest);
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

async function delTaskConfirm(id){
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
            toastAlert("Tarefa excluída.","success");
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

async function atualizaTask(id,btn){
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
            if(btn == 'done'){
                resposta.completed == false ? tarefa.completed = true : tarefa.completed = false;
                tarefa.description = resposta.description
            }else{
                !textoEditadodaTask == '' ? tarefa.description = textoEditadodaTask : tarefa.description = resposta.description;
                
            }

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
                    textoEditadodaTask = ''
                    resposta.completed == true ? toastAlert("Tarefa concluida.","success") :toastAlert("Tarefa aberta novamente.","success")
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
    userImage.style.backgroundImage ='url("./assets/face.png")';
};

function setTask(itenTask){
    if(itenTask.completed == false){
        tarefasPendentes.innerHTML +=
        `
        <li class="tarefa" id="tarefa${itenTask.id}">
            <div class="not-done" onclick="atualizaTask(${itenTask.id},'done')" data-bs-toggle="tooltip" data-bs-placement="top" title="Concluir Tarefa"></div>
            <div class="descricao" id="divDescricao${itenTask.id}">
                <p class="nome" id="descricao${itenTask.id}">${itenTask.description}</p>
                <p id="dtCriacao${itenTask.id}" class="timestamp">Criada em: ${dataFormatada(itenTask.createdAt)}
                    <button id="btnEdit${itenTask.id}" class=" btn" onclick="editTask(${itenTask.id})" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar Tarefa"><i class="fa-solid fa-pencil"></i></button>
                </p>
            </div>
        </li>
        `
    }else{
        tarefasTerminadas.innerHTML +=
        `
        <li class="tarefa" id="tarefa${itenTask.id}">
            <div class="not-done done" onclick="atualizaTask(${itenTask.id},'done')" data-bs-toggle="tooltip" data-bs-placement="top" title="Reabrir Tarefa"></div>
            <div class="descricao">
                <p class="nome">${itenTask.description}</p>
                <p class="timestamp">Criada em: ${dataFormatada(itenTask.createdAt)}
                    <button class="btn" onclick="delTask(${itenTask.id})"><i class="fa-solid fa-trash"></i></button>
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

function delTask(id){
    let body = document.body;
    let existeModal = document.querySelector('#modalConfirmar');    
    if (existeModal != null) body.removeChild(existeModal);
        
    let modal = document.createElement('div');
        modal.className = "modal fade"
        modal.setAttribute('id','modalConfirmar')
        modal.setAttribute('data-bs-backdrop','static')
        modal.setAttribute('data-bs-keyboard','modalConfirmar')
        modal.setAttribute('data-bs-config','false')
    body.appendChild (modal);
    document.getElementById('modalConfirmar').innerHTML = 
        `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body">
                    <h5 class="modal-title text-center" id="staticBackdropLabel">Deseja realmente apagar a tarefa?</h5>
                </div>
                
                <div class="modal-footer d-flex justify-content-center">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Não</button>
                    <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal" onclick="delTaskConfirm(${id})">Sim</button>
                </div>
            </div>
        </div>
        `
    const modalConfirmar = new bootstrap.Modal(document.getElementById('modalConfirmar'),{
        keyboard: true
    });
    modalConfirmar.show();
};

function editTask(idTask){
    let divDescricao = document.getElementById(`divDescricao${idTask}`);
    let dtCriacao = document.getElementById(`dtCriacao${idTask}`);
    let descricao = document.getElementById(`descricao${idTask}`);
    descricaoOriginal = [descricao,dtCriacao];
    
    let input = document.createElement('input');
        input.setAttribute('id',`input${idTask}`);
        input.setAttribute('class',`editar-tarefa`);
        input.setAttribute('value',`${descricao.textContent}`);
        divDescricao.appendChild(input);
    divDescricao.removeChild(descricao);
    divDescricao.removeChild(dtCriacao);
    
    let btnEdicao = document.createElement('span');
        btnEdicao.setAttribute('id',`btnEditConfirm${idTask}`);
        divDescricao.appendChild(btnEdicao);
        document.getElementById(`btnEditConfirm${idTask}`).innerHTML=`
        <button id="btnEditConfirm${idTask}" class="btn" onclick="atualizaTask(${idTask},'edit','${input.value}')" data-bs-toggle="tooltip" data-bs-placement="top" title="Confirmar"><i class="fa-solid fa-check"></i></button>
        <button id="btnEditCancel${idTask}" class="btn" onclick="editTaskCancel(${idTask})" data-bs-toggle="tooltip" data-bs-placement="top" title="Cancelar"><i class="fa-solid fa-xmark"></i><button>
        `
        
    let tarefaEditada = document.getElementById(`input${idTask}`);
    tarefaEditada.addEventListener("keyup", () =>{
        textoEditadodaTask = retiraEspacos(tarefaEditada.value);
    })
}


function editTaskCancel(idTask){
    let divDescricao = document.getElementById(`divDescricao${idTask}`);
    let span = document.getElementById(`btnEditConfirm${idTask}`);
    let input = document.getElementById(`input${idTask}`);
    divDescricao.removeChild(span);
    divDescricao.removeChild(input);
    let descricao = document.createElement('p');
        descricao.setAttribute('class','nome');
        descricao.setAttribute('id',`descricao${idTask}`);
    divDescricao.appendChild(descricaoOriginal[0]);
    divDescricao.appendChild(descricaoOriginal[1]);
}
