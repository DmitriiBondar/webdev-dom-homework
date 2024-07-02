export const getTodos = () => {
    return fetch("https://wedev-api.sky.pro/api/v1/dmitrii-bondar/comments", {
        method: "GET",
      })
      .then((promis) => {
        if (promis.status === 200) {
          return promis.json();
        } else {
          throw new Error("Сервер упал");
        }
      })
}

export const postTodo = ({ name, text, forceError, startTime }) => {
    return fetch("https://wedev-api.sky.pro/api/v1/dmitrii-bondar/comments", {
        method: "POST",
        body: JSON.stringify({
            name: name,
            text: text,
            forceError: forceError,
        }),
    })
    .then((response) => {
        console.log('Прошло времени: ' + (Date.now() - startTime));
        return response
    })
    .then((response) => {
        console.log(response);
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