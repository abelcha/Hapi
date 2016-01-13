sudo service redis-server start 
sudo service mongod start 
sudo service nginx start 
sudo service proftpd start 
cd ../
pm2 start /ecosystem.json
