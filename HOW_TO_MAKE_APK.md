# 📱 How to Get Your APK (Super Simple Guide)

Hey! Since you're new to this, the easiest way to get your app onto your phone is using **GitHub**. No need to install complex software on your computer!

## Method 1: The "Noob-Friendly" Way (GitHub)

1. **Upload your code to GitHub**: If you haven't already, push this project to a GitHub repository.
2. **Wait a few minutes**: Every time you save (push) your code, GitHub will automatically start building your app in the background.
3. **Download the APK**:
    - Go to your repository on GitHub.com.
    - Click on the **"Actions"** tab at the top.
    - Click on the latest run named **"Build Android APK"**.
    - Scroll down to the bottom to the **"Artifacts"** section.
    - Click on **`app-debug`** to download your APK!
    - Send that file to your phone and install it!

---

## Method 2: The "Expert" Way (Local Build)

If you want to build it on your own computer, you'll need **Android Studio** installed.

1. **Open your terminal** in the `TearApp` folder.
2. **Run these commands one by one**:
   ```powershell
   npm install
   npm run build
   npx cap add android
   npx cap sync
   npx cap open android
   ```
3. **Android Studio will open**:
   - Wait for it to finish "syncing" (look at the bottom bar).
   - Click **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)** at the top.
   - A little pop-up will appear when it's done—click **"locate"** to find your APK!

---

### Need Help?
Just ask! I've already set everything up so GitHub does the hard work for you.
