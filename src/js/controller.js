import * as modal from './modal.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addrecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    resultsView.update(modal.getSearchResultsPage());

    bookmarksView.update(modal.state.bookmarks);
    // 1) Loading
    await modal.loadRecipe(id);

    // 2) Reandering
    recipeView.render(modal.state.recipe);
  } catch (err) {
    alert(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1 Get search query
    const query = searchView.getQuery();
    if (!query) return;
    // 2 Load search results
    await modal.loadSearchResults(query);
    // 3 render results
    resultsView.render(modal.getSearchResultsPage());

    paginationView.render(modal.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(modal.getSearchResultsPage(goToPage));

  paginationView.render(modal.state.search);
};

const controlServings = function (newServings) {
  modal.uptadeServings(newServings);
  recipeView.update(modal.state.recipe);
};

const controlAddBookmark = function () {
  if (!modal.state.recipe.bookmarked) modal.addBookmark(modal.state.recipe);
  else modal.deleteBookmark(modal.state.recipe.id);
  recipeView.update(modal.state.recipe);
  bookmarksView.render(modal.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(modal.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await modal.uploadRecipe(newRecipe);
    recipeView.render(modal.state.recipe);
    addRecipeView.renderMessage();
    bookmarksView.render(modal.state.bookmarks);

    window.history.pushState(null, '', `#${modal.state.recipe.id}`);
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHendlerRender(controlRecipes);
  recipeView.addHendlerUpdateServings(controlServings);
  recipeView.addHendlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerclick(controlPagination);
  addRecipeView.addHendlerUpload(controlAddRecipe);
};
init();
