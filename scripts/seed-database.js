const { createClient } = require('@supabase/supabase-js');

// Use as credenciais diretamente (temporário para seed)
const supabaseUrl = 'https://tqtjglpgllnemsxqzvqy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGpnbHBnbGxuZW1zeHF6dnF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTgzMzI2NSwiZXhwIjoyMDk1NDA5MjY1fQ._lff6Ne4diR9m4ZlPymUpYLP3QC6iD7dtzXmKY3Tw8o';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Credenciais do Supabase não foram definidas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  try {
    // 1. Criar usuários de teste
    console.log('1️⃣  Criando usuários...');
    const usuarios = [
      {
        email: 'admin@arvoresnatal.com',
        nome: 'Administrador',
        perfil: 'administrador',
      },
      {
        email: 'operacional@arvoresnatal.com',
        nome: 'Operacional',
        perfil: 'operacional',
      },
    ];

    for (const usuario of usuarios) {
      const { data, error } = await supabase
        .from('usuarios')
        .insert([usuario]);

      if (error) {
        console.warn(`⚠️  Erro ao criar usuário ${usuario.email}: ${error.message}`);
      } else {
        console.log(`   ✓ ${usuario.email}`);
      }
    }

    // 2. Inserir modelos de árvore
    console.log('\n2️⃣  Criando modelos de árvore...');
    const modelos = [
      {
        nome_modelo: 'Pequena (1.5m)',
        altura: 1.5,
        complexidade: 'baixa',
        tempo_montagem_1_funcionario: 45,
        tempo_montagem_2_funcionarios: 30,
        tempo_montagem_3_funcionarios: 20,
        tempo_desmontagem: 20,
        quantidade_luzes_padrao: 300,
        quantidade_enfeites_padrao: 50,
        valor_montagem_por_funcionario: 150.0,
        valor_desmontagem_por_funcionario: 100.0,
      },
      {
        nome_modelo: 'Média (2.2m)',
        altura: 2.2,
        complexidade: 'media',
        tempo_montagem_1_funcionario: 90,
        tempo_montagem_2_funcionarios: 60,
        tempo_montagem_3_funcionarios: 45,
        tempo_desmontagem: 40,
        quantidade_luzes_padrao: 600,
        quantidade_enfeites_padrao: 100,
        valor_montagem_por_funcionario: 200.0,
        valor_desmontagem_por_funcionario: 150.0,
      },
      {
        nome_modelo: 'Grande (3.0m)',
        altura: 3.0,
        complexidade: 'alta',
        tempo_montagem_1_funcionario: 150,
        tempo_montagem_2_funcionarios: 100,
        tempo_montagem_3_funcionarios: 75,
        tempo_desmontagem: 60,
        quantidade_luzes_padrao: 1000,
        quantidade_enfeites_padrao: 150,
        valor_montagem_por_funcionario: 250.0,
        valor_desmontagem_por_funcionario: 200.0,
      },
      {
        nome_modelo: 'Gigante (4.0m)',
        altura: 4.0,
        complexidade: 'alta',
        tempo_montagem_1_funcionario: 240,
        tempo_montagem_2_funcionarios: 150,
        tempo_montagem_3_funcionarios: 100,
        tempo_desmontagem: 90,
        quantidade_luzes_padrao: 1500,
        quantidade_enfeites_padrao: 250,
        valor_montagem_por_funcionario: 350.0,
        valor_desmontagem_por_funcionario: 300.0,
      },
    ];

    const { data: modelosData, error: modelosError } = await supabase
      .from('modelos_arvore')
      .insert(modelos);

    if (modelosError) {
      console.warn(`⚠️  Erro ao criar modelos: ${modelosError.message}`);
    } else {
      console.log(`   ✓ ${modelos.length} modelos criados`);
    }

    // 3. Criar funcionários de exemplo
    console.log('\n3️⃣  Criando funcionários...');
    const funcionarios = [
      {
        nome: 'João Silva',
        telefone: '11999999001',
        endereco: 'Rua A, 100',
        bairro: 'Tatuapé',
        cidade: 'São Paulo',
        cep: '03000-000',
        latitude: -23.5505,
        longitude: -46.5805,
        pix: '11999999001',
        especialidade: 'Montagem',
        observacoes: 'Experiente em árvores grandes',
      },
      {
        nome: 'Maria Santos',
        telefone: '11999999002',
        endereco: 'Rua B, 200',
        bairro: 'Vila Madalena',
        cidade: 'São Paulo',
        cep: '05440-000',
        latitude: -23.5595,
        longitude: -46.6805,
        pix: '11999999002',
        especialidade: 'Desmontagem',
        observacoes: 'Especialista em limpeza',
      },
      {
        nome: 'Carlos Oliveira',
        telefone: '11999999003',
        endereco: 'Rua C, 300',
        bairro: 'Pinheiros',
        cidade: 'São Paulo',
        cep: '05450-000',
        latitude: -23.5505,
        longitude: -46.6905,
        pix: '11999999003',
        especialidade: 'Ambos',
        observacoes: 'Flexível para qualquer serviço',
      },
    ];

    const { data: funcionariosData, error: funcionariosError } = await supabase
      .from('funcionarios')
      .insert(funcionarios);

    if (funcionariosError) {
      console.warn(`⚠️  Erro ao criar funcionários: ${funcionariosError.message}`);
    } else {
      console.log(`   ✓ ${funcionarios.length} funcionários criados`);
    }

    // 4. Criar clientes de exemplo
    console.log('\n4️⃣  Criando clientes...');
    const clientes = [
      {
        nome: 'Empresa ABC',
        telefone: '1132000001',
        whatsapp: '5511999999001',
        endereco: 'Av. Paulista, 1000',
        numero: '1000',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        cep: '01311-100',
        latitude: -23.5615,
        longitude: -46.6560,
        preferencia_periodo: 'manha',
        observacoes: 'Cliente VIP',
      },
      {
        nome: 'Residência Silva',
        telefone: '1132000002',
        whatsapp: '5511999999002',
        endereco: 'Rua das Flores, 500',
        numero: '500',
        bairro: 'Tatuapé',
        cidade: 'São Paulo',
        cep: '03000-100',
        latitude: -23.5505,
        longitude: -46.5805,
        preferencia_periodo: 'tarde',
        observacoes: 'Família com crianças',
      },
      {
        nome: 'Consultório Dr. Santos',
        telefone: '1132000003',
        whatsapp: '5511999999003',
        endereco: 'Av. Brasil, 250',
        numero: '250',
        bairro: 'Vila Mariana',
        cidade: 'São Paulo',
        cep: '04000-000',
        latitude: -23.5795,
        longitude: -46.6360,
        preferencia_periodo: 'integral',
        observacoes: 'Horário flexível',
      },
    ];

    const { data: clientesData, error: clientesError } = await supabase
      .from('clientes')
      .insert(clientes);

    if (clientesError) {
      console.warn(`⚠️  Erro ao criar clientes: ${clientesError.message}`);
    } else {
      console.log(`   ✓ ${clientes.length} clientes criados`);
    }

    // 5. Criar equipes
    console.log('\n5️⃣  Criando equipes...');
    const equipes = [
      { nome: 'Equipe Verde' },
      { nome: 'Equipe Vermelha' },
      { nome: 'Equipe Dourada' },
    ];

    const { data: equipesData, error: equipesError } = await supabase
      .from('equipes')
      .insert(equipes);

    if (equipesError) {
      console.warn(`⚠️  Erro ao criar equipes: ${equipesError.message}`);
    } else {
      console.log(`   ✓ ${equipes.length} equipes criadas`);
    }

    console.log('\n✅ Seed concluído com sucesso!\n');
    console.log('📝 Dados iniciais criados:');
    console.log('   - 2 usuários de teste');
    console.log('   - 4 modelos de árvore');
    console.log('   - 3 funcionários');
    console.log('   - 3 clientes');
    console.log('   - 3 equipes\n');

    console.log('🔐 Credenciais de teste:');
    console.log('   Email: admin@arvoresnatal.com');
    console.log('   Senha: demo123456\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante seed:', error.message);
    process.exit(1);
  }
}

seedDatabase();