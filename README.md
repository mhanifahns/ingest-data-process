# GOOGLE PLAY CLIENT API
Merupakan API dan service yang mengambil data dari Google Analytics (console.firebase.google.com) dan Google Cloud Storage (cloud.google.com). Data yang diperoleh kemudian disimpan dalam Elasticsearch untuk ditampilkan di Dashboard Angelica. 

## Instalasi
- Clone aplikasi dari repository
- Copy file config/sample.database.js ke config/database.js. Sesuaikan dengan konfigurasi server database yang digunakan.
- Copy file config/sample.main.js ke config/main.js. Sesuaikan dengan konfigurasi server database yang digunakan.
- Install package dependency dengan menjalankan perintah
```
npm install
```
## Menjalankan Web Server
Untuk menjalankan web server jalankan command berikut
```
npm run webserver
```
Web server secara default akan dijalankan dalam cluster mode.

## Indexing Daily Active User
Untuk melakukan indexing data Daily Active User secara manual maka dapat menjalankan perintah
```
FILE=[sample-report.csv] node active-user.js
```

## Indexing Annual Accessed feature
Untuk melakukan indexing data Annual Accessed feature secara manual maka dapat menjalankan perintah
```
FILE=[sample-report.csv] node event-accessed-features.js
```

## Indexing install feature
Untuk melakukan indexing data Install secara manual maka dapat menjalankan perintah
```
FILE=[sample-report.csv] node install-googleplay.js
```

## Indexing Uninstall feature
Untuk melakukan indexing data Uninstall secara manual maka dapat menjalankan perintah
```
FILE=[sample-report.csv] node uninstall-googleplay.js
```

## Indexing Crash feature
Untuk melakukan indexing data Crash secara manual maka dapat menjalankan perintah
```
FILE=[sample-report.csv] node crash-googleplay.js
```


## Indexing device Active feature
Untuk melakukan indexing data Device Active secara manual maka dapat menjalankan perintah
```
FILE=[sample-report.csv] node device-active.js
```

## API Doc
Dokumentasi api dapat diakses pada http://[APPHOST]/v1/docs
