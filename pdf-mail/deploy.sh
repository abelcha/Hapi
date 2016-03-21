emacs -nw package.json &&
npm publish && 
git push origin master &&
cd ../edsx &&
npm install edsx-mail --save &&
git add -A &&
git commit -m "deploy" &&
git push production master &&
git push stage master &&
git push origin master
