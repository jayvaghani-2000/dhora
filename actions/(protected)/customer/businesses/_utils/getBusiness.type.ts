export interface BusinessesType {
  id: string;
  type: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  address: string;
  contact: string;
  logo: string;
  stripe_id: string;
  stripe_account_verified: Date;
  deleted: boolean;
  user_id: string;
  description: string;
  assets: Asset[];
  rating_info: RatingInfo;
}
[];

export interface Asset {
  id: string;
  url: string;
  type: string;
  width: number;
  height: number;
  user_id: string;
  blur_url: string;
  asset_type: string;
  created_at: Date;
  package_id: null | string;
  updated_at: Date;
  business_id: string;
}

export interface RatingInfo {
  total_ratings: number;
  average_rating: number;
}
