# Sistema de Gerenciamento de Gincana - IFPA Campus Marabá Industrial

Um sistema web moderno para gerenciamento de competições esportivas, desenvolvido com React, TypeScript e Vite.

## 🎯 Funcionalidades

### Área Pública
- Visualização de jogos ao vivo com placar em tempo real
- Calendário de próximos jogos
- Consulta de resultados anteriores
- Interface responsiva e amigável
- Acompanhamento de estatísticas dos jogadores
- Visualização de eventos do jogo em tempo real (gols, cartões, substituições)

### Área Administrativa
- Gerenciamento completo de times e jogadores
- Controle de placar em tempo real
- Gestão do calendário de jogos
- Sistema de eventos de jogo (gols, cartões, substituições)
- Controle de premiações
- Gestão de estatísticas dos jogadores:
  - Gols marcados
  - Cartões amarelos
  - Cartões vermelhos

## 🛠️ Tecnologias Utilizadas

- **React** - Biblioteca para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **Framer Motion** - Biblioteca de animações
- **Lucide React** - Ícones modernos
- **Supabase** - Backend as a Service para banco de dados e autenticação

## 📦 Modalidades Suportadas

- Futsal
- Vôlei
- Basquete
- Handebol
- Outras modalidades podem ser adicionadas dinamicamente

## 🚀 Como Executar

1. Clone o repositório
```bash
git clone [url-do-repositorio]
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
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

## 🔒 Autenticação

O sistema possui uma área administrativa protegida com autenticação para gerenciamento das competições.

## 🎮 Funcionalidades do Placar

- Controle de tempo de jogo com cronômetro integrado
- Marcação de eventos:
  - Gols (atualiza automaticamente o placar e estatísticas do jogador)
  - Cartões amarelos (atualiza estatísticas do jogador)
  - Cartões vermelhos (atualiza estatísticas do jogador)
  - Substituições
- Atualização em tempo real usando Supabase Realtime
- Gestão de períodos de jogo
- Registro de jogadores e estatísticas
- Histórico de eventos do jogo

## 👥 Gestão de Times

- Cadastro e edição de times
- Gerenciamento de jogadores:
  - Informações básicas (nome, número)
  - Foto do jogador
  - Estatísticas individuais:
    - Gols marcados
    - Cartões amarelos
    - Cartões vermelhos
- Controle de cartões e suspensões
- Registro de premiações
- Histórico de partidas

## 📅 Gestão de Calendário

- Agendamento de jogos
- Definição de locais
- Categorias:
  - Masculino
  - Feminino
  - Misto
- Controle de modalidades
- Visualização por mês
- Status dos jogos:
  - Agendado
  - Em andamento
  - Finalizado
  - Cancelado

## 🎨 Temas

O sistema suporta tema claro e escuro, adaptando-se automaticamente às preferências do usuário.

## 📱 Responsividade

Interface totalmente responsiva, funcionando em:
- Desktops
- Tablets
- Smartphones

## 🤝 Atualizações em Tempo Real

- Placar dos jogos
- Eventos (gols, cartões, substituições)
- Estatísticas dos jogadores
- Status dos jogos
- Calendário de partidas

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🏗️ Desenvolvido por

Mim
