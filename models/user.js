var pgp = require('pg-promise')();
var db = pgp(process.env.DB_CONNECTION_STRING);
var util = require('util');

class User {
	constructor(id, email, level, rating, profile) {
		this.id = id;
		this.email = email;
		this.level = level;
    this.rating = rating;
    this.profile = profile;
	}
}

class Profile {
	constructor(id, userId, providerName, providerUserId, userName) {
		this.id = id;
		this.userId = userId;
		this.providerName = providerName;
		this.providerUserId = providerUserId;
		this.userName = userName;
	}
}

function getUserModel(userRecord) {
  const profile = new Profile(userRecord.provider_id, userRecord.id, userRecord.provider_name, userRecord.provider_user_id, userRecord.provider_user_name);
  const result = new User(userRecord.id, userRecord.email, userRecord.level, userRecord.rating, profile);
  return result;
}

const getUserQuery = 
  'SELECT u.id, u.email, u.level, u.rating, p.provider_user_name, p.provider_name, p.provider_user_id, p.id AS provider_id ' +
  'FROM users u INNER JOIN profiles p ON u.id = p.user_id WHERE u.id = $1 AND p.provider_name = $2';

exports.findById = async function(userId, providerName) {
  if (util.isNullOrUndefined(userId)) throw new Error('Argument userId is null or undefined.');
  if (util.isNullOrUndefined(providerName)) throw new Error('Argument providerName is null or undefined.');
  if (typeof providerName !== 'string') throw new Error('Invalid providerName argument type.');

  let result = null;
  const normalizedProviderName = providerName.toUpperCase();
  const userRecord = await db.oneOrNone(getUserQuery, [ +userId, normalizedProviderName ]);
    
  if (userRecord !== null) { result = getUserModel(userRecord); }
	return result;
};

exports.findOrCreate = async function(providerProfile) {
  if (util.isNullOrUndefined(providerProfile)) throw new Error('Argument providerProfile is null or undefined.');
  if (typeof providerProfile !== 'object') throw new Error('Invalid providerProfile argument type.');

  let result = null;  
  const normalizedProviderName = providerProfile.provider.toUpperCase();
  const normalizedEmail = providerProfile.email.toUpperCase();

  const query = 
    'SELECT u.id, u.email, u.level, u.rating, p.provider_user_name, p.provider_name, p.provider_user_id, p.id AS provider_id ' +
    'FROM users u INNER JOIN profiles p ON u.id = p.user_id WHERE (p.provider_name, p.provider_user_id) = ($1, $2)';
  let userRecord = await db.oneOrNone(query, [ normalizedProviderName, providerProfile.id.toString() ]);

  if (userRecord === null) {
    userRecord = await db.tx(function * (t) {
      const newUser = yield t.one('INSERT INTO users(email) VALUES($1) RETURNING id', normalizedEmail);
      yield t.none('INSERT INTO profiles(user_id, provider_name, provider_user_id, provider_user_name) VALUES($1, $2, $3, $4)', 
        [ newUser.id, normalizedProviderName, providerProfile.id, providerProfile.displayName ]);
      let user = yield t.one(getUserQuery, [ newUser.id, normalizedProviderName ]);
      return user;
    });
  }

  result = getUserModel(userRecord);
  return result;
};

exports.levelIncrement = async function(userId) {
  if (util.isNullOrUndefined(userId)) throw new Error('Argument userId is null or undefined.');

  const result = await db.tx(function * (t) {
    yield t.none('UPDATE users SET level = level + 1 WHERE id = $1', +userId);
    const updated = yield t.one('SELECT level FROM users WHERE id = $1', +userId);
    return updated.level;
  });
	return result;
};

exports.levelDecrement = async function(userId) {
	if (util.isNullOrUndefined(userId)) throw new Error('Argument userId is null or undefined.');

  const result = await db.tx(function * (t) {
    yield t.none('UPDATE users SET level = level - 1 WHERE id = $1 AND level > 0', +userId);
    const updated = yield t.one('SELECT level FROM users WHERE id = $1', +userId);
    return updated.level;
  });
	return result;
};

exports.ratingIncrement = async function(userId) {
	if (util.isNullOrUndefined(userId)) throw new Error('Argument userId is null or undefined.');

  const result = await db.tx(function * (t) {
    yield t.none('UPDATE users SET rating = rating + 1 WHERE id = $1', +userId);
    const updated = yield t.one('SELECT rating FROM users WHERE id = $1', +userId);
    return updated.rating;
  });
	return result;
};

exports.ratingDecrement = async function(userId) {
	if (util.isNullOrUndefined(userId)) throw new Error('Argument userId is null or undefined.');

  const result = await db.tx(function * (t) {
    yield t.none('UPDATE users SET rating = rating - 1 WHERE id = $1 AND rating > 0', +userId);
    const updated = yield t.one('SELECT rating FROM users WHERE id = $1', +userId);
    return updated.rating;
  });
	return result;
};

exports.findNearestUser = async function(rating, level) {
  if (util.isNullOrUndefined(rating)) throw new Error('Argument rating is null or undefined.');
  if (+rating < 0) throw new Error('Argument rating out of range.');
  if (+level < 0) throw new Error('Argument level out of range.');

  let result = null;
  const query = 
    'SELECT u.id, u.email, u.level, u.rating, p.provider_user_name, p.provider_name, p.provider_user_id, p.id AS provider_id FROM users u INNER JOIN profiles p ON p.user_id = u.id ' + 
    'WHERE u.id in (SELECT id FROM users GROUP BY id, rating, level ORDER BY ABS(MIN(rating - $1)) ASC, ABS(MIN(level - $2)) ASC LIMIT 1) ' +
    'LIMIT 1';

  const nearestUser = await db.oneOrNone(query, [ +rating, +level ]);
  if (nearestUser !== null) { result = getUserModel(nearestUser); }
  return result;
};
