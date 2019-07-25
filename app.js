'use strict'

const express = require('express');
const bodyParser = require('body-Parser');
const request = require('request');
const access_token = "EAAfsTMmUKl0BAA8ydjD9ZAQuS4ZC3tqpbQZBcsy3KLO7LnEKvCXFlExyfnBwzoPAAlvKsrNBKU9nZBakdrNTNAawjWVKcDe6qSQvA9m0oHkYPdVssuCIpnYd2zgRej1DNDCXS7sZCAk3dvmlBVJ7WqO61nx6UU7Ux8lSSeHP7YwZDZD";
const app = express();

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());

app.get('/', function(req, response){
    response.send('Hola Mundo!');
})

app.get('/webhook', function(req, response){
    if(req.query['hub.verify_token'] === 'DuiDeveloperBot_Token'){
        response.send(req.query['hub.challenge']);
    }else{
        response.send('DuiDeveloperBot No tienes permisos.')
    }
});

app.post('/webhook/', function(req, res){
    const webhook_event = req.body.entry[0];
    if( webhook_event.messaging ){
        webhook_event.messaging.forEach(event => {
            handleEvent(event.sender.id, event);
        });
    }
    res.sendStatus(200);
});

function handleEvent(senderId, event){
    if(event.message ){
        handleMessage(senderId,event.message);
    }
    else if (event.postback) {
        handlePostBack(senderId, event.postback.payload)
    }
}

function handleMessage(senderId, event){
    if(event.text){
        defaultMessage(senderId);
    }
    else if (event.attachments){
        handleAttachments(senderId, event)
    }
}

function defaultMessage(senderId){
    const messageData = {
        "recipient":{
            "id":senderId
        },
        "message": {
            "text": "¡Hola!, soy el asistente de Dui, puedes usar el menu que esta aqui abajito para explorar mas sobre lo que necesites, justo a la izquierda de donde escribes un mensaje. :D"/*,
            "quick_replies": [
                {
                    "content_type" :"text",
                    "title": "Una pagina web",
                    "payload": "DESARROLLOWEB_PAYLOAD"
                },
                {
                    "content_type" :"text",
                    "title": "App para mi negocio",
                    "payload": "DESARROLLOESCRITORIO_PAYLOAD"
                },
                {
                    "content_type" :"text",
                    "title": "Community Manager",
                    "payload": "COMMUNITYMANAGER_PAYLOAD"
                },
                {
                    "content_type" :"text",
                    "title": "Bot para mi Messenger",
                    "payload": "BOTMESSENGER_PAYLOAD"
                }
            ]*/
        }
    }
    senderActions(senderId);
    callSendApi(messageData);
}

function handlePostBack(senderId, payload){
    switch(payload){
        case "GET_STARTED_DUIDEVELOPERBOT":
            defaultMessage(senderId);
        break;
        case "SERVICIOS_PAYLOAD":
            showServicios(senderId);
        break;
        case "CONTACTAME_PAYLOAD":
            showContactame(senderId);
        break;
        case "DESARROLLOESCRITORIOELEGIR_PAYLOAD":
            showTrataDesarrolloEscritorio(senderId);
        break;
        case "DESARROLLOWEBELEGIR_PAYLOAD":
            showTrataDesarrolloWeb(senderId);
        break;
        case "COMMUNITYMANAGERELEGIR_PAYLOAD":
            showTrataCommunityManager(senderId);
        break;
        case "BOTMESSENGERELEGIR_PAYLOAD":
            showTrataBotMessenger(senderId);
        break;
        
    }
}


function senderActions(senderId){
    const messageData = {
        "recipient": {
            "id" : senderId
        },
        "sender_action" : "typing_on"
    }
    callSendApi(messageData);
}

function handleAttachments(senderId, event){
    let  attachments_type = event.attachments[0].type;
    switch(attachments_type){
        case "image":
            console.log(attachments_type);
        break;
        case "video":
            console.log(attachments_type);
        break;
        case "audio":
                console.log(attachment_type);
            break;
        case "file":
                console.log(attachment_type);
            break;
        default:
                console.log(attachment_type);
        break;
    }
}


