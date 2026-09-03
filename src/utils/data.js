// Dados Estruturados de Estevão Emanuel (StevegitXz)
// Fonte: Guia Completo de Preenchimento do Currículo Lattes & Comprehensive Specification

export const PERSONAL_INFO = {
  name: "Estevão Emanuel Silva de Farias",
  shortName: "Estevão Emanuel",
  nickname: "Steve",
  handle: "StevegitXz",
  github: "https://github.com/StevegitXz",
  email: "estevaoemanuel470@gmail.com", // contato principal
  location: "Rio Branco, Acre, Brasil",

  timezone: "America/Rio_Branco", // UTC-5
  status: "Disponível para Estágios & Projetos",
  institution: "Instituto Federal do Acre (IFAC) - Campus Rio Branco",
  course: "Técnico Integrado ao Ensino Médio em Informática para a Internet",
  period: "2024 - 2026",
  age: 17,
  role: "Full Stack Developer & Creative Technologist",
  tagline: "Desenvolvedor Full Stack, Pesquisador em IoT e Maker apaixonado por arquiteturas limpas, sistemas embarcados e interfaces interativas.",
  lattesBio: "Discente do Curso Técnico Integrado ao Ensino Médio em Informática para a Internet no Instituto Federal de Educação, Ciência e Tecnologia do Acre (IFAC) – Campus Rio Branco. Atua como discente pesquisador e extensionista em iniciativas voltadas à Transformação Digital e Internet das Coisas (IoT). Atuou na co-coordenação e monitoria do projeto de apoio pedagógico e acolhimento Learn.with(us), na apresentação de trabalhos científicos no Congresso da Sociedade Brasileira de Computação (CSBC/WCAMA) e possui produções técnicas no desenvolvimento de software, aplicações web (Full Stack) e sistemas embarcados.",
  cnpqCitation: "FARIAS, E. E. S. ; SILVA DE FARIAS, Estevão Emanuel",
  cnpqAreas: [
    "Metodologia e Técnicas da Computação",
    "Sistemas de Informação",
    "Internet das Coisas (IoT)",
    "Desenvolvimento Web Full Stack"
  ]
};

export const METRICS = [
  { label: "Softwares Desenvolvidos", value: "04+", detail: "Full Stack & IoT" },
  { label: "Artigo Publicado SBC", value: "01", detail: "WCAMA / CSBC 2025" },
  { label: "Vínculos de Monitoria", value: "02", detail: "Lógica & Sociologia" },
  { label: "Horas de Formação Tech", value: "100h+", detail: "Robótica & Certificações" }
];

export const PHILOSOPHY_PILLARS = [
  {
    id: "fullstack",
    kanji: "開発",
    title: "Desenvolvimento Full-Stack",
    subtitle: "Do Componente ao Banco Relacional",
    desc: "Criação de ecossistemas web com React, Node.js e Tailwind CSS. Foco em arquitetura MVC/REST, performance, acessibilidade e designs orientados ao usuário.",
    techs: ["React", "Node.js", "Express", "Tailwind CSS", "MySQL"]
  },
  {
    id: "iot",
    kanji: "接続",
    title: "Sistemas Embarcados & IoT",
    subtitle: "Hardware Integrado à Nuvem",
    desc: "Prototipagem física com ESP8266, microcontroladores, relés e sensores. Desenvolvimento de firmware em C++ com aplicação direta em desafios ecológicos e agrícolas da Amazônia.",
    techs: ["ESP8266", "C++", "Arduino IDE", "Sensores & Relés", "Automação"]
  },
  {
    id: "academic",
    kanji: "共創",
    title: "Pesquisa & Liderança",
    subtitle: "Co-coordenação & Impacto Comunitário",
    desc: "Co-coordenador do Learn.with(us) e monitor acadêmico no IFAC. Publicação no 45º CSBC/WCAMA e participação ativa em projetos de pesquisa (PROINP) e extensão (PROEX).",
    techs: ["CSBC/WCAMA", "Learn.with(us)", "PROINP", "PROEX", "Monitoria"]
  },
  {
    id: "zen",
    kanji: "調和",
    title: "Estética Cyber-Zen",
    subtitle: "Precisão Lógica com Calma Visual",
    desc: "União entre a estética cyberpunk funcional e o minimalismo japonês: contrastes escuros equilibrados, toques de rosa sakura e interfaces com resposta tátil imersiva.",
    techs: ["UI/UX", "Canvas 2D", "Web Audio", "Framer Motion", "Lenis"]
  }
];

