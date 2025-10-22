/*********************************************************************************************
* 
* Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model(Validações, tratamento de dados, erros, etc)
* Data: 21/10/2025 D.C.
* Autor: Alex Henrique Da Cruz Gomes
* Versão: 1.0
* 
**********************************************************************************************/

//Import do arquivo DAO para manipular o CRUD no BD
const generoDAO = require('../../model/dao/genero.js')

//Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

//Retorna uma lista de generos
const listarGeneros = async function(){

    //Realizando uma copia do objeto MESSAGE_DEFAULT, permitindo que as alterações dessa função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    
    try {
        
        //Chama a função do DAO para retornar a lista de generos
        let result = await generoDAO.getSelectAllGenres()

        if(result){
            if(result.length > 0){
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.genres = result
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

//Retorna um genero filtrando pelo ID
const buscarGeneroId = async function(id){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try{
        //Validação de campo obrigatório
        if(id != '' && id != null && id != undefined && !isNaN(id) && id > 0){

            //Chama a função para filtrar pelo ID
            let result = await generoDAO.getSelectByIdGenres(parseInt(id))

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.genre = result

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

//Insere um novo genero
const inserirGenero = async function(genero, contentType){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Validação de campo obrigatório
            if(genero.nome == '' || genero.nome == null || genero.nome == undefined || genero.nome.length > 100){
                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [nome] invalido .|.'
                return MESSAGE.ERROR_REQUIRED_FIELDS //400
            }else{
                
                //Chama a função do DAO para inserir um novo filme
                let result = await generoDAO.setInsertGenres(genero)

                if(result){

                    //Chama a função para receber o ID gerado no BD
                    let lastIdGenero = await generoDAO.getSelectLastIdGenre()

                    if(lastIdGenero){

                        //Adiciona no json de genero o id que foi gerado pelo BD
                        genero.genero_id                    = lastIdGenero

                        MESSAGE.HEADER.status       = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response     = genero
    
                        return MESSAGE.HEADER //201

                    }else{
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                }else{
                    return MESSAGE.ERROR_NOT_FOUND //500
                }
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
        
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Atualiza um genero no BD filtrando pelo ID
const atualizarGenero = async function(genero, genero_id, contentType){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //Validação do content-type
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Validação de campo obrigatório
            if(genero.nome == '' || genero.nome == null || genero.nome == undefined || genero.nome.length > 100){
                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [nome] invalido .|.'
                return MESSAGE.ERROR_REQUIRED_FIELDS //400
            }else{

                let validarId = await buscarGeneroId(genero_id)

                //Verifica se o ID existe no BD, Caso exista teremos um 200
                if(validarId.status_code == 200){

                    genero.genero_id = parseInt(genero_id)

                    //Chama a função do DAO que atuaiza o genero
                    let result = await generoDAO.setUpdateGenres(genero)

                    if(result){
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = genero

                        return MESSAGE.HEADER //200
                    }else{
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                }else{
                    return validarId //Retorno da função de buscar o ID (400/404/500)
                }
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE
        }
        
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Deleta um genero no BD filtrando pelo ID
const excluirGenero = async function(genero_id){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try{

        let validarId = await buscarGeneroId(genero_id)

        //Verifica se o ID existe no BD, Caso exista teremos um 200
        if(validarId.status_code == 200){

            //Chama a função do DAO para deletar um genero
            let result = await generoDAO.setDeleteGenres(genero_id)

            if(result){
                MESSAGE.HEADER.status       = MESSAGE.SUCCESS_DELETE_ITEM.status
                MESSAGE.HEADER.status_code  = MESSAGE.SUCCESS_DELETE_ITEM.status_code
                MESSAGE.HEADER.message      = MESSAGE.SUCCESS_DELETE_ITEM.message

                return MESSAGE.HEADER //200
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else{
            return validarId //Retorna a função de buscar o ID (400/404/500)
        }

    }catch(error){
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}
module.exports = {
    listarGeneros,
    buscarGeneroId,
    inserirGenero,
    atualizarGenero,
    excluirGenero
}