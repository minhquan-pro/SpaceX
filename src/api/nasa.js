import axios from 'axios';

// NASA Image and Video Library — no key required
export const searchNASAImages = (query, page = 1, pageSize = 24) =>
  axios.get('https://images-api.nasa.gov/search', {
    params: { q: query, media_type: 'image', page, page_size: pageSize },
  });

// NASA EPIC — no key required
export const getEPICImages = (date = '2024-01-04') =>
  axios.get(`https://epic.gsfc.nasa.gov/api/natural/date/${date}`);

export const getEPICDates = () =>
  axios.get('https://epic.gsfc.nasa.gov/api/natural/all');

// Launch Library 2 — no key required
export const getUpcomingLaunches = (limit = 20) =>
  axios.get('https://ll.thespacedevs.com/2.2.0/launch/upcoming/', {
    params: { limit, format: 'json' },
  });

export const getPastLaunches = (limit = 20) =>
  axios.get('https://ll.thespacedevs.com/2.2.0/launch/previous/', {
    params: { limit, format: 'json', ordering: '-net' },
  });
