
window.onload = function () {
    document.getElementById("button").addEventListener('click', function () {
        document.getElementById('stuff').innerHTML += "hello"
        console.log('hello')
        fetch(`/api/register`).then(response => response.json()).then(message => {

        })
    })
}