// ╔══════════════════════════════════════════════════════════════╗
// ║  MÉTODO ROAR — Diagnóstico Comportamental Visual             ║
// ║  Arquivo único — cole no App.js do CodeSandbox / Vercel      ║
// ║  Deps: react · framer-motion · lucide-react · tailwindcss    ║
// ╚══════════════════════════════════════════════════════════════╝

// ─── EDITE AQUI — URL pública do seu deploy ───────────────────
const SITE_URL = "https://tcyh87.csb.app/";
// Exemplo: const SITE_URL = "https://metodo-roar.vercel.app";
// ─────────────────────────────────────────────────────────────

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Brain,
  Eye,
  User,
  Palette,
  Zap,
  RotateCcw,
  Share2,
  MessageCircle,
  ArrowRight,
  Check,
} from "lucide-react";

// ═════════════════════════════════════════════════════════════
//  DADOS — BFI-20
//  trait: E=Extroversão A=Amabilidade C=Conscienciosidade
//         N=Neuroticismo O=Abertura
//  inv: true → score real = 6 − resposta do usuário
// ═════════════════════════════════════════════════════════════
const QUESTIONS = [
  { id: 1, text: "Sou o centro das atenções.", trait: "E", inv: false },
  { id: 2, text: "Sou reservado(a).", trait: "E", inv: true },
  { id: 3, text: "Sou cheio(a) de energia.", trait: "E", inv: false },
  { id: 4, text: "Prefiro ficar sozinho(a).", trait: "E", inv: true },
  { id: 5, text: "Confio nas pessoas.", trait: "A", inv: false },
  {
    id: 6,
    text: "Costumo encontrar defeitos nos outros.",
    trait: "A",
    inv: true,
  },
  { id: 7, text: "Sou prestativo(a) e altruísta.", trait: "A", inv: false },
  { id: 8, text: "Sou frio(a) e distante.", trait: "A", inv: true },
  { id: 9, text: "Faço trabalho minucioso.", trait: "C", inv: false },
  { id: 10, text: "Sou desorganizado(a).", trait: "C", inv: true },
  {
    id: 11,
    text: "Sou eficiente e realizado(a) no trabalho.",
    trait: "C",
    inv: false,
  },
  { id: 12, text: "Prefiro o improviso à organização.", trait: "C", inv: true },
  { id: 13, text: "Fico tenso(a) facilmente.", trait: "N", inv: false },
  { id: 14, text: "Sou calmo(a) sob pressão.", trait: "N", inv: true },
  { id: 15, text: "Me preocupo muito.", trait: "N", inv: false },
  { id: 16, text: "Sou emocionalmente estável.", trait: "N", inv: true },
  { id: 17, text: "Tenho imaginação ativa.", trait: "O", inv: false },
  { id: 18, text: "Tenho pouco interesse em arte.", trait: "O", inv: true },
  {
    id: 19,
    text: "Adoro experiências e coisas novas.",
    trait: "O",
    inv: false,
  },
  { id: 20, text: "Prefiro seguir rotinas conhecidas.", trait: "O", inv: true },
];

const TRAIT_META = {
  O: { label: "Abertura", color: "#B45309", bar: "#D97706" },
  C: { label: "Conscienciosidade", color: "#1D4ED8", bar: "#3B82F6" },
  E: { label: "Extroversão", color: "#6D28D9", bar: "#7C3AED" },
  A: { label: "Amabilidade", color: "#065F46", bar: "#10B981" },
  N: { label: "Neuroticismo", color: "#9F1239", bar: "#F43F5E" },
};
const TRAIT_ORDER = ["O", "C", "E", "A", "N"];

