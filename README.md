# API Postig

API Postig adalah sebuah API yang digunakan untuk melakukan posting foto, like foto, unlike foto (mirip seperti instagram). API ini dibangun menggunakan bahasa pemrograman JavaScript dengan framework ExpressJS dan database PostgreSQL dengan ORM Prisma.

## Instalasi

1. Clone repository ini
2. Install dependencies dengan menjalankan perintah `npm install`
3. Buat file `.env` dan isi dengan konfigurasi yang dibutuhkan
4. Jalankan perintah `npm start` untuk menjalankan server

## Konfigurasi

Konfigurasi `.env` yang dibutuhkan adalah sebagai berikut:

```
DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database>"

PORT=<port> # contoh: 3000

JWT_SECRET=<value> # contoh: af9feda4afbeb0f2bda10be61cc15f45165bb11
```

Untuk menjalankan konfigurasi `prisma`, jalankan perintah berikut:

```
npx prisma migrate dev --name <nama-migrasi>
```
