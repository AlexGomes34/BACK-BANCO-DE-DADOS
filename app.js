/*********************************************************************************************
* 
* Objetivo: Arquivo responsável pelas requisições da API do projeto da locadora de filmes
* Data: 07/10/2025 D.C.
* Autor: Alex Henrique Da Cruz Gomes
* Versão: 1.0
* 
**********************************************************************************************/

//Import das dependencias
const express = require('express') 
const cors = require('cors')
const bodyParser = require('body-parser')

//Cria um objeto especialista no formato JSON para receber os dados do BODY ()
const bodyParserJson = bodyParser.json()

//Porta
            const PORT = process.PORT || 8080

//Instancia na classe do express
const app = express()

//Configurações do cors
app.use((request, response, next)=>{
    response.header('Access-Controll-Allow-Origin', '*')//IP de origem
    response.header('Access-Controll-Allow-Methods', 'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS')//Métodos (verbos) do protocólo HTTP

    app.use(cors())
    next()//Proximo
})

//Import das controllers da API
const controllerFilme = require('./controller/filme/controller_filme.js')

const controllerGenero = require('./controller/genero/controller_genero.js')

const controllerClassificacao = require('./controller/classificacao/controller_classificacao.js')

//Endpoint para CRUD de Filmes

//Retorna a Lista de Filmes
app.get('/v1/locadora/filmes', cors(), async function(request, response) {

    //Chama a função da controller para retornar todos os filmes
    let filme = await controllerFilme.listarFilmes()
    response.status(filme.status_code)
    response.json(filme)
    
})

//Retorna um filme filtrado pelo ID
app.get('/v1/locadora/filmes/:id', cors(), async function(request, response) {

    //Recebe o ID enviado na requisição via parametro
    let idFilme = request.params.id

    //Chama a função da controller para retornar todos os filmes
    let filme = await controllerFilme.buscarFilmeId(idFilme)

    response.status(filme.status_code)
    response.json(filme)
    
})

//INSERE UM NOVO FILME NO BD
app.post('/v1/locadora/filmes', cors(), bodyParserJson,async function(request, response) {
    
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
app.put('/v1/locadora/filmes/:id', cors(), bodyParserJson, async function(request, response){
    
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
app.delete('/v1/locadora/filmes/:id', cors(), async function(request, response){

    let idFilme = request.params.id

    let filme = await controllerFilme.excluirFilme(idFilme)

    response.status(filme.status_code)
    response.json(filme)

})

//ENDPOINTS PARA O CRUD DE GENEROS

//Retorna a Lista de Generos
app.get('/v1/locadora/generos', cors(), async function(request, response){

    //Chama a função da controller para retornar todos os generos
    let genero = await controllerGenero.listarGeneros()
    response.status(genero.status_code)
    response.json(genero)
})

//Retorna um Genero Filtrando pelo ID
app.get('/v1/locadora/generos/:id', cors(), async function(request, response) {

    //Recebe o ID enviado na requisição via parametro
    let idGenero = request.params.id

    //Chama a função da controller para retornar todos os filmes
    let genero = await controllerGenero.buscarGeneroId(idGenero)

    response.status(genero.status_code)
    response.json(genero)
    
})

//Insere um Novo Gênero no BD
app.post('/v1/locadora/generos', cors(), bodyParserJson, async function(request, response){

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
app.put('/v1/locadora/generos/:id', cors(), bodyParserJson, async function(request, response){

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
app.delete('/v1/locadora/generos/:id', cors(), async function(request,  response){

    let idGenero = request.params.id

    let genero = await controllerGenero.excluirGenero(idGenero)

    response.status(genero.status_code)
    response.json(genero)
})

//ENDPOINTS PARA O CRUD DE CLASSIFICAÇÕES

//Retorna uma lista de classificações do BD
app.get('/v1/locadora/classificacoes', cors(), async function(request, response){

    //Chama a função que retorna a lista de classificações
    let classificacao = await controllerClassificacao.listarClassificacoes()

    response.status(classificacao.status_code)
    response.json(classificacao)
    
})

//Retorna uma classificação do BD filtrando pelo ID
app.get('/v1/locadora/classificacoes/:id', cors(), async function(request, response){

    let idClassificacao = request.params.id

    let classificacao = await controllerClassificacao.buscarClassificacaoId(idClassificacao)

    response.status(classificacao.status_code)
    response.json(classificacao)
    
})

//Insere uma nova classificação dentro do BD
app.post('/v1/locadora/classificacoes', cors(), bodyParserJson, async function(request, response){

    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let classificacao = await controllerClassificacao.InserirClassificacao(dadosBody, contentType)

    response.status(classificacao.status_code)
    response.json(classificacao)
    
})
app.listen(PORT, function(){
    console.log('API aguardando requisições')
})
