// Import das dependências
const express = require('express') 
const cors = require('cors')
const bodyParser = require('body-parser')

// Cria um objeto especialista no formato JSON para receber os dados do BODY
const bodyParserJson = bodyParser.json()

const controllerFilmeDiretor = require('../controller/filme/controller_filme_diretor.js')

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
    let listaFilmesDiretores = await controllerFilmeDiretor.listarFilmesDiretores()

    response.status(listaFilmesDiretores.status_code)
    response.json(listaFilmesDiretores)
    
})

//BUSCAR RELACIONAMENTO PELO ID
router.get('/:id', cors(), async function(request, response) {

    // Recebe o ID enviado na requisição via parâmetro (ID da tabela tbl_filme_diretor)
    let idRelacionamento = request.params.id

    // Chama a função da controller para retornar o relacionamento
    let filmeDiretor = await controllerFilmeDiretor.buscarFilmeDiretorId(idRelacionamento)

    response.status(filmeDiretor.status_code)
    response.json(filmeDiretor)
    
})

//BUSCAR DIRETORES POR ID DO FILME
router.get('/filme/:idFilme', cors(), async function(request, response) {

    // Recebe o ID do Filme enviado na requisição via parâmetro
    let idFilme = request.params.idFilme

    // Chama a função da controller para retornar os diretores daquele filme
    let diretores = await controllerFilmeDiretor.listarDiretoresIdFilme(idFilme)

    response.status(diretores.status_code)
    response.json(diretores)
})

//BUSCAR FILMES POR ID DO DIRETOR
router.get('/diretor/:idDiretor', cors(), async function(request, response) {

    // Recebe o ID do Diretor enviado na requisição via parâmetro
    let idDiretor = request.params.idDiretor

    // Chama a função da controller para retornar os filmes daquele diretor
    let filmes = await controllerFilmeDiretor.listarFilmesIdDiretor(idDiretor)

    response.status(filmes.status_code)
    response.json(filmes)
})

//INSERIR NOVO RELACIONAMENTO 
router.post('/', cors(), bodyParserJson, async function(request, response) {
    
    // Recebe o objeto JSON pelo body da requisição (Contém id_filme e id_diretor)
    let dadosBody = request.body

    // Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    // Chama a função da controller para inserir o relacionamento
    let filmeDiretor = await controllerFilmeDiretor.inserirFilmeDiretor(dadosBody, contentType)

    response.status(filmeDiretor.status_code)
    response.json(filmeDiretor)
})

//ATUALIZAR RELACIONAMENTO EXISTENTE
router.put('/:id', cors(), bodyParserJson, async function(request, response){
    
    // Recebe os dados do body (Contém id_filme e id_diretor atualizados)
    let dadosBody = request.body

    // Recebe o ID do relacionamento encaminhado pela url
    let idRelacionamento = request.params.id

    // Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    let filmeDiretor = await controllerFilmeDiretor.atualizarFilmeDiretor(dadosBody, idRelacionamento, contentType)

    response.status(filmeDiretor.status_code)
    response.json(filmeDiretor)

})

//DELETAR RELACIONAMENTO
router.delete('/:id', cors(), async function(request, response){

    let idRelacionamento = request.params.id

    let filmeDiretor = await controllerFilmeDiretor.excluirFilmeDiretor(idRelacionamento)

    response.status(filmeDiretor.status_code)
    response.json(filmeDiretor)

})

module.exports = router