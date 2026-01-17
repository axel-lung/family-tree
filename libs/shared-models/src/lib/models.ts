export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'family_manager' | 'family_member' | 'guest';
  approved: boolean;
}

export interface Person {
  id: number;
  user_id?: number;
  first_name: string;
  second_name: string;
  third_name: string;
  last_name: string;
  gender?: 'M' | 'F';
  birth_date?: Date;
  birth_place?: string;
  death_date?: Date;
  biography?: string;
  email?: string;
  phone?: string;
  residence?: string;
  photo?: string;
  deleted: boolean;
  family_id: number;
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

export interface Family {
  id: number;
  name: string;
}

export interface UsersFamilies {
    id: number;
    user_id: number;
    family_id: number;
}