export const PROJECTS = [
  {
    id: "mariot-iot",
    title: "MARIOT: Automação na Amazônia",
    category: "Hardware & IoT / Pesquisa SBC",
    badge: "PUBLICADO CSBC 2025",
    rarity: "LEGENDARY",
    year: "2025",
    description: "Sistema de automação e irrigação inteligente projetado para o contexto da Amazônia Ocidental. Artigo científico apresentado no 16º WCAMA / 45º Congresso da Sociedade Brasileira de Computação (CSBC 2025 em Maceió).",
    fullDescription: "O MARIOT é uma solução completa de Internet das Coisas (IoT) desenvolvida com firmware em C++ e microcontrolador ESP8266. Integrado a circuitos com relés e sensores analógicos/digitais de umidade e temperatura, o protótipo viabiliza controle inteligente e programado de bombas d'água e monitoramento ambiental, mitigando o estresse hídrico e otimizando recursos no ambiente amazônico.",
    techs: ["C++", "Arduino IDE", "ESP8266", "Relés & Sensores", "IoT", "CSBC/WCAMA"],
    github: "https://github.com/StevegitXz",
    metrics: [
      { label: "Evento", val: "45º CSBC / 16º WCAMA" },
      { label: "Local", val: "Maceió - AL" },
      { label: "Hardware", val: "ESP8266 + Sensores" }
    ],
    highlights: [
      "Trabalho publicado nos Anais de Congresso Nacional da SBC",
      "Firmware em C++ com gerenciamento de sensores em tempo real",
      "Aplicação direta em automação sustentável na Amazônia Ocidental"
    ]
  },
  {
    id: "socio-plat",
    title: "Socio-Plat (sociologia-app)",
    category: "Full-Stack / EdTech",
    badge: "WEB APP EDUCACIONAL",
    rarity: "EPIC",
    year: "2026",
    description: "Plataforma web educacional moderna criada para apoiar as atividades de estudo, compartilhamento de materiais didáticos e dinamização da monitoria de Sociologia no IFAC.",
    fullDescription: "Desenvolvida para sanar a dispersão de materiais de estudo entre os alunos, a Socio-Plat centraliza resumos, flashcards, cronogramas de monitoria e discussões temáticas. Conta com interface reativa de alta fluidez em React e Tailwind CSS, deploy automatizado na Vercel e integração com APIs Node.js.",
    techs: ["React", "Tailwind CSS", "JavaScript", "Vercel", "Node.js"],
    github: "https://github.com/StevegitXz",
    metrics: [
      { label: "Ambiente", val: "Vercel Cloud" },
      { label: "Público", val: "Discentes IFAC" },
      { label: "Foco", val: "EdTech & Suporte" }
    ],
    highlights: [
      "Interface moderna com arquitetura baseada em componentes reutilizáveis",
      "Feed de publicações e resumos estruturados para alunos do ensino médio",
      "Desenvolvido no contexto da monitoria acadêmica oficial do IFAC"
    ]
  },
  {
    id: "norte-eventos",
    title: "Norte Eventos",
    category: "Full-Stack / Arquitetura MVC",
    badge: "SISTEMA WEB ROBUSTO",
    rarity: "EPIC",
    year: "2026",
    description: "Sistema web completo desenvolvido para cadastro, organização, filtragem e ampla divulgação de eventos culturais, acadêmicos e corporativos da região Norte.",
    fullDescription: "Construído sobre o clássico e robusto padrão arquitetural MVC (Model-View-Controller) com Node.js e Express, o sistema integra autenticação segura de organizadores, rotas protegidas, validação de requisições e persistência em banco de dados relacional MySQL, estilizado dinamicamente com Tailwind CSS.",
    techs: ["Node.js", "Express", "MySQL", "JavaScript", "Tailwind CSS", "MVC"],
    github: "https://github.com/StevegitXz",
    metrics: [
      { label: "Arquitetura", val: "MVC Modular" },
      { label: "Banco", val: "MySQL Relacional" },
      { label: "Segurança", val: "Auth & Rotas Protegidas" }
    ],
    highlights: [
      "CRUD completo de eventos com upload de mídias e categorização",
      "Banco relacional normalizado com consultas otimizadas",
      "Design responsivo otimizado para dispositivos móveis"
    ]
  },
  {
    id: "decifra",
    title: "Decifra: Gamificação Matemática",
    category: "Frontend Interativo / Games",
    badge: "GAMIFICAÇÃO EDUCACIONAL",
    rarity: "RARE",
    year: "2026",
    description: "Plataforma interativa gamificada com minijogos dinâmicos e mecânicas visuais envolventes para reforço no aprendizado de matemática no ensino médio.",
    fullDescription: "O Decifra transforma teoremas e equações em desafios interativos estilo arcade. Utilizando manipuladores de estado modernos em JavaScript vanilla e HTML5 com Tailwind CSS, oferece pontuação em tempo real, fases progressivas e feedback sonoro e visual para estimular o engajamento dos estudantes.",
    techs: ["HTML5", "Tailwind CSS", "JavaScript", "Gamificação", "CSS Animations"],
    github: "https://github.com/StevegitXz",
    metrics: [
      { label: "Gênero", val: "Puzzle & EdTech" },
      { label: "Stack", val: "Pure JS + Tailwind" },
      { label: "Nível", val: "Ensino Médio" }
    ],
    highlights: [
      "Mecânicas de recompensa e progressão por fases de raciocínio lógico",
      "Execução instantânea no navegador sem overhead de bundlers pesados",
      "Design acessível com animações suaves e micro-interações estimulantes"
    ]
  }
];

