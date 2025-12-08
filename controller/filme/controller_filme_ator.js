/*********************************************************************************************
* * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model para o CRUD de FILMES E ATORES (Validações, tratamento de dados, erros, etc)
* Data: 07/12/2025 D.C.
* Autor: Alex Henrique Da Cruz Gomes 
* Versão: 1.0
* **********************************************************************************************/

// Import do arquivo DAO para manipular o CRUD no BD (Note o caminho correto do seu projeto)
const filmeAtorDAO = require('../../model/dao/filme_ator.js') 

// Import do arquivo que padroniza todas as mensagens (Note o caminho correto do seu projeto)
const MESSAGE_DEFAULT = require('../modulo/config_messages')

//Retorna uma lista de todos os filmes e atores relacionados
const listarFilmesAtores = async function(){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    
    try {
        
        let result = await filmeAtorDAO.getSelectAllFilmsActors()

        if(result){
            if(result.length > 0){
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.films_actors = result
                return MESSAGE.HEADER //200
            }else{
                return MESSAGE.ERROR_NOT_FOUND //404
            }
        }else{
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Retorna um relacionamento filmeAtor filtrando pelo ID
const buscarFilmeAtorId = async function(id){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try{
        //Validação de campo obrigatório 
        if(id != '' && id != null && id != undefined && !isNaN(id) && id > 0){

            // Chama a função para filtrar pelo ID
            let result = await filmeAtorDAO.getSelectByIdFilmActor(parseInt(id))

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film_actor = result
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

//Retorna os atores filtrando pelo ID do filme
const listarAtoresIdFilme = async function(idFilme){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try{
        //Validação de campo obrigatório
        if(idFilme != '' && idFilme != null && idFilme != undefined && !isNaN(idFilme) && idFilme > 0){

            let result = await filmeAtorDAO.getSelectActorsByIdFilm(parseInt(idFilme))

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.actors = result

                    return MESSAGE.HEADER //200
                }else{
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }

        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [id_filme] invalido .|.'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }

    }catch(error){
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Retorna os filmes filtrando pelo ID do ator
const listarFilmesIdAtor = async function(idAtor){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try{
        //Validação de campo obrigatório
        if(idAtor != '' && idAtor != null && idAtor != undefined && !isNaN(idAtor) && idAtor > 0){

            let result = await filmeAtorDAO.getSelectFilmsByIdActor(parseInt(idAtor))

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
        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [id_ator] invalido .|.'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }

    }catch(error){
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Insere um novo relacionamento filmeAtor
const inserirFilmeAtor = async function(filmeAtor, contentType){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if(String(contentType).toUpperCase() === 'APPLICATION/JSON'){

            let validarDados = await validarDadosFilmeAtor(filmeAtor)

            if(!validarDados){

                // CHAMA A FUNÇÃO DO DAO PARA INSERIR
                let result = await filmeAtorDAO.setInsertFilmsActors(filmeAtor)

                if(result){
                    // Chama a função para receber o id gerado no BD
                    let lastIdFilmeAtor = await filmeAtorDAO.getSelectLastId()

                    if(lastIdFilmeAtor){

                        filmeAtor.id = lastIdFilmeAtor

                        MESSAGE.HEADER.status     = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message    = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response   = filmeAtor
    
                        return MESSAGE.HEADER //201

                    }else{
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
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

//Atualiza um relacionamento filme-ator filtrando pelo ID
const atualizarFilmeAtor = async function(filmeAtor, id, contentType){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        // Validação do content-type
        if(String(contentType).toUpperCase() !== 'APPLICATION/JSON'){
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }

        // Validação dos dados
        let validarDados = await validarDadosFilmeAtor(filmeAtor)

        if(validarDados){
            return validarDados //400
        }
        
        // Validação do ID 
        let validarId = await buscarFilmeAtorId(id)

        // Verifica se o ID existe no DB (200)
        if(validarId.status_code === 200){

            filmeAtor.id = parseInt(id)

            // Chama a função do DAO para atualizar
            let result = await filmeAtorDAO.setUpdateFilmsActors(filmeAtor)

            if(result){
                MESSAGE.HEADER.status     = MESSAGE.SUCCESS_UPDATED_ITEM.status
                MESSAGE.HEADER.status_code  = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                MESSAGE.HEADER.message    = MESSAGE.SUCCESS_UPDATED_ITEM.message
                MESSAGE.HEADER.response   = filmeAtor

                return MESSAGE.HEADER //200
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else{
            return validarId // Retorno da função de buscarFilmeAtorId (400, 404, ou 500)
        }
        
    }catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Apaga um relacionamento filme-ator filtrando pelo ID
const excluirFilmeAtor = async function(id){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    
    try {
        
        // Validação de ID inválido antes de buscar
        if (id === '' || id === null || id === undefined || isNaN(id) || parseInt(id) <= 0) {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [id] invalido .|.'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }

        let validarId = await buscarFilmeAtorId(id)

        // Verifica se o ID existe no DB (200)
        if(validarId.status_code === 200){

            // Chama a função do DAO para delete
            let result = await filmeAtorDAO.setDeleteFilmsActors(id)

            if(result){
                MESSAGE.HEADER.status     = MESSAGE.SUCCESS_DELETE_ITEM.status
                MESSAGE.HEADER.status_code  = MESSAGE.SUCCESS_DELETE_ITEM.status_code
                MESSAGE.HEADER.message    = MESSAGE.SUCCESS_DELETE_ITEM.message
                
                delete MESSAGE.HEADER.response
                return MESSAGE.HEADER //200
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else{
            return validarId // Retorno da função de buscarFilmeAtorId (400, 404, ou 500)
        }
    }catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}


//Validação de dados de filme_ator
const validarDadosFilmeAtor = async function(filmeAtor){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if(filmeAtor.id_filme == '' || filmeAtor.id_filme == null || filmeAtor.id_filme == undefined || isNaN(filmeAtor.id_filme) || filmeAtor.id_filme <= 0){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [id_filme] invalido .|.'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }else if(filmeAtor.id_ator == '' || filmeAtor.id_ator == null || filmeAtor.id_ator == undefined || isNaN(filmeAtor.id_ator) || filmeAtor.id_ator <= 0){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [id_ator] invalido .|.'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }else{
        return false // Dados válidos
    }
}

module.exports = {
    listarFilmesAtores,
    buscarFilmeAtorId,
    inserirFilmeAtor,
    atualizarFilmeAtor,
    excluirFilmeAtor,
    listarFilmesIdAtor,
    listarAtoresIdFilme
}