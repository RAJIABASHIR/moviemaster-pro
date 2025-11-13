export function validatePassword(pwd) {
  const errs = [];
  if (!/[A-Z]/.test(pwd)) errs.push("at least one uppercase letter");
  if (!/[a-z]/.test(pwd)) errs.push("at least one lowercase letter");
  if (pwd.length < 6) errs.push("at least six characters");
  return errs;
}