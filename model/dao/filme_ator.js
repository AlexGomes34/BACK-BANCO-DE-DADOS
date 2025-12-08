/*********************************************************************************************
 * * Objetivo: Arquivo responsável pela realização do CRUD de relacionamento entre filme e ator no Banco de Dados MySQL
 * Data: 07/12/2025 D.C.
 * Autor: Alex Henrique Da Cruz Gomes
 * Versão: 1.0
 * **********************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os filmes e atores do BD
const getSelectAllFilmsActors = async function(){
    try {

        //SCRIPT SQL
        let sql = `select * from tbl_filme_ator order by id desc`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar se o retorno do banco é um array (vazio ou com dados) 
        if (Array.isArray(result)) {
            return result
        } else {
            return false
        }
        
    } catch (error) {
        return false
    }
}

//Retorna um filmeAator filtrando pelo ID do BD
const getSelectByIdFilmActor = async function(id){
    try {
        //Script SQL
        let sql = `select * from tbl_filme_ator where id = ${id}`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar se o retorno do banco é um array (vazio ou com dados)
        if(Array.isArray(result))
            return result
        else
            return false
        
    } catch (error) {
        return false
    }
}

//Retorna os atores Filtrando pelo ID do filme do BD
const getSelectActorsByIdFilm = async function(idFilme){
    try {
        //Script SQL
        let sql = `select 
                      tbl_ator.ator_id, 
                      tbl_ator.nome
                   from tbl_filme
                   inner join tbl_filme_ator on tbl_filme.id = tbl_filme_ator.id_filme 
                   inner join tbl_ator on tbl_ator.ator_id = tbl_filme_ator.ator_id
                   where tbl_filme.id = ${idFilme}`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar se o retorno do banco é um array (vazio ou com dados)
        if(Array.isArray(result))
            return result
        else
            return false
        
    } catch (error) {
        return false
    }
}

//Retorna os filmes Filtrando pelo ID do ator do BD
const getSelectFilmsByIdActor = async function(idAtor){
    try {
        //Script SQL
        let sql = `select 
                      tbl_filme.id as id_filme, 
                      tbl_filme.nome
                   from tbl_filme
                   inner join tbl_filme_ator on tbl_filme.id = tbl_filme_ator.id_filme 
                   inner join tbl_ator on tbl_ator.id = tbl_filme_ator.id_ator
                   where tbl_ator.id = ${idAtor}`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar se o retorno do banco é um array (vazio ou com dados)
        if(Array.isArray(result))
            return result
        else
            return false
        
    } catch (error) {
        return false
    }
}


//Retorna o Último ID a ser Adicionado no BD
const getSelectLastId = async function(){
    try {

        //Script SQL
        let sql = `select id from tbl_filme_ator order by id desc limit 1`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar se o retorno do banco é um array (vazio ou com dados)
        if(Array.isArray(result) && result.length > 0)
            return Number(result[0].id)
        else
            return false

    } catch (error) {
        return false
    }
}

//Insere um novo relacionamento filmeAtor no BD
const setInsertFilmsActors = async function(filmeAtor){
    try {
        let sql =   `
                    INSERT INTO tbl_filme_ator (id_filme, id_ator)
                    VALUES (${filmeAtor.id_filme}, ${filmeAtor.id_ator});
                    `

        // $executeRawUnsafe() -> Permite apenas executar scripts SQL que não tem retorno de dados (INSERT, UPDATE & DELETE)
        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            return true
        }else
            return false
    } catch (error) {
        return false
    }
}

//Atualiza um relacionamento filmeAtor existente no BD filtrando pelo ID
const setUpdateFilmsActors = async function(filmeAtor){
    try {
        let sql =   `
                    UPDATE tbl_filme_ator set
                        id_filme = ${filmeAtor.idFilme},
                        id_ator = ${filmeAtor.idAtor}
                    WHERE id = ${filmeAtor.id}
                    `

        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            return true
        }else{
            return false
        }
        
    } catch (error) {
        return false
    }
}

//Deleta um relacionamento filmeAtor existente no BD filtrando pelo ID
const setDeleteFilmsActors = async function(id){
    try {
        
        let sql =   `
                    DELETE FROM tbl_filme_ator WHERE id = ${id}
                    `

        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            return true
        }else{
            return false
        }

    } catch (error) {
        return false
    }
}

module.exports ={
    getSelectAllFilmsActors,
    getSelectByIdFilmActor,
    getSelectLastId,
    setInsertFilmsActors,
    setUpdateFilmsActors,
    setDeleteFilmsActors,
    getSelectFilmsByIdActor,
    getSelectActorsByIdFilm
}