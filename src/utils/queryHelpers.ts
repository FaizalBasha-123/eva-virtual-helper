
export const updateURLWithCity = (city: string) => {
  const url = new URL(window.location.href);
  
  // Set the city parameter
  url.searchParams.set('city', city);
  
  // Update the URL without reloading the page
  window.history.pushState({ path: url.href }, '', url.href);
};

export const getCityFromURL = (): string | null => {
  const url = new URL(window.location.href);
  return url.searchParams.get('city');
};
