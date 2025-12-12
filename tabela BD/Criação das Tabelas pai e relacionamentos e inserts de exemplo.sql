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

INSERT INTO tbl_filme (nome, sinopse, data_lancamento, duracao, orcamento, trailer, capa)
VALUES (
    'Origem',
    'Um ladrão que rouba segredos corporativos através do uso da tecnologia de compartilhamento de sonhos é encarregado da tarefa inversa: plantar uma ideia na mente de um C.E.O.',
    '2010-08-06',
    '02:28:00',
    160000000.00,
    'url_trailer_origem',
    'url_capa_origem'
);

CREATE TABLE tbl_genero(
	genero_id INT PRIMARY KEY auto_increment,
    nome VARCHAR(100) NOT NULL
);

INSERT INTO tbl_genero (nome) VALUES ('Ação');
INSERT INTO tbl_genero (nome) VALUES ('Ficção Científica');
INSERT INTO tbl_genero (nome) VALUES ('Comédia');

CREATE TABLE tbl_classificacao(
	classificacao_id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    idade_minima INT NOT NULL
);

INSERT INTO tbl_classificacao (nome, idade_minima) VALUES ('Livre', 0);
INSERT INTO tbl_classificacao (nome, idade_minima) VALUES ('12 Anos', 12);
INSERT INTO tbl_classificacao (nome, idade_minima) VALUES ('18 Anos', 18);

CREATE TABLE tbl_ator(
	ator_id INT PRIMARY KEY auto_increment,
    nome VARCHAR(100) NOT NULL,
    genero VARCHAR(100) NULL,
    data_nascimento DATE NULL,
    data_morte DATE NULL,
    img_ator TEXT NULL
);

INSERT INTO tbl_ator (nome, genero, data_nascimento, data_morte, img_ator) 
VALUES ('Tom Cruise', 'Masculino', '1962-07-03', NULL, 'url_imagem_tom_c');

INSERT INTO tbl_ator (nome, genero, data_nascimento, data_morte, img_ator) 
VALUES ('Gal Gadot', 'Feminino', '1985-04-30', NULL, 'url_imagem_gal_g');

CREATE TABLE tbl_diretor(
	diretor_id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    genero VARCHAR(100) NULL,
    data_nascimento DATE NULL,
    data_morte DATE NULL,
    img_diretor TEXT NULL
    
);

INSERT INTO tbl_diretor (nome, genero, data_nascimento, data_morte, img_diretor) 
VALUES ('Christopher Nolan', 'Masculino', '1970-07-30', NULL, 'url_imagem_chris_n');

CREATE TABLE tbl_filme_ator(
	id INT PRIMARY KEY AUTO_INCREMENT,
    id_filme INT NOT NULL,
    id_ator INT NOT NULL,
    
    FOREIGN KEY (id_filme) REFERENCES tbl_filme (id),
    FOREIGN KEY (id_ator) REFERENCES tbl_ator (ator_id)
);

INSERT INTO tbl_filme_ator (id_filme, id_ator) VALUES (1, 1);
          
CREATE TABLE tbl_filme_diretor(
	id INT PRIMARY KEY AUTO_INCREMENT,
    id_filme INT NOT NULL,
    id_diretor INT NOT NULL,
    
    FOREIGN KEY (id_filme) REFERENCES tbl_filme (id),
    FOREIGN KEY (id_diretor) REFERENCES tbl_diretor (diretor_id)
);

INSERT INTO tbl_filme_diretor (id_filme, id_diretor) VALUES (1, 1);

CREATE TABLE tbl_filme_genero(
	id INT PRIMARY KEY AUTO_INCREMENT,
    id_filme INT NOT NULL,
    id_genero INT NOT NULL,
    
    FOREIGN KEY (id_filme) REFERENCES tbl_filme (id),
    FOREIGN KEY (id_genero) REFERENCES tbl_genero (genero_id)
);

INSERT INTO tbl_filme_genero (id_filme, id_genero) VALUES (1, 1); -- Ação
INSERT INTO tbl_filme_genero (id_filme, id_genero) VALUES (1, 2); -- Ficção Científica