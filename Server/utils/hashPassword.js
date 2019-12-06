import bcrypt from 'bcryptjs';

export const hashPassword = password => bcrypt.hashSync(password, 10);

export const comparePassword = (unHashedPassword, hashedPassword) =>
  bcrypt.compareSync(unHashedPassword, hashedPassword);
