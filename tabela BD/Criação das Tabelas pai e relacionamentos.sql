CREATE TABLE tbl_filme (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL, 
    sinopse TEXT, 
    data_lancamento DATE,
    duracao TIME,
    orcamento DECIMAL(18, 2), 
    trailer VARCHAR(500), 
    capa VARCHAR(500) 
);

CREATE TABLE tbl_genero(
	genero_id INT PRIMARY KEY auto_increment,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE tbl_classificacao(
	classificacao_id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    idade_minima INT NOT NULL
);

CREATE TABLE tbl_ator(
	ator_id INT PRIMARY KEY auto_increment,
    nome VARCHAR(100) NOT NULL,
    genero VARCHAR(100) NULL,
    data_nascimento DATE NULL,
    data_morte DATE NULL,
    img_ator TEXT NULL
);

CREATE TABLE tbl_diretor(
	diretor_id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    genero VARCHAR(100) NULL,
    data_nascimento DATE NULL,
    data_morte DATE NULL,
    img_diretor TEXT NULL
    
);

CREATE TABLE tbl_filme_ator(
	id INT PRIMARY KEY AUTO_INCREMENT,
    id_filme INT NOT NULL,
    id_ator INT NOT NULL,
    
    FOREIGN KEY (id_filme) REFERENCES tbl_filme (id),
    FOREIGN KEY (id_ator) REFERENCES tbl_ator (ator_id)
);

CREATE TABLE tbl_filme_diretor(
	id INT PRIMARY KEY AUTO_INCREMENT,
    id_filme INT NOT NULL,
    id_diretor INT NOT NULL,
    
    FOREIGN KEY (id_filme) REFERENCES tbl_filme (id),
    FOREIGN KEY (id_diretor) REFERENCES tbl_diretor (diretor_id)
);

CREATE TABLE tbl_filme_genero(
	id INT PRIMARY KEY AUTO_INCREMENT,
    id_filme INT NOT NULL,
    id_genero INT NOT NULL,
    
    FOREIGN KEY (id_filme) REFERENCES tbl_filme (id),
    FOREIGN KEY (id_genero) REFERENCES tbl_genero (genero_id)
);