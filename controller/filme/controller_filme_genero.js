/*********************************************************************************************
* 
* Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model para o CRUD de FILMES E GENEROS(Validações, tratamento de dados, erros, etc)
* Data: 05/11/2025 D.C.
* Autor: Alex Henrique Da Cruz Gomes
* Versão: 1.0
* 
**********************************************************************************************/

//Import do arquivo DAO para manipular o CRUD no BD
const filmeGeneroDAO = require('../../model/dao/filme_genero.js')

//Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

//Retorna uma lista de todos os filmes e generos
const listarFilmesGeneros = async function(){

    //Realizando uma copia do objeto MESSAGE_DEFAULT, permitindo que as alterações dessa função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    
    try {
        
        //Chama a função do DAO para retornar a lista de filmes e generos
        let result = await filmeGeneroDAO.getSelectAllFilmsGenres()

        if(result){
            if(result.length > 0){
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.films_genres = result
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

//Retorna filmes e generos filtrando pelo ID
const buscarFilmeGeneroId = async function(id){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try{
        //Validação de campo obrigatório
        if(id != '' && id != null && id != undefined && !isNaN(id) && id > 0){

            //Chama a função para filtrar pelo ID
            let result = await filmeGeneroDAO.getSelectByIdFilmGenre(parseInt(id))

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film_genre = result

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

//Retorna os generos filtrando pelo ID do filme
const listarGenerosIdFilme = async function(idFilme){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try{
        //Validação de campo obrigatório
        if(idFilme != '' && idFilme != null && idFilme != undefined && !isNaN(idFilme) && idFilme > 0){

            //Chama a função para filtrar pelo ID
            let result = await filmeGeneroDAO.getSelectGenresByIdFilm(parseInt(idFilme))

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film_genre = result

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

//Retorna os filmes filtrando pelo ID do genero
const listarFilmesIdGenero = async function(idGenero){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try{
        //Validação de campo obrigatório
        if(idGenero != '' && idGenero != null && idGenero != undefined && !isNaN(idGenero) && idGenero > 0){

            //Chama a função para filtrar pelo ID
            let result = await filmeGeneroDAO.getSelectFilmsByIdGenre(parseInt(idGenero))

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film_genre = result

                    return MESSAGE.HEADER //200
                }else{
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            }else{
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [id_genero] invalido .|.'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }

    }catch(error){
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Insere um novo filme
const inserirFilmeGenero = async function(filmeGenero, contentType){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validação de dados de cadastro
            let validarDados = await validarDadosFilmeGenero(filmeGenero)

            if(!validarDados){

                //CHAMA A FUNÇÃO DO DAO PARA INSERIR UM NOVO FILME
                let result = await filmeGeneroDAO.setInsertFilmsGenres(filmeGenero)

                if(result){
                    //Chama a função para receber o id gerado no BD
                    let lastIdFilmeGenero = await filmeGeneroDAO.getSelectLastId()

                    if(lastIdFilmeGenero){

                        //Adiciona no json de filme o id que foi gerado pelo BD
                        filmeGenero.id                    = lastIdFilmeGenero

                        MESSAGE.HEADER.status       = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response     = filmeGenero
    
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

//Atualiza um filme filtrando pelo ID
const atualizarFilmeGenero = async function(filmeGenero, id, contentType){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //Validação do content-type
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validação de dados de cadastro
            let validarDados = await validarDadosFilmeGenero(filmeGenero)

            if(!validarDados){

            let validarId = await buscarFilmeGeneroId(id)

            //Verifica se o ID existe no DB, caso exista teremos um 200
            if(validarId.status_code == 200){

                //Adicionando o ID no JSON com os dados do filme
                filmeGenero.id = parseInt(id)

                //Chama a função do DAO para atualizar um filme
                let result = await filmeGeneroDAO.setUpdateFilmsGenres(filmeGenero)

                if(result){
                    MESSAGE.HEADER.status       = MESSAGE.SUCCESS_UPDATED_ITEM.status
                    MESSAGE.HEADER.status_code  = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                    MESSAGE.HEADER.message      = MESSAGE.SUCCESS_UPDATED_ITEM.message
                    MESSAGE.HEADER.response     = filmeGenero

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

//Apaga um filme e genero filtrando pelo ID
const excluirFilmeGenero = async function(id){

        let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    
        try {
    
                let validarId = await buscarFilmeGeneroId(id)
    
                //Verifica se o ID existe no DB, caso exista teremos um 200
                if(validarId.status_code == 200){
    
                    //Chama a função do DAO para delete um filme
                    let result = await filmeGeneroDAO.setDeleteFilmsGenres(id)
    
                    if(result){
                        MESSAGE.HEADER.status       = MESSAGE.SUCCESS_DELETE_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCCESS_DELETE_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCCESS_DELETE_ITEM.message
    
                        delete MESSAGE.HEADER.response
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
const validarDadosFilmeGenero = async function(filmeGenero){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if(filmeGenero.id_filme == '' || filmeGenero.id_filme == null || filmeGenero.id_filme == undefined || isNaN(filmeGenero.id_filme) || filmeGenero.id_filme <= 0){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [id_filme] invalido .|.'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }else if(filmeGenero.id_genero == '' || filmeGenero.id_genero == null || filmeGenero.id_genero == undefined || isNaN(filmeGenero.id_genero) || filmeGenero.id_genero <= 0){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [id_genero] invalido .|.'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }else{
        return false
    }
}

module.exports = {
    listarFilmesGeneros,
    buscarFilmeGeneroId,
    inserirFilmeGenero,
    atualizarFilmeGenero,
    excluirFilmeGenero,
    listarFilmesIdGenero,
    listarGenerosIdFilme
}