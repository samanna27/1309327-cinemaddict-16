export const createPopUpBottomSectionTemplate = (film) => {
  const {commentsIds} = film;

  return  `<div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsIds.length}</span></h3>
      </section>
   </div>`;
};
