function validateUserProfile(user) {
  if (!user.name || typeof user.name !== 'string') return false;
  if (
    !user.email ||
    typeof user.email !== 'string' ||
    !user.email.includes('@')
  )
    return false;
  if (typeof user.age !== 'number' || user.age < 0 || user.age > 120)
    return false;
  return true;
}

export { validateUserProfile };
