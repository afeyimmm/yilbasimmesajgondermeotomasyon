# WhatsApp Yılbaşı Otomasyon

Node.js ile WhatsApp Web üzerinden mesaj gönderebileceğiniz, test modlu, log tutan ve 31 Aralık 00:00’da otomatik mesaj atan bir otomasyon sistemi.

---

## ⚡ Özellikler

- Test modu: Mesaj sadece sana gider ve onay sonrası toplu gönderim yapılır.
- Normal test: Mesaj hemen tüm kontaklara gönderilir.
- Yılbaşı modu: 31 Aralık 00:00’da mesaj gönderimi otomatik yapılır.
- Başarılı ve başarısız gönderimler loglanır (`success.log` ve `fail.log`).
- Menü döngüsü: Gönderim bitince ana menüye geri döner.
- Renkli terminal çıktısı (chalk).

---

## 📦 Gereken Paketler

Projenin MANUEL çalışması için terminalde aşağıdaki paketleri yükleyin:

```bash
npm install whatsapp-web.js qrcode-terminal chalk@4
