/*********************************************************************************************
* 
* Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model(Validações, tratamento de dados, erros, etc)
* Data: 29/10/2025 D.C.
* Autor: Alex Henrique Da Cruz Gomes
* Versão: 1.0
* 
**********************************************************************************************/

const diretorDAO = require('../../model/dao/diretor.js')

const MESSAGE_DEFAULT = require('../../controller/modulo/config_messages')
const {json} = require('body-parser')

//Retorna a lista dos diretores dentro do BD
const listarDiretores = async function(){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        
        let result = await diretorDAO.getSelectAllDirectors()

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

//Retorna um diretor do BD filtrando ID
const buscarDiretorId = async function(diretor_id){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        
        if(diretor_id != '' && diretor_id != null && diretor_id != undefined && diretor_id && !isNaN(diretor_id) && diretor_id > 0){

            let result = await diretorDAO.getSelectByIdDirectors(parseInt(diretor_id))

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.directors = result

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

//Validação dos dados de cadastro do ator
const validarDadosDiretor = function(diretor){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if(diretor.nome == '' || diretor.nome == null || diretor.nome == undefined || diretor.nome.length > 100){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [nome] invalido .|.`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(diretor.genero == '' || diretor.genero == null || diretor.genero == undefined || diretor.genero.length > 100){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [genero] invalido .|.`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(diretor.data_nascimento == '' || diretor.data_nascimento == null || diretor.data_nascimento == undefined || diretor.data_nascimento.length != 10){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [data_nascimento] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(diretor.img_diretor == ''|| diretor.img_diretor == undefined || diretor.img_diretor.length > 200){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [img] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
        
    }else if(diretor.data_morte == null){
        return false
    
    }else if(diretor.data_morte == '' || diretor.data_morte == undefined || diretor.data_morte.length != 10){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [data_morte] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else{
        return false
    }
}

//Insere um novo ator dentro do BD
const inserirDiretor = async function(diretor, contentType){
    
    MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let validarDados = await validarDadosDiretor(diretor)

            if(!validarDados){

                let result = await diretorDAO.setInsertDirectors(diretor)

                if(result){

                    lastIdDiretor = await diretorDAO.getSelectLasIdDirectors()

                    if(lastIdDiretor){
                        diretor.diretor_id                    = lastIdDiretor
                        MESSAGE.HEADER.status       = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response     = diretor
    
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

//Atualizar um diretor do BD filtrando pelo ID
const atualizarDiretor = async function(diretor, id, contentType){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //Validação do content-type
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validação de dados de cadastro
            let validarDados = await validarDadosDiretor(diretor)

            if(!validarDados){

            let validarId = await buscarDiretorId(id)

            //Verifica se o ID existe no DB, caso exista teremos um 200
            if(validarId.status_code == 200){

                //Adicionando o ID no JSON com os dados do ator
                diretor.id = parseInt(id)

                //Chama a função do DAO para atualizar um ator
                let result = await diretorDAO.setUpdateDirectors(diretor)

                if(result){
                    MESSAGE.HEADER.status       = MESSAGE.SUCCESS_UPDATED_ITEM.status
                    MESSAGE.HEADER.status_code  = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                    MESSAGE.HEADER.message      = MESSAGE.SUCCESS_UPDATED_ITEM.message
                    MESSAGE.HEADER.response     = diretor

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

//Exclui um diretor existente no BD filtrando pelo ID
const excluirDiretor = async function(diretor_id){

        let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    
        try {
    
                let validarId = await buscarDiretorId(diretor_id)
    
                //Verifica se o ID existe no DB, caso exista teremos um 200
                if(validarId.status_code == 200){
    
                    //Chama a função do DAO para delete um ator
                    let result = await diretorDAO.setDeleteDirectors(diretor_id)
    
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

module.exports = {
    listarDiretores,
    buscarDiretorId,
    validarDadosDiretor,
    inserirDiretor,
    atualizarDiretor,
    excluirDiretor
}