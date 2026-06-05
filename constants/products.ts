export type Product = {
  id: string;
  name: string;
  price: number;
  rating?: string;
  time?: string;
  img?: any;
  desc?: string;
  tag?: string;
  season?: string;
  oldPrice?: number;
  rooms?: string[];
};

export const PRODUCTS: Product[] = [
  // Plants
  { id: 'plant_tulsi', name: 'Tulsi (Holy Basil)', price: 49, rating: '4.9', time: '12 MINS', img: require('@/assets/images/succulent_plant.png'), rooms: ['Kitchen', 'Outdoor'] },
  { id: 'plant_money', name: 'Money Plant', price: 149, rating: '4.8', time: '15 MINS', img: require('@/assets/images/office_plant.png'), oldPrice: 299, rooms: ['Living Room', 'Bedroom', 'Library'] },
  { id: 'plant_aloe', name: 'Aloe Vera', price: 99, rating: '4.9', time: '10 MINS', img: require('@/assets/images/succulent_plant.png'), oldPrice: 199, rooms: ['Kitchen', 'Bedroom', 'Living Room'] },
  { id: 'plant_ashwa', name: 'Ashwagandha', price: 199, rating: '4.7', time: '18 MINS', img: require('@/assets/images/fiddle_leaf_fig.png'), rooms: ['Kitchen', 'Outdoor'] },
  { id: 'plant_peace', name: 'Peace Lily', price: 299, rating: '4.7', time: '20 MINS', img: require('@/assets/images/office_plant.png'), rooms: ['Living Room', 'Bedroom', 'Library'] },
  { id: 'plant_snake', name: 'Snake Plant', price: 349, rating: '4.8', time: '12 MINS', img: require('@/assets/images/succulent_plant.png'), rooms: ['Bedroom', 'Living Room', 'Library'] },
  { id: 'plant_curry', name: 'Curry Leaf', price: 79, rating: '4.4', time: '10 MINS', img: require('@/assets/images/office_plant.png'), rooms: ['Kitchen', 'Outdoor'] },
  { id: 'plant_jasmine', name: 'Jasmine (Mogra)', price: 129, rating: '4.7', time: '25 MINS', img: require('@/assets/images/fiddle_leaf_fig.png'), rooms: ['Bedroom', 'Outdoor'] },
  { id: 'plant_fiddle', name: 'Fiddle Leaf', price: 1299, rating: '4.9', img: require('@/assets/images/fiddle_leaf_fig.png'), rooms: ['Living Room', 'Library'] },
  { id: 'plant_marigold', name: 'Marigold', price: 29, season: 'Summer', img: require('@/assets/images/succulent_plant.png'), rooms: ['Outdoor'] },
  { id: 'plant_dahlia', name: 'Dahlia', price: 79, season: 'Monsoon', img: require('@/assets/images/office_plant.png'), rooms: ['Outdoor'] },
  { id: 'plant_chrys', name: 'Chrysanthemum', price: 99, season: 'Winter', img: require('@/assets/images/fiddle_leaf_fig.png'), rooms: ['Outdoor'] },
  { id: 'plant_hibiscus', name: 'Hibiscus', price: 49, season: 'All Year', img: require('@/assets/images/succulent_plant.png'), rooms: ['Outdoor'] },
  { id: 'plant_desk', name: 'Desk Plant', price: 147, rating: '4.7', img: require('@/assets/images/office_plant.png'), oldPrice: 195, rooms: ['Living Room', 'Library', 'Bedroom'] },

  // Tools
  { id: 'tool_shears', name: 'Pruning Shears', price: 299, desc: 'Sharp stainless steel shears', img: require('@/assets/images/succulent_plant.png') },
  { id: 'tool_gloves', name: 'Garden Gloves', price: 149, desc: 'Protective heavy duty gloves', img: require('@/assets/images/office_plant.png') },
  { id: 'tool_can', name: 'Watering Can', price: 399, desc: 'Ergonomic watering can', img: require('@/assets/images/fiddle_leaf_fig.png') },
  { id: 'tool_bottle', name: 'Spray Bottle', price: 99, desc: 'Fine mist spray bottle', img: require('@/assets/images/succulent_plant.png') },

  // Pesticides & Care
  { id: 'care_neem', name: 'Neem Oil Spray', price: 199, tag: 'Organic', desc: 'Organic pest control' },
  { id: 'care_fungi', name: 'Fungicide Mix', price: 249, tag: 'Anti-Fungal', desc: 'Anti-fungal solution' },
  { id: 'care_insect', name: 'Insect Killer', price: 179, tag: 'Safe', desc: 'Safe bug and insect repellent' },
  { id: 'care_root', name: 'Root Booster', price: 349, tag: 'Growth', desc: 'Hormone for fast root growth' },
  { id: 'care_potting', name: 'Potting Mix', price: 149, tag: 'Soil', desc: 'Rich organic soil blend' },

  // Fertilizers
  { id: 'fert_npk', name: 'NPK 19-19-19', price: 129, desc: 'All-purpose fertilizer' },
  { id: 'fert_vermi', name: 'Vermicompost', price: 199, desc: 'Organic manure' },
  { id: 'fert_bone', name: 'Bone Meal', price: 149, desc: 'Phosphorus rich' },
  { id: 'fert_seaweed', name: 'Seaweed Extract', price: 249, desc: 'Micro-nutrient solution' },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}
