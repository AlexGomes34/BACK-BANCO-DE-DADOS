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

const controllerClassificacao = require('../controller/classificacao/controller_classificacao.js')

//ENDPOINTS PARA O CRUD DE CLASSIFICAÇÕES

//Retorna uma lista de classificações do BD
router.get('/', cors(), async function(request, response){

    //Chama a função que retorna a lista de classificações
    let classificacao = await controllerClassificacao.listarClassificacoes()

    response.status(classificacao.status_code)
    response.json(classificacao)
    
})
//Retorna uma classificação do BD filtrando pelo ID
router.get('/:id', cors(), async function(request, response){

    let idClassificacao = request.params.id

    let classificacao = await controllerClassificacao.buscarClassificacaoId(idClassificacao)

    response.status(classificacao.status_code)
    response.json(classificacao)
    
})
//Insere uma nova classificação dentro do BD
router.post('/', cors(), bodyParserJson, async function(request, response){

    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let classificacao = await controllerClassificacao.inserirClassificacao(dadosBody, contentType)

    response.status(classificacao.status_code)
    response.json(classificacao)
    
})
//Atualiza uma classificação dentro do BD
router.put('/:id', cors(), bodyParserJson, async function(request, response){

    let dadosBody = request.body

    let idClassificacao = request.params.id

    let contentType = request.headers['content-type']

    let classificacao = await controllerClassificacao.atualizarClassificacao(dadosBody, idClassificacao, contentType)

    response.status(classificacao.status_code)
    response.json(classificacao)
})
router.delete('/:id', cors(), async function(request, response){

    let idClassificacao = request.params.id

    let classificacao = await controllerClassificacao.excluirClassificacao(idClassificacao)

    response.status(classificacao.status_code)
    response.json(classificacao)
})

module.exports = router