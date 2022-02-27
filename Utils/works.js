const empregos = [
  "⚡ Eletricista",
  "🎨 Designer",
  "😂 Comediante",
  "🚨 Policial",
  "🎥 Youtuber",
  "💻 Programador",
  "🍞 Padeiro(a)",
  "🌾 Fazendeiro(a)",
  "🥫 Catador(a) de latinha",
  "🕵️ Detetive",
  "🧵 Costureiro(a)",
  "🧑‍🍳 Cozinheiro(a)",
  "🧑‍🚀 Astronauta"

]

const emojis = [
  "⚡",
  "🎨",
  "😂",
  "🚨",
  "🎥",
  "💻",
  "🍞",
  "🌾",
  "🥫",
  "🕵️",
  "🧵",
  "🧑‍🍳",
  "🧑‍🚀"
]

const trabalhando = (id) => {
  
  id = Number(id)

  let mensagensWork = [
    //eletricista: 
    ["Você ajeitou um poste", "Você organizou afiação"],

    //designer: 
    ["Você fez uma obra de arte para o museu", "Fez um desenho"],

    //comediante: 
    ["Você contou a piada do PIU :hatching_chick:"],

    //policial: 
    ["Você prendeu o bandido", "Você impediu um assalto"], 

    //youtuber: 
    ["Você gravou um video", "Você fez um shorts"],

    //programador: 
    ["Você programou um site para uma empresa", "Você fez um bot"],

    //padeiro: 
    ["Você vendeu pão :bread:", "Você vendeu um bolo para um aniversário", "Você vendeu um bolo para um casamento"],

    //fazendeiro: 
    ["Você cuidou do gado", "Você colheu a platanção de batata"],

    //catador de latinha: 
    ["Você trocou suas latinhas por dinheiro"],

    //detetive:
    ["Resolveu um caso", "Você descobriu quem comeu o seu biscoito"],

    //costureiro:
    ["Consertou um rasgo numa roupa", "Criou uma roupa", "Restaurou um roupa velha"],

    //cozinheiro:
    ["Você fez um cuscuz com ovo", "Você fez um bolo de chocolate 😋", "Você fez um ovo frito"],

     //astronauta:
    ["Você foi ate a lua", "Você descobriu um novo planeta", "A nasa mandou você para uma missão espacial"]
  ]
  
  let arrayIndex = mensagensWork[id]
  return arrayIndex[Math.floor(Math.random() * arrayIndex.length)]


}

exports.empregos = empregos;
exports.emojis = emojis;
exports.trabalhando = trabalhando;