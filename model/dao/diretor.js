/*********************************************************************************************
 * 
 * Objetivo: Arquivo responsável pela realização do CRUD de diretores no Banco de Dados MySQL
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

//Retorna todos os diretores do BD
const getSelectAllDirectors = async function(){

    try {
        
        let sql = `SELECT * FROM tbl_diretor`

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

//Retorna um diretor do BD baseando-se no ID
const getSelectByIdDirectors = async function(diretor_id){
    try {
        let sql = `select * from tbl_ator WHERE diretor_id = ${diretor_id}`

        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

//Retorna o ultimo registro de diretor a ser criado dentro do BD
const getSelectLasIdDirectors = async function() {
    try {
        
        let sql = `select diretor_id from tbl_diretor order by diretor_id desc limit 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result)){
            return Number(result[0].diretor_id)
        }else{
            return false
        }

    } catch (error) {
        return false
    }
}

//Insere um diretor novo dentro do BD
const setInsertDirectors = async function(diretor){
    try {
        
        let sql =   `
                    INSERT INTO tbl_diretor (nome, genero, data_nascimento, data_morte, img_diretor)
                    VALUES ('${diretor.nome}', '${diretor.genero}', '${diretor.data_nascimento}', ${diretor.data_morte}, '${diretor.img_diretor}');
                    `
        
        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

//Atualiza um diretor que exista dentro do BD filtrando pelo ID
const setUpdateDirectors = async function(diretor){
    try {
        let sql =   `
                    UPDATE tbl_diretor set 
                        nome            = '${diretor.nome}',
                        genero          = '${diretor.genero}',
                        data_nascimento = '${diretor.data_nascimento}',
                        data_morte      =  ${diretor.data_morte},
                        img_diretor     = '${diretor.img_diretor}'
                    where diretor_id = ${diretor.id}
                    `

        // $executeRawUnsafe() ->   Permite apenas executar scripts SQL que não tem retorno de dados (INSERT, UPDATE & DELETE)
        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            return true
        }else
            return false
    } catch (error) {
        return false
    }
}

//Deleta um ator existente no BD filtrando pelo ID
const setDeleteDirectors = async function(diretor_id){
    try {
        let sql =   `
                    DELETE FROM tbl_diretor WHERE diretor_id = ${diretor_id}
                    `

        let result = await prisma.$queryRawUnsafe(sql)


    if(result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}
module.exports = {
    getSelectAllDirectors,
    getSelectByIdDirectors,
    getSelectLasIdDirectors,
    setInsertDirectors,
    setUpdateDirectors,
    setDeleteDirectors
}