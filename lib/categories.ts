/**
 * Dynamic category and subcategory system
 * Extracts subcategories from product titles using keyword matching
 */

// Subcategory detection rules
export const SUBCATEGORY_RULES = {
  Electronics: [
    { name: 'Laptops', keywords: ['laptop', 'notebook', 'ultrabook'] },
    { name: 'Telefoane', keywords: ['telefon mobil', 'smartphone', 'iphone', 'samsung galaxy', 'xiaomi redmi', 'xiaomi mi', 'oppo', 'realme', 'oneplus'] },
    { name: 'TV & Audio', keywords: ['televizor', 'tv', 'smart tv', 'boxe', 'soundbar', 'home cinema'] },
    { name: 'Calculatoare', keywords: ['calculator', 'desktop', 'pc gaming', 'all-in-one'] },
    { name: 'Tablete', keywords: ['tableta', 'tablet', 'ipad'] },
    { name: 'Smartwatch', keywords: ['smartwatch', 'ceas inteligent', 'apple watch', 'galaxy watch'] },
    { name: 'Componente PC', keywords: ['placa video', 'procesor', 'ram', 'ssd', 'hdd', 'carcasa', 'sursa'] },
    { name: 'Periferice', keywords: ['mouse', 'tastatura', 'headset', 'casti gaming', 'webcam', 'monitor'] },
    { name: 'Camere', keywords: ['camera foto', 'aparat foto', 'dslr', 'mirrorless', 'obiectiv'] },
    { name: 'Gaming', keywords: ['consola', 'playstation', 'xbox', 'nintendo', 'controller'] },
    { name: 'Imprimante', keywords: ['imprimanta', 'scanner', 'multifunctionala'] },
    { name: 'Electrocasnice', keywords: ['frigider', 'masina de spalat', 'aragazz', 'cuptor', 'aspirator'] },
  ],
  Fashion: [
    { name: 'Îngrijire Păr', keywords: ['sampon', 'balsam', 'masca par', 'ser par', 'spray par', 'lotiune par'] },
    { name: 'Extensii Păr', keywords: ['extensii', 'extensie', 'clip-on', 'clip on', 'peruca'] },
    { name: 'Îmbrăcăminte Femei', keywords: ['rochie', 'bluza dama', 'pantaloni dama', 'fusta', 'geaca dama'] },
    { name: 'Îmbrăcăminte Bărbați', keywords: ['camasa', 'tricou barbati', 'pantaloni barbati', 'geaca barbati', 'costum'] },
    { name: 'Încălțăminte', keywords: ['pantofi', 'adidasi', 'sandale', 'cizme', 'ghete', 'bocanci'] },
    { name: 'Accesorii', keywords: ['geanta', 'portofel', 'curea', 'esarfa', 'palarie', 'sapca'] },
    { name: 'Bijuterii', keywords: ['inel', 'colier', 'bratara', 'cercei', 'pandantiv'] },
    { name: 'Cosmetice', keywords: ['crema', 'fond ten', 'mascara', 'ruj', 'parfum', 'apa toaleta'] },
    { name: 'Styling', keywords: ['placa par', 'ondulator', 'uscator par', 'perie'] },
  ],
  Home: [
    { name: 'Tratare Apă', keywords: ['dedurizator', 'statie deferizare', 'filtru apa', 'purificator'] },
    { name: 'Mobilier', keywords: ['canapea', 'fotoliu', 'masa', 'scaun', 'dulap', 'pat'] },
    { name: 'Decorațiuni', keywords: ['tablou', 'rama foto', 'vaza', 'lumanare', 'perna decorativa'] },
    { name: 'Bucătărie', keywords: ['set vase', 'tigaie', 'oala', 'cutite', 'mixer', 'blender'] },
    { name: 'Iluminat', keywords: ['lustra', 'lampa', 'aplica', 'bec led', 'spoturi'] },
    { name: 'Textile', keywords: ['perdele', 'draperii', 'lenjerie pat', 'prosop', 'covor'] },
    { name: 'Grădină', keywords: ['motocoasa', 'masina tuns iarba', 'gratar', 'mobilier gradina'] },
  ],
};

export interface CategoryTree {
  name: string;
  slug: string;
  count: number;
  subcategories: SubcategoryInfo[];
}

export interface SubcategoryInfo {
  name: string;
  slug: string;
  count: number;
  parent: string;
}

/**
 * Detect subcategory from product title
 */
