# 🏠 Neo Design Studio – Rəsmi Vebsayt

**Neo Design Studio** – interyer və eksteryer dizayn sahəsində ixtisaslaşmış bir şirkətin rəsmi vebsaytıdır. Bu layihə, **Next.js**, **Express.js (Node.js)** və **MongoDB** texnologiyalarından istifadə edilərək hazırlanmış tam funksional bir **fullstack veb tətbiqidir**.

🔗 [neodesignstudio.az](https://neodesignstudio.az)

## 🚀 Texnologiyalar

- **Frontend:** [Next.js](https://nextjs.org/)
- **Backend:** [Express.js (Node.js)](https://expressjs.com/)
- **Verilənlər Bazası:** [MongoDB](https://www.mongodb.com/)
- **Deployment:** Contabo server (NGINX ilə həm frontend, həm də backend yayımı)
- **Autentifikasiya:** [JWT (JSON Web Tokens)](https://jwt.io/)
- **Dil Dəstəyi:** Azərbaycan, Rus və İngilis dilləri

## 🔐 Əsas Xüsusiyyətlər

- **Admin Panel:**

  - JWT ilə qorunan giriş sistemi
  - Yeni layihələrin əlavə edilməsi
  - Mövcud layihələrin redaktəsi və silinməsi

- **Çoxdilli Dəstək:**

  - Sayt tam şəkildə Azərbaycan, Rus və İngilis dillərini dəstəkləyir

- **Əlaqə Sistemi:**
  - İstifadəçi mesajları contact form vasitəsilə backend-ə ötürülür

## 🛠️ Quraşdırma və İstifadə

### Əvvəlcədən:

- [Node.js](https://nodejs.org/) və [npm](https://www.npmjs.com/) quraşdırılmalıdır
- [MongoDB](https://www.mongodb.com/) verilənlər bazası aktiv olmalıdır

### 1. Repository-nin klonlanması:

```bash
git clone https://github.com/AliAgayevv/NeoDesignStudio.git
cd NeoDesignStudio
```

### 2. Ətraf mühit dəyişənlərinin təyin edilməsi:

`.env` faylını yaradın və aşağıdakı dəyişənləri əlavə edin:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 3. Backend-in işə salınması:

```bash
cd backend
npm install
npm start
```

### 4. Frontend-in işə salınması:

```bash
cd frontend
npm install
npm run dev
```

Frontend tətbiqi `http://localhost:3000` ünvanında əlçatan olacaq.

## 📦 Deployment

- **Server:** Həm frontend, həm də backend Contabo VPS üzərində host edilir.
- **NGINX:** Reverse proxy olaraq istifadə edilir, domain və port yönləndirmələri üçün konfiqurasiya edilib.
- **Alternativ:** Frontend tətbiqi Vercel üzərində yayımlana biləcək şəkildə qurulub.

## 🧪 Təhlükəsizlik

- **Autentifikasiya:** JWT əsasında qorunan giriş sistemi
- **Admin Panel:** Yalnız avtorizə olunmuş adminlər üçün aktivdir
