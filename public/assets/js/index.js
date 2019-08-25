
function renderArticles(articles) {
  const articlesHtml = articles.map(buildArticle);
  $('#articles').html(articlesHtml);
  
  $(".comment-form").on('submit', function(e) {
    e.preventDefault();

    const articleId = $(this).data('article-id');
    const comment = {
      text: $(this).find('input').val(),
    };
     $.ajax({
       url: `/api/articles/${articleId}/comments`,
       type: 'POST',
       dataType: 'json',
       data: JSON.stringify(comment),
       contentType: 'application/json',
       success: (data) => {
         $(`#article_${articleId}`)
          .find('.comments_list')
          .append(buildComment(data));
       },
       error: (request, error) => {
         alert("Request: " + JSON.stringify(request));
       }
     });

    return false;
  })
}

function buildArticle(article) {
  return `
    <div class="article" id="article_${article._id}">
      <h2><a href="${article.url}">${article.title}</a></h2>
      <p>${article.summary}</p>

      <div class="comments">
        <h3>Comments:</h3>
        <div class="comments_list">
          ${article.comments.map(buildComment).join('')}
        </div>

        <form id="comment_article_${article._id}" class="comment-form" data-article-id="${article._id}">
          <input type="text" placeholder="Leave a comment">
          <input type="submit" value="Submit" />
        </form>
      <div>
    </div>
    <hr>
  `;
}

function buildComment(comment) {
  return `<div class="comment"><div class="createdAt">${comment.createdAt}:</div>${comment.text}</div>`;
}

 $.ajax({
   url: '/api/articles',
   type: 'GET',
   success: (data) => {
      renderArticles(data);
   },
   error: (request, error) => {
     alert("Request: " + JSON.stringify(request));
   }
 });