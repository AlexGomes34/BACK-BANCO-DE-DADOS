/*********************************************************************************************
* * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model para o CRUD de FILMES E DIRETORES (Validações, tratamento de dados, erros, etc)
* Data: 07/12/2025 D.C.
* Autor: Alex Henrique Da Cruz Gomes
* Versão: 1.0
* **********************************************************************************************/

// Import do arquivo DAO para manipular o CRUD no BD (Note o caminho correto do seu projeto)
const filmeDiretorDAO = require('../../model/dao/filme_diretor.js') 

// Import do arquivo que padroniza todas as mensagens (Note o caminho correto do seu projeto)
const MESSAGE_DEFAULT = require('../modulo/config_messages')

//Retorna uma lista de todos os filmes e diretores relacionados
const listarFilmesDiretores = async function(){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    
    try {
        
        let result = await filmeDiretorDAO.getSelectAllFilmsDirectors()

        if(result){
            if(result.length > 0){
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.films_directors = result
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

//Retorna os diretores filtrando pelo ID do filme
const listarDiretoresIdFilme = async function(idFilme){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try{
        //Validação de campo obrigatório
        if(idFilme != '' && idFilme != null && idFilme != undefined && !isNaN(idFilme) && idFilme > 0){

            let result = await filmeDiretorDAO.getSelectDirectorsByIdFilm(parseInt(idFilme))

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.directors = result

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

//Retorna os filmes filtrando pelo ID do diretor
const listarFilmesIdDiretor = async function(idDiretor){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try{
        //Validação de campo obrigatório
        if(idDiretor != '' && idDiretor != null && idDiretor != undefined && !isNaN(idDiretor) && idDiretor > 0){

            let result = await filmeDiretorDAO.getSelectFilmsByIdDirectors(parseInt(idDiretor))

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
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [id_diretor] invalido .|.'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }

    }catch(error){
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Insere um novo relacionamento filme-diretor
const inserirFilmeDiretor = async function(filmeDiretor, contentType){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if(String(contentType).toUpperCase() === 'APPLICATION/JSON'){

            let validarDados = await validarDadosFilmeDiretor(filmeDiretor)

            if(!validarDados){ // Se validarDados for false (válido)

                // CHAMA A FUNÇÃO DO DAO PARA INSERIR
                let result = await filmeDiretorDAO.setInsertFilmsDirectors(filmeDiretor)

                if(result){
                    // Chama a função para receber o id gerado no BD
                    let lastIdFilmeDiretor = await filmeDiretorDAO.getSelectLastId()

                    if(lastIdFilmeDiretor){

                        filmeDiretor.id = lastIdFilmeDiretor

                        MESSAGE.HEADER.status     = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message    = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response   = filmeDiretor
    
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

//Atualiza um relacionamento filme-diretor filtrando pelo ID
const atualizarFilmeDiretor = async function(filmeDiretor, id, contentType){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        // Validação do content-type
        if(String(contentType).toUpperCase() !== 'APPLICATION/JSON'){
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }

        // Validação dos dados
        let validarDados = await validarDadosFilmeDiretor(filmeDiretor)

        if(validarDados){
            return validarDados // Retorno da validação de dados (400)
        }
        
        // Validação do ID fornecido na URL e existência no BD
        let validarId = await buscarFilmeDiretorId(id)

        // Verifica se o ID existe no DB (status_code 200)
        if(validarId.status_code === 200){

            // Adicionando o ID no JSON para o DAO
            filmeDiretor.id = parseInt(id)

            // Chama a função do DAO para atualizar
            let result = await filmeDiretorDAO.setUpdateFilmsDirectors(filmeDiretor)

            if(result){
                MESSAGE.HEADER.status     = MESSAGE.SUCCESS_UPDATED_ITEM.status
                MESSAGE.HEADER.status_code  = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                MESSAGE.HEADER.message    = MESSAGE.SUCCESS_UPDATED_ITEM.message
                MESSAGE.HEADER.response   = filmeDiretor

                return MESSAGE.HEADER //200
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else{
            return validarId // Retorno da função de buscarFilmeDiretorId (400, 404, ou 500)
        }
        
    }catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Apaga um relacionamento filme-diretor filtrando pelo ID
const excluirFilmeDiretor = async function(id){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    
    try {
        
        // Validação de ID inválido antes de buscar (Otimização)
        if (id === '' || id === null || id === undefined || isNaN(id) || parseInt(id) <= 0) {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [id] invalido .|.'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }

        let validarId = await buscarFilmeDiretorId(id)

        // Verifica se o ID existe no DB (status_code 200)
        if(validarId.status_code === 200){

            // Chama a função do DAO para delete
            let result = await filmeDiretorDAO.setDeleteFilmsDirectors(id)

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
            return validarId // Retorno da função de buscarFilmeDiretorId (400, 404, ou 500)
        }
    }catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Retorna um relacionamento filme-diretor filtrando pelo ID
const buscarFilmeDiretorId = async function(id){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try{
        //Validação de campo obrigatório (ID)
        if(id != '' && id != null && id != undefined && !isNaN(id) && id > 0){

            // Chama a função para filtrar pelo ID
            let result = await filmeDiretorDAO.getSelectByIdFilmDirector(parseInt(id))

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film_director = result
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

//Validação de dados de cadastro/atualização de filme_diretor
const validarDadosFilmeDiretor = async function(filmeDiretor){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if(filmeDiretor.id_filme == '' || filmeDiretor.id_filme == null || filmeDiretor.id_filme == undefined || isNaN(filmeDiretor.id_filme) || filmeDiretor.id_filme <= 0){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [id_filme] invalido .|.'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }else if(filmeDiretor.id_diretor == '' || filmeDiretor.id_diretor == null || filmeDiretor.id_diretor == undefined || isNaN(filmeDiretor.id_diretor) || filmeDiretor.id_diretor <= 0){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [id_diretor] invalido .|.'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }else{
        return false // Dados válidos
    }
}

module.exports = {
    listarFilmesDiretores,
    buscarFilmeDiretorId,
    inserirFilmeDiretor,
    atualizarFilmeDiretor,
    excluirFilmeDiretor,
    listarFilmesIdDiretor,
    listarDiretoresIdFilme
}