function getValueFromType(type) {
    if (type == 'string') {
        return getRandomWord();
    }

    if (type == 'integer') {
      return Math.floor(Math.random() * 100);
    }

    if (type == 'array') {
      return '0';
    }

    return '0';
}

var randomWords = [
    "Toyota", "Ford", "Chevrolet", "Honda", "Tesla", "BMW", "Mercedes-Benz", "Audi", "Lexus", "Volvo",
    "JFK Airport", "Heathrow Airport", "Los Angeles International Airport (LAX)", "Dubai International Airport", 
    "Hong Kong International Airport", "OHare International Airport", "Singapore Changi Airport", 
    "Incheon International Airport", "Frankfurt Airport", "Amsterdam Airport Schiphol",
    "The Shawshank Redemption", "The Godfather", "The Dark Knight", "Pulp Fiction", "Schindlers List", 
    "The Lord of the Rings: The Return of the King", "Forrest Gump", "Fight Club", "Inception", "The Matrix",
    "Alex","Emma","Grace","Noah","Liam","Ethan","Olivia","Ava","Mia","Sophia", "Apple","Samsung","Nike","Adidas",
    "PlayStation","Xbox","MacBook","Windows","Linux","The Great Gatsby","To Kill a Mockingbird","1984",
    "Brave New World","The Catcher in the Rye","The Lord of the Rings","Harry Potter and the Sorcerer's Stone",
    'Aalborg', 'Aarhus', 'Esbjerg', 'Randers', 'Silkeborg', 'Horsens', 'Kolding', 'Vejle', 'Herning', 'Holstebro',
    'Skive', 'Viborg', 'Hjørring', 'Fredericia', 'Frederikshavn', 'Struer', 'Thisted', 'Ikast',
    'Bærbar computer', 'Stationær computer', 'Grafikkort', 'Tastatur', 'Mus', 'Skærm', 'Printer', 'Router', 'Switch', 'Netværkskabel',
    'Webkamera', 'Mikrofon', 'Højttalere', 'USB-drev', 'Ekstern harddisk', 'SSD', 'RAM', 'Processor', 'Moderkort', 'Strømforsyning', 
  ];
  
  function getRandomWord() {
    var randomIndex = Math.floor(Math.random() * randomWords.length);
    return randomWords[randomIndex];
  }

module.exports = { getValueFromType }
