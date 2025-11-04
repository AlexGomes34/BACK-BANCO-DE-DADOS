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

const controllerGenero = require('../controller/genero/controller_genero.js')

//ENDPOINTS PARA O CRUD DE GENEROS

//Retorna a Lista de Generos
router.get('/', cors(), async function(request, response){

    //Chama a função da controller para retornar todos os generos
    let genero = await controllerGenero.listarGeneros()
    response.status(genero.status_code)
    response.json(genero)
})
//Retorna um Genero Filtrando pelo ID
router.get('/:id', cors(), async function(request, response) {

    //Recebe o ID enviado na requisição via parametro
    let idGenero = request.params.id

    //Chama a função da controller para retornar todos os filmes
    let genero = await controllerGenero.buscarGeneroId(idGenero)

    response.status(genero.status_code)
    response.json(genero)
    
})
//Insere um Novo Gênero no BD
router.post('/', cors(), bodyParserJson, async function(request, response){

    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    //Chama a função da controller para inserir o filme, enviando os dados do body e o content-type
    let genero = await controllerGenero.inserirGenero(dadosBody, contentType)

    response.status(genero.status_code)
    response.json(genero)
})
//Atualiza um Gênero Existente no BD
router.put('/:id', cors(), bodyParserJson, async function(request, response){

    //Recebe os dados do body
    let dadosBody = request.body

    //Recebe os dados do genero encaminhado pela url
    let idGenero = request.params.id

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    let genero = await controllerGenero.atualizarGenero(dadosBody, idGenero, contentType)

    response.status(genero.status_code)
    response.json(genero)
})
//Deleta um Gênero do BD Filtrando pelo ID
router.delete('/:id', cors(), async function(request,  response){

    let idGenero = request.params.id

    let genero = await controllerGenero.excluirGenero(idGenero)

    response.status(genero.status_code)
    response.json(genero)
})

module.exports = router