export const ARSENAL_SKILLS = [
  {
    category: "Front-End & Creative",
    icon: "Layout",
    skills: [
      { name: "React", level: 90, status: "Avançado", badge: "Core" },
      { name: "Tailwind CSS", level: 95, status: "Especialista", badge: "Design" },
      { name: "JavaScript (ES6+)", level: 92, status: "Avançado", badge: "Lógica" },
      { name: "HTML5 / CSS3", level: 95, status: "Avançado", badge: "Markup" },
      { name: "Vite / Modern Bundlers", level: 88, status: "Intermediário+", badge: "Build" },
      { name: "UI/UX & Figma", level: 85, status: "Intermediário+", badge: "Prototipagem" }
    ]
  },
  {
    category: "Back-End & Banco de Dados",
    icon: "Server",
    skills: [
      { name: "Node.js & Express", level: 88, status: "Avançado", badge: "APIs" },
      { name: "MySQL Relacional", level: 85, status: "Avançado", badge: "Database" },
      { name: "Arquitetura MVC & REST", level: 88, status: "Avançado", badge: "Patterns" },
      { name: "Python", level: 78, status: "Intermediário", badge: "Scripts" },
      { name: "PHP", level: 75, status: "Intermediário", badge: "Legacy/Web" }
    ]
  },
  {
    category: "Hardware, IoT & Firmware",
    icon: "Cpu",
    skills: [
      { name: "ESP8266 Microcontrolador", level: 88, status: "Avançado", badge: "IoT Core" },
      { name: "C++ para Embarcados", level: 82, status: "Intermediário+", badge: "Firmware" },
      { name: "Arduino IDE & Ferramentas", level: 90, status: "Avançado", badge: "Tooling" },
      { name: "Sensores, Relés & Circuitos", level: 85, status: "Avançado", badge: "Eletrônica" },
      { name: "Automação & Robótica Maker", level: 88, status: "Avançado", badge: "Suframa 40h" }
    ]
  },
  {
    category: "Ambiente, DevOps & Práticas",
    icon: "Terminal",
    skills: [
      { name: "Git & Versionamento GitHub", level: 92, status: "Avançado", badge: "Version Control" },
      { name: "Vercel & Cloud Deploy", level: 88, status: "Avançado", badge: "CI/CD" },
      { name: "Linux / Shell Scripting", level: 80, status: "Intermediário", badge: "OS" },
      { name: "VS Code Customizado", level: 95, status: "Avançado", badge: "DevEnv" }
    ]
  }
];

