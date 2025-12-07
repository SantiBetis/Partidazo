export const addLoginSession = (usuarioActual) => {

    fetch('/add-login-session', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioActual),
    })
    .then(res => res.json())
    .then(data => {
        if( data.status === 200){
            console.log(data.message);
            console.log(data.result);
        }
        else {
            console.log(data.message);
            console.log(data.result);
        }
    });
};

export const deleteLoginSession = () => {

    fetch('/delete-login-session', {
        method: 'DELETE',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        if( data.status === 200){
            console.log(data.message);
        }
        else {
            console.log(data.message);
        }
    });
}
