import { QueryClient } from "@tanstack/query-core";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
})

// Fetch Coordinates for a City Using Open-Meteo Geocoding API
export async function fetchCoordinates(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

  try {
    const res = await queryClient.fetchQuery({
      queryKey: ['fetchCoordinates', city], queryFn:
        async ({ signal }) => {
          return fetch(url, { signal })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to fetch coordinates.");
              }
              return response.json();
            })
            .then((data) => {
              if (data.results && data.results.length > 0) {
                return {
                  lat: data.results[0].latitude,
                  lon: data.results[0].longitude,
                };
              } else {
                throw new Error("City not found.");
              }
            });
        }
    })
    return res;
  } catch (e) {
    const isCancelledError = error && error.constructor.name === 'CancelledError'
    !isCancelledError && console.error(e)
  }
}

// Fetch Data from Open-Meteo API
export async function fetchWeatherData(args) {
  // TODO: verify with zod
  const searchParams = new URLSearchParams(args);
  searchParams.append('timezone', 'auto');
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.search = searchParams.toString();

  try {
    const res = await queryClient.fetchQuery({
      queryKey: ['fetchWeatherData', args], queryFn:
        async ({ signal }) => {
          return fetch(url, { signal }).then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          });
        }
    })
    return res;
  } catch (e) {
    const isCancelledError = error && error.constructor.name === 'CancelledError'
    !isCancelledError && console.error(e)
  }
}
