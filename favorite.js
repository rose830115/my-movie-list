const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

//呼叫API建立電影清單陣列，並渲染至首頁
const movies = JSON.parse(localStorage.getItem('favoriteMovies'))
const dataPanel = document.querySelector('#data-panel')

function renderMovieList(data) {
  let rawHTML = ''
  //建立模板
  data.forEach((item) => {
    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer text-muted">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

renderMovieList(movies)
 
//More btn 功能
function showMovieModal(id) {
  const movieTitle = document.querySelector('#movie-modal-title')
  const movieImage = document.querySelector('#movie-modal-image')
  const movieDate = document.querySelector('#movie-modal-date')
  const movieDescription = document.querySelector('#movie-modal-description')

  axios
    .get(INDEX_URL + id)
    .then((response) => {
      const data = response.data.results
      movieTitle.innerText = data.title
      movieImage.innerHTML = `<img
                src="${POSTER_URL + data.image}"
                alt="Movie Poster" class="img-fluid">
      `
      movieDate.innerText = 'Release date: ' + data.release_date
      movieDescription.innerText = data.description
    })
}

//X btn功能
function removeFavorite(id){
  if (!movies) return

  const movieInedx = movies.findIndex((movie) => movie.id === id)
  if (movieInedx === -1) return

  movies.splice(movieInedx, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    //點擊more按鈕，傳入該電影資料
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    //點擊+按鈕，加入最愛清單
    removeFavorite(Number(event.target.dataset.id))
  }
})
