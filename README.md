# project-k
Introduction:
 - project-k was the arbitage trading  bot, it was developed in secret to protect the source code in case it success. Afterall the great test was fail so it will be publish from now on
 - this project also droped for couble months so its dependence resouce might outdated right at the moment it pushed to github! Careful if you plan to reuse it!
 
 Tutorial:
  - create your binance api-key on https://www.binance.com/en/my/settings/api-management , edit API restriction, enable Spot&Margin Trading, enable withdrawals, enable Permit Universal Transfer.
  - import your binance api-key to /socket-io/request.py line 31,37
  - create your By-bit api-key on https://www.bybit.com/app/user/api-management , give it permision: Spot-Trade; Wallet-Subaccount Transfer; Account Transfer withdraw; Exchange-Exchange History
  - import your By-bit api-key & secret to /socket-io/bybit-wallet-socket.py line 46,47
  
  - run below files sequencely: /socket-io/binance-wallet-socket.py, /socket-io/bybit-wallet-socket.py, /socket-io/binance-socket.py, /socket-io/bybit-socket.py, /statistics-web/index.js
  
 Note:
  - all my API in the source was disabled, dont waste your time!
  - recomend using https://pm2.keymetrics.io/ console to run the source for perfomance and stablity
