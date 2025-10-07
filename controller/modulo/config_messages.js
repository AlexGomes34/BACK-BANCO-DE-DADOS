/*********************************************************************************************
* 
* Objetivo: Arquivo responsável pela padronização de todas as mensagens da API do projeto de filmes
* Data: 07/10/2025 D.C.
* Autor: Alex Henrique Da Cruz Gomes
* Versão: 1.0
* 
**********************************************************************************************/

const dataAtual = new Date()

/************************************MENSAGENS DE PADRONIZAÇÃO DO PROJETO************************************************ */

const MESSAGE_HEADER = {
                            development:        'Alex Henrique Da Cruz Gomes', 
                            api_description:    'API para manipular dados da locadora de filmes',  
                            version:            '1.0.10.25',   
                            request_date:       dataAtual.toLocaleDateString(),

                            status:             Boolean,
                            status_code:        Number,
                            response: {}
                        }

/************************************MENSAGENS DE ERRO DO PROJETO******************************************************** */

/************************************MENSAGENS DE SUCESSO DO PROJETO***************************************************** */

const MESSAGE_SUCCESS_REQUEST = {status: true, status_code: 200, message: 'requisição bem sucedida .|.'}


module.exports = {
    MESSAGE_SUCCESS_REQUEST,
    MESSAGE_HEADER
}