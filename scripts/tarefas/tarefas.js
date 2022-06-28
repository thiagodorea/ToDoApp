let sair = document.getElementById("closeApp");

let tokenJwt;

onload = function(){
    tokenJwt = this.sessionStorage.getItem("jwt");
    if(!tokenJwt)
        location.href = "index.html"
};

console.log(sair)

sair.addEventListener("click",() =>{
    sessionStorage.removeItem("jwt");
    location.href = "index.html"
});