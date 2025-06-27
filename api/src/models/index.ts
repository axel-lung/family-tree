import { User } from './user';
import { Person } from './person';
import { Relationship } from './relationship';
import { Permission } from './permission';

export function initModels() {
  // User -> Person (un utilisateur peut être lié à plusieurs personnes)
  User.hasMany(Person, { foreignKey: 'user_id', as: 'persons' });
  Person.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // Person -> Relationship (une personne peut avoir plusieurs relations)
  Person.hasMany(Relationship, { foreignKey: 'person1_id', as: 'outgoingRelationships' });
  Person.hasMany(Relationship, { foreignKey: 'person2_id', as: 'incomingRelationships' });
  Relationship.belongsTo(Person, { foreignKey: 'person1_id', as: 'sourcePerson' });
  Relationship.belongsTo(Person, { foreignKey: 'person2_id', as: 'targetPerson' });

  // User -> Permission (un utilisateur peut avoir plusieurs permissions) 
  User.hasMany(Permission, { foreignKey: 'user_id', as: 'permissions' });
  Person.hasMany(Permission, { foreignKey: 'person_id', as: 'permissions' });
  Permission.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Permission.belongsTo(Person, { foreignKey: 'person_id', as: 'person' });
}