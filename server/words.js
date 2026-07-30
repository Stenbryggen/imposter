const CATEGORIES = {
  'Dyr': ['Elefant', 'Løve', 'Giraf', 'Pingvin', 'Kænguru', 'Delfin', 'Ørn', 'Slange', 'Bjørn', 'Ulv', 'Kanin', 'Egern', 'Zebra', 'Flodhest', 'Næsehorn', 'Gorilla', 'Krokodille', 'Ræv', 'Hjort', 'Pindsvin', 'Koala', 'Panda', 'Struds', 'Flamingo'],
  'Havdyr': ['Haj', 'Blæksprutte', 'Hval', 'Søstjerne', 'Krabbe', 'Skildpadde', 'Søhest', 'Sæl', 'Vandmand', 'Tunfisk', 'Reje', 'Havkat', 'Marsvin', 'Pingvin'],
  'Insekter': ['Sommerfugl', 'Myre', 'Bi', 'Edderkop', 'Guldsmed', 'Myg', 'Bille', 'Græshoppe', 'Larve', 'Hveps', 'Skalbagge', 'Flue'],
  'Mad': ['Pizza', 'Sushi', 'Burger', 'Lasagne', 'Tacos', 'Pandekager', 'Pølsehorn', 'Frikadeller', 'Wienerbrød', 'Popcorn', 'Nudler', 'Suppe', 'Salat', 'Omelet', 'Sandwich', 'Kylling', 'Ris', 'Pasta', 'Gulaschsuppe', 'Æggekage', 'Rugbrød', 'Smørrebrød'],
  'Slik & snacks': ['Chokolade', 'Lakrids', 'Vingummi', 'Chips', 'Popcorn', 'Is', 'Karamel', 'Marshmallow', 'Nødder', 'Lollipop', 'Skumfidus', 'Bolsjer'],
  'Krydderier': ['Salt', 'Peber', 'Kanel', 'Ingefær', 'Hvidløg', 'Chili', 'Basilikum', 'Oregano', 'Karry', 'Muskatnød', 'Vanilje', 'Persille'],
  'Drikkevarer': ['Kaffe', 'Sodavand', 'Æblejuice', 'Mælk', 'Te', 'Smoothie', 'Kakao', 'Cider', 'Champagne', 'Limonade', 'Cocosmælk', 'Isvand', 'Milkshake', 'Vin', 'Øl'],
  'Frugt & grønt': ['Æble', 'Banan', 'Gulerod', 'Jordbær', 'Ananas', 'Agurk', 'Vandmelon', 'Kartoffel', 'Citron', 'Løg', 'Vindrue', 'Blomkål', 'Peberfrugt', 'Kirsebær', 'Fersken', 'Broccoli', 'Majs', 'Hvidkål', 'Tomat', 'Avocado'],
  'Steder': ['Paris', 'Skoven', 'Stranden', 'Biografen', 'Skolen', 'Lufthavnen', 'Tivoli', 'Rådhuspladsen', 'Bjerget', 'Ørkenen', 'Svømmehallen', 'Supermarkedet', 'Sygehuset', 'Zoologisk have', 'Biblioteket', 'Kirkegården', 'Havnen', 'Museet'],
  'Lande': ['Danmark', 'Sverige', 'Tyskland', 'Frankrig', 'Spanien', 'Italien', 'Norge', 'USA', 'Japan', 'Brasilien', 'Egypten', 'Grønland', 'Kina', 'Australien', 'Grækenland', 'Portugal'],
  'Danske byer': ['København', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg', 'Roskilde', 'Vejle', 'Kolding', 'Silkeborg', 'Helsingør', 'Randers', 'Herning'],
  'Feriesteder': ['Mallorca', 'Bornholm', 'Legoland', 'Disneyland', 'Alperne', 'Sommerhuset', 'Kroatien', 'Rom', 'Thailand', 'Tyrkiet', 'Kanarieøerne', 'Skiferie', 'Campingplads', 'Paris'],
  'Erhverv': ['Læge', 'Brandmand', 'Lærer', 'Politibetjent', 'Tømrer', 'Pilot', 'Kok', 'Sygeplejerske', 'Advokat', 'Frisør', 'Elektriker', 'Landmand', 'Journalist', 'Dyrlæge', 'Fotograf', 'Bibliotekar', 'Bager', 'Skuespiller', 'Ingeniør', 'Revisor'],
  'Skolefag': ['Matematik', 'Dansk', 'Idræt', 'Musik', 'Historie', 'Biologi', 'Engelsk', 'Geografi', 'Fysik', 'Billedkunst', 'Kemi', 'Tysk', 'Samfundsfag', 'Håndarbejde', 'Madkundskab'],
  'Film & serier': ['Star Wars', 'Frost', 'Matrix', 'Titanic', 'Vikings', 'Friends', 'Jurassic Park', 'Harry Potter', 'Batman', 'Grease', 'Shrek', 'Ringenes Herre', 'Rocky', 'Toy Story', 'Ghostbusters', 'Jaws', 'Rio', 'Modermorderen'],
  'Tegnefilm': ['Mickey Mouse', 'Simpsons', 'SpongeBob', 'Scooby-Doo', 'Pokémon', 'Peppa Gris', 'Anders And', 'Bamse', 'Ninja Turtles', 'Tom og Jerry', 'Dora', 'Paw Patrol', 'Familien Robinson', 'Looney Tunes'],
  'Superhelte': ['Spider-Man', 'Superman', 'Wonder Woman', 'Iron Man', 'Hulk', 'Thor', 'Batman', 'Flash', 'Captain America', 'Black Panther', 'Aquaman', 'Deadpool', 'Wolverine'],
  'Videospil': ['Minecraft', 'Fortnite', 'Mario', 'Tetris', 'Pac-Man', 'FIFA', 'Roblox', 'Sims', 'Zelda', 'Pokémon', 'Among Us', 'Candy Crush'],
  'Sport': ['Fodbold', 'Håndbold', 'Svømning', 'Tennis', 'Cykling', 'Boksning', 'Golf', 'Skiløb', 'Badminton', 'Atletik', 'Basketball', 'Volleyball', 'Bordtennis', 'Ridning', 'Rugby', 'Gymnastik'],
  'Vintersport': ['Skiløb', 'Snowboard', 'Skøjteløb', 'Ishockey', 'Slædehund', 'Bobslæde', 'Skibakke', 'Curling', 'Snebold', 'Snemand'],
  'Musikinstrumenter': ['Guitar', 'Klaver', 'Violin', 'Trompet', 'Trommer', 'Fløjte', 'Saxofon', 'Harpe', 'Cello', 'Ukulele', 'Xylofon', 'Mundharmonika'],
  'Møbler': ['Sofa', 'Spisebord', 'Reol', 'Seng', 'Skrivebord', 'Lænestol', 'Skab', 'Skammel', 'Sofabord', 'Vaskemaskine', 'Kommode', 'Gyngestol', 'Hylde', 'Barstol'],
  'Køkkenredskaber': ['Gryde', 'Pande', 'Kniv', 'Ske', 'Blender', 'Ovn', 'Mikrobølgeovn', 'Skærebræt', 'Piskeris', 'Dåseåbner', 'Rivejern', 'Sigte'],
  'Køretøjer': ['Cykel', 'Bus', 'Fly', 'Tog', 'Motorcykel', 'Sejlbåd', 'Traktor', 'Ambulance', 'Helikopter', 'Skateboard', 'Lastbil', 'Ubåd', 'Ballon', 'Løbehjul', 'Kano'],
  'Tøj': ['Bukser', 'Kjole', 'Sko', 'Hue', 'Halstørklæde', 'Regnjakke', 'Badedragt', 'Handsker', 'Slips', 'Kasket', 'Sweater', 'Nederdel', 'Støvler', 'Bælte', 'Pyjamas'],
  'Værktøj': ['Hammer', 'Skruetrækker', 'Sav', 'Boremaskine', 'Skruenøgle', 'Tang', 'Målebånd', 'Stige', 'Skovl', 'Søm', 'Skrue', 'Fejekost'],
  'Legetøj': ['Dukke', 'Bamse', 'Puslespil', 'Lego', 'Kolonihjul', 'Trampolin', 'Drage', 'Yo-yo', 'Boldspil', 'Sæbebobler', 'Gyngestativ', 'Rutsjebane'],
  'Kropsdele': ['Øje', 'Øre', 'Næse', 'Hånd', 'Fod', 'Knæ', 'Albue', 'Ryg', 'Mave', 'Hjerte', 'Hår', 'Tunge'],
  'Følelser': ['Glæde', 'Vrede', 'Sorg', 'Frygt', 'Overraskelse', 'Kærlighed', 'Jalousi', 'Stolthed', 'Skam', 'Nervøsitet', 'Spænding', 'Kedsomhed'],
  'Vejr': ['Regn', 'Sne', 'Solskin', 'Torden', 'Lynild', 'Blæst', 'Tåge', 'Regnbue', 'Hagl', 'Orkan', 'Frost', 'Skyer'],
  'Planeter & rummet': ['Jorden', 'Mars', 'Månen', 'Solen', 'Saturn', 'Stjerne', 'Komet', 'Astronaut', 'Raket', 'Sort hul', 'Mælkevejen', 'Meteor'],
  'Farver': ['Rød', 'Blå', 'Gul', 'Grøn', 'Lilla', 'Orange', 'Sort', 'Hvid', 'Lyserød', 'Turkis', 'Guld', 'Sølv'],
  'Højtider & traditioner': ['Jul', 'Påske', 'Fastelavn', 'Nytår', 'Fødselsdag', 'Halloween', 'Sankt Hans', 'Bryllup', 'Konfirmation', 'Valentinsdag'],
};

function pickWord() {
  const categoryNames = Object.keys(CATEGORIES);
  const category = categoryNames[Math.floor(Math.random() * categoryNames.length)];
  const words = CATEGORIES[category];
  const word = words[Math.floor(Math.random() * words.length)];
  return { category, word };
}

module.exports = { CATEGORIES, pickWord };
