const dogs = [
    {
      dogId: 1,
      name: "Fluffy",
      age: 2
    }
];

console.log(dogs.findIndex(({dogId}) => dogId == 3))