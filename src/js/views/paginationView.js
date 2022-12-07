import View from './View.js';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerclick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = Number(btn.dataset.goto);
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const numPage = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    if (this._data.page === 1 && numPage > 1) {
      return `
        <button data-goto = "${
          this._data.page + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
              <use href="   ${icons} #icon-arrow-right"></use>
            </svg>
          </button> 
        `;
    }

    if (this._data.page === numPage && numPage > 1) {
      return `
        <button data-goto = "${
          this._data.page - 1
        }" class="btn--inline pagination__btn--prev">
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
              </svg>
              <span>Page ${this._data.page - 1}</span>
            </button>
        `;
    }

    if (this._data.page < numPage) {
      return `

    <button data-goto = "${
      this._data.page - 1
    }" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${this._data.page - 1}</span>
  </button>
    
    <button data-goto = "${
      this._data.page + 1
    }" class="btn--inline pagination__btn--next">
    <span>Page ${this._data.page + 1}</span>
    <svg class="search__icon">
      <use href="   ${icons} #icon-arrow-right"></use>
    </svg>
  </button> `;
    }

    return '';
  }
}

export default new PaginationView();
