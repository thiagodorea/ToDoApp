let sair = document.getElementById("closeApp");
let nomeUsuario = document.getElementById("nomeUsuario");
let userImage = document.getElementById("userImage");

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
        console.log(tokenJwt);
        let resp = await fetch(`${BASE_URL}/users/getMe`,configRequest)
        let resposta = resp.json();
        resposta.then(res => {
            nomeUsuario.innerText = `Olá, ${res.firstName} ${res.lastName}`
            userImage.style.backgroundImage ='url("../assets/face.png")';
        });
    } catch(error){
        console.log(error);
    }
}