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

const controllerFilme = require('../controller/filme/controller_filme.js')

router.get('/', cors(), async function(request, response) {

    //Chama a função da controller para retornar todos os filmes
    let filme = await controllerFilme.listarFilmes()
    response.status(filme.status_code)
    response.json(filme)
    
})
//Retorna um filme filtrado pelo ID
router.get('/:id', cors(), async function(request, response) {

    //Recebe o ID enviado na requisição via parametro
    let idFilme = request.params.id

    //Chama a função da controller para retornar todos os filmes
    let filme = await controllerFilme.buscarFilmeId(idFilme)

    response.status(filme.status_code)
    response.json(filme)
    
})
//INSERE UM NOVO FILME NO BD
router.post('/', cors(), bodyParserJson,async function(request, response) {
    
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    //Chama a função da controller para inserir o filme, enviamos os dados do body e o content-type
    let filme = await controllerFilme.inserirFilme(dadosBody, contentType)

    response.status(filme.status_code)
    response.json(filme)
})
//Atualizar um filme existente no BD
router.put('/:id', cors(), bodyParserJson, async function(request, response){
    
    //Recebe os dados do body
    let dadosBody = request.body

    //Recebe os dados do filme encaminhado pela url
    let idFilme = request.params.id

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    let filme = await controllerFilme.atualizarFilme(dadosBody, idFilme, contentType)

    response.status(filme.status_code)
    response.json(filme)

})
//Deleta um registro de filme do BD
router.delete('/:id', cors(), async function(request, response){

    let idFilme = request.params.id

    let filme = await controllerFilme.excluirFilme(idFilme)

    response.status(filme.status_code)
    response.json(filme)

})

module.exports = router