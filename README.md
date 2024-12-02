# Documentação da Loja - Leechy Cupcakes

## Funcionalidades da Aplicação

### Área do Cliente
1. **Autenticação e Perfil**
   - Cadastro de usuário com informações pessoais
   - Login/Logout
   - Gerenciamento de perfil com dados de entrega

2. **Catálogo de Produtos**
   - Visualização de cupcakes disponíveis
   - Filtros por:
     - Mais Pedidos
     - Novidades
     - Menor Preço
     - Maior Desconto
     - Black Friday
     - Natal
   - Detalhes do produto (ingredientes, preço, descrição)

3. **Carrinho de Compras**
   - Adição/remoção de produtos
   - Ajuste de quantidade
   - Cálculo automático do total
   - Persistência do carrinho

4. **Pedidos**
   - Histórico de pedidos
   - Acompanhamento de status
   - Detalhes completos dos itens

5. **Contato**
   - Múltiplos canais de comunicação:
     - WhatsApp
     - Instagram
     - Twitter
     - Telefone
   - Informações de localização e horário de funcionamento

### Área Administrativa
1. **Dashboard**
   - Visão geral das vendas
   - Total de produtos cadastrados
   - Pedidos pendentes
   - Estatísticas em tempo real

2. **Gestão de Produtos**
   - Cadastro de novos cupcakes
   - Edição de informações
   - Remoção de produtos
   - Controle de estoque

3. **Gestão de Pedidos**
   - Visualização de todos os pedidos
   - Atualização de status
   - Histórico completo

4. **Gestão de Usuários**
   - Lista de clientes cadastrados
   - Informações detalhadas de perfil
   - Histórico de compras por cliente

## Documentação do Banco de Dados

### Visão Geral
A aplicação utiliza um banco de dados PostgreSQL gerenciado pelo Supabase. O esquema do banco de dados foi projetado para suportar uma plataforma de e-commerce de cupcakes com gerenciamento de usuários, funcionalidade de carrinho de compras e processamento de pedidos.

### Estrutura das Tabelas

#### 1. profiles (Perfis)
Armazena informações do perfil do usuário, vinculado à autenticação do Supabase.
- `id` (uuid, PK) - Referencia auth.users.id
- `first_name` (texto, anulável) - Nome
- `last_name` (texto, anulável) - Sobrenome
- `email` (texto, anulável)
- `cpf` (texto, anulável)
- `phone` (texto, anulável) - Telefone
- `cep` (texto, anulável)
- `address` (texto, anulável) - Endereço
- `number` (texto, anulável) - Número
- `complement` (texto, anulável) - Complemento
- `neighborhood` (texto, anulável) - Bairro
- `city` (texto, anulável) - Cidade
- `additional_info` (texto, anulável) - Informações Adicionais
- `is_admin` (booleano, padrão: false) - É Administrador
- `created_at` (timestamp com fuso horário) - Data de Criação
- `updated_at` (timestamp com fuso horário) - Data de Atualização

#### 2. administrators (Administradores)
Gerencia privilégios de administrador.
- `id` (uuid, PK) - Referencia auth.users.id
- `created_at` (timestamp com fuso horário) - Data de Criação
- `updated_at` (timestamp com fuso horário) - Data de Atualização

#### 3. cupcakes
Armazena informações dos produtos (cupcakes).
- `id` (inteiro, PK)
- `title` (texto) - Título
- `ingredients` (texto) - Ingredientes
- `description` (texto) - Descrição
- `price` (numérico) - Preço
- `image` (texto) - Imagem
- `is_new` (booleano, padrão: false) - É Novo
- `discount` (inteiro, padrão: 0) - Desconto
- `order_count` (inteiro, padrão: 0) - Contagem de Pedidos
- `is_black_friday` (booleano, padrão: false) - É Black Friday
- `is_christmas` (booleano, padrão: false) - É Natal
- `created_at` (timestamp com fuso horário) - Data de Criação
- `updated_at` (timestamp com fuso horário) - Data de Atualização

#### 4. cart_items (Itens do Carrinho)
Gerencia itens nos carrinhos de compras dos usuários.
- `id` (inteiro, PK)
- `user_id` (uuid) - Referencia auth.users.id
- `cupcake_id` (inteiro) - Referencia cupcakes.id
- `quantity` (inteiro, padrão: 1) - Quantidade
- `created_at` (timestamp com fuso horário) - Data de Criação
- `updated_at` (timestamp com fuso horário) - Data de Atualização

#### 5. orders (Pedidos)
Armazena informações dos pedidos.
- `id` (inteiro, PK)
- `user_id` (uuid) - Referencia auth.users.id
- `total_amount` (numérico) - Valor Total
- `status` (texto, padrão: 'pending') - Status
- `created_at` (timestamp com fuso horário) - Data de Criação
- `updated_at` (timestamp com fuso horário) - Data de Atualização

#### 6. order_items (Itens do Pedido)
Armazena itens individuais dentro dos pedidos.
- `id` (inteiro, PK)
- `order_id` (inteiro) - Referencia orders.id
- `cupcake_id` (inteiro) - Referencia cupcakes.id
- `quantity` (inteiro, padrão: 1) - Quantidade
- `price_at_time` (numérico) - Preço no Momento
- `created_at` (timestamp com fuso horário) - Data de Criação
- `updated_at` (timestamp com fuso horário) - Data de Atualização

### Relacionamentos Principais
1. `profiles.id` → `auth.users.id`
2. `administrators.id` → `auth.users.id`
3. `cart_items.user_id` → `auth.users.id`
4. `cart_items.cupcake_id` → `cupcakes.id`
5. `orders.user_id` → `auth.users.id`
6. `order_items.order_id` → `orders.id`
7. `order_items.cupcake_id` → `cupcakes.id`

### Recursos Automatizados
1. Gerenciamento automático de timestamps para `created_at` e `updated_at`
2. Criação automática de perfil após o registro do usuário
3. Políticas de Segurança em Nível de Linha (RLS) garantindo:
   - Usuários só podem visualizar e modificar seus próprios dados
   - Administradores têm acesso estendido para gerenciar produtos e visualizar todos os pedidos
   - Acesso público para visualizar produtos (cupcakes)


## Quais tecnologias estão presentes no projeto?

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
