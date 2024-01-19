// Simulate a request to the server

function wait(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function request<T>(data: T): Promise<T> {
  return wait(700).then(() => data);
}

export const client = {
  get: <T>(data: T) => request(data),
};