// ═════════════════════════════════════════════════════════════
//  BASE DE DADOS — 6 Estilos ROAR (conteúdo completo)
// ═════════════════════════════════════════════════════════════
const ROAR_STYLES = {
  "Minimalista Previsível": {
    id: 1,
    emoji: "⬜",
    accent: "#374151",
    big5: "Conscienciosidade Alta · Extroversão Baixa",
    match: (t) => t.C >= 3.5 && t.E < 2.5,
    silent:
      "Minha presença dispensa explicações — minha consistência fala mais alto que qualquer palavra.",
    busca: "Precisão, confiabilidade, ambientes ordenados e previsíveis.",
    evita: "Caos, excesso de estímulo, situações de improviso sem estrutura.",
    foco: "Eficiência silenciosa e resultado tangível e duradouro.",
    action:
      "Postura firme e contida. Gestos deliberados e econômicos. Contato visual direto e objetivo. Voz calma, pausada e sem ornamento verbal excessivo.",
    formas:
      "Linhas retas, ângulos precisos, geometrias limpas e sem ornamento. Simetria como regra.",
    cores:
      "Branco óptico, off-white mineral, cinza claro, cinza carvão, preto absoluto e bege areia.",
    tecidos:
      "Algodão egípcio de alta qualidade, linho estruturado, couro liso de grão fino, lã penteada.",
    neuro:
      "O visual minimalista ativa o córtex pré-frontal do observador: sinais de previsibilidade e autocontrole. O cérebro interpreta ausência de ruído como competência e confiança. Estudos de percepção social mostram que looks monocromáticos e estruturados aumentam em até 34% a percepção de autoridade no primeiro contato.",
  },
  "Natural Acolhedora": {
    id: 2,
    emoji: "🌿",
    accent: "#065F46",
    big5: "Amabilidade Alta · Extroversão Média · Neuroticismo Médio",
    match: (t) =>
      t.A >= 3.5 && t.E >= 2.5 && t.E < 4.0 && t.N >= 2.0 && t.N < 3.8,
    silent:
      "Sou o espaço onde as pessoas se sentem vistas — sem esforço, sem performance.",
    busca: "Conexão genuína, harmonia relacional, senso de pertencimento.",
    evita:
      "Conflito desnecessário, ambientes frios e impessoais, artificialidade.",
    foco: "Bem-estar coletivo e qualidade das relações interpessoais.",
    action:
      "Sorriso espontâneo e acolhedor. Postura corporal aberta, inclinada em direção ao interlocutor. Voz calorosa com ritmo empático e pausas atentas.",
    formas:
      "Curvas suaves, formas orgânicas e fluidas, texturas naturais que convidam ao toque.",
    cores:
      "Terracota suave, verde-sálvia, bege quente, areia úmida, branco-cru e siena tostado.",
    tecidos:
      "Linho natural, algodão orgânico cru, malha suave de bambu, tricô leve e camadas sobrepostas.",
    neuro:
      "Tons terrosos e vegetais ativam memórias de segurança ambiental. O sistema de apego libera ocitocina em resposta à suavidade das texturas percebidas. A abertura postural e os tons quentes reduzem o cortisol do observador, aumentando receptividade ao diálogo e disposição de confiar.",
  },
  "Elegante Intencional": {
    id: 3,
    emoji: "🟣",
    accent: "#4B0082",
    big5: "Conscienciosidade Alta · Neuroticismo Baixo · Extroversão Média/Alta",
    match: (t) => t.C >= 3.5 && t.N < 2.5 && t.E >= 2.5,
    silent:
      "Cada escolha que faço é uma declaração de intenção — nada aqui é por acaso.",
    busca:
      "Excelência estética, impacto calibrado, reconhecimento discreto e merecido.",
    evita: "Vulgaridade, excesso decorativo, o ordinário e o não intencional.",
    foco: "Influência silenciosa e sofisticação percebida como autoridade natural.",
    action:
      "Movimentos calculados e fluidos. Postura alongada com ocupação deliberada do espaço. Pausas estratégicas na fala. Olhar que observa antes de engajar — nunca reativo.",
    formas:
      "Assimetrias elegantes e resolvidas, linhas fluidas com estrutura subjacente, detalhes únicos como assinatura.",
    cores:
      "Vinho profundo, azul-marinho noturno, nude sofisticado, dourado fosco, off-white e preto como acento cirúrgico.",
    tecidos:
      "Seda lavada, crepe de viscose, cashmere de espessura média, couro macio de grão fino, lã gabardine.",
    neuro:
      "O alto contraste visual entre cores profundas e neutros captura atenção involuntária via sistema de saliência. O striatum ventral ativa circuitos de status e reconhecimento social. A ausência de excessos sinaliza autocontrole executivo — traço associado a liderança e dominância social de alto prestígio.",
  },
  "Criativa Elegante": {
    id: 4,
    emoji: "🔵",
    accent: "#1D4ED8",
    big5: "Abertura Alta · Conscienciosidade Média/Alta",
    match: (t) => t.O >= 3.5 && t.C >= 3.0,
    silent:
      "Sou a prova de que originalidade e intenção não se excluem — elas se multiplicam.",
    busca:
      "Expressão autêntica, inovação visual, significado estético e narrativa pessoal.",
    evita:
      "Conformidade estética, rigidez de padrões, o previsível e o genérico.",
    foco: "Criar narrativas visuais que provocam curiosidade e permanecem na memória.",
    action:
      "Gesticulação expressiva e rica em detalhes. Tonalidade vocal variada e envolvente. Faz perguntas inesperadas. Transita entre introspecção profunda e entusiasmo compartilhado.",
    formas:
      "Mix intencional de estrutura e fluidez, proporções inusitadas com coerência interna, estampas com narrativa ou referência cultural.",
    cores:
      "Azul-cobalto elétrico, mostarda queimada, terracota vibrante, branco como tela de fundo e preto como acento editorial.",
    tecidos:
      "Jacquard texturizado, cetim fosco, lona artística, combinações de texturas contrastantes que criam tensão visual produtiva.",
    neuro:
      "A tensão criativa entre estrutura e liberdade gera 'incongruência resolvível': o cérebro detecta padrão suficiente para segurança, mas novidade suficiente para liberar dopamina. O núcleo accumbens ativa recompensa por originalidade. Estímulos singulares são armazenados em memória de longo prazo com maior fidelidade.",
  },
  "Exuberante Impactante": {
    id: 5,
    emoji: "🔴",
    accent: "#B91C1C",
    big5: "Extroversão Alta · Abertura Alta · Neuroticismo Baixo",
    match: (t) => t.E >= 3.8 && t.O >= 3.5 && t.N < 2.5,
    silent: "Não entro em um ambiente — eu inauguro ele.",
    busca:
      "Impacto imediato, celebração coletiva, experiências de alta intensidade.",
    evita:
      "Invisibilidade, o neutro, a subestimação e ambientes de baixa energia.",
    foco: "Presença máxima e memória afetiva duradoura nos que a rodeiam.",
    action:
      "Expansivo e magnético por natureza. Voz projetada com ressonância. Riso aberto e contagiante. Gestos largos que ocupam e animam o espaço sem esforço consciente.",
    formas:
      "Volumes expressivos e intencionais, sobreposições estratégicas, proporções dramatizadas que criam movimento visual mesmo em repouso.",
    cores:
      "Vermelho-vivo, amarelo-solar, laranja intenso, estampas bold de grande escala, contrastes cromáticos extremos.",
    tecidos:
      "Veludo rico, organza com volume, couro texturizado com relevo, tecidos metalizados e brocados de alto impacto tátil.",
    neuro:
      "Cores saturadas de alta luminância ativam o sistema de alerta via amígdala — garantindo atenção involuntária imediata antes de qualquer processamento consciente. O movimento das peças estimula neurônios no córtex visual (V5/MT). O conjunto produz pico de dopamina nos observadores, criando associação neurológica de prazer e vitalidade à sua presença.",
  },
  "Afetuosa Sensorial": {
    id: 6,
    emoji: "🟠",
    accent: "#92400E",
    big5: "Amabilidade Alta · Abertura Média · Neuroticismo Médio/Alto",
    match: (t) => t.A >= 3.5 && t.O >= 2.5 && t.O < 4.0 && t.N >= 2.5,
    silent:
      "Sou textura, sou calor — as pessoas não sabem por que, mas querem ficar perto.",
    busca:
      "Profundidade emocional, experiências sensoriais ricas, vínculos genuínos e duradouros.",
    evita:
      "Superficialidade relacional, ambientes ásperos e frios, o inautêntico.",
    foco: "Criar ambiência afetiva pela presença física, visual e emocional.",
    action:
      "Contato visual prolongado e genuinamente empático. Toque consciente como linguagem de cuidado. Voz suave e modulada com atenção ao tom emocional do outro.",
    formas:
      "Formas arredondadas e generosas, camadas sobrepostas com profundidade, volumes suaves que convidam ao toque.",
    cores:
      "Lilás empoeirado, pêssego suave, rosa-antigo, bege cremoso, bordô macio e amêndoa tostada.",
    tecidos:
      "Veludo suave de baixo pelo, modal fluido, jersey amanteigado, malhas felpudas e camadas com profundidade sensorial.",
    neuro:
      "Cores no espectro quente suave ativam o sistema parassimpático — estado de calma e receptividade. Texturas visualmente macias estimulam neurônios-espelho do sistema tátil, criando desejo inconsciente de aproximação. A profundidade emocional percebida ativa o mesmo circuito da confiança parental.",
  },
};

