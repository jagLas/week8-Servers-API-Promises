export function getAllDogs() {
    // Your code here
    return fetch('/dogs')
}

export function getDogNumberTwo() {
    // Your code here
    return fetch('/dogs/2')
}

export function postNewDog() {
    // Your code here
    const textBody = new URLSearchParams([['name', 'telemcus'], ['age', 4]])
    return fetch('/dogs', {
        'headers': {'Content-type': 'application/x-www-form-urlencoded'},
        'method': 'POST',
        'body': textBody
    })
}

export function postNewDogV2(name, age) {
     // Your code here
}

export function deleteDog(id) {
      // Your code here
}