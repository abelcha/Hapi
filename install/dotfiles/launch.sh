sudo service redis-server start &&
sudo service mongodb start &&
sudo service nginx start &&
sudo service proftpd start && 
pm2 start ../ecosystem.json
