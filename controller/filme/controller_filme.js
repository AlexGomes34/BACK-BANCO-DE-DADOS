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

    //Chama a função do DAO para retornar a lista de filmes
    let result = await filmeDAO.getSelectAllFilms()

    if(result){
        if(result.length > 0){
            MESSAGE_DEFAULT.MESSAGE_HEADER.status = MESSAGE_DEFAULT.MESSAGE_SUCCESS_REQUEST.status
            MESSAGE_DEFAULT.MESSAGE_HEADER.status_code = MESSAGE_DEFAULT.MESSAGE_SUCCESS_REQUEST.status_code
            MESSAGE_DEFAULT.MESSAGE_HEADER.response.films = result
            return MESSAGE_DEFAULT.MESSAGE_HEADER 
        }
    }

}

//Retorna um filme filtrando pelo ID
const buscarFilmeId = async function(id){

}

//Insere um novo filme
const inserirFilme = async function(filme){

}

//Atualiza um filme filtrando pelo ID
const atualizarFilme = async function(filme, id){

}

//Apaga um filme filtrando pelo ID
const excluirFilme = async function(id){

}

module.exports = {
    listarFilmes
}