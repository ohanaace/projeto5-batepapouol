let nome = {name: prompt("Digite seu nome:")};
let chat =[];


const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nome);
promessa.then(pegarMensagensDoBatePapo);
promessa.catch(deuRuim);

manterConectado()

function deuRuim(erro){
    const statusCode = erro.response.status;
    while(statusCode === 400){
        alert("Usuário já cadastrado no chat.");
        nome = {name: prompt("Digite seu nome:")};
    }
}
function pegarMensagensDoBatePapo(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessa.then(renderizaMensagens);
    promessa.catch();
    
}
setInterval(pegarMensagensDoBatePapo, 3000);

function scroll(){
    
    document.querySelector('.corpo-de-mensagens').lastChild.scrollIntoView();
}

function renderizaMensagens(sucesso){
    console.log('suas mensagens chegaram!!!');
    chat = sucesso.data;

exibeMensagens()
}
function exibeMensagens(){
    const batePapo = document.querySelector('.corpo-de-mensagens');
    chat.map((elemento) => {
        if(elemento.type === 'status'){
            return batePapo.innerHTML += `<li data-test="message" class="mensagem status"> <span class="tempo">(${elemento.time})<\span> <span class="usuario">${elemento.from} <\span> <span class="texto">${elemento.text}<\span> <\li>`
        }
        if(elemento.type === 'message'){
            return batePapo.innerHTML += `<li data-test="message" class="mensagem publica"> <span class="tempo"> (${elemento.time}) <\span> <span class="usuario"> ${elemento.from} <\span> <span class="texto"> para <\span> <span class="usuario"> ${elemento.to}: <\span>  <span class="texto">${elemento.text}<\span> <\li>`
        }
        if(elemento.type === 'private_message' && (elemento.to !== nome.name || elemento.from !== nome.name)){
            return;
        }
        if(elemento.type === 'private_message' && (elemento.to === nome.name || elemento.from === nome.name)){
            return batePapo.innerHTML += `<li data-test="message" class="mensagem privada"> <span class="tempo"> (${elemento.time}) <\span> <span class="usuario"> ${elemento.from} <\span> <span class="texto"> reservadamente para <\span> <span class="usuario"> ${elemento.to}: <\span>  <span class="texto">${elemento.text}<\span> <\li>`
        }
    }
    )
    scroll();
}


function enviar(){
    const mensagemEscrita = document.querySelector('input');
    const mensagemEnviada = mensagemEscrita.value;
    console.log(mensagemEnviada)
    const novaMensagem = {
        from: nome.name,
        to: "Todos",
        text: mensagemEnviada,
        type: "message"
    }
    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', novaMensagem);
    promessa.then(exibeMensagens);
    promessa.catch(falhaAoEnviar);
}
function falhaAoEnviar(erro){
    console.log('erro ao enviar a mensagem');
    console.log(erro.response);
}
function manterConectado(){
    setInterval(postNoServer, 5000)
}
function postNoServer(){
    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', {name: nome.name});
    promessa.then(()=> console.log('tá dando certo'));
    promessa.catch(() => console.log('deu ruim'));
}
