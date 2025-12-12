/*********************************************************************************************
 * * Objetivo: Arquivo responsável pela realização do CRUD de relacionamento entre filme e diretor no Banco de Dados MySQL
 * Data: 07/12/2025 D.C.
 * Autor: Alex Henrique Da Cruz Gomes
 * Versão: 1.0
 * **********************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os filmes e ditores do BD
const getSelectAllFilmsDirectors = async function(){
    try {

        //SCRIPT SQL
        let sql = `select * from tbl_filme_diretor order by id desc`

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

//Retorna um filmeDiretor filtrando pelo ID do BD
const getSelectByIdFilmDirector = async function(id){
    try {
        //Script SQL
        let sql = `select * from tbl_filme_diretor where id = ${id}`

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

//Retorna os diretores Filtrando pelo ID do filme do BD
const getSelectDirectorsByIdFilm = async function(idFilme){
    try {
        //Script SQL
        let sql = `select 
                      tbl_diretor.diretor_id, 
                      tbl_diretor.nome
                   from tbl_filme
                   join tbl_filme_diretor on tbl_filme.id = tbl_filme_diretor.id_filme 
                   join tbl_diretor on tbl_diretor.diretor_id = tbl_filme_diretor.id_diretor
                   where tbl_filme.id = ${idFilme}`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar se o retorno do banco é um array (vazio ou com dados)
        if(Array.isArray(result))
            return result
        else
            return false
        
    } catch (error) {
        console.log(error)
        return false
    }
}

//Retorna os filmes Filtrando pelo ID do diretor do BD
const getSelectFilmsByIdDirectors = async function(idDiretor){
    try {
        //Script SQL
        let sql = `select 
                      tbl_filme.id as id_filme, 
                      tbl_filme.nome
                   from tbl_filme
                   join tbl_filme_diretor on tbl_filme.id = tbl_filme_diretor.id_filme 
                   join tbl_diretor on tbl_diretor.diretor_id = tbl_filme_diretor.id_diretor
                   where tbl_diretor.diretor_id = ${idDiretor}`

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
        let sql = `select id from tbl_filme_diretor order by id desc limit 1`

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

//Insere um novo relacionamento filmeDiretor no BD
const setInsertFilmsDirectors = async function(filmeDiretor){
    try {
        let sql =   `
                    INSERT INTO tbl_filme_diretor (id_filme, id_diretor)
                    VALUES (${filmeDiretor.id_filme}, ${filmeDiretor.id_diretor});
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

//Atualiza um relacionamento filmeDiretor existente no BD filtrando pelo ID
const setUpdateFilmsDirectors = async function(filmeAtor){
    try {
        let sql =   `
                    UPDATE tbl_filme_diretor set
                        id_filme = ${filmeDiretor.idFilme},
                        id_diretor = ${filmeDiretor.idDiretor}
                    WHERE id = ${filmeDiretor.id}
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

//Deleta um relacionamento filmeDiretor existente no BD filtrando pelo ID
const setDeleteFilmsDirectors = async function(id){
    try {
        
        let sql =   `
                    DELETE FROM tbl_filme_diretor WHERE id = ${id}
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
    getSelectAllFilmsDirectors,
    getSelectByIdFilmDirector,
    getSelectLastId,
    setInsertFilmsDirectors,
    setUpdateFilmsDirectors,
    setDeleteFilmsDirectors,
    getSelectFilmsByIdDirectors,
    getSelectDirectorsByIdFilm
}