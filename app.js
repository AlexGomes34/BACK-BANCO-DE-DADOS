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

const filmeRoutes = require('./routes/filmeRoutes.js')

const generoRoutes = require('./routes/generoRoutes.js')

const classificacaoRoutes = require('./routes/classificacaoRoutes.js')

const atorRoutes = require('./routes/atorRoutes.js')

const diretorRoutes = require('./routes/diretorRoutes.js')

//Configurando as rotas de filme
app.use('/v1/locadora/filmes', filmeRoutes)

//Configurando as rotas de genero
app.use('/v1/locadora/generos', generoRoutes)

//Configurando as rotas de classificação
app.use('/v1/locadora/classificacoes', classificacaoRoutes)

//Configurando as rotas de ator
app.use('/v1/locadora/atores', atorRoutes)

//Configurando as rotas de diretor
app.use('/v1/locadora/diretores', diretorRoutes)

app.listen(PORT, function(){
    console.log('API aguardando requisições')
})
