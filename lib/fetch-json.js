export class FetchError extends Error {
  response;
  data;
  constructor({ message, response, data }) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchError);
    }

    this.name = "FetchError";
    this.response = response;
    this.data = data ?? { message: message };
  }
}

export async function post(url, body) {
  return fetchJson(url, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function put(url, body) {
  return fetchJson(url, {
    method: "PUT",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function fetchJson(input, init) {
  const response = await fetch(input, init);

  const data = await response.json();
  if (response.ok) {
    return data;
  }

  throw new FetchError({
    message: response.statusText,
    response,
    data,
  });
}

export function trapError(error) {
  console.error(error);
  return;
}
