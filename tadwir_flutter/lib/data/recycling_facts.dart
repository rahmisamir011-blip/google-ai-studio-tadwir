import 'dart:math';

const List<String> recyclingFacts = [
  "Recycling one aluminum can saves enough energy to listen to a full album on an iPod.",
  "The amount of wood and paper we throw away each year is enough to heat 50,000,000 homes for 20 years.",
  "Plastic bags and other plastic garbage thrown into the ocean kill as many as 1,000,000 sea creatures every year.",
  "A modern glass bottle would take 4000 years or more to decompose -- and even longer if it's in a landfill.",
  "Recycling plastic saves twice as much energy as burning it in an incinerator.",
  "The U.S. is the #1 trash-producing country in the world at 1,609 pounds per person per year. This means that 5% of the world's people generate 40% of the world's waste.",
];

String getRandomFact() {
  final random = Random();
  return recyclingFacts[random.nextInt(recyclingFacts.length)];
}
