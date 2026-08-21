# 🛒 Grocery Delivery

Uma aplicação **full-stack de delivery de produtos de supermercado**, desenvolvida com React, TypeScript, Node.js, Express e PostgreSQL.

O projeto foi desenvolvido com o objetivo de praticar e demonstrar conceitos de desenvolvimento **Front-end e Back-end**, incluindo autenticação de usuários, gerenciamento de produtos, carrinho de compras, pedidos, endereços e integração com banco de dados.

---

## 📋 Sobre o projeto

O **Grocery Delivery** simula uma plataforma de compras de supermercado online, onde o usuário pode navegar pelos produtos disponíveis, adicionar itens ao carrinho, gerenciar seus dados de entrega e realizar pedidos.

A aplicação é dividida em duas partes:

* **Client:** interface da aplicação desenvolvida com React + TypeScript.
* **Server:** API REST desenvolvida com Node.js + Express + TypeScript.

---

## ✨ Funcionalidades

### 👤 Usuários

* Cadastro de usuários
* Login
* Autenticação utilizando JWT
* Proteção de rotas
* Criptografia de senhas com bcrypt
* Gerenciamento do perfil

### 🛍️ Produtos

* Visualização de produtos
* Organização por categorias
* Visualização de detalhes dos produtos
* Imagens dos produtos
* Gerenciamento de produtos através da API

### 🛒 Carrinho

* Adicionar produtos ao carrinho
* Remover produtos
* Alterar quantidade dos produtos
* Visualizar resumo da compra

### 📦 Pedidos

* Criação de pedidos
* Visualização das informações do pedido
* Gerenciamento das informações de entrega

### 🏠 Endereços

* Cadastro de endereços
* Edição de endereços
* Exclusão de endereços
* Seleção do endereço para entrega

> O cadastro do endereço não depende da obtenção automática da localização do usuário.

### 🖼️ Upload de imagens

* Upload de imagens utilizando Multer
* Armazenamento de imagens utilizando Cloudinary

---

## 🛠️ Tecnologias utilizadas

### Front-end

| Tecnologia          | Utilização                          |
| ------------------- | ----------------------------------- |
| **React**           | Construção da interface             |
| **TypeScript**      | Tipagem estática                    |
| **Vite**            | Ambiente de desenvolvimento e build |
| **Tailwind CSS**    | Estilização                         |
| **React Router**    | Gerenciamento de rotas              |
| **Axios**           | Comunicação com a API               |
| **Lucide React**    | Ícones                              |
| **React Hot Toast** | Notificações                        |

### Back-end

| Tecnologia     | Utilização                             |
| -------------- | -------------------------------------- |
| **Node.js**    | Ambiente de execução                   |
| **Express**    | Criação da API REST                    |
| **TypeScript** | Tipagem estática                       |
| **Prisma**     | ORM                                    |
| **PostgreSQL** | Banco de dados                         |
| **Neon**       | Hospedagem do banco de dados           |
| **JWT**        | Autenticação                           |
| **bcrypt**     | Criptografia de senhas                 |
| **Cloudinary** | Armazenamento de imagens               |
| **Multer**     | Upload de arquivos                     |
| **Inngest**    | Processamento de funções em background |

---

## 📁 Estrutura do projeto

```text
Grocery-delivery-app/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── server/
│   ├── prisma/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── server.ts
│   ├── seed.ts
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

---

## 🚀 Como executar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/httpfabiana/Grocery-delivery-app.git
```

Entre na pasta do projeto:

```bash
cd Grocery-delivery-app
```

---

## 💻 Configurando o Front-end

Entre na pasta `client`:

```bash
cd client
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` dentro da pasta `client`:

```env
VITE_API_URL=
```

Depois, execute:

```bash
npm run dev
```

---

## 🖥️ Configurando o Back-end

Abra outro terminal e entre na pasta `server`:

```bash
cd server
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` com as variáveis necessárias para o projeto:

```env
DATABASE_URL=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Gere o Prisma Client:

```bash
npx prisma generate
```

Para inserir os dados iniciais no banco:

```bash
npm run seed
```

Para iniciar o servidor em desenvolvimento:

```bash
npm run server
```

---

## 🗄️ Banco de dados

O back-end utiliza **PostgreSQL** como banco de dados, com **Prisma ORM** para comunicação e gerenciamento das informações.

O banco de dados utilizado no projeto está hospedado na plataforma **Neon**.

Após configurar a variável `DATABASE_URL`, execute:

```bash
npx prisma generate
```

Caso seja necessário executar o seed:

```bash
npm run seed
```

---

## 🔐 Variáveis de ambiente

As variáveis de ambiente são utilizadas para armazenar informações sensíveis, como:

* URL de conexão com o banco de dados
* Chave secreta do JWT
* Credenciais do Cloudinary
* URL da API utilizada pelo front-end

**Nunca compartilhe ou envie arquivos `.env` para o GitHub.**

---

## 🌐 Deploy

O projeto possui uma estrutura separada entre **Front-end e Back-end**, permitindo que cada parte seja hospedada de forma independente.

### Front-end

Desenvolvido com Vite e preparado para deploy em plataformas como Vercel.

### Back-end

API desenvolvida com Express e preparada para deploy em ambiente serverless.

---

## 📸 Demonstração

Em breve serão adicionados screenshots da aplicação mostrando:

* Página inicial
* Produtos
* Carrinho
* Login e cadastro
* Perfil
* Endereços
* Pedidos

---

## 🎯 Objetivos do projeto

O projeto foi desenvolvido para colocar em prática conhecimentos de desenvolvimento **Full-Stack**, principalmente:

* Desenvolvimento de interfaces com React
* TypeScript
* Consumo de APIs REST
* Criação de APIs com Express
* Autenticação com JWT
* Criptografia de senhas
* Modelagem de banco de dados
* Prisma ORM
* PostgreSQL
* Upload e armazenamento de imagens
* Gerenciamento de estado da aplicação
* Rotas protegidas
* Variáveis de ambiente
* Deploy de aplicações

---

## 👩‍💻 Autora

**Fabiana**

Desenvolvedora Front-end em formação, estudando e desenvolvendo projetos Full-Stack para aprimorar conhecimentos em desenvolvimento web.

### 🔗 GitHub

https://github.com/httpfabiana

---

## 📄 Licença

Este projeto foi desenvolvido para fins de estudo e portfólio.