// ═════════════════════════════════════════════════════════════
//  ALGORITMOS PSICOMÉTRICOS
// ═════════════════════════════════════════════════════════════

/** Calcula a média de cada traço aplicando inversão onde necessário */
function calcTraits(answers) {
  const buckets = { E: [], A: [], C: [], N: [], O: [] };
  answers.forEach((val, i) => {
    const q = QUESTIONS[i];
    buckets[q.trait].push(q.inv ? 6 - val : val);
  });
  return Object.fromEntries(
    Object.entries(buckets).map(([k, arr]) => [
      k,
      arr.reduce((a, b) => a + b, 0) / arr.length,
    ])
  );
}

/** Mapeia traços para um dos 6 estilos ROAR por ordem de prioridade */
function mapToROAR(t) {
  const priority = [
    "Exuberante Impactante",
    "Elegante Intencional",
    "Criativa Elegante",
    "Afetuosa Sensorial",
    "Natural Acolhedora",
    "Minimalista Previsível", // fallback garantido
  ];
  return (
    priority.find((name) => ROAR_STYLES[name].match(t)) ??
    "Minimalista Previsível"
  );
}

// ═════════════════════════════════════════════════════════════
//  TOKENS DE ESTILO REUTILIZÁVEIS
// ═════════════════════════════════════════════════════════════

