/*********************************************************************************************
* 
* Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model(Validações, tratamento de dados, erros, etc)
* Data: 22/10/2025 D.C.
* Autor: Alex Henrique Da Cruz Gomes
* Versão: 1.0
* 
**********************************************************************************************/

//Import do arquivo DAO para manipular o CRUD no BD
const classificacaoDAO = require('../../model/dao/classificacao')

//Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../../controller/modulo/config_messages')
const { json } = require('body-parser')

//Retorna a lista das classificações
const listarClassificacoes = async function(){

    //Realiza uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações dessa função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        
        //Chama a função do DAO para retornar a lista de generos
        let result = await classificacaoDAO.getSelectAllClassifications()

        if(result){
            if(result.length > 0){
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.classifications = result
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

//Retorna uma classificação do BD filtrando pelo ID
const buscarClassificacaoId = async function(id) {
    
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        
        //Validação do ID recebido
        if(id != '' && id != null && id != undefined && id && !isNaN(id) && id > 0){

            //Chama a função que buscar filtrando pelo ID
            let result = await classificacaoDAO.getSelectByIdClassifications(parseInt(id))

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.classifications = result

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
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Insere uma nova classificação no BD
const inserirClassificacao = async function(classificacao, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Validação dos campos obrigatórios
            if(classificacao.nome == '' || classificacao.nome == null || classificacao.nome == undefined || classificacao.nome.length > 100){
                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [nome] invalido .|.'
                return MESSAGE.ERROR_REQUIRED_FIELDS //400
            }else if(classificacao.idade_minima == '' || classificacao.idade_minima == null || classificacao.idade_minima == undefined || classificacao.idade_minima < 0){
                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [nome] invalido .|.'
                return MESSAGE.ERROR_REQUIRED_FIELDS //400
            }else{

                let result = await classificacaoDAO.setInsertClassifications(classificacao)

                if(result){

                    let lastIdClassificacao = await classificacaoDAO.getSelectLastIdClassification()
                    if(lastIdClassificacao){

                        classificacao.classificacao_id = lastIdClassificacao

                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.response = classificacao

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
    }catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Atualiza uma classificação dentro do BD
const atualizarClassificacao = async function(classificacao, classificacao_id, contentType){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //Validação do content-type
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Validação de campo obrigatório
            if(classificacao.nome == '' || classificacao.nome == null || classificacao.nome == undefined || classificacao.nome.length > 100){
                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [nome] invalido .|.'
                return MESSAGE.ERROR_REQUIRED_FIELDS //400
            }else if(classificacao.idade_minima == '' || classificacao.idade_minima == null || classificacao.idade_minima == undefined || isNaN(classificacao.idade_minima) || classificacao.idade_minima.length <=0){
                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [idade_minima] invalido .|.'
                console.log(classificacao.idade_minima)
                return MESSAGE.ERROR_REQUIRED_FIELDS //400
            }else{

                let validarId = await buscarClassificacaoId(classificacao_id)

                if(validarId.status_code = 200){

                    classificacao.classificacao_id = parseInt(classificacao_id)

                    let result = await classificacaoDAO.setUpdateClassifications(classificacao)

                    if(result){
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = classificacao

                        return MESSAGE.HEADER //200
                    }else{
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                }else{
                    return validarId //Retorno da função de validar o ID (400/404/500)
                }

            }
        }else{
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
        }
        
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Deleta uma classificação dentro do BD
const excluirClassificacao = async function(classificacao_id){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        
        let validarId = await buscarClassificacaoId(classificacao_id)

        if(validarId.status_code = 200){

            let result = await classificacaoDAO.setDeleteClassifications(classificacao_id)

            if(result){
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETE_ITEM.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETE_ITEM.status_code
                MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETE_ITEM.message

                return MESSAGE.HEADER //200
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else{
            return validarId //Retorno da função de buscarFilmeID (400/404/500)
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}
module.exports = {
    listarClassificacoes,
    buscarClassificacaoId,
    inserirClassificacao,
    atualizarClassificacao,
    excluirClassificacao
}
