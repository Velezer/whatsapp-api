const contact = {
    number: `814218312`,
    isBla: true,
    id: { client: `113213212` },
}

console.log(contact)
const keys = Object.keys(contact)
keys.forEach(key => {
    if (key !== `number`) {
        delete contact[key]
    }
});




console.log(contact)