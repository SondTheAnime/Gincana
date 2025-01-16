# Sistema de Gerenciamento de Gincana - IFPA Campus Marabá Industrial

Um sistema web moderno para gerenciamento de competições esportivas, desenvolvido com React, TypeScript e Vite.

## 🎯 Funcionalidades

### Área Pública
- Visualização de jogos ao vivo com placar em tempo real
- Calendário de próximos jogos
- Consulta de resultados anteriores
- Interface responsiva e amigável
- Sistema de inscrição para times e jogadores
- Tema claro/escuro

### Área Administrativa
- Gerenciamento completo de times e jogadores
- Controle de placar em tempo real
- Gestão do calendário de jogos
- Gerenciamento de modalidades esportivas
- Controle de inscrições de times e jogadores
- Painel administrativo completo

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **Framer Motion** - Biblioteca de animações
- **Lucide React** - Ícones modernos
- **Supabase** - Backend as a Service para banco de dados e autenticação
- **React Router DOM** - Roteamento da aplicação
- **Sonner** - Notificações modernas
- **Zod** - Validação de esquemas
- **HeadlessUI** - Componentes acessíveis sem estilo

## 📦 Estrutura do Projeto

```
src/
├── assets/      # Recursos estáticos
├── components/  # Componentes React
│   ├── admin/   # Componentes da área administrativa
│   └── home/    # Componentes da área pública
├── contexts/    # Contextos React (ex: Tema)
├── lib/         # Bibliotecas e configurações
├── pages/       # Páginas da aplicação
└── routes/      # Configuração de rotas
```

## 🚀 Como Executar

1. Clone o repositório
```bash
git clone [url-do-repositorio]
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente (.env)
```bash
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

4. Execute o projeto em modo de desenvolvimento
```bash
npm run dev
```

5. Para build de produção
```bash
npm run build
```

## 🔒 Autenticação e Rotas

O sistema possui rotas protegidas para a área administrativa:
- `/admin` - Login administrativo
- `/admin/dashboard` - Painel de controle
- `/jogos` - Visualização de jogos ao vivo
- `/calendario` - Calendário de jogos
- `/inscricao` - Sistema de inscrições
  - `/inscricao/time` - Inscrição de times
  - `/inscricao/jogador` - Inscrição de jogadores

## 🎮 Funcionalidades do Painel Administrativo

- Adicionar novos jogos
- Gerenciar calendário de competições
- Atualizar placares em tempo real
- Gerenciar times e jogadores
- Administrar modalidades esportivas
- Controlar solicitações de inscrição
- Configurar períodos de inscrição

## 👥 Gestão de Times e Jogadores

- Cadastro e gerenciamento de times
- Controle de jogadores por modalidade
- Aprovação de inscrições
- Gerenciamento de modalidades específicas:
  - Futsal
  - Vôlei
  - Tênis de Mesa
  - Outras modalidades configuráveis

## 🎨 Temas e Responsividade

- Suporte a tema claro e escuro
- Design responsivo para todas as telas
- Interface moderna e intuitiva
- Componentes acessíveis
- Animações suaves com Framer Motion

## 🔄 Atualizações em Tempo Real

- Placar dos jogos
- Status das partidas
- Notificações de eventos
- Atualizações do calendário

## 📱 Compatibilidade

Interface totalmente responsiva, funcionando em:
- Desktops
- Tablets
- Smartphones

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🏗️ Desenvolvido por

Mim

