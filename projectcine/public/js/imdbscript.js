const url = 'https://imdb-top-100-movies.p.rapidapi.com/';
const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': 'b94a73b021msh2edfe0473fe14a4p137c31jsn476c480d3538',
        'x-rapidapi-host': 'imdb-top-100-movies.p.rapidapi.com'
    }
};

    /*
    -------------------------------------------------------------------------
      Purpose: Fetches data of IMDB top ranked movies from the external API.
      Parameters: None.
      Postcondition: Maps and displays the JSON objects into movie posters &
      displays title in the top100imdb page.
    -------------------------------------------------------------------------
    */

async function fetchData() {
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);

        const list = result;
        let count = 0;
        list.map(item => {
            const name = item.title;
            const poster = item.image;
            const movie = `<li><img src="${poster}" alt="${name}"><h2>${++count}: ${name}</h2></li>`;
            document.querySelector('.topmovies').innerHTML += movie;
        });
    } catch (error) {
        console.error(error);
    }
}

fetchData();
