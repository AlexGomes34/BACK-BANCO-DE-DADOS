/*********************************************************************************************
* 
* Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model(Validações, tratamento de dados, erros, etc)
* Data: 29/10/2025 D.C.
* Autor: Alex Henrique Da Cruz Gomes
* Versão: 1.0
* 
**********************************************************************************************/

const atorDAO = require('../../model/dao/ator')

const MESSAGE_DEFAULT = require('../../controller/modulo/config_messages')
const {json} = require('body-parser')

//Retorna a lista dos atores dentro do BD
const listarAtores = async function(){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        
        let result = await atorDAO.getSelectAllActors()

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
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Retorna um ator do BD filtrando pelo ID
const buscarAtorId = async function(ator_id){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        
        if(ator_id != '' && ator_id != null && ator_id != undefined && ator_id && !isNaN(ator_id) && ator_id > 0){

            let result = await atorDAO.getSelectByIdActors(parseInt(ator_id))

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.actors = result

                    return MESSAGE.HEADER //200
                }else{
                    return MESSAGE.ERROR_NOT_FOUND
                }
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [id] invalido .|.'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Insere um novo ator dentro do BD
const inserirAtor = async function(ator, contentType){
    
    MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let validarDados = await validarDadosAtor(ator)

            if(!validarDados){

                let result = await atorDAO.setInsertActors(ator)

                if(result){

                    lastIdAtor = await atorDAO.getSelectLastIdActors()

                    if(lastIdAtor){
                        ator.id                    = lastIdAtor
                        MESSAGE.HEADER.status       = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response     = ator
    
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

//Atualizar um ator filtrando pelo ID
const atualizarAtor = async function(ator, id, contentType){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //Validação do content-type
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validação de dados de cadastro
            let validarDados = await validarDadosAtor(ator)

            if(!validarDados){

            let validarId = await buscarAtorId(id)

            //Verifica se o ID existe no DB, caso exista teremos um 200
            if(validarId.status_code == 200){

                //Adicionando o ID no JSON com os dados do ator
                ator.id = parseInt(id)

                //Chama a função do DAO para atualizar um ator
                let result = await atorDAO.setUpdateActors(ator)

                if(result){
                    MESSAGE.HEADER.status       = MESSAGE.SUCCESS_UPDATED_ITEM.status
                    MESSAGE.HEADER.status_code  = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                    MESSAGE.HEADER.message      = MESSAGE.SUCCESS_UPDATED_ITEM.message
                    MESSAGE.HEADER.response     = ator

                    return MESSAGE.HEADER //200
                }else{
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }else{
                return validarId //Retorno da função de buscarAtorID (400 ou 404 ou 500)
            }
        }else{
                return validarDados //Retorno da função de validar dados do ator 400
        }
    }else{
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    }catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Apaga um ator filtrando pelo ID
const excluirAtor = async function(ator_id){

        let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    
        try {
    
                let validarId = await buscarAtorId(ator_id)
    
                //Verifica se o ID existe no DB, caso exista teremos um 200
                if(validarId.status_code == 200){
    
                    //Chama a função do DAO para delete um ator
                    let result = await atorDAO.setDeleteActors(ator_id)
    
                    if(result){
                        MESSAGE.HEADER.status       = MESSAGE.SUCCESS_DELETE_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCCESS_DELETE_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCCESS_DELETE_ITEM.message
    
                        return MESSAGE.HEADER //200
                    }else{
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                }else{
                    return validarId //Retorno da função de buscarAtorID (400 ou 404 ou 500)
                }
        }catch (error) {
            return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
        }
}

//Validação dos dados de cadastro do ator
const validarDadosAtor = function(ator){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if(ator.nome == '' || ator.nome == null || ator.nome == undefined || ator.nome.length > 100){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [nome] invalido .|.`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(ator.genero == '' || ator.genero == null || ator.genero == undefined || ator.genero.length > 100){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [genero] invalido .|.`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(ator.data_nascimento == '' || ator.data_nascimento == null || ator.data_nascimento == undefined || ator.data_nascimento.length != 10){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [data_nascimento] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(ator.img == ''|| ator.img == undefined || ator.img.length > 200){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [img] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(ator.data_morte == '' || ator.data_morte == undefined || ator.data_morte.length != 10){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [data_morte] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(ator.data_morte == null){
    return false

    }else{
        return false
    }
}


module.exports = {
    listarAtores,
    buscarAtorId,
    validarDadosAtor,
    inserirAtor,
    atualizarAtor,
    excluirAtor
}