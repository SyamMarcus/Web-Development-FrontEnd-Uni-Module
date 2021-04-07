export function status(response) {

  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    return new Promise((resolve, reject) => {
      console.log("status err")
      return reject(response);
    });
  }
}

export function json(response) {
  return response.json();
}