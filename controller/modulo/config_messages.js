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

const HEADER = {
                            development:        'Alex Henrique Da Cruz Gomes', 
                            api_description:    'API para manipular dados da locadora de filmes',  
                            version:            '1.0.10.25',   
                            request_date:       dataAtual.toLocaleDateString(),

                            status:             Boolean,
                            status_code:        Number,
                            response: {}
                        }

/************************************MENSAGENS DE ERRO DO PROJETO******************************************************** */

const ERROR_NOT_FOUND = {status: false, status_code: 404, message: 'Não foram encontrados dados de retorno.|.'}

const ERROR_INTERNAL_SERVER_MODEL = {status: false, status_code: 500, message: 'Não foi possivel processar a requisição, devido a erros/problemas na camada de modelagem de dados .|.'}

const ERROR_REQUIRED_FIELDS = {status: false, status_code: 400, message: 'Não foi possivel processar a requisição devido a atributos/campos obrigatorios que não foram enviados corretamente, conforme a documentação da API .|.'}

const ERROR_INTERNAL_SERVER_CONTROLLER = {status: false, status_code: 500, message: 'Não foi possivel processar a requisição, devido a erros/problemas na camada de controle de dados .|.'}

const ERROR_CONTENT_TYPE = {status: false, status_code: 415, message: 'Não foi possivél processar a requisição pois o tipo de conteudo enviado no BODY não é permitido. Deve-se utilizar apenas JSON na API .|.'}
/************************************MENSAGENS DE SUCESSO DO PROJETO***************************************************** */

const SUCCESS_REQUEST = {status: true, status_code: 200, message: 'requisição bem sucedida .|.'}

const SUCCESS_CREATED_ITEM = {status: true, status_code: 201, message: 'requisição bem sucedida, objeto criado com sucesso'
}

const SUCCESS_UPDATED_ITEM = {status: true, status_code: 200, message: 'Requisição bem sucedida, objeto atualizado com sucesso .|.'}

const SUCCESS_DELETE_ITEM = {status: true, status_code: 200, message: 'Requisição bem sucedida, objeto DELETADO com sucesso .|.'}


module.exports = {
    SUCCESS_REQUEST,
    HEADER,
    ERROR_NOT_FOUND,
    ERROR_INTERNAL_SERVER_MODEL,
    ERROR_INTERNAL_SERVER_CONTROLLER,
    ERROR_REQUIRED_FIELDS,
    SUCCESS_CREATED_ITEM,
    ERROR_CONTENT_TYPE,
    SUCCESS_UPDATED_ITEM,
    SUCCESS_DELETE_ITEM
}