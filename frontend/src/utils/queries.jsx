export function hasTokenCookie() {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    if (cookie.trim().startsWith("token=")) {
      return true;
    }
  }
  return false;
}
