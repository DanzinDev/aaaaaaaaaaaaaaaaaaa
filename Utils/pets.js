const pets = [
  "🐶 Cachorro",
  "🐱 Gato",
  "🐦 Pássaro",
  "🐰 Coelho",
  "🦊 Raposa"
]



const emojis = [
  "🐶",
  "🐱",
  "🐦",
  "🐰",
  "🦊"
]

const imagepet = (id) => {
  
  id = Number(id)

  let mensagensWork = [
    //eletricista: 
    ["https://emoji.gg/assets/emoji/5052_googledog.png"],

    //designer: 
    ["https://emoji.gg/assets/emoji/4245_googlecatface.png"],

    //comediante: 
    ["https://emoji.gg/assets/emoji/4645_googlebird.png"],

    //policial: 
    ["https://emoji.gg/assets/emoji/8336_googlerabbit.png"], 

    //youtuber: 
    ["https://emoji.gg/assets/emoji/7882_googlefox.png"]
  ]
  let arrayIndex = mensagensWork[id]
  return arrayIndex[Math.floor(Math.random() * arrayIndex.length)]


}

exports.pets = pets;
exports.emojis = emojis;
exports.imagepet = imagepet;