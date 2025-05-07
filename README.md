
# 📦 Final Project Cloud Computing – Bagian Praktik

## 🔧 Tujuan Praktikum
Melatih pemahaman peserta terhadap konsep **containerization**, **orchestrasi sederhana dengan Docker Compose**, serta kolaborasi antara service backend dan frontend dalam satu sistem.

---

## 📝 Instruksi

Anda diberikan sebuah struktur project sederhana yang terdiri dari dua folder utama:

```
project-root/
├── docker-compose.yml
├── backend/
│   └── Dockerfile
├── frontend/
    └── Dockerfile
```

File `docker-compose.yml` belum lengkap. Anda diminta untuk:

### ✅ Ketentuan Service Backend:
- Build image dari direktori `./backend`
- Gunakan nama container `backend`
- Ekspose ke port **8080**
- Masukkan ke dalam satu jaringan khusus yang juga digunakan oleh frontend

### ✅ Ketentuan Service Frontend:
- Build image dari direktori `./frontend`
- Gunakan nama container `frontend`
- Ekspose ke port **5173**
- Pastikan frontend **menunggu backend aktif lebih dulu** sebelum running (`depends_on`)
- Set environment variable `VITE_BACKEND_URL=http://localhost:8080`
- Masukkan ke dalam jaringan yang sama dengan backend

### ✅ Tambahan:
- Buat jaringan bernama `seo-analyzer-network` di bagian paling bawah `docker-compose.yml`

---

## 📤 Langkah Upload

Setelah berhasil:

1. Pastikan kedua service bisa berjalan dan saling terhubung di `localhost` menggunakan perintah:
   ```bash
   docker-compose up --build
   ```
2. Upload seluruh project ke repository GitHub Anda.

  **(Opsional nilai tambah)**

3. Sertakan file `README.md` berisi:
   - Deskripsi singkat project
   - Screenshot hasil running frontend yang berjalan dan berhasil fetch service backend

4. Push image backend dan frontend Anda ke Docker Hub
   - Sertakan nama image dan tag pada README.md Anda
   - Contoh:
     ```
     Backend Image: sajidan/backend-finalgdgoccloud:latest
     Frontend Image: sajidan/frontend-finalgdgoccloud:latest
     ```

---

## 🔗 Source Tutorial
- Docker Compose: [TUTORIAL DOCKER COMPOSE (BAHASA INDONESIA)](https://www.youtube.com/watch?v=3nFbRd4FnRo) - [How Compose works | Docker Docs](https://docs.docker.com/compose/)
- Push Docker Image to DockerHub: [How to Push and Pull a Docker Image from Docker Hub](https://www.digitalocean.com/community/tutorials/how-to-push-and-pull-docker-images)

---

## 🧪 Penilaian

| Aspek | Bobot |
|-------|--------|
| docker-compose.yml berjalan tanpa error | 30% |
| Backend dan frontend bisa berkomunikasi | 30% |
| Repository GitHub lengkap (README, struktur, screenshot) | 25% |
| Upload ke DockerHub (nilai tambah) | +15% |

---

## 🛠️ Tips Debugging
- Cek log container dengan `docker-compose logs`
- Gunakan `docker exec -it <container_name> sh` untuk masuk ke container (atau bisa cek langsung ke docker desktop jika menggunakannya)
- Pastikan tidak ada port yang konflik di sistem Anda
