/*********************************************************************************************
 * 
 * Objetivo: Arquivo responsável pela realização do CRUD de filme no Banco de Dados MySQL
 * Data: 01/10/2025 D.C.
 * Autor: Alex Henrique Da Cruz Gomes
 * Versão: 1.0
 * 
 **********************************************************************************************/
/**********************************************************************************************************
 * Dependencias do node para Banco de Dados Relacional
 *      Sequelize   -> Foi uma biblioteca para acesso a banco de dados
 *      Prisma      -> É uma biblioteca atual para acesso e manipulação de dados, utilizando SQL ou ORM (MySQL, PostgreSQL, SQLServer, Oracle)
 *      Knex        -> É uma biblioteca atual para acesso e manipualação de dados, utilizando SQL (MySQL)
 * 
 * Dependencia do node para Banco de Dados NÃO Relacional
 *      Mongoose    -> É uma biblioteca para acesso a banco de dados não relacional (MongoDB)
 * 
 * ***********************************************************************************************************
 * 
 * Instalação do Prisma
 * npm install prisma --save            -> Realiza a conexão com o Banco de Dados
 * npm install @prisma/client --save   -> Permite executar scripts SQL no Banco de Dados
 * npx prisma init                      -> Inicializar o prisma no projeto(.env, prisma, etc)
 * npx prisma migrate                   -> Permite sincronizar o Prisma com o BD, Modelar o BD
 *                                         conforme as configurações do ORM.
 *                                         CUIDADO: Esse comando faz um reset no BD
 * npx prisma migrate reset             -> Realiza o reset do database
 * npx prisma generate                  -> Realiza apenas o sincronismo com o BD 
 *  
 * 
 *      $queryRawUnsafe()   -> Permite executar apenas scripts SQL que retornam dados do Banco de Dados (SELECT), 
 *                             permite também executar um script SQL através de uma variável
 *      
 *      $executeRawUnsafe() -> Permite executar apenas scripts SQL que NÃO retornam dados do Banco de Dados (INSERT, UPDATE, DELETE)
 * 
 * 
 *      $queryRaw()         -> Permite executar apenas scripts SQL que retornam dados do Banco de Dados (SELECT), 
 *                             permite APENAS executar um script SQL direto no método. Permite também aplicar segurança contra SQL Injection
 *      
 *      $executeRaw()       -> Permite executar apenas scripts SQL que NÃO retornam dados do Banco de Dados (INSERT, UPDATE, DELETE),
 *                             permite APENAS executar um script SQL direto no método. Permite também aplicar segurança contra SQL Injection
 * 
 * 
 **************************************************************************************************/


//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os filmes do banco de dados
const getSelectAllFilms = async function(){
    try {
        //Script SQL
        let sql = `select * from tbl_filme order by id desc`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validaçaõ para identificar se o retorno do banco é um array (vazio ou com dados)
        if(Array.isArray(result))
            return result
        else
            return false
        

    } catch (error) {
        //console.log(error)
        return false
    }
    
}

//Retorna um filme filtrando pelo ID do banco de dados
const getSelectByIdFilms = async function(id) {
    try {
        //Script SQL
        let sql = `select * from tbl_filme where id = ${id}`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validaçaõ para identificar se o retorno do banco é um array (vazio ou com dados)
        if(Array.isArray(result))
            return result
        else
            return false
        

    } catch (error) {
        //console.log(error)
        return false
    }
    
}

//Insere um filme no banco de dados
const setInsertFilms = async function(filme){
    try {
        let sql =   `
                    INSERT INTO tbl_filme (nome, sinopse, data_lancamento, duracao, orcamento, trailer, capa)
                    VALUES ( '${filme.nome}','${filme.sinopse}','${filme.data_lancamento}','${filme.duracao}','${filme.orcamento}','${filme.trailer}','${filme.capa}')
                    `

        // $executeRawUnsafe() ->   Permite apenas executar scripts SQL que não tem retorno de dados (INSERT, UPDATE & DELETE)
        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

//Atualiza um filme existente no banco de dados filtrando pelo ID
const setUpdateFilms = async function(filme){
    
}

//Apaga um filme existente no banco de dados filtrando pelo ID
const setDeleteFilms = async function(id){
    
}

module.exports ={
    getSelectAllFilms,
    getSelectByIdFilms,
    setInsertFilms
}