export const TIMELINE = [
  {
    period: "2025 - 2026",
    title: "Apresentação de Artigo no CSBC / WCAMA 2025",
    subtitle: "Sociedade Brasileira de Computação (Maceió - AL)",
    type: "Pesquisa & Publicação",
    tag: "CONGRESSO NACIONAL",
    description: "Apresentação e publicação do trabalho 'MARIOT: Automação na Amazônia Ocidental' no 16º Workshop de Computação Aplicada à Gestão do Meio Ambiente e Recursos Naturais (WCAMA) no âmbito do 45º Congresso da SBC.",
    details: "Artigo científico em coautoria tratando de sistemas embarcados e sensores IoT aplicados ao bioma amazônico."
  },
  {
    period: "2025",
    title: "Co-coordenação & Tutoria: Projeto Learn.with(us)",
    subtitle: "IFAC Campus Rio Branco (Processo SEI nº 23841.001866/2025-06)",
    type: "Liderança & Ensino",
    tag: "VOLUNTÁRIO",
    description: "Coordenação discente e ministração de aulas de apoio pedagógico e reforço para calouros do 1º ano de Informática para a Internet, integrando ensino de programação e acolhimento institucional.",
    details: "Atuação voluntária durante os semestres 2025.1 e 2025.2."
  },
  {
    period: "2025",
    title: "Pesquisa: Transformação Digital com IoT",
    subtitle: "Edital Nº 12/2024/PROINP/IFAC (Processo SEI nº 23859.002442/2025-61)",
    type: "Pesquisa Científica",
    tag: "FOMENTO IFAC",
    description: "Pesquisa e desenvolvimento de soluções de Internet das Coisas (IoT) integradas à modernização tecnológica institucional e transformação digital.",
    details: "Carga horária semanal de 8 horas com bolsa de fomento à pesquisa."
  },
  {
    period: "2024 - 2025",
    title: "Extensão: Evento de Transformação Digital & Robótica",
    subtitle: "Edital nº 13/2024 PROEX/IFAC (Processo SEI nº 23859.001013/2024-96)",
    type: "Extensão Comunitária",
    tag: "PROEX / IFAC",
    description: "Ações extensionistas em duas vertentes: 'Aprovação Certa' (capacitação para a comunidade externa) e 'Ensino de Robótica' (oficinas e cursos práticos de difusão tecnológica para estudantes).",
    details: "Carga horária de 8 horas semanais em oficinas práticas."
  },
  {
    period: "2024 - Atual",
    title: "Monitoria Acadêmica de Ensino",
    subtitle: "IFAC Campus Rio Branco",
    type: "Monitoria Bolsista",
    tag: "BOLSISTA",
    description: "Monitor de Lógica de Programação e Monitor de Sociologia. Esclarecimento de dúvidas conceituais e algorítmicas, acompanhamento de turmas em laboratório e confecção de materiais de apoio didático.",
    details: "Resultou na criação da plataforma web Socio-Plat."
  },
  {
    period: "2025",
    title: "Certificação em Robótica Maker (EU PROGRAMO ROBÔS)",
    subtitle: "IFAC / CITS / Suframa (PP14.0) — Carga: 40h",
    type: "Formação Técnica",
    tag: "SUFRAMA",
    description: "Capacitação imersiva prática em prototipagem robótica, eletrônica básica, atuadores e programação maker aplicada.",
    details: "Concluído com aproveitamento integral."
  },
  {
    period: "2025",
    title: "Honra ao Mérito — Olimpíada Brasileira de Língua Inglesa (OBLI)",
    subtitle: "Seleta Educação / OBLI (Edição 2025.2)",
    type: "Premiação / Distinção",
    tag: "DISTINÇÃO",
    description: "Reconhecimento de proficiência e destaque acadêmico na Olimpíada Brasileira de Língua Inglesa.",
    details: "Distinção de Honra ao Mérito homologada."
  },
  {
    period: "2024 - 2026",
    title: "Cursos de Aperfeiçoamento — Fundação Bradesco",
    subtitle: "Escola Virtual Bradesco",
    type: "Capacitação Complementar",
    tag: "CERTIFICAÇÕES",
    description: "Segurança em Tecnologia da Informação (12h, 2026), Microsoft Excel Avançado (30h, 2024), Fundamentos de TI: Hardware e Software (7h, 2024), Word Avançado (8h, 2024) e PowerPoint Avançado (8h, 2024).",
    details: "Sólida base de produtividade, segurança de redes e arquitetura de computadores."
  }
];