export function detectSubcategory(title: string, category: string): string | null {
  const titleLower = title.toLowerCase();
  const rules = SUBCATEGORY_RULES[category as keyof typeof SUBCATEGORY_RULES];
  
  if (!rules) return null;
  
  for (const rule of rules) {
    for (const keyword of rule.keywords) {
      if (titleLower.includes(keyword.toLowerCase())) {
        return rule.name;
      }
    }
  }
  
  return null;
}

/**
 * Generate slug from name
 */
export function generateCategorySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ă/g, 'a')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/ș/g, 's')
    .replace(/ț/g, 't')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Build category tree from products
 */
export function buildCategoryTree(products: any[]): CategoryTree[] {
  const categoryMap = new Map<string, CategoryTree>();
  
  // Initialize main categories
  for (const category of ['Electronics', 'Fashion', 'Home']) {
    categoryMap.set(category, {
      name: category,
      slug: generateCategorySlug(category),
      count: 0,
      subcategories: [],
    });
  }
  
  // Process products
  const subcategoryCounts = new Map<string, Map<string, number>>();
  
  for (const product of products) {
    const category = product.category || 'Electronics';
    const categoryData = categoryMap.get(category);
    
    if (!categoryData) continue;
    
    categoryData.count++;
    
    // Detect subcategory
    const subcategory = detectSubcategory(product.title || '', category);
    
    if (subcategory) {
      if (!subcategoryCounts.has(category)) {
        subcategoryCounts.set(category, new Map());
      }
      
      const catSubcats = subcategoryCounts.get(category)!;
      catSubcats.set(subcategory, (catSubcats.get(subcategory) || 0) + 1);
    }
  }
  
  // Build subcategories
  for (const [category, subcats] of subcategoryCounts) {
    const categoryData = categoryMap.get(category)!;
    
    for (const [subcatName, count] of subcats) {
      categoryData.subcategories.push({
        name: subcatName,
        slug: generateCategorySlug(subcatName),
        count,
        parent: category,
      });
    }
    
    // Sort by count
    categoryData.subcategories.sort((a, b) => b.count - a.count);
  }
  
  return Array.from(categoryMap.values());
}

/**
 * Get brands from products
 */
export function extractBrands(products: any[]): { name: string; count: number }[] {
  const brandCounts = new Map<string, number>();
  
  const commonBrands = [
    'ASUS', 'Lenovo', 'HP', 'Dell', 'Acer', 'Apple', 'Samsung', 'Xiaomi',
    'Huawei', 'LG', 'Sony', 'Philips', 'Canon', 'Nikon', 'Microsoft',
    'Intel', 'AMD', 'NVIDIA', 'Kingston', 'Corsair', 'Logitech', 'Razer',
    'Nike', 'Adidas', 'Puma', 'Zara', 'H&M', 'Levis', 'Calvin Klein',
    'Keune', 'Schwarzkopf', 'Garnier', 'Loreal', 'Maybelline',
  ];
  
  for (const product of products) {
    const title = product.title || '';
    let foundBrand = false;
    
    for (const brand of commonBrands) {
      if (title.toLowerCase().includes(brand.toLowerCase())) {
        brandCounts.set(brand, (brandCounts.get(brand) || 0) + 1);
        foundBrand = true;
        break;
      }
    }
    
    // If no brand found, extract first word
    if (!foundBrand && title) {
      const firstWord = title.split(' ')[0];
      if (firstWord && firstWord.length > 2) {
        brandCounts.set(firstWord, (brandCounts.get(firstWord) || 0) + 1);
      }
    }
  }
  
  // Return top brands with at least 10 products
  return Array.from(brandCounts.entries())
    .filter(([_, count]) => count >= 10)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 100);
}

/**
 * Get price ranges for category
 */
export function getPriceRanges(products: any[], category?: string): { min: number; max: number; avg: number } {
  let filtered = products;
  
  if (category && category !== 'All') {
    filtered = products.filter(p => {
      const cat = p.category || '';
      return cat.toLowerCase().includes(category.toLowerCase());
    });
  }
  
  const prices = filtered.map(p => {
    const price = typeof p.price === 'string' ? parseFloat(p.price.replace(/[^0-9.]/g, '')) : (p.price || 0);
    return price;
  }).filter(p => p > 0);
  
  if (prices.length === 0) {
    return { min: 0, max: 10000, avg: 500 };
  }
  
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
    avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
  };
}
