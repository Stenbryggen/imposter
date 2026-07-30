const CATEGORIES = {
  'Dyr': ['Elefant', 'Løve', 'Giraf', 'Pingvin', 'Kænguru', 'Delfin', 'Ørn', 'Slange', 'Bjørn', 'Ulv', 'Kanin', 'Egern'],
  'Mad': ['Pizza', 'Sushi', 'Burger', 'Lasagne', 'Tacos', 'Pandekager', 'Pølsehorn', 'Frikadeller', 'Wienerbrød', 'Popcorn'],
  'Steder': ['Paris', 'Skoven', 'Stranden', 'Biografen', 'Skolen', 'Lufthavnen', 'Tivoli', 'Rådhuspladsen', 'Bjerget', 'Ørkenen'],
  'Erhverv': ['Læge', 'Brandmand', 'Lærer', 'Politibetjent', 'Tømrer', 'Pilot', 'Kok', 'Sygeplejerske', 'Advokat', 'Frisør'],
  'Film & serier': ['Star Wars', 'Frost', 'Matrix', 'Titanic', 'Vikings', 'Friends', 'Jurassic Park', 'Harry Potter', 'Batman', 'Grease'],
  'Sport': ['Fodbold', 'Håndbold', 'Svømning', 'Tennis', 'Cykling', 'Boksning', 'Golf', 'Skiløb', 'Badminton', 'Atletik'],
  'Møbler': ['Sofa', 'Spisebord', 'Reol', 'Seng', 'Skrivebord', 'Lænestol', 'Skab', 'Skammel', 'Sofabord', 'Vaskemaskine'],
  'Køretøjer': ['Cykel', 'Bus', 'Fly', 'Tog', 'Motorcykel', 'Sejlbåd', 'Traktor', 'Ambulance', 'Helikopter', 'Skateboard'],
  'Frugt & grønt': ['Æble', 'Banan', 'Gulerod', 'Jordbær', 'Ananas', 'Agurk', 'Vandmelon', 'Kartoffel', 'Citron', 'Løg'],
  'Superhelte': ['Spider-Man', 'Superman', 'Wonder Woman', 'Iron Man', 'Hulk', 'Thor', 'Batman', 'Flash', 'Captain America'],
  'Tegnefilm': ['Mickey Mouse', 'Simpsons', 'SpongeBob', 'Scooby-Doo', 'Pokémon', 'Peppa Gris', 'Anders And', 'Bamse'],
  'Skolefag': ['Matematik', 'Dansk', 'Idræt', 'Musik', 'Historie', 'Biologi', 'Engelsk', 'Geografi', 'Fysik', 'Billedkunst'],
  'Tøj': ['Bukser', 'Kjole', 'Sko', 'Hue', 'Halstørklæde', 'Regnjakke', 'Badedragt', 'Handsker', 'Slips', 'Kasket'],
  'Musikinstrumenter': ['Guitar', 'Klaver', 'Violin', 'Trompet', 'Trommer', 'Fløjte', 'Saxofon', 'Harpe', 'Cello'],
  'Drikkevarer': ['Kaffe', 'Sodavand', 'Æblejuice', 'Mælk', 'Te', 'Smoothie', 'Kakao', 'Cider', 'Champagne'],
  'Feriesteder': ['Mallorca', 'Bornholm', 'Legoland', 'Disneyland', 'Alperne', 'Sommerhuset', 'Kroatien', 'Rom', 'Thailand'],
};

function pickWord() {
  const categoryNames = Object.keys(CATEGORIES);
  const category = categoryNames[Math.floor(Math.random() * categoryNames.length)];
  const words = CATEGORIES[category];
  const word = words[Math.floor(Math.random() * words.length)];
  return { category, word };
}

module.exports = { CATEGORIES, pickWord };
