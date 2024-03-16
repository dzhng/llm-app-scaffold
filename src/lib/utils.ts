import { ReadonlyURLSearchParams } from 'next/navigation';
import kyImpl from 'ky';
import pThrottle from 'p-throttle';

const noop = () => undefined;

/**
 * Throttles HTTP requests made by a ky instance. Very useful for enforcing rate limits.
 */
export function throttleKy(ky: typeof kyImpl, throttleFn: ReturnType<typeof pThrottle>) {
  return ky.extend({
    hooks: {
      beforeRequest: [throttleFn(noop)],
    },
  });
}

/**
 * takes an object as input and recursively filters out null, undefined, and empty arrays in its properties.
 */
export function filterObject(
  obj: object,
  filterKeys?: string[],
): {
  [key: string]: unknown;
} {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      if (value === null || value === undefined || filterKeys?.includes(key)) {
        return acc;
      }

      if (Array.isArray(value)) {
        const filteredArray = value.filter(item => {
          if (item === null || item === undefined) {
            return false;
          }

          if (Array.isArray(item)) {
            return item.length > 0;
          }

          if (typeof item === 'object') {
            return Object.keys(item).length > 0;
          }

          return true;
        });

        if (filteredArray.length > 0) {
          acc[key] = filteredArray.map(item =>
            typeof item === 'object' ? filterObject(item, filterKeys) : item,
          );
        }
      } else if (typeof value === 'object') {
        const filteredObject = filterObject(value, filterKeys);

        if (Object.keys(filteredObject).length > 0) {
          acc[key] = filteredObject;
        }
      } else {
        acc[key] = value;
      }

      return acc;
    },
    {} as { [key: string]: unknown },
  );
}

export const isHtml = (content: string): boolean => {
  const regex = /<\/?[a-z][\s\S]*>/i;
  return regex.test(content);
};

export const createQueryString = (
  searchParams: ReadonlyURLSearchParams | null,
  newParams: Array<{ name: string; value: string }>,
) => {
  // TODO URLSearchParams does not accepts ReadonlyURLSearchParams type, but it works
  // See: https://nextjs.org/docs/app/api-reference/functions/use-search-params
  // When searchParams, URLSearchParams constructor will create a queryparam ?null=, so we need to use undefined
  const params = new URLSearchParams((searchParams || undefined) as any);
  for (const newParam of newParams) {
    if (newParam.value) {
      params.set(newParam.name, newParam.value);
    } else {
      params.delete(newParam.name);
    }
  }

  return params.toString();
};

export async function asyncDelay(delay: number) {
  await new Promise(res => {
    setTimeout(() => {
      res(true);
    }, delay);
  });
}
