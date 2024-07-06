const host = "https://wedev-api.sky.pro/api/v2/dmitrii-bondar/comments"
const userUrl = "https://wedev-api.sky.pro/api/user/login"

export let token

export const setToken = (newToken) => {
    token = newToken
}

export const userLogin = ({ login, password }) => {
    return fetch (userUrl, {
        method: "POST",
        body: JSON.stringify({ 
            login, 
            password,
        }),
    }).then((promis) => {
        if (promis.status === 400) {
            throw new Error("Неверный логин или пароль");
        }
        return promis.json()
    })
}

export const getTodos = () => {
    return fetch(host, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    .then((promis) => {
        if (promis.status === 401) {
            throw new Error("Введите верный пароль");
        }
        return promis.json()
    })
}

export const postTodo = ({ name, text, forceError, startTime }) => {
    return fetch(host, {
        method: "POST",
        body: JSON.stringify({
            name: name,
            text: text,
            forceError: forceError,
        }),
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then((response) => {
        console.log('Прошло времени: ' + (Date.now() - startTime));
        return response
    })
    .then((response) => {
        if (response.status === 201) {
            return response.json();
        } else if (response.status === 400) {
            alert(`Server error ${response.status}\n\nВведите не менее 3-х символов.`);
            throw new Error("Сервер упал 400");
        } else if (response.status === 500) {
            alert(`Server error ${response.status}`);
            post();
            throw new Error("Сервер упал 500");
        }
    })
    .then((response) => {
        console.log('Прошло времени: ' + (Date.now() - startTime));
        return response
    })
}

