const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'insomnia/11.0.0',
  },
  body: new URLSearchParams({ name: 'tablet', price: '56' }),
};

for (let j = 0; j < 50; j++) {
  setTimeout(() => {
    for (let i = 0; i < 10000; i++) {
      fetch('http://localhost:3000/api/products', options)
        .then((response) => response.json())
        .then((response) => console.log(response))
        .catch((err) => console.error(err));
    }
  }, 10000);
}
