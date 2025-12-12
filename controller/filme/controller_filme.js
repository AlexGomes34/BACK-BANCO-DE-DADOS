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

//Import da controller_filme_genero(tabela de relação)
const controllerFilmeGenero = require('./controller_filme_genero.js')

//Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

//Retorna uma lista de filmes
const listarFilmes = async function(filme){

    //Realizando uma copia do objeto MESSAGE_DEFAULT, permitindo que as alterações dessa função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try{

        //Chama a função do DAO para retornar a lista de filmes
        let result = await filmeDAO.getSelectAllFilms()

        if(result){
            if(result.length > 0){

                //Versão do professor
                //let arrayFilmes = []

                //Processamento para adicionar os generos em cada filme
                for(filme of result){
                    let resultFilmeGenero = await controllerFilmeGenero.listarGenerosIdFilme(filme.id)

                    if(resultFilmeGenero.status_code == 200)
                    filme.genero = resultFilmeGenero.response.film_genre

                }

                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.films = result

                return MESSAGE.HEADER //201
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

                    for(filme of result){
                        let resultFilmeGenero = await controllerFilmeGenero.listarGenerosIdFilme(filme.id)
    
                        if(resultFilmeGenero.status_code == 200)
                        filme.genero = resultFilmeGenero.response.film_genre
    
                    }

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

const inserirFilme = async function(filme, contentType){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));
    let statusRelacao = true; // Flag para controlar o sucesso da relação

    try {
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            // 1. CHAMA A FUNÇÃO DE VALIDAÇÃO DE DADOS DE CADASTRO
            let validarDados = await validarDadosFilme(filme);

            // Se os dados principais do filme forem válidos (retorna false se sucesso na validação)
            if(!validarDados){

                // 2. CHAMA A FUNÇÃO DO DAO PARA INSERIR UM NOVO FILME
                let result = await filmeDAO.setInsertFilms(filme);

                if(result){

                    // 3. BUSCA O ID GERADO NO BD
                    let lastIdFilme = await filmeDAO.getSelectLasIdFilm();

                    if(lastIdFilme){

                        // 4. PROCESSAMENTO PARA INSERIR RELAÇÃO (FILME X GÊNERO)
                        
                        // VERIFICAÇÃO: Garante que filme.genero é um array e tem dados
                        if(filme.genero && Array.isArray(filme.genero) && filme.genero.length > 0){
                            
                            // Repetição para pegar os generos e enviar para o DAO do filmeGenero
                            for(genero of filme.genero){
                                let filmeGenero = {id_filme: lastIdFilme, id_genero: genero.id};

                                let resultFilmeGenero = await controllerFilmeGenero.inserirFilmeGenero(filmeGenero, contentType);

                                // Se a inserção da relação falhar
                                if(resultFilmeGenero.status_code != 201){
                                    statusRelacao = false; // Define a flag como falha
                                    break; // Sai do loop imediatamente
                                }
                            }
                        }

                        // 5. VERIFICA SE HOUVE ERRO NA RELAÇÃO
                        if (!statusRelacao) {
                             // Retorna erro 200, mas com problemas na tabela de relação
                            return MESSAGE.ERROR_RELATION_TABLE; 
                        }

                        // 6. MONTA A RESPOSTA DE SUCESSO (STATUS 201)
                        
                        // Adiciona no json de filme o id que foi gerado pelo BD
                        filme.id = lastIdFilme;

                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status;
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code;
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message;

                        // Apaga o atributo genero que chegou no POST
                        delete filme.genero;

                        // Pesquisa no BD quais os generos e os seus dados que foram inseridos na tabela de relação
                        let resultGenerosFilme = await controllerFilmeGenero.listarGenerosIdFilme(lastIdFilme);

                        // >>>>>> CORREÇÃO PRINCIPAL: VALIDAÇÃO DO RETORNO <<<<<<
                        // Garante que 'response' e 'film_genre' existem antes de acessá-los
                        if (resultGenerosFilme && 
                            resultGenerosFilme.response && 
                            resultGenerosFilme.response.film_genre) 
                        {
                            // Adiciona novamente o atributo genero com todas as informações do genero
                            filme.genero = resultGenerosFilme.response.film_genre;
                            console.log(filme.genero);
                        } else {
                            // Se falhar, o filme foi inserido, mas não teremos os dados detalhados do gênero
                            console.warn("Aviso: Falha ao recuperar os dados dos gêneros inseridos. Retornando filme sem detalhe de gênero.");
                            // Se a listagem falhou, garantimos que o campo 'genero' é um array vazio ou não existe, 
                            // para que o JSON de resposta seja coerente.
                            filme.genero = []; 
                        }
                        
                        MESSAGE.HEADER.response = filme;
        
                        return MESSAGE.HEADER; // 201

                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; // 500
                    }
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; // 500
                }
            } else {
                return validarDados; // 400 (Dados de entrada inválidos)
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE; // 415
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER; // 500
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