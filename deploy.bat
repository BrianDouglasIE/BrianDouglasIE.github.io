git fetch origin
git subtree pull --prefix dist origin gh-pages --squash
git subtree push --prefix dist origin gh-pages
