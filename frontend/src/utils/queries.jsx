// Use endpoint /api/status to check if the user is logged in
export async function hasTokenCookie() {
  return fetch("/api/status")
    .then((response) => {
      if (response.ok) {
        return true;
      }
      return false;
    })
    .catch(() => false);
}
