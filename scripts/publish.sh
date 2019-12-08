#!/bin/sh -e

publish_dir='../bbokorney.github.io'

npm version patch

current_version=$(jq -r '.version' package.json)

( cd $publish_dir

# ensure there are no changes
output=$(git status --porcelain)
if ! [ -z "$output" ]; then
  echo 'Uncommitted changes'
  exit 1
fi

git checkout master
git pull
if git rev-parse $current_version >/dev/null 2>&1 ; then
  echo "Version $current_version already exists. Increment version before publishing."
  exit 1
fi

rm -rf ./*

)

export REACT_APP_VERSION=$current_version
npm run build

cp -R ./build/* $publish_dir/

( cd $publish_dir

git add .
git status
git commit -m "Update site to version $current_version"
git tag $current_version
git push
git push --tags
)

