//Import das dependencias
const express = require('express') 
const cors = require('cors')
const bodyParser = require('body-parser')

//Cria um objeto especialista no formato JSON para receber os dados do BODY ()
const bodyParserJson = bodyParser.json()

//Porta
            const PORT = process.PORT || 8080

//Instancia na classe do express
const router = express()

//Configurações do cors
router.use((request, response, next)=>{
    response.header('Access-Controll-Allow-Origin', '*')//IP de origem
    response.header('Access-Controll-Allow-Methods', 'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS')//Métodos (verbos) do protocólo HTTP

    router.use(cors())
    next()//Proximo
})

// router = express.Router()

const controllerAtor = require('../controller/ator/controller_ator.js')


//ENDPOINTS PARA O CRUD DE ATORES

//Retorna uma lista de atores do BD
router.get('/', cors(), async function(request, response){

    let ator = await controllerAtor.listarAtores()

    response.status(ator.status_code)
    response.json(ator)
    
})
//Retorna um ator do BD filtrando pelo ID
router.get('/:id', cors(), async function(request, response){

    let idAtor = request.params.id

    let ator = await controllerAtor.buscarAtorId(idAtor)

    response.status(ator.status_code)
    response.json(ator)
    
})
//Insere um novo ator dentro do BD
router.post('/', cors(), bodyParserJson,async function(request, response) {
    
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    //Chama a função da controller para inserir o filme, enviamos os dados do body e o content-type
    let ator = await controllerAtor.inserirAtor(dadosBody, contentType)

    response.status(ator.status_code)
    response.json(ator)
})
//Atualiza um ator dentro do BD
router.put('/:id', cors(), bodyParserJson, async function(request, response){
    
    //Recebe os dados do body
    let dadosBody = request.body

    //Recebe os dados do ator encaminhado pela url
    let idAtor = request.params.id

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    let ator = await controllerAtor.atualizarAtor(dadosBody, idAtor, contentType)

    response.status(ator.status_code)
    response.json(ator)

})
//Deleta um registro de um ator do BD
router.delete('/:id', cors(), async function(request, response){

    let idAtor = request.params.id

    let ator = await controllerAtor.excluirAtor(idAtor)

    response.status(ator.status_code)
    response.json(ator)

})


module.exports = router