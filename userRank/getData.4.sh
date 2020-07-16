cd data

curl https://api.fsky7.com/BiliOBhelper/fetchRankList?range=1-25 > data-quarter-1.csv
curl https://api.fsky7.com/BiliOBhelper/fetchRankList?range=26-50 > data-quarter-2.csv
curl https://api.fsky7.com/BiliOBhelper/fetchRankList?range=51-75 > data-quarter-3.csv
curl https://api.fsky7.com/BiliOBhelper/fetchRankList?range=76-100 > data-quarter-4.csv