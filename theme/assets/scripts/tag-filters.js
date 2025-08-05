const tagFilters = document.getElementById('tagFilters')

if(tagFilters) {
  for(const tagFilter of tagFilters.querySelectorAll('.tagFilter'))
  {
    tagFilter.addEventListener('click', filterPostsByTag(tagFilter.dataset.value))
  }

  const posts = document.querySelectorAll('.post-item--brief')
  function filterPostsByTag(tag)
  {
    return () => {
      for(const post of posts)
      {
        if(tag == 'reset' || post.dataset.tags.split(' ').includes(tag)) {
          post.classList.remove('hidden')
        } else {
          post.classList.add('hidden')
        }
      }
    }
  }
}