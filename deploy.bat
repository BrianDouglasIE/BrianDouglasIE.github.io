git fetch origin
git subtree pull --prefix dist origin gh-pages --allow-unrelated-histories
git subtree push --prefix dist origin gh-pages
