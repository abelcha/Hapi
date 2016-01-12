sudo apt-get update
sudo apt-get install -y emacs-nox curl wget git zsh  golang nginx redis-server scp pdftk htop proftpd ffmpeg

#config
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

#mongo install
echo "install mongo"

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install mongodb-org
mongo --version

#node install
echo "install npm && node"
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v

#npm packages
sudo npm install -g gulp n nodemon pm2 prok

#rsub
sudo wget -O /usr/local/bin/rsub https://raw.github.com/aurora/rmate/master/rmate
sudo chmod a+x /usr/local/bin/rsub