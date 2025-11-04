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

const controllerDiretor = require('../controller/diretor/controller_diretor.js')

//ENDPOINTS PARA O CRUD DE DIRETORES

//Retorna uma lista de diretores do BD
router.get('/', cors(), async function(request, response){

    let diretor = await controllerDiretor.listarDiretores()
    
    response.status(diretor.status_code)
    response.json(diretor)
    
})
//Retorna um diretor dentro do BD filtrando pelo BD
router.get('/:id', cors(), async function(request, response){

    let idDiretor = request.params.id

    let diretor = await controllerDiretor.buscarDiretorId(idDiretor)

    response.status(diretor.status_code)
    response.json(diretor)
    
})
//Insere um novo diretor dentro do BD
router.post('/', cors(), bodyParserJson,async function(request, response) {
    
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    //Chama a função da controller para inserir o filme, enviamos os dados do body e o content-type
    let diretor = await controllerDiretor.inserirDiretor(dadosBody, contentType)

    response.status(diretor.status_code)
    response.json(diretor)
})
//Atualiza um diretor dentro do BD
router.put('/:id', cors(), bodyParserJson, async function(request, response){
    
    //Recebe os dados do body
    let dadosBody = request.body

    //Recebe os dados do diretor encaminhado pela url
    let idDiretor = request.params.id

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    let diretor = await controllerDiretor.atualizarDiretor(dadosBody, idDiretor, contentType)

    response.status(diretor.status_code)
    response.json(diretor)

})
//Deleta um registro de um diretor do BD
router.delete('/:id', cors(), async function(request, response){

    let idDiretor = request.params.id

    let diretor = await controllerDiretor.excluirDiretor(idDiretor)

    response.status(diretor.status_code)
    response.json(diretor)

})



module.exports = router