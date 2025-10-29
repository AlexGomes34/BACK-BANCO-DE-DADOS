/*********************************************************************************************
 * 
 * Objetivo: Arquivo responsável pela realização do CRUD de atores no Banco de Dados MySQL
 * Data: 29/10/2025 D.C.
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

//Retorna todos os atores do BD
const getSelectAllActors = async function(){

    try {
        
        let sql = `SELECT * FROM tbl_ator`

        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result)){
            return result
        }else{
            return false
        }
    } catch (error) {
        return false
    }
    
}

//Retorna um ator do BD filtrando pelo ID
const getSelectByIdActors = async function(ator_id){
    try {
        let sql = `select * from tbl_ator WHERE ator_id = ${ator_id}`

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
const getSelectLastIdActors = async function(){
    try{

        let sql = `select ator_id from tbl_ator order by ator_id desc limit 1`

        let result = prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result)){
            return Number(result[0].ator_id)
        }else{
            return false
        }

    }catch(error){
        return false
    }
}

//Insere um ator novo no BD
const setInsertActors = async function(ator){
    try {
        
        let sql =   `
                    INSERT INTO tbl_ator (nome, genero, data_nascimento, data_morte, img_ator)
                    VALUES ('${ator.nome}', '${ator.genero}', '${ator.data_nascimento}', '${ator.data_morte}', '${ator.img_ator}');
                    `
        
        let result = await prisma.$executeRawUnsafe(sql)
        if(result)
            return result
        else
            return false
    } catch (error) {
        return false
    }
}
module.exports = {
    getSelectAllActors,
    getSelectByIdActors,
    getSelectLastIdActors,
    setInsertActors
}
