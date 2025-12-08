// Import das dependências
const express = require('express') 
const cors = require('cors')
const bodyParser = require('body-parser')

// Cria um objeto especialista no formato JSON para receber os dados do BODY
const bodyParserJson = bodyParser.json()

const controllerFilmeGenero = require('../controller/filme_genero/controller_filme_genero.js')

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
    let listaFilmesGeneros = await controllerFilmeGenero.listarFilmesGeneros()

    response.status(listaFilmesGeneros.status_code)
    response.json(listaFilmesGeneros)
    
})

//BUSCAR RELACIONAMENTO PELO ID
router.get('/:id', cors(), async function(request, response) {

    // Recebe o ID enviado na requisição via parâmetro (ID da tabela tbl_filme_genero)
    let idRelacionamento = request.params.id

    // Chama a função da controller para retornar o relacionamento
    let filmeGenero = await controllerFilmeGenero.buscarFilmeGeneroId(idRelacionamento)

    response.status(filmeGenero.status_code)
    response.json(filmeGenero)
    
})

//BUSCAR GENEROS POR ID DO FILME
router.get('/filme/:idFilme', cors(), async function(request, response) {

    // Recebe o ID do Filme enviado na requisição via parâmetro
    let idFilme = request.params.idFilme

    // Chama a função da controller para retornar os generos daquele filme
    let generos = await controllerFilmeGenero.listarGenerosIdFilme(idFilme)

    response.status(generos.status_code)
    response.json(generos)
})

//BUSCAR FILMES POR ID DO GÊNERO
router.get('/genero/:idGenero', cors(), async function(request, response) {

    // Recebe o ID do Gênero enviado na requisição via parâmetro
    let idGenero = request.params.idGenero

    // Chama a função da controller para retornar os filmes daquele gênero
    let filmes = await controllerFilmeGenero.listarFilmesIdGenero(idGenero)

    response.status(filmes.status_code)
    response.json(filmes)
})

//INSERIR NOVO RELACIONAMENTO 
router.post('/', cors(), bodyParserJson, async function(request, response) {
    
    // Recebe o objeto JSON pelo body da requisição (Contém id_filme e id_genero)
    let dadosBody = request.body

    // Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    // Chama a função da controller para inserir o relacionamento
    let filmeGenero = await controllerFilmeGenero.inserirFilmeGenero(dadosBody, contentType)

    response.status(filmeGenero.status_code)
    response.json(filmeGenero)
})

//ATUALIZAR RELACIONAMENTO EXISTENTE
router.put('/:id', cors(), bodyParserJson, async function(request, response){
    
    // Recebe os dados do body (Contém id_filme e id_genero atualizados)
    let dadosBody = request.body

    // Recebe o ID do relacionamento encaminhado pela url
    let idRelacionamento = request.params.id

    // Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    let filmeGenero = await controllerFilmeGenero.atualizarFilmeGenero(dadosBody, idRelacionamento, contentType)

    response.status(filmeGenero.status_code)
    response.json(filmeGenero)

})

//DELETAR RELACIONAMENTO
router.delete('/:id', cors(), async function(request, response){

    let idRelacionamento = request.params.id

    let filmeGenero = await controllerFilmeGenero.excluirFilmeGenero(idRelacionamento)

    response.status(filmeGenero.status_code)
    response.json(filmeGenero)

})

module.exports = router