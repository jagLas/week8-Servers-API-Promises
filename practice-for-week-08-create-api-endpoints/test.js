const dogs = [
    {
      dogId: 1,
      name: "Fluffy",
      age: 2
    }
];

    const dogIdSearch = 1;
    console.log(dogIdSearch)
    // Your code here
    const dog = dogs.find(({dogId}) => dogId === dogIdSearch);
    console.log(dog)
    if (dog) {
      res.statusCode = 200;
      res.setHeader('content-type', 'application/json');
      return res.end(JSON.stringify(dog));
    } else {
      res.statusCode = 404;
      res.setHeader ('content-type', 'text/plain');
      return res.end('not found');
    }