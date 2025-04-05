
export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface RideStop {
  id?: string;
  address: string;
  lat: number;
  lng: number;
  isCompleted?: boolean;
  order?: number;
  position?: number;
  rideId?: string;
}

export interface Ride {
  id: string;
  userId: string;
  driverId?: string;
  startLocation: Location;
  endLocation: Location;
  stops?: RideStop[];
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  fare: number;
  distance: number;
  duration: number;
  rideType: 'standard' | 'premium' | 'eco';
  paymentMethod?: 'cash' | 'card' | 'wallet';
  createdAt: Date;
  updatedAt: Date;
  nearbyLandmark?: string;
  rideMood?: 'chatty' | 'quiet' | 'work' | 'music';
  userRating?: number;
  appliedDiscount?: number;
  weatherAdjustment?: number;
  isShared?: boolean;
  isNegotiable?: boolean;
  isRated?: boolean;
}

export interface FavoriteRoute {
  id: string;
  name: string;
  startLocation: Location;
  endLocation: Location;
  userId: string;
}
