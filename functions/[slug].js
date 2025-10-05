// functions/[slug].js

// --- DAFTAR TARGET URL ---
// KUNCI: adalah angka (slug) yang diakses di URL (misalnya '001' untuk /001)
// NILAI: adalah URL tujuan akhir untuk pengalihan.
const TARGET_MAP = {
    // URL untuk gen.hurw.xyz/001
    '001': 'https://target-url-untuk-001.com/redirect?data=A',
    
    // URL untuk gen.hurw.xyz/002
    '002': 'https://target-url-untuk-002.com/promo?data=B',

    // Tambahkan halaman baru di sini:
    // '003': 'https://target-url-untuk-003.com/new',
};
// -------------------------

const DELAY_SECONDS = 3; // Durasi penundaan (detik) sebelum pengalihan otomatis
const INTERMEDIATE_PAGE_TITLE = 'Loading Your Content...';
const INTERMEDIATE_PAGE_MESSAGE = 'You will be redirected shortly. If it is not automatic, please click the button below.';
const BUTTON_TEXT = 'Continue';

export async function onRequest(context) {
    // 1. Ambil parameter dynamic 'slug' dari URL (misalnya '001')
    const slug = context.params.slug;

    // 2. Cari target URL berdasarkan slug
    const BASE_TARGET_URL = TARGET_MAP[slug];

    // Penanganan 404 jika slug tidak terdaftar di TARGET_MAP
    if (!BASE_TARGET_URL) {
        return new Response('404 Not Found: Target URL for this page is not configured.', { 
            status: 404,
            headers: { 'Content-Type': 'text/plain' }
        });
    }

    const requestUrl = new URL(context.request.url);
    
    // 3. Gabungkan parameter query (seperti ?param=value) dari request ke Target URL
    const targetUrlWithParams = new URL(BASE_TARGET_URL);
    requestUrl.searchParams.forEach((value, key) => {
        targetUrlWithParams.searchParams.append(key, value);
    });

    // 4. Buat halaman HTML dengan meta refresh ke URL target
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${INTERMEDIATE_PAGE_TITLE} - ${slug}</title>
          <meta http-equiv="refresh" content="${DELAY_SECONDS};url=${targetUrlWithParams.toString()}">
          <style>
            /* CSS Anda */
            body { font-family: sans-serif; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background-color: #f0f2f5; color: #333; text-align: center; padding: 20px; box-sizing: border-box; }
            .container { background-color: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); max-width: 500px; width: 100%; }
            h1 { color: #007bff; margin-bottom: 20px; font-size: 2em; }
            p { font-size: 1.1em; line-height: 1.6; margin-bottom: 30px; }
            .button { background-color: #28a745; color: white; padding: 14px 28px; border: none; border-radius: 8px; text-decoration: none; font-size: 1.1em; cursor: pointer; transition: background-color 0.3s ease, transform 0.2s ease; display: inline-block; }
            .button:hover { background-color: #218838; transform: translateY(-2px); }
            .loading-spinner { border: 4px solid rgba(0, 0, 0, 0.1); border-top: 4px solid #007bff; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="loading-spinner"></div>
            <h1>${INTERMEDIATE_PAGE_TITLE}</h1>
            <p>${INTERMEDIATE_PAGE_MESSAGE}</p>
            <a href="${targetUrlWithParams.toString()}" class="button">${BUTTON_TEXT}</a>
          </div>
        </body>
        </html>
    `;

    // 5. Kirim respon HTML
    return new Response(htmlContent, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
        status: 200
    });
}
