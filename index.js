const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

//呼叫API建立電影清單陣列，並渲染至首頁且分頁
const movies = []
let filterMovies = []
const dataPanel = document.querySelector('#data-panel')
const paginator = document.querySelector('#paginator')
const MOVIES_PER_PAGE = 12

//切割電影清單陣列做分頁
function renderPaginator(amount){
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  
  paginator.innerHTML = rawHTML
} 

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
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

function getMoviesByPage(page) {
  const data = filterMovies.length ? filterMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(1))
  })

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
//+ btn 功能
function addToFavorite(id) {
   const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
   const movie = movies.find((movie) => movie.id === id)
   if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
   }
   list.push(movie)
   localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    //點擊more按鈕，傳入該電影資料
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    //點擊+按鈕，加入最愛清單
    addToFavorite(Number(event.target.dataset.id))
  }
})

//換頁功能
paginator.addEventListener('click', function onPaginatorClick(event) {
  if (event.target.tagName !== 'A') return

  const page = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(page))
})

//搜尋功能
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

searchForm.addEventListener('submit', function onSearchFormSubmit(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  filterMovies = movies.filter((movie) => 
    movie.title.toLowerCase().includes(keyword)
  )  

  if (filterMovies.length === 0){
    return alert('Cannot find movies with keyword: ' + keyword)
  }
  renderPaginator(filterMovies.length)
  renderMovieList(getMoviesByPage(1))
})