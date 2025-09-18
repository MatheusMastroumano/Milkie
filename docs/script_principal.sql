create database if not exists milkie;

create table lojas (
	id int primary key auto_increment not null,
	tipo enum('matriz', 'filial'),
    aberta_em timestamp,
	ativo boolean default true,
    endereco varchar(100),
    constraint fk_funcionarios
		foreign key (funcionario_id)
        references funcionarios(id)
);

create table funcionarios (
	id int primary key auto_increment not null,
    funcao enum('admin', 'gerente', 'caixa'),
    nome varchar(50),
    CPF varchar(50),
    salario int,
    email varchar(50),
    telefone int,
    idade int
);

create 