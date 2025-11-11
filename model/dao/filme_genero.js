/*********************************************************************************************
 * 
 * Objetivo: Arquivo responsável pela realização do CRUD de relacionamento entre filme e genero no Banco de Dados MySQL
 * Data: 05/11/2025 D.C.
 * Autor: Alex Henrique Da Cruz Gomes
 * Versão: 1.0
 * 
 **********************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')
const { getSelectLastIdGenre } = require('./genero')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os filmes e generos do BD
const getSelectAllFilmsGenres = async function(){
    try {

        //SCRIPT SQL
        let sql = `select * from tbl_filme_genero order by id desc`

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

//Retorna um filmeGenero Filtrando pelo ID do BD
const getSelectByIdFilmGenre = async function(id){
    try {
        //Script SQL
        let sql = `select * from tbl_filme_genero where id = ${id}`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validaçaõ para identificar se o retorno do banco é um array (vazio ou com dados)
        if(Array.isArray(result))
            return result
        else
            return false
        

    } catch (error) {
        return false
    }
    
}

//Retorna os generos Filtrando pelo ID do filme do BD
const getSelectGenresByIdFilm = async function(idFilme){
    try {
        //Script SQL
        let sql = `select tbl_genero.genero_id, tbl_genero.nome from tbl_filme
         inner join tbl_filme_genero on tbl_filme.id = tbl_filme_genero.id_filme 
         inner join tbl_genero on tbl_genero.genero_id = tbl_filme_genero.id_genero
        where tbl_filme.id = ${idFilme}`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validaçaõ para identificar se o retorno do banco é um array (vazio ou com dados)
        if(Array.isArray(result))
            return result
        else
            return false
        

    } catch (error) {
        return false
    }
    
}

//Retorna os filmes Filtrando pelo ID do genero do BD
const getSelectFilmsByIdGenre = async function(idGenero){
    try {
        //Script SQL
        let sql = `select tbl_filme.id, tbl_filme.nome from tbl_filme
         inner join tbl_filme_genero on tbl_filme.id = tbl_filme_genero.id_filme 
         inner join tbl_genero on tbl_genero.id = tbl_filme_genero.id_genero
        where tbl_genero.id = ${idGenero}`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validaçaõ para identificar se o retorno do banco é um array (vazio ou com dados)
        if(Array.isArray(result))
            return result
        else
            return false
        

    } catch (error) {
        return false
    }
    
}

//Retorna o Ultimo ID a ser Adicionado no BD
const getSelectLastId = async function(){
    try {

        //Script SQL
        let sql = `select id from tbl_filme_genero order by id desc limit 1`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        //Validaçaõ para identificar se o retorno do banco é um array (vazio ou com dados)
        if(Array.isArray(result))
            return Number(result[0].id)
        else
            return false

    } catch (error) {
        return false
    }
    
}

//Insere um Genero no BD
const setInsertFilmsGenres = async function(filmeGenero){
    try {
        let sql =   `
                    INSERT INTO tbl_filme_genero (id_filme, id_genero)
                    VALUES (${filmeGenero.id_filme}, ${filmeGenero.id_genero});
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

//Atualiza um genero existente no BD filtrando pelo ID
const setUpdateFilmsGenres = async function(filmeGenero){
    try {

        let sql =   `
                    UPDATE tbl_filme_genero set
                        id_filme = ${filmeGenero.idFilme},
                        id_genero = ${filmeGenero.idGenero}
                    WHERE id = ${filmeGenero.id}
                    `

        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            return true
        }else{
            false
        }
        
    } catch (error) {
        return false
    }
}

//Deleta um genero existente no BD filtrando pelo ID
const setDeleteFilmsGenres = async function(id){
    try {
        
        let sql =   `
                    DELETE FROM tbl_filme_genero WHERE id = ${id}
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
    getSelectAllFilmsGenres,
    getSelectByIdFilmGenre,
    getSelectLastId,
    setInsertFilmsGenres,
    setUpdateFilmsGenres,
    setDeleteFilmsGenres,
    getSelectFilmsByIdGenre,
    getSelectGenresByIdFilm
}