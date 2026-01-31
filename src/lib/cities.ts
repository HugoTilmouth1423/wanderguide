export interface Landmark {
  name: string
  description: string
  lat: number
  lng: number
  category: 'landmark' | 'museum' | 'park' | 'neighborhood' | 'food' | 'historic'
}

export interface City {
  slug: string
  name: string
  country: string
  description: string
  heroImage: string
  landmarks: Landmark[]
  metaDescription: string
}

export const cities: City[] = [
  {
    slug: 'london',
    name: 'London',
    country: 'United Kingdom',
    description: 'A vibrant metropolis blending centuries of history with cutting-edge culture. From royal palaces to hidden pubs, London offers endless discoveries.',
    heroImage: '/cities/london.jpg',
    metaDescription: 'Explore London with WanderGuide AI. Discover Big Ben, Tower of London, hidden gems and local secrets with your personal AI tour guide.',
    landmarks: [
      { name: 'Tower of London', description: 'Medieval fortress, royal palace, and infamous prison with 1000 years of history', lat: 51.5081, lng: -0.0759, category: 'historic' },
      { name: 'British Museum', description: 'World-class collection spanning 2 million years of human history', lat: 51.5194, lng: -0.1270, category: 'museum' },
      { name: 'Big Ben & Parliament', description: 'Iconic clock tower and the heart of British democracy', lat: 51.5007, lng: -0.1246, category: 'landmark' },
      { name: 'Borough Market', description: "London's oldest food market, dating back to the 13th century", lat: 51.5055, lng: -0.0910, category: 'food' },
      { name: 'Hyde Park', description: 'Royal park with Serpentine Lake, Speakers Corner, and Diana Memorial', lat: 51.5073, lng: -0.1657, category: 'park' },
      { name: 'Shoreditch', description: 'Creative hub with street art, vintage shops, and thriving nightlife', lat: 51.5246, lng: -0.0780, category: 'neighborhood' },
      { name: 'Tower Bridge', description: 'Victorian engineering marvel with glass floor walkways', lat: 51.5055, lng: -0.0754, category: 'landmark' },
      { name: 'Camden Market', description: 'Eclectic market with alternative fashion, food, and live music', lat: 51.5416, lng: -0.1461, category: 'food' },
    ]
  },
  {
    slug: 'paris',
    name: 'Paris',
    country: 'France',
    description: 'The City of Light captivates with its artistic heritage, world-class cuisine, and timeless romance at every corner.',
    heroImage: '/cities/paris.jpg',
    metaDescription: 'Discover Paris with WanderGuide AI. Explore the Eiffel Tower, Louvre, Montmartre and hidden Parisian secrets with your AI tour guide.',
    landmarks: [
      { name: 'Eiffel Tower', description: 'Iconic iron lattice tower and symbol of Paris since 1889', lat: 48.8584, lng: 2.2945, category: 'landmark' },
      { name: 'Louvre Museum', description: "World's largest art museum, home to the Mona Lisa", lat: 48.8606, lng: 2.3376, category: 'museum' },
      { name: 'Notre-Dame Cathedral', description: 'Medieval Gothic masterpiece on the Île de la Cité', lat: 48.8530, lng: 2.3499, category: 'historic' },
      { name: 'Montmartre', description: 'Bohemian hilltop village with Sacré-Cœur and artist heritage', lat: 48.8867, lng: 2.3431, category: 'neighborhood' },
      { name: 'Le Marais', description: 'Historic district with Jewish quarter, LGBTQ+ scene, and trendy boutiques', lat: 48.8566, lng: 2.3622, category: 'neighborhood' },
      { name: 'Musée d\'Orsay', description: 'Impressionist masterpieces in a stunning Beaux-Arts railway station', lat: 48.8600, lng: 2.3266, category: 'museum' },
      { name: 'Luxembourg Gardens', description: 'Elegant French garden with palace, fountains, and Parisian charm', lat: 48.8462, lng: 2.3372, category: 'park' },
      { name: 'Champs-Élysées', description: 'Grand avenue from Place de la Concorde to Arc de Triomphe', lat: 48.8698, lng: 2.3078, category: 'landmark' },
    ]
  },
  {
    slug: 'new-york',
    name: 'New York',
    country: 'United States',
    description: 'The city that never sleeps offers world-famous landmarks, diverse neighborhoods, and endless energy on every block.',
    heroImage: '/cities/new-york.jpg',
    metaDescription: 'Explore New York City with WanderGuide AI. Discover Central Park, Statue of Liberty, Brooklyn and hidden NYC gems with your AI tour guide.',
    landmarks: [
      { name: 'Statue of Liberty', description: 'Iconic symbol of freedom and welcome to immigrants since 1886', lat: 40.6892, lng: -74.0445, category: 'landmark' },
      { name: 'Central Park', description: '843 acres of urban oasis in the heart of Manhattan', lat: 40.7829, lng: -73.9654, category: 'park' },
      { name: 'Empire State Building', description: 'Art Deco skyscraper with panoramic city views', lat: 40.7484, lng: -73.9857, category: 'landmark' },
      { name: 'Metropolitan Museum of Art', description: "America's largest art museum with 5,000 years of art", lat: 40.7794, lng: -73.9632, category: 'museum' },
      { name: 'Brooklyn Bridge', description: 'Gothic-towered suspension bridge connecting Manhattan and Brooklyn', lat: 40.7061, lng: -73.9969, category: 'landmark' },
      { name: 'Times Square', description: 'Dazzling entertainment hub known as the Crossroads of the World', lat: 40.7580, lng: -73.9855, category: 'neighborhood' },
      { name: 'Greenwich Village', description: 'Bohemian neighborhood with jazz clubs and historic brownstones', lat: 40.7336, lng: -74.0027, category: 'neighborhood' },
      { name: 'Chelsea Market', description: 'Food hall in a former Nabisco factory on the High Line', lat: 40.7424, lng: -74.0061, category: 'food' },
    ]
  },
  {
    slug: 'rome',
    name: 'Rome',
    country: 'Italy',
    description: 'The Eternal City layers ancient ruins, Renaissance art, and la dolce vita into an unforgettable open-air museum.',
    heroImage: '/cities/rome.jpg',
    metaDescription: 'Discover Rome with WanderGuide AI. Explore the Colosseum, Vatican, Trastevere and ancient Roman secrets with your AI tour guide.',
    landmarks: [
      { name: 'Colosseum', description: 'Ancient amphitheater that hosted gladiatorial combat for 50,000 spectators', lat: 41.8902, lng: 12.4922, category: 'historic' },
      { name: 'Vatican Museums', description: 'Papal art collection culminating in the Sistine Chapel', lat: 41.9065, lng: 12.4536, category: 'museum' },
      { name: 'Roman Forum', description: 'Ancient civic center and heart of the Roman Empire', lat: 41.8925, lng: 12.4853, category: 'historic' },
      { name: 'Trevi Fountain', description: 'Baroque masterpiece where a coin toss ensures your return to Rome', lat: 41.9009, lng: 12.4833, category: 'landmark' },
      { name: 'Trastevere', description: 'Charming medieval neighborhood with cobblestones and trattorias', lat: 41.8867, lng: 12.4692, category: 'neighborhood' },
      { name: 'Pantheon', description: 'Best-preserved ancient Roman temple with its iconic dome', lat: 41.8986, lng: 12.4769, category: 'historic' },
      { name: 'Spanish Steps', description: 'Monumental stairway and fashionable meeting spot since 1725', lat: 41.9060, lng: 12.4828, category: 'landmark' },
      { name: 'Villa Borghese', description: 'Elegant gardens with world-class art gallery and zoo', lat: 41.9142, lng: 12.4921, category: 'park' },
    ]
  },
  {
    slug: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    description: 'A mesmerizing blend of ancient temples and futuristic technology, where tradition and innovation coexist in perfect harmony.',
    heroImage: '/cities/tokyo.jpg',
    metaDescription: 'Explore Tokyo with WanderGuide AI. Discover Shibuya, Senso-ji Temple, Harajuku and hidden Japanese gems with your AI tour guide.',
    landmarks: [
      { name: 'Senso-ji Temple', description: "Tokyo's oldest temple in historic Asakusa district", lat: 35.7148, lng: 139.7967, category: 'historic' },
      { name: 'Shibuya Crossing', description: "World's busiest pedestrian intersection and iconic Tokyo scene", lat: 35.6595, lng: 139.7004, category: 'landmark' },
      { name: 'Meiji Shrine', description: 'Serene Shinto shrine in a forested sanctuary', lat: 35.6764, lng: 139.6993, category: 'historic' },
      { name: 'Tsukiji Outer Market', description: 'Legendary seafood market with fresh sushi and street food', lat: 35.6654, lng: 139.7707, category: 'food' },
      { name: 'Harajuku', description: 'Youth culture epicenter with avant-garde fashion and crepes', lat: 35.6702, lng: 139.7027, category: 'neighborhood' },
      { name: 'Tokyo Tower', description: 'Eiffel-inspired communications tower with observation decks', lat: 35.6586, lng: 139.7454, category: 'landmark' },
      { name: 'Shinjuku', description: 'Neon-lit entertainment district with Golden Gai and Omoide Yokocho', lat: 35.6938, lng: 139.7034, category: 'neighborhood' },
      { name: 'teamLab Borderless', description: 'Immersive digital art museum pushing creative boundaries', lat: 35.6264, lng: 139.7838, category: 'museum' },
    ]
  },
  {
    slug: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    description: 'Gaudí\'s fantastical architecture, Mediterranean beaches, and vibrant Catalan culture create an intoxicating coastal escape.',
    heroImage: '/cities/barcelona.jpg',
    metaDescription: 'Discover Barcelona with WanderGuide AI. Explore Sagrada Família, Park Güell, Gothic Quarter and Catalan secrets with your AI tour guide.',
    landmarks: [
      { name: 'Sagrada Família', description: "Gaudí's unfinished masterpiece and symbol of Barcelona", lat: 41.4036, lng: 2.1744, category: 'landmark' },
      { name: 'Park Güell', description: "Whimsical hilltop park with Gaudí's mosaic works", lat: 41.4145, lng: 2.1527, category: 'park' },
      { name: 'Gothic Quarter', description: 'Medieval labyrinth of narrow streets and hidden plazas', lat: 41.3833, lng: 2.1777, category: 'neighborhood' },
      { name: 'La Boqueria', description: "Europe's best food market on La Rambla since 1217", lat: 41.3816, lng: 2.1719, category: 'food' },
      { name: 'Casa Batlló', description: "Gaudí's bone-inspired modernist mansion on Passeig de Gràcia", lat: 41.3917, lng: 2.1649, category: 'landmark' },
      { name: 'Barceloneta Beach', description: 'Lively Mediterranean beach with seafood and chiringuitos', lat: 41.3807, lng: 2.1925, category: 'neighborhood' },
      { name: 'Picasso Museum', description: "World's most complete collection of Picasso's formative years", lat: 41.3851, lng: 2.1808, category: 'museum' },
      { name: 'El Born', description: 'Trendy medieval quarter with boutiques and cocktail bars', lat: 41.3852, lng: 2.1829, category: 'neighborhood' },
    ]
  },
  {
    slug: 'amsterdam',
    name: 'Amsterdam',
    country: 'Netherlands',
    description: 'Canals, bicycles, and Golden Age heritage create a uniquely relaxed yet culturally rich European capital.',
    heroImage: '/cities/amsterdam.jpg',
    metaDescription: 'Explore Amsterdam with WanderGuide AI. Discover Anne Frank House, Van Gogh Museum, canals and Dutch secrets with your AI tour guide.',
    landmarks: [
      { name: 'Anne Frank House', description: 'Poignant museum in the secret annex where Anne Frank hid', lat: 52.3752, lng: 4.8840, category: 'museum' },
      { name: 'Van Gogh Museum', description: "World's largest collection of Van Gogh's works", lat: 52.3584, lng: 4.8811, category: 'museum' },
      { name: 'Rijksmuseum', description: "Dutch Golden Age masterpieces including Rembrandt's Night Watch", lat: 52.3600, lng: 4.8852, category: 'museum' },
      { name: 'Jordaan', description: 'Charming neighborhood of canals, cafes, and galleries', lat: 52.3747, lng: 4.8819, category: 'neighborhood' },
      { name: 'Vondelpark', description: "Amsterdam's beloved green lung for picnics and people-watching", lat: 52.3579, lng: 4.8686, category: 'park' },
      { name: 'Royal Palace', description: '17th-century palace on Dam Square, still used by the royals', lat: 52.3731, lng: 4.8913, category: 'historic' },
      { name: 'De Pijp', description: 'Bohemian neighborhood with Albert Cuyp Market', lat: 52.3547, lng: 4.8946, category: 'neighborhood' },
      { name: 'Nine Streets', description: 'Shopping district of independent boutiques and vintage finds', lat: 52.3700, lng: 4.8850, category: 'neighborhood' },
    ]
  },
  {
    slug: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    description: 'A futuristic desert oasis where record-breaking skyscrapers meet traditional souks and golden beaches.',
    heroImage: '/cities/dubai.jpg',
    metaDescription: 'Discover Dubai with WanderGuide AI. Explore Burj Khalifa, Palm Jumeirah, Old Dubai and Arabian secrets with your AI tour guide.',
    landmarks: [
      { name: 'Burj Khalifa', description: "World's tallest building with observation decks at 555m", lat: 25.1972, lng: 55.2744, category: 'landmark' },
      { name: 'Dubai Mall', description: 'One of the largest malls with aquarium and ice rink', lat: 25.1985, lng: 55.2796, category: 'landmark' },
      { name: 'Palm Jumeirah', description: 'Iconic palm-shaped artificial island with luxury resorts', lat: 25.1124, lng: 55.1390, category: 'neighborhood' },
      { name: 'Dubai Creek', description: 'Historic waterway with traditional dhow boats and souks', lat: 25.2644, lng: 55.3117, category: 'historic' },
      { name: 'Gold Souk', description: 'Dazzling market with tons of gold jewelry', lat: 25.2867, lng: 55.2972, category: 'food' },
      { name: 'Jumeirah Beach', description: 'Pristine public beach with Burj Al Arab views', lat: 25.2048, lng: 55.2395, category: 'neighborhood' },
      { name: 'Dubai Frame', description: 'Picture frame-shaped observation tower with city views', lat: 25.2350, lng: 55.3003, category: 'landmark' },
      { name: 'Al Fahidi', description: 'Restored heritage district with wind towers and galleries', lat: 25.2631, lng: 55.2975, category: 'historic' },
    ]
  }
]

export function getCity(slug: string): City | undefined {
  return cities.find(c => c.slug === slug)
}

export function getAllCities(): City[] {
  return cities
}
