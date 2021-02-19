const db = require('../../data/db-config');
const bcrypt = require('bcryptjs');

const findAll = async () => {
  return await db('users').select('id','email');
};

const findById = async (id) => {
  return db('users').where({ id }).first().select('id','email');
};

const findBy = (filter) => {
    return db('users').where(filter);
  };
  
const create = async (user) => {
  const hash = bcrypt.hashSync(user.password);
  const user_id = await db('users').insert({ ...user, password: hash })  
  return findById(user_id);
};

const update = (id, user) => {
  return db('users')
    .where({ id: id })
    .first()
    .update(user)
    .returning('*');
};

const remove = async (id) => {
  return await db('users').where({ id }).del();
};

module.exports = {
  findAll,
  findById,
  findBy,
  create,
  update,
  remove,
};
