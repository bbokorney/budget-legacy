#!/bin/sh -e

publish_dir='../bbokorney.github.io'

( cd $publish_dir

# ensure there are no changes
output=$(git status --porcelain)
if ! [ -z "$output" ]; then
  echo 'Uncommitted changes'
  exit 1
fi

git checkout master

rm -rf ./*

)

npm run build

cp -R ./build/* $publish_dir/

( cd $publish_dir

echo 'Files modified...'
git add .
git status
git commit -m 'Update site'
git push
)

