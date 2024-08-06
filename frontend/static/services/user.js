

export function fetchAndStoreActiveUser() {
    return fetch('/api/getUser', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if(!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(users => {
        const activeUsers = users.find(user => user.online === 1);
        if(activeUsers > 0) {
            localStorage.setItem('activeUsers', JSON.stringify(activeUsers));
            console.log('Active users stored', activeUsers)
        } else {
            console.log('No active users')
        }
    })
    .catch(error => {
        console.log('There was a problem fetching users:', error)
    })
}