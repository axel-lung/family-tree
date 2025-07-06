export interface User {
  id: number;
  email: string;
  role: 'admin' | 'family_member' | 'guest';
}

export interface Person {
  id: number;
  user_id?: number;
  first_name: string;
  last_name: string;
  gender?: 'M' | 'F';
  birth_date?: string;
  birth_place?: string;
  death_date?: string;
  biography?: string;
  email?: string;
  phone?: string;
  residence?: string;
  photo_url?: string;
  deleted: boolean;
}

export interface Relationship {
  id: number;
  person1_id: number;
  person2_id: number;
  relationship_type: 'parent' | 'child' | 'spouse' | 'mother' | 'father';
}

export interface Permission {
  id: number;
  user_id: number;
  person_id: number;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
}
