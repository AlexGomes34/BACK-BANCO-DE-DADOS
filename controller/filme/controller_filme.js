/*********************************************************************************************
* 
* Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model(Validações, tratamento de dados, erros, etc)
* Data: 07/10/2025 D.C.
* Autor: Alex Henrique Da Cruz Gomes
* Versão: 1.0
* 
**********************************************************************************************/

//Import do arquivo DAO para manipular o CRUD no BD
const filmeDAO = require('../../model/dao/filme.js')

//Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

//Retorna uma lista de filmes
const listarFilmes = async function(){

    //Realizando uma copia do objeto MESSAGE_DEFAULT, permitindo que as alterações dessa função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try{

        //Chama a função do DAO para retornar a lista de filmes
        let result = await filmeDAO.getSelectAllFilms()

        if(result){
            if(result.length > 0){
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.films = result
                return MESSAGE.HEADER //200
            }else{
                return MESSAGE.ERROR_NOT_FOUND //404
            }
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
    }catch(error){
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}
//Retorna um filme filtrando pelo ID
const buscarFilmeId = async function(id){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try{
        //Validação de campo obrigatório
        if(id != '' && id != null && id != undefined && !isNaN(id) && id > 0){

            //Chama a função para filtrar pelo ID
            let result = await filmeDAO.getSelectByIdFilms(parseInt(id))

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film = result

                    return MESSAGE.HEADER //200
                }else{
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            }else{
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }

        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [id] invalido .|.'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }

    }catch(error){
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Insere um novo filme
const inserirFilme = async function(filme, contentType){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validação de dados de cadastro
            let validarDados = await validarDadosFilme(filme)

            if(!validarDados){

                //CHAMA A FUNÇÃO DO DAO PARA INSERIR UM NOVO FILME
                let result = await filmeDAO.setInsertFilms(filme)

                if(result){
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message


                    return MESSAGE.HEADER //201
                }else{
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }else{
                return validarDados //400
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Atualiza um filme filtrando pelo ID
const atualizarFilme = async function(filme, id, contentType){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //Validação do content-type
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validação de dados de cadastro
            let validarDados = await validarDadosFilme(filme)

            if(!validarDados){

            let validarId = await buscarFilmeId(id)

            //Verifica se o ID existe no DB, caso exista teremos um 200
            if(validarId.status_code == 200){

                //Adicionando o ID no JSON com os dados do filme
                filme.id = parseInt(id)

                //Chama a função do DAO para atualizar um filme
                let result = await filmeDAO.setUpdateFilms(filme)

                if(result){
                    MESSAGE.HEADER.status       = MESSAGE.SUCCESS_UPDATED_ITEM.status
                    MESSAGE.HEADER.status_code  = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                    MESSAGE.HEADER.message      = MESSAGE.SUCCESS_UPDATED_ITEM.message
                    MESSAGE.HEADER.response     = filme

                    return MESSAGE.HEADER //200
                }else{
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }else{
                return validarId //Retorno da função de buscarFilmeID (400 ou 404 ou 500)
            }
        }else{
                return validarDados //Retorno da função de validar dados do filme 400
        }
    }else{
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    }catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}



//Apaga um filme filtrando pelo ID
const excluirFilme = async function(id){

        let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    
        try {
    
                let validarId = await buscarFilmeId(id)
    
                //Verifica se o ID existe no DB, caso exista teremos um 200
                if(validarId.status_code == 200){
    
                    //Chama a função do DAO para delete um filme
                    let result = await filmeDAO.setDeleteFilms(id)
    
                    if(result){
                        MESSAGE.HEADER.status       = MESSAGE.SUCCESS_DELETE_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCCESS_DELETE_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCCESS_DELETE_ITEM.message
    
                        return MESSAGE.HEADER //200
                    }else{
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                }else{
                    return validarId //Retorno da função de buscarFilmeID (400 ou 404 ou 500)
                }
        }catch (error) {
            return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
        }
}

//Validação dos dados de cadrastro do filme
const validarDadosFilme = async function(filme){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if(filme.nome == '' || filme.nome == null || filme.nome == undefined || filme.nome.length > 100){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [nome] invalido .|.'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }else if(filme.sinopse == undefined){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [sinopse] invalido .|.'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }else if(filme.data_lancamento == undefined || filme.data_lancamento.length != 10){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [data lançamento] invalido .|.'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }else if(filme.duracao == '' || filme.duracao == null || filme.duracao == undefined || filme.duracao.length > 8){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [duração] invalido .|.'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }else if(filme.orcamento == '' || filme.orcamento == null || filme.orcamento == undefined || typeof(filme.orcamento) != 'number'){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [orçamento] invalido .|.'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }else if(filme.trailer == undefined || filme.trailer.length > 200){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [trailer] invalido .|.'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }else if(filme.capa == '' || filme.capa == null || filme.capa == undefined || filme.capa.length > 200){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [capa] invalido .|.'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }else{
        return false
    }
}

module.exports = {
    listarFilmes,
    buscarFilmeId,
    inserirFilme,
    atualizarFilme,
    excluirFilme
}