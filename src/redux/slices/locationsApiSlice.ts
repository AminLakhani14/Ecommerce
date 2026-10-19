import { apiSlice } from './apiSlice';
// CountriesNow (https://countriesnow.space) is a free, open-source geo API. Its POST endpoints now
// 301-redirect to these GET "/q" variants, so call them directly.
const base = 'https://countriesnow.space/api/v0.1/countries';
interface Envelope<T> { error: boolean; msg: string; data: T }
export interface Country { name: string; iso2: string; iso3: string; flag: string }
const unwrap = <T,>(response: Envelope<T>) => { if (response.error) throw new Error(response.msg); return response.data; };
const names = (values: string[]) => [...new Set(values.filter(Boolean))].sort((a,b) => a.localeCompare(b));
const request = (path: string, params: Record<string, string>) => ({ url: `${base}${path}`, params, credentials: 'omit' as const, timeout: 15000 });
export const locationsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCountry: builder.query<Country, string>({
      query: iso2 => request('/flag/images/q', { iso2 }),
      transformResponse: (response: Envelope<Country>) => unwrap(response), keepUnusedDataFor: 86400,
    }),
    getStates: builder.query<string[], string>({
      query: country => request('/states/q', { country }),
      transformResponse: (response: Envelope<{states:Array<{name:string}>}>) => names(unwrap(response).states.map(state => state.name)),
      keepUnusedDataFor: 86400,
    }),
    getStateCities: builder.query<string[], {country:string;state:string}>({
      query: ({country,state}) => request('/state/cities/q', { country, state }),
      transformResponse: (response: Envelope<string[]>) => names(unwrap(response)), keepUnusedDataFor: 3600,
    }),
    getCities: builder.query<string[], string>({
      query: country => request('/cities/q', { country }),
      transformResponse: (response: Envelope<string[]>) => names(unwrap(response)), keepUnusedDataFor: 3600,
    }),
  }),
});
export const { useGetCountryQuery, useGetStatesQuery, useGetStateCitiesQuery, useGetCitiesQuery } = locationsApiSlice;
