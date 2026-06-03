import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  q: parseAsString,
  status: parseAsString,
  categories: parseAsString,
  property_type: parseAsString,
  search: parseAsString,
  location: parseAsString,
  agent: parseAsString,
  listType: parseAsString,
  minPrice: parseAsString,
  max: parseAsString,
  name: parseAsString,
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
