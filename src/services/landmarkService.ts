
// Mock landmark service for finding nearby landmarks
// In a real app, this would connect to a maps API or a custom landmarks database

export interface Landmark {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: 'mall' | 'restaurant' | 'hotel' | 'park' | 'station' | 'other';
  description?: string;
}

// Mock database of landmarks
const landmarks: Landmark[] = [
  {
    id: 'lm1',
    name: 'Central Mall',
    address: '123 Shopping Ave',
    lat: 40.7128,
    lng: -74.006,
    category: 'mall',
    description: 'Main entrance on north side'
  },
  {
    id: 'lm2',
    name: 'Grand Hotel',
    address: '456 Luxury Blvd',
    lat: 40.7138,
    lng: -74.013,
    category: 'hotel',
    description: 'Valet parking available'
  },
  {
    id: 'lm3',
    name: 'City Park',
    address: '789 Green St',
    lat: 40.7118,
    lng: -74.009,
    category: 'park',
    description: 'East entrance near the fountain'
  },
  {
    id: 'lm4',
    name: 'Downtown Bus Station',
    address: '101 Transit Rd',
    lat: 40.7148,
    lng: -74.007,
    category: 'station',
    description: 'Main terminal building'
  },
  {
    id: 'lm5',
    name: 'Seafood Palace',
    address: '202 Ocean Dr',
    lat: 40.7158,
    lng: -74.003,
    category: 'restaurant',
    description: 'Front entrance with blue awning'
  }
];

// Generate more mock landmarks
for (let i = 0; i < 20; i++) {
  landmarks.push({
    id: `lm${i + 6}`,
    name: `Landmark ${i + 6}`,
    address: `${100 + i} Mock Street`,
    lat: 40.7128 + (Math.random() * 0.02 - 0.01),
    lng: -74.006 + (Math.random() * 0.02 - 0.01),
    category: ['mall', 'restaurant', 'hotel', 'park', 'station', 'other'][Math.floor(Math.random() * 6)] as any,
    description: `Description for Landmark ${i + 6}`
  });
}

export const landmarkService = {
  // Get landmarks near a location
  getNearbyLandmarks: (lat: number, lng: number, radius: number = 1): Promise<Landmark[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple distance calculation (not accurate for real-world use)
        const nearbyLandmarks = landmarks.filter(landmark => {
          const distance = Math.sqrt(
            Math.pow(landmark.lat - lat, 2) + 
            Math.pow(landmark.lng - lng, 2)
          );
          return distance <= radius;
        });
        
        resolve(nearbyLandmarks);
      }, 300);
    });
  },
  
  // Search for landmarks by name or category
  searchLandmarks: (query: string): Promise<Landmark[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = landmarks.filter(landmark => 
          landmark.name.toLowerCase().includes(query.toLowerCase()) ||
          landmark.category.toLowerCase().includes(query.toLowerCase()) ||
          landmark.address.toLowerCase().includes(query.toLowerCase())
        );
        
        resolve(results);
      }, 300);
    });
  },
  
  // Get landmark by ID
  getLandmarkById: (id: string): Promise<Landmark | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const landmark = landmarks.find(l => l.id === id);
        resolve(landmark);
      }, 100);
    });
  },
  
  // Get all landmarks for testing
  getAllLandmarks: (): Promise<Landmark[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...landmarks]);
      }, 200);
    });
  }
};
