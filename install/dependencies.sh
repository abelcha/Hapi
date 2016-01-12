sudo apt-get update
sudo apt-get install emacs23-nox 
sudo apt-get install curl 
sudo apt-get install wget 
sudo apt-get install git 
sudo apt-get install zsh 
sudo apt-get install golang 
sudo apt-get install nginx 
sudo apt-get install redis-server 
sudo apt-get install scp 
sudo apt-get install pdftk 
sudo apt-get install htop 
sudo apt-get install proftpd 
sudo apt-get install ffmpeg

#config
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

#mongo install
echo "install mongo"

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install -y mongodb-org 
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