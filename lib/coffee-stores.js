import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (latlong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latlong}&limit=${limit}`;
};

const getListOfCoffeeStoresPhotos = async () => {
  const photos = await unsplash.search.getPhotos({
    query: 'coffee shop',
    page: 1,
    perPage: 30,
  });
  const unsplashResults = photos.response.results;

  return unsplashResults.map((result) => result.urls['small']);

  // console.log({ unsplashResults });
};

export const fetchCoffeeStores = async () => {
  const photos = await getListOfCoffeeStoresPhotos();

  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: process.env.FOURSQUARE_API_KEY,
    },
  };

  const response = await fetch(
    getUrlForCoffeeStores(
      '41.980321531178916%2C-88.02858108854798',
      'coffee',
      6
    ),
    options
  );
  const data = await response.json();
  return data.results.map((result, idx) => {
     const neighborhood = result.location.neighborhood;
     return {
       id: result.fsq_id,
       address: result.location.address,
       name: result.name,
       neighbourhood: neighborhood?.length > 0 ? neighborhood[0] : '',
       imgUrl: photos.length > 0 ? photos[idx] : null,
     };
  });
};