/** Efeito glassmorphism padrão do projeto */
const glass = {
  background: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.60)",
  boxShadow: "0 8px 40px rgba(75,0,130,0.07), 0 1.5px 6px rgba(0,0,0,0.04)",
};

/** Glass mais sutil — usado nos botões de compartilhamento */
const glassSubtle = {
  background: "rgba(255,255,255,0.55)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.75)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
};

// ═════════════════════════════════════════════════════════════
//  TELA 1 — WELCOME
// ═════════════════════════════════════════════════════════════
function WelcomeScreen({ onStart }) {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-5 py-16 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg,#F9F9FB 0%,#F3E8FF 42%,#FAF5FF 68%,#F9F9FB 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.22 } }}
    >
      {/* Orbs decorativos */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: "-130px",
            right: "-90px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(75,0,130,0.11) 0%,transparent 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-110px",
            left: "-70px",
            width: "380px",
            height: "380px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(124,58,237,0.07) 0%,transparent 65%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.18em] uppercase mb-6"
            style={{
              background: "rgba(75,0,130,0.08)",
              color: "#4B0082",
              border: "1px solid rgba(75,0,130,0.15)",
              fontFamily: "'Inter',sans-serif",
            }}
          >
            <Sparkles size={11} /> Método ROAR
          </span>
        </motion.div>

        <motion.h1
          className="text-[2.50rem] leading-tight font-bold tracking-tight mb-4"
          style={{
            color: "#1A0030",
            fontFamily: "Georgia,'Times New Roman',serif",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          Diagnóstico
          <br />
          <span style={{ color: "#4B0082" }}>Comportamental</span>
          <br />
          Visual
        </motion.h1>

        <motion.p
          className="text-base leading-relaxed mb-8"
          style={{ color: "#6B7280", fontFamily: "'Inter',sans-serif" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
        >
          Em 20 afirmações científicas, descubra qual dos{" "}
          <strong style={{ color: "#4B0082" }}>6 estilos ROAR</strong> expressa
          autenticamente quem você é — com base no Big Five BFI‑20 e
          neurociência da percepção.
        </motion.p>

        <motion.div
          className="rounded-2xl p-5 mb-7"
          style={glass}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34 }}
        >
          <div className="grid grid-cols-3 divide-x divide-white/50">
            {[
              ["20", "Afirmações"],
              ["5", "Dimensões"],
              ["6", "Estilos"],
            ].map(([n, l]) => (
              <div key={l} className="text-center px-3">
                <div
                  className="text-2xl font-bold"
                  style={{ color: "#4B0082", fontFamily: "Georgia,serif" }}
                >
                  {n}
                </div>
                <div
                  className="text-xs mt-0.5"
                  style={{ color: "#9CA3AF", fontFamily: "'Inter',sans-serif" }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.button
          onClick={onStart}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-semibold text-base tracking-wide"
          style={{
            background: "linear-gradient(135deg,#4B0082 0%,#7C3AED 100%)",
            boxShadow: "0 8px 32px rgba(75,0,130,0.30)",
            fontFamily: "'Inter',sans-serif",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          whileHover={{
            scale: 1.03,
            boxShadow: "0 12px 40px rgba(75,0,130,0.40)",
          }}
          whileTap={{ scale: 0.97 }}
        >
          Iniciar Diagnóstico <ArrowRight size={17} />
        </motion.button>

        <motion.p
          className="text-xs mt-4"
          style={{ color: "#9CA3AF", fontFamily: "'Inter',sans-serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          4–6 minutos · gratuito · sem julgamentos
        </motion.p>
      </div>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════
//  TELA 2 — QUIZ
// ═════════════════════════════════════════════════════════════
const TRAIT_LABEL = {
  E: "Extroversão",
  A: "Amabilidade",
  C: "Conscienciosidade",
  N: "Neuroticismo",
  O: "Abertura",
};

function QuizScreen({ current, total, question, selected, onSelect, onNext }) {
  const pct = (current / total) * 100;

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg,#F9F9FB 0%,#F3E8FF 50%,#F9F9FB 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: "360px",
          height: "360px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(75,0,130,0.09) 0%,transparent 68%)",
          transform: "translate(32%,-32%)",
        }}
      />

      <div className="relative z-10 w-full max-w-lg">
        {/* Cabeçalho: trait badge + contador */}
        <div className="flex items-center justify-between mb-3 px-1">
          <span
            className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full"
            style={{
              background: "rgba(75,0,130,0.08)",
              color: "#4B0082",
              border: "1px solid rgba(75,0,130,0.14)",
              fontFamily: "'Inter',sans-serif",
            }}
          >
            {TRAIT_LABEL[question.trait]}
          </span>
          <span
            className="text-xs font-semibold tabular-nums"
            style={{ color: "#9CA3AF", fontFamily: "'Inter',sans-serif" }}
          >
            {current} / {total}
          </span>
        </div>

        {/* Barra de progresso animada */}
        <div
          className="h-[3px] rounded-full mb-6 overflow-hidden"
          style={{ background: "rgba(75,0,130,0.10)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg,#4B0082,#7C3AED)" }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>

        {/* Card glassmorphism com slide entre perguntas */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current}
            className="rounded-3xl p-8 mb-5"
            style={glass}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <p
              className="text-xl font-semibold leading-snug mb-8"
              style={{
                color: "#1A0030",
                fontFamily: "Georgia,serif",
                minHeight: "68px",
              }}
            >
              {question.text}
            </p>

            {/* Botões de escala 1–5 com hover/tap */}
            <div className="flex gap-2.5 justify-between mb-3">
              {[1, 2, 3, 4, 5].map((v) => {
                const active = selected === v;
                return (
                  <motion.button
                    key={v}
                    onClick={() => onSelect(v)}
                    className="flex-1 flex items-center justify-center py-3.5 rounded-2xl font-bold text-lg"
                    style={{
                      border: active
                        ? "2px solid #4B0082"
                        : "1.5px solid rgba(75,0,130,0.20)",
                      background: active
                        ? "linear-gradient(135deg,#4B0082,#7C3AED)"
                        : "rgba(255,255,255,0.65)",
                      color: active ? "#fff" : "#4B0082",
                      backdropFilter: "blur(8px)",
                      fontFamily: "'Inter',sans-serif",
                      transition: "background 0.15s, border-color 0.15s",
                    }}
                    whileHover={{ scale: 1.09, borderColor: "#4B0082" }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.12 }}
                  >
                    {v}
                  </motion.button>
                );
              })}
            </div>

            <div className="flex justify-between px-0.5">
              <span
                className="text-[10px] leading-tight max-w-[64px]"
                style={{ color: "#9CA3AF", fontFamily: "'Inter',sans-serif" }}
              >
                Discordo totalmente
              </span>
              <span
                className="text-[10px] leading-tight text-right max-w-[64px]"
                style={{ color: "#9CA3AF", fontFamily: "'Inter',sans-serif" }}
              >
                Concordo totalmente
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Botão avançar — desabilitado até selecionar */}
        <motion.button
          onClick={onNext}
          disabled={selected === null}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-base"
          style={{
            background:
              selected !== null
                ? "linear-gradient(135deg,#4B0082,#7C3AED)"
                : "rgba(156,163,175,0.35)",
            color: selected !== null ? "#fff" : "#9CA3AF",
            cursor: selected !== null ? "pointer" : "not-allowed",
            boxShadow:
              selected !== null ? "0 8px 28px rgba(75,0,130,0.26)" : "none",
            fontFamily: "'Inter',sans-serif",
            transition: "background 0.2s, box-shadow 0.2s",
          }}
          whileHover={selected !== null ? { scale: 1.02 } : {}}
          whileTap={selected !== null ? { scale: 0.97 } : {}}
        >
          {current < total ? "Próxima pergunta" : "Ver meu resultado"}
          <ArrowRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════
//  TELA 3 — RESULTADO
// ═════════════════════════════════════════════════════════════

function TraitBar({ traitKey, value, delay }) {
  const meta = TRAIT_META[traitKey];
  const pct = Math.round(((value - 1) / 4) * 100);
  return (
    <motion.div
      className="mb-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.48 }}
    >
      <div className="flex justify-between items-center mb-1.5">
        <span
          className="text-sm font-medium"
          style={{ color: "#374151", fontFamily: "'Inter',sans-serif" }}
        >
          {meta.label}
        </span>
        <span
          className="text-sm font-bold tabular-nums"
          style={{ color: meta.color, fontFamily: "'Inter',sans-serif" }}
        >
          {pct}%
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: "rgba(0,0,0,0.06)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: meta.bar }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{
            delay: delay + 0.18,
            duration: 0.88,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      </div>
    </motion.div>
  );
}

function InfoCard({ icon: Icon, title, children, delay, accent }) {
  return (
    <motion.div
      className="rounded-2xl p-5"
      style={glass}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.44 }}
    >
      <div className="flex items-center gap-2.5 mb-3.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: accent + "1A" }}
        >
          <Icon size={14} style={{ color: accent }} />
        </div>
        <h3
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: "#6B7280", fontFamily: "'Inter',sans-serif" }}
        >
          {title}
        </h3>
      </div>
      {children}
    </motion.div>
  );
}

function ResultScreen({ styleName, traits, onRestart }) {
  const s = ROAR_STYLES[styleName];
  const accent = s.accent;

  // Estado local para feedback visual do botão "Outras Redes"
  const [copied, setCopied] = useState(false);

  // ── 1. Web Share API — título e texto exatos conforme especificado ──
  function handleShare() {
    const shareData = {
      title: "Método ROAR - Diagnóstico Comportamental",
      text: `Descobri que meu estilo é ${styleName}! Descubra o seu também.`,
      url: SITE_URL,
    };

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      // Mobile / Safari / Chrome com suporte à Web Share API nativa
      navigator.share(shareData).catch(() => {});
    } else {
      // Fallback Desktop: copia link + alert + feedback visual no botão
      const fallback = `${shareData.text}\n${SITE_URL}`;
      navigator.clipboard
        .writeText(fallback)
        .then(() => {
          alert("Link copiado para a área de transferência!");
          setCopied(true);
          setTimeout(() => setCopied(false), 2800);
        })
        .catch(() => alert("Copie manualmente: " + SITE_URL));
    }
  }

  // ── 2. WhatsApp com encodeURIComponent ──
  function handleWhatsApp() {
    const message =
      `Olha só, acabei de descobrir que meu estilo comportamental é *${styleName}* no Método ROAR! ${s.emoji}\n\n` +
      `_"${s.silent}"_\n\n` +
      `🟣 Faça o seu diagnóstico gratuito aqui: ${SITE_URL}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <motion.div
      className="min-h-screen px-4 py-14 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg,#F9F9FB 0%,#F3E8FF 45%,#F9F9FB 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Orbs dinâmicos com accent color do estilo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: "-90px",
            right: "-70px",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            background: `radial-gradient(circle,${accent}14 0%,transparent 65%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-70px",
            left: "-50px",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background: `radial-gradient(circle,${accent}0B 0%,transparent 65%)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-xl mx-auto">
        {/* ── HERO ── */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.52 }}
        >
          <motion.span
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.16em] uppercase mb-5"
            style={{
              background: accent + "10",
              color: accent,
              border: `1px solid ${accent}22`,
              fontFamily: "'Inter',sans-serif",
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.14, type: "spring", stiffness: 220 }}
          >
            <Sparkles size={11} /> Seu Estilo ROAR
          </motion.span>

          <motion.div
            className="text-6xl mb-3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.24,
              type: "spring",
              stiffness: 200,
              damping: 13,
            }}
          >
            {s.emoji}
          </motion.div>

          <motion.h1
            className="text-4xl font-bold tracking-tight mb-1"
            style={{ color: "#1A0030", fontFamily: "Georgia,serif" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
          >
            {s.id}. {styleName}
          </motion.h1>

          <motion.p
            className="text-sm font-semibold mb-5"
            style={{ color: accent, fontFamily: "'Inter',sans-serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {s.big5}
          </motion.p>

          {/* Mensagem Silenciosa */}
          <motion.div
            className="rounded-2xl px-6 py-5 text-left"
            style={{ ...glass, borderLeft: `4px solid ${accent}` }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{ color: accent, fontFamily: "'Inter',sans-serif" }}
            >
              Mensagem Silenciosa
            </p>
            <p
              className="text-lg italic leading-relaxed"
              style={{ color: "#1A0030", fontFamily: "Georgia,serif" }}
            >
              "{s.silent}"
            </p>
          </motion.div>
        </motion.div>

        {/* ── GRÁFICO BIG FIVE ── */}
        <motion.div
          className="rounded-2xl p-6 mb-4"
          style={glass}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62 }}
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: accent + "1A" }}
            >
              <Brain size={14} style={{ color: accent }} />
            </div>
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "#6B7280", fontFamily: "'Inter',sans-serif" }}
            >
              Perfil Big Five
            </h3>
          </div>
          {TRAIT_ORDER.map((k, i) => (
            <TraitBar
              key={k}
              traitKey={k}
              value={traits[k]}
              delay={0.72 + i * 0.09}
            />
          ))}
        </motion.div>

        {/* ── COMPORTAMENTO + AÇÃO ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <InfoCard
            icon={User}
            title="Resumo Comportamental"
            delay={1.02}
            accent={accent}
          >
            {[
              ["Busca", s.busca],
              ["Evita", s.evita],
              ["Foco", s.foco],
            ].map(([l, v]) => (
              <div key={l} className="mb-2.5 last:mb-0">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: accent, fontFamily: "'Inter',sans-serif" }}
                >
                  {l}
                </span>
                <p
                  className="text-sm leading-relaxed mt-0.5"
                  style={{ color: "#4B5563", fontFamily: "'Inter',sans-serif" }}
                >
                  {v}
                </p>
              </div>
            ))}
          </InfoCard>
          <InfoCard
            icon={Zap}
            title="Ação & Expressão Corporal"
            delay={1.1}
            accent={accent}
          >
            <p
              className="text-sm leading-relaxed"
              style={{ color: "#4B5563", fontFamily: "'Inter',sans-serif" }}
            >
              {s.action}
            </p>
          </InfoCard>
        </div>

        {/* ── GUIA VISUAL ── */}
        <motion.div
          className="rounded-2xl p-5 mb-4"
          style={glass}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.18 }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: accent + "1A" }}
            >
              <Palette size={14} style={{ color: accent }} />
            </div>
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "#6B7280", fontFamily: "'Inter',sans-serif" }}
            >
              Guia Visual ROAR
            </h3>
          </div>
          {[
            ["Formas", s.formas],
            ["Cores", s.cores],
            ["Tecidos", s.tecidos],
          ].map(([l, v]) => (
            <div key={l} className="flex gap-3 mb-3.5 last:mb-0">
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: accent, marginTop: 6 }}
              />
              <div>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: "#9CA3AF", fontFamily: "'Inter',sans-serif" }}
                >
                  {l}
                </span>
                <p
                  className="text-sm leading-relaxed mt-0.5"
                  style={{ color: "#4B5563", fontFamily: "'Inter',sans-serif" }}
                >
                  {v}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── NEUROCIÊNCIA ── */}
        <motion.div
          className="rounded-2xl p-6 mb-8"
          style={{
            background: "linear-gradient(135deg,#1A0030 0%,#2D0057 100%)",
            boxShadow: "0 8px 40px rgba(75,0,130,0.22)",
            border: "1px solid rgba(124,58,237,0.22)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.28 }}
        >
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/10">
              <Eye size={14} className="text-purple-300" />
            </div>
            <h3
              className="text-xs font-bold uppercase tracking-wider text-purple-300"
              style={{ fontFamily: "'Inter',sans-serif" }}
            >
              Neurociência da Percepção
            </h3>
          </div>
          <p
            className="text-sm leading-relaxed text-purple-100"
            style={{ fontFamily: "'Inter',sans-serif" }}
          >
            {s.neuro}
          </p>
        </motion.div>

        {/* ══════════════════════════════════════════════════════
            SEÇÃO DE COMPARTILHAMENTO
            Especificações:
            • "Compartilhar no WhatsApp" e "Outras Redes" lado
              a lado em ≥sm, empilhados em mobile
            • Estilo glass com bordas finas brancas e fonte Inter
            • whileHover={{ scale: 1.02 }} em todos os botões
        ══════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest text-center mb-3"
            style={{ color: "#9CA3AF", fontFamily: "'Inter',sans-serif" }}
          >
            Compartilhar resultado
          </p>

          {/* Grade responsiva: coluna única mobile → linha em ≥sm */}
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            {/* ── Botão WhatsApp ── */}
            <motion.button
              onClick={handleWhatsApp}
              className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl text-sm font-semibold"
              style={{
                background:
                  "linear-gradient(135deg,rgba(37,211,102,0.14) 0%,rgba(18,140,67,0.10) 100%)",
                border: "1.5px solid rgba(37,211,102,0.42)",
                color: "#065F46",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                boxShadow: "0 4px 20px rgba(37,211,102,0.12)",
                fontFamily: "'Inter',sans-serif",
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 8px 30px rgba(37,211,102,0.24)",
                borderColor: "rgba(37,211,102,0.70)",
              }}
              whileTap={{ scale: 0.96 }}
            >
              <MessageCircle size={17} style={{ color: "#128C43" }} />
              Compartilhar no WhatsApp
            </motion.button>

            {/* ── Botão Outras Redes (Web Share API / clipboard fallback) ── */}
            <motion.button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl text-sm font-semibold"
              style={{
                ...glassSubtle,
                color: copied ? "#065F46" : "#374151",
                border: copied
                  ? "1.5px solid rgba(37,211,102,0.55)"
                  : "1.5px solid rgba(255,255,255,0.80)",
                fontFamily: "'Inter',sans-serif",
                transition: "color 0.2s, border-color 0.2s",
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 8px 28px rgba(0,0,0,0.09)",
              }}
              whileTap={{ scale: 0.96 }}
            >
              {copied ? (
                <>
                  <Check size={17} style={{ color: "#128C43" }} /> Copiado!
                </>
              ) : (
                <>
                  <Share2 size={17} /> Outras Redes
                </>
              )}
            </motion.button>
          </div>

          {/* ── Botão Reiniciar — largura total, abaixo ── */}
          <motion.button
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold"
            style={{
              ...glassSubtle,
              color: "#6B7280",
              border: "1.5px solid rgba(255,255,255,0.75)",
              fontFamily: "'Inter',sans-serif",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <RotateCcw size={15} /> Reiniciar Teste
          </motion.button>
        </motion.div>

        {/* Rodapé */}
        <motion.p
          className="text-center text-[11px] mt-8"
          style={{ color: "#C4B5FD", fontFamily: "'Inter',sans-serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          Método ROAR · Big Five BFI‑20 · Neurociência Aplicada ao Design
        </motion.p>
      </div>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════
//  APP PRINCIPAL — gerenciador de estado e fluxo de telas
// ═════════════════════════════════════════════════════════════
export default function App() {
  const [phase, setPhase] = useState("welcome"); // "welcome" | "quiz" | "result"
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [styleName, setStyleName] = useState(null);
  const [traits, setTraits] = useState(null);

  const handleStart = useCallback(() => {
    setPhase("quiz");
    setIdx(0);
    setAnswers([]);
    setSelected(null);
  }, []);

  const handleSelect = useCallback((v) => setSelected(v), []);

  const handleNext = useCallback(() => {
    if (selected === null) return;
    const next = [...answers, selected];
    setAnswers(next);
    setSelected(null);

    if (idx < QUESTIONS.length - 1) {
      setIdx((i) => i + 1);
    } else {
      const t = calcTraits(next);
      setTraits(t);
      setStyleName(mapToROAR(t));
      setPhase("result");
    }
  }, [selected, answers, idx]);

  const handleRestart = useCallback(() => {
    setPhase("welcome");
    setIdx(0);
    setAnswers([]);
    setSelected(null);
    setStyleName(null);
    setTraits(null);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {phase === "welcome" && (
        <motion.div key="welcome">
          <WelcomeScreen onStart={handleStart} />
        </motion.div>
      )}
      {phase === "quiz" && (
        <motion.div key="quiz">
          <QuizScreen
            current={idx + 1}
            total={QUESTIONS.length}
            question={QUESTIONS[idx]}
            selected={selected}
            onSelect={handleSelect}
            onNext={handleNext}
          />
        </motion.div>
      )}
      {phase === "result" && styleName && traits && (
        <motion.div key="result">
          <ResultScreen
            styleName={styleName}
            traits={traits}
            onRestart={handleRestart}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