function callSendApi(response){
    request({
        "uri": "https://graph.facebook.com/me/messages",
        "qs": {
            "access_token": access_token
        },
        "method": "POST",
        "json": response
    },
    function(err){
        if(err){
            console.log('Ha ocurrido un error')
        }
        else{
            console.log('Mensaje enviado')
        }
    }
    )
}

function showServicios(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title":"Desarrollo Web",
                            "subtitle": "Tu pagina Web en 2 semanas a tus propias especificaciones.",
                            "image_url": "http://duideveloper.byethost18.com/web.png",
                            "buttons":[
                                {
                                    "type":"postback",
                                    "title": "Elegir Desarrollo Web",
                                    "payload" : "DESARROLLOWEBELEGIR_PAYLOAD",
                                }
                            ]
                        },
                        {
                            "title":"Desarrollo escritorio",
                            "subtitle": "Tu programa de escritorio para tu negocio a la medida.",
                            "image_url": "http://duideveloper.byethost18.com/RecursosPagina/DesarrolloDesktop.png",
                            "buttons":[
                                {
                                    "type":"postback",
                                    "title": "Elegir Desarrollo de APP Escritorio.",
                                    "payload" : "DESARROLLOESCRITORIOELEGIR_PAYLOAD",
                                }
                            ]
                        },
                        {
                            "title":"Community Manager",
                            "subtitle": "Tus redes sociales manejadas profesionalmente para que no te preocupes por ellas.",
                            "image_url": "http://duideveloper.byethost18.com/RecursosPagina/CommunityManager.png",
                            "buttons":[
                                {
                                    "type":"postback",
                                    "title": "Elegir Community Manager",
                                    "payload" : "COMMUNITYMANAGERELEGIR_PAYLOAD",
                                }
                            ]
                        },
                        {
                            "title":"Bot para Messenger",
                            "subtitle": "Un bot programado para responder tus mensaje de Messenger",
                            "image_url": "https://miro.medium.com/max/2000/1*m9IJdAYW04MYh75ivpwUNA.png",
                            "buttons":[
                                {
                                    "type":"postback",
                                    "title": "Elegir Bot de Messenger",
                                    "payload" : "BOTMESSENGERELEGIR_PAYLOAD",
                                }
                            ]
                        }
                    ]
                }

            }
        }
    
    }
    callSendApi(messageData);
}
function showContactame(senderId){
    const messageData = {
        "recipient":{
            "id":senderId
        },
        "message": {
            "text": "Para contactarme puedes escribirme al whatsapp o llamarme al 0993171903, estare atento a tus peticiones. 😊",
        }
    }
    senderActions(senderId);
    callSendApi(messageData);
}

function sizeServicio(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            attachment: {
                "type" : "template",
                "payload":{
                    "template_type": "list",
                    "top_elemente_style": "large",
                    "elements":[
                        {
                            "title" : "Individual",
                            "image_url": "",
                            "subtitle": "Pagina web",
                            "buttons":[
                                {
                                    "type":"postback",
                                    "title" : "",
                                    "payload":""
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
}

function showTrataDesarrolloWeb(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "La página web te ayudará a aumentar tu presencia en internet, la fidelidad y la confianza que generarás en tus clientes será la mejor. 😎",
        }
    }
    senderActions(senderId);
    callSendApi(messageData);
}

function showTrataDesarrolloEscritorio(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "Una aplicación que funcionará en tu computadora y te ayudará a optimizar los procesos que mantengas en tu negocio, control de paciente o clientes, inventario, ventas, consultas y mucho más. 😱",
        }
    }
    senderActions(senderId);
    callSendApi(messageData);
}

function showTrataCommunityManager(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "No debes preocuparte por tus redes sociales mientras trabajas, yo me encargaré de ellas y enviaré al cliente a ti con una excelente atención. 🤓💻",
        }
    }
    senderActions(senderId);
    callSendApi(messageData);
}

function showTrataBotMessenger(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "Optimiza los mensajes de tu chat de Messenger de Facebook para que las personas encuentres tus servicios, ubicación, forma de contactarte y precios al alcance de 3 clic. 😉",
        }
    }
    senderActions(senderId);
    callSendApi(messageData);
}





app.listen(app.get('port'), function(){
    console.log('Nuestro servidor esta funcionando el puerto.', app.get('port'));
})
