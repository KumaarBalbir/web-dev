import generateRandom from "sillyname";
import { randomSuperhero as superHeroName } from "superheroes";

let myName = generateRandom();
let supHero = superHeroName();
console.log(myName);
console.log(`I am a superhero: ${supHero}`);
