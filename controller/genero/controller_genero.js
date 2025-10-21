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

//Insere um novo filme
const inserirGenero = async function(genero, contentType){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            //Validação de campo obrigatório
            if(id == '' || id == null || id == undefined || !isNaN(id) || id <= 0){
                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [id] invalido .|.'
                return MESSAGE.ERROR_REQUIRED_FIELDS //400
            }else if(genero.nome == '' || genero.nome == null || genero.nome == undefined || genero.nome.length > 100){
                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [nome] invalido .|.'
                return MESSAGE.ERROR_REQUIRED_FIELDS //400
            }else{
                
                //Chama a função do DAO para inserir um novo filme
                let result = await generoDAO.setInsertGenres(genero)

                if(result){

                    //Chama a função para receber o ID gerado no BD
                    let lastIdGenero = await generoDAO.getSelectLastIdGenre()

                    if(lastIdGenero){

                        //Adiciona no json de generos o id que foi gerado pelo BD
                        genero.id = lastIdGenero

                        MESSAGE.HEADER.status       = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response     = genero
    
                        return MESSAGE.HEADER //201
                    }else{
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                }else{
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
        
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}
module.exports = {
    listarGeneros,
    buscarGeneroId,
    inserirGenero
}