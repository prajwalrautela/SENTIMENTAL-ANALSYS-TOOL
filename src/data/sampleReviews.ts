import { MovieReviewPreset } from "../types";

export const SAMPLE_MOVIE_REVIEWS: MovieReviewPreset[] = [
  {
    id: "oppenheimer",
    title: "Oppenheimer",
    year: 2023,
    genre: "Biographical Thriller / Drama",
    ratingScore: "9.5/10",
    reviewerType: "Top Critic",
    reviewerName: "Cinephile Review Quarterly",
    expectedPolarity: "Strongly Positive",
    reviewText:
      "A monumental, breathtaking cinematic triumph that will reverberate for generations. Christopher Nolan orchestrates a breathtaking symphony of tension, moral decay, and political terror. Cillian Murphy delivers an extraordinary, haunting performance with eyes that convey cosmic dread and immense remorse. Hoyte van Hoytema's 70mm cinematography captures both intimate emotional devastation and atomic fury. Ludwig Göransson's pulse-pounding score is an electrifying masterpiece in its own right. This is filmmaking at its most rigorous, inventive, and devastatingly profound.",
  },
  {
    id: "the-room",
    title: "The Room",
    year: 2003,
    genre: "Drama / Cult Phenomenon",
    ratingScore: "1.5/10",
    reviewerType: "Indie Film Journal",
    reviewerName: "Midnight Cinema Dissection",
    expectedPolarity: "Strongly Negative",
    reviewText:
      "An unmitigated, incoherent disaster of astronomical proportions, yet paradoxically fascinating in its sheer incompetence. Tommy Wiseau's dialogue is utterly stilted, robotic, and laughable. The acting across the board is wooden and painful to endure. Subplots vanish into thin air without explanation, the editing feels like a fever dream, and the cinematography is laughably clumsy. It is undoubtedly an abysmal failure of filmmaking craft, though it has accidentally earned its place as the citizen kane of bad movies.",
  },
  {
    id: "the-godfather",
    title: "The Godfather",
    year: 1972,
    genre: "Crime / Drama Epic",
    ratingScore: "10/10",
    reviewerType: "Top Critic",
    reviewerName: "Classic Cinema Heritage",
    expectedPolarity: "Strongly Positive",
    reviewText:
      "An undisputed, timeless masterpiece of world cinema. Francis Ford Coppola crafts an exquisite, operatic portrait of power, family loyalty, and moral corruption. Marlon Brando and Al Pacino deliver flawless, indelible performances that redefine screen acting. Gordon Willis's shadowy, chiaroscuro cinematography is legendary, and Nino Rota's melancholic score breaks your heart with every note. The screenplay is airtight, pacing is measured to perfection, and every frame vibrates with quiet majesty.",
  },
  {
    id: "madame-web",
    title: "Madame Web",
    year: 2024,
    genre: "Superhero / Mystery",
    ratingScore: "2.0/10",
    reviewerType: "Disappointed Viewer",
    reviewerName: "Box Office Debacle Chronicles",
    expectedPolarity: "Strongly Negative",
    reviewText:
      "A cynical, soulless, and disjointed corporate product that feels completely lifeless from start to finish. The dialogue is cringeworthy and unnatural, featuring lines that no human would ever speak. The pacing drags endlessly through tedious exposition, while the villain's lines are visibly ADR-dubbed with zero emotional resonance. The action sequences are choppy, blurry, and devoid of stakes. A completely forgettable, uninspired mess that squanders its talented ensemble cast.",
  },
  {
    id: "interstellar",
    title: "Interstellar",
    year: 2014,
    genre: "Sci-Fi / Adventure",
    ratingScore: "8.8/10",
    reviewerType: "Audience Fan",
    reviewerName: "AstroSciFi Hub",
    expectedPolarity: "Positive",
    reviewText:
      "An emotionally overwhelming, visually spectacular voyage across the cosmos. Hans Zimmer's cathedral organ score elevates every sequence into pure spiritual awe. Matthew McConaughey's tearful video transmission scene is deeply moving and heartbreaking. While some third-act dialogue regarding love transcending dimensions feels slightly melodramatic and scientifically loose, the sheer ambition, stunning black hole visuals, and poignant parent-child bond make it an unforgettable cinematic experience.",
  },
  {
    id: "eeao",
    title: "Everything Everywhere All At Once",
    year: 2022,
    genre: "Sci-Fi / Absurdist Comedy",
    ratingScore: "9.2/10",
    reviewerType: "Indie Film Journal",
    reviewerName: "Avant-Garde Review",
    expectedPolarity: "Strongly Positive",
    reviewText:
      "A chaotic, wildly inventive, and deeply touching marvel of modern cinema. Michelle Yeoh and Ke Huy Quan provide heartbreaking, transcendent turns that anchor the multiversal madness in pure emotional truth. The editing is lightning fast, effortlessly shifting from riotously funny bagel apocalypses to profoundly tender dialogues between rocks in a desert. It celebrates kindness and human connection amid nihilistic void. Truly a one-of-a-kind triumph.",
  },
];
