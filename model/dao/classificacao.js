/*********************************************************************************************
 * 
 * Objetivo: Arquivo responsável pela realização do CRUD de classificação no Banco de Dados MySQL
 * Data: 22/10/2025 D.C.
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

//Retorna todas as classificações do BD
const getSelectAllClassifications = async function(){
    try {

        //SCRIPT SQL
        let sql = `SELECT * FROM tbl_classificacao`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validaçaõ para identificar se o retorno do banco é um array (vazio ou com dados) 
        if (Array.isArray(result)) {
            return result
        } else {
            return false
        }
        
    } catch (error) {
        return false
    }
}

//Retorna uma classificação do BD filtrando pelo ID
const getSelectByIdClassifications = async function(id){
    try {
        let sql =   `select * from tbl_classificacao WHERE classificacao_id = ${id}`
        
        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result))
            return result
        else
            return false
        

    } catch (error) {
        return false
    }
}

//Retorna a ultima classificação a ser criada dentro do BD
const getSelectLastIdClassification = async function(){
    try {
        
        let sql = `select classificacao_id from tbl_classificacao order by classificacao_id desc limit 1`

        let result = await prisma.$executeRawUnsafe(sql)

        if(Array.isArray(result)){
            return Number(result[0].classificacao_id)
        }else{
            return false
        }
    } catch (error) {
        return false
    }
} 

//Insere uma nova classificação dentro do BD
const setInsertClassifications = async function(classificacao){
    try {
        
        let sql =   `
                    INSERT INTO tbl_classificacao (nome, idade_minima)
                    VALUES ('${classificacao.nome}', '${classificacao.idade_minima}')
                    `

        let result = await prisma.$executeRawUnsafe(sql)
        console.log(result)
        if(result){
            return result
        }else{
            return false
        }
    } catch (error) {
        console.log(error)
        return false

    }
}
module.exports = {
    getSelectAllClassifications,
    getSelectByIdClassifications,
    getSelectLastIdClassification,
    setInsertClassifications
}