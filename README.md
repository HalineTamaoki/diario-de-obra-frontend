# **Diário de Obra 🚧**

## **Descrição**

O Diário de Obra é uma aplicação moderna em React, projetada para ajudar usuários a gerenciarem projetos de obras e reformas individuais. Acompanhe suas obras, adicione itens, gerencie orçamentos, monitore a execução e finalize tarefas — tudo em uma interface limpa e intuitiva. 

---

## **Pré-requisitos**

- **Node.js** (v18 ou maior)
- **npm** (v9+) ou **yarn** (v1+)

---

## **Instalação**

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/your-username/diario-de-obra-frontend.git
cd diario-de-obra-frontend
npm install
# ou
yarn install
```

---

## **Executando o Projeto**

### Iniciar Servidor de Desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

### Gerar Build para Produção

```bash
npm run build
# ou
yarn build
```

### Pré-visualizar Build de Produção

```bash
npm run preview
# ou
yarn preview
```

### Executar testes unitários

- **Testes unitários:**

 ```bash
 npm run test
 ```

## Cobertura de Testes

- **Gerar relatório de cobertura:**

   ```bash
   npm run coverage
   ```

- O relatório estará disponível na pasta `coverage/`.

---

## **Estrutura de pastas**

```
diario-de-obra-frontend/
├── public/                # Arquivos estáticos
├── src/
│   ├── app/               # Configuração da store do Redux
│   ├── assets/            # Imagens e ícones
│   ├── components/        # Componentes React reutilizáveis
│   │   ├── common/        # Elementos de interface (UI) compartilhados
│   │   ├── detalhesObra/  # Detalhes do item, execução, ideação, etc.
│   │   ├── layout/        # Componentes de layout (Cabeçalho, Rodapé, etc.)
│   │   ├── obra/          # Cards e inputs relacionados à obra
│   ├── features/          # Redux slices e reducers
│   ├── navigation/        # Roteamento da aplicação
│   ├── pages/             # Páginas principais (Obra, DetalhesObra)
│   ├── types/             # Tipagens TypeScript
│   ├── app.css            # Estilos gerais da aplicação
│   ├── index.css          # Estilos globais
│   ├── main.tsx           # Ponto de entrada (Entry point)
│   ├── app.tsx            # Componente raiz
├── package.json           # Metadados e scripts do projeto
├── vite.config.ts         # Configuração do Vite
├── tsconfig*.json         # Configurações do TypeScript
└── index.html             # Template HTML
```

---

## **Tecnologias usadas**

- ⚛️ **React** (v19)
- 🛠️ **Redux Toolkit** (gerenciamento de estado)
- 🎨 **Tailwind CSS** (estilização utility-first)
- 💡 **React Bootstrap** (componentes de interface)
- 🧭 **React Router DOM** (roteamento)
- 🖼️ **React Icons** (biblioteca de ícones)
- 📝 **TypeScript** (segurança de tipos)
- 🚀 **Vite** (ferramenta de build rápida)
- 📱 **React Responsive** (media queries/responsividade)
- 🧪 **React Hook Form** (gerenciamento de formulários)

---


## **License**

Este projeto está sob a licença **MIT**.  
Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido por Haline Tamaoki**
