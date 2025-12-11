// Import das dependências
const express = require('express') 
const cors = require('cors')
const bodyParser = require('body-parser')

// Cria um objeto especialista no formato JSON para receber os dados do BODY
const bodyParserJson = bodyParser.json()

// Importa o Controller do relacionamento Filme-Ator
const controllerFilmeAtor = require('../controller/filme/controller_filme_ator.js')

// Instancia na classe do express
const router = express.Router() // Usamos express.Router() para modularizar as rotas

// Configurações do cors
router.use((request, response, next)=>{
    response.header('Access-Controll-Allow-Origin', '*')// IP de origem
    response.header('Access-Controll-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')// Métodos (verbos) do protocólo HTTP

    // Ativa o CORS para o express
    router.use(cors())
    next() // Próximo
})

//LISTAR TODOS OS RELACIONAMENTOS
router.get('/', cors(), async function(request, response) {

    // Chama a função da controller para retornar todos os relacionamentos
    let listaFilmesAtores = await controllerFilmeAtor.listarFilmesAtores()

    response.status(listaFilmesAtores.status_code)
    response.json(listaFilmesAtores)
    
})

//BUSCAR RELACIONAMENTO PELO ID
router.get('/:id', cors(), async function(request, response) {

    // Recebe o ID enviado na requisição via parâmetro (ID da tabela tbl_filme_ator)
    let idRelacionamento = request.params.id

    // Chama a função da controller para retornar o relacionamento
    let filmeAtor = await controllerFilmeAtor.buscarFilmeAtorId(idRelacionamento)

    response.status(filmeAtor.status_code)
    response.json(filmeAtor)
    
})

//BUSCAR ATORES POR ID DO FILME
router.get('/filme/:idFilme', cors(), async function(request, response) {

    // Recebe o ID do Filme enviado na requisição via parâmetro
    let idFilme = request.params.idFilme

    // Chama a função da controller para retornar os atores daquele filme
    let atores = await controllerFilmeAtor.listarAtoresIdFilme(idFilme)

    response.status(atores.status_code)
    response.json(atores)
})

//BUSCAR FILMES POR ID DO ATOR 
router.get('/ator/:idAtor', cors(), async function(request, response) {

    // Recebe o ID do Ator enviado na requisição via parâmetro
    let idAtor = request.params.idAtor

    // Chama a função da controller para retornar os filmes daquele ator
    let filmes = await controllerFilmeAtor.listarFilmesIdAtor(idAtor)

    response.status(filmes.status_code)
    response.json(filmes)
})


//INSERIR NOVO RELACIONAMENTO 
router.post('/', cors(), bodyParserJson, async function(request, response) {
    
    // Recebe o objeto JSON pelo body da requisição (Contém id_filme e id_ator)
    let dadosBody = request.body

    // Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    // Chama a função da controller para inserir o relacionamento
    let filmeAtor = await controllerFilmeAtor.inserirFilmeAtor(dadosBody, contentType)

    response.status(filmeAtor.status_code)
    response.json(filmeAtor)
})

//ATUALIZAR RELACIONAMENTO EXISTENTE
router.put('/:id', cors(), bodyParserJson, async function(request, response){
    
    // Recebe os dados do body (Contém id_filme e id_ator atualizados)
    let dadosBody = request.body

    // Recebe o ID do relacionamento encaminhado pela url
    let idRelacionamento = request.params.id

    // Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    let filmeAtor = await controllerFilmeAtor.atualizarFilmeAtor(dadosBody, idRelacionamento, contentType)

    response.status(filmeAtor.status_code)
    response.json(filmeAtor)

})

//DELETAR RELACIONAMENTO
router.delete('/:id', cors(), async function(request, response){

    let idRelacionamento = request.params.id

    let filmeAtor = await controllerFilmeAtor.excluirFilmeAtor(idRelacionamento)

    response.status(filmeAtor.status_code)
    response.json(filmeAtor)

})

module.exports = router