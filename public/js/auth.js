const miFormulario = document.querySelector('form');


miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    for (let element of miFormulario.elements) {
        if (element.name.length > 0)
            formData[element.name] = element.value
    }
    console.log(formData);
    fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(resp => resp.json())
        .then(({ token, msg, errors }) => {
            if (msg) {
                return console.error(msg);
            }
            if (errors) {
                return console.error(errors);
            }
            else {

                localStorage.setItem('token', token);
                console.log(`Impresion de token en js/auth.js:${token}`);
                window.location = 'chat.html';
            }

        })
        .catch(err => {
            console.log(err);
        })

});


