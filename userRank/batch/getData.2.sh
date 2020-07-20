cd ../data

curl https://api.fsky7.com/BiliOBhelper/fetchRankList?range=1-50 > data-half-a.csv
curl https://api.fsky7.com/BiliOBhelper/fetchRankList?range=51-100 > data-half-b.csv
