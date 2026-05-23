export interface Course {
  name: string;
  duration: string;
  fees: number;
}

export interface Placements {
  averagePackage: number;
  highestPackage: number;
  topRecruiters: string[];
  placementRate: number;
}

export interface Review {
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface College {
  id: string;
  name: string;
  location: string;
  type: "Private" | "Government" | "Deemed";
  category: "Engineering" | "Management" | "Medical" | "Arts" | "Commerce";
  fees: number;
  rating: number;
  totalReviews: number;
  rank: number;
  imageUrl: string;
  established: number;
  overview: string;
  courses: Course[];
  placements: Placements;
  reviews: Review[];
  tags: string[];
  website: string;
  phone: string;
  email: string;
}

export interface CollegeFilters {
  category: string;
  location: string;
  minFees: number | "";
  maxFees: number | "";
  minRating: number;
  type: string;
}

export type SortOption =
  | "rating-desc"
  | "fees-asc"
  | "fees-desc"
  | "rank-asc"
  | "reviews-desc";
