# PuffvJS 

[![NPM Version](https://img.shields.io/npm/v/puffvjs.svg)](https://www.npmjs.com/package/puffvjs)
[![NPM Downloads](https://img.shields.io/npm/dm/puffvjs.svg)](https://www.npmjs.com/package/puffvjs)
[![gzip size](https://img.shields.io/bundlephobia/minzip/puffvjs?label=gzip)](https://bundlephobia.com/package/puffvjs)
[![min size](https://img.shields.io/bundlephobia/min/puffvjs?label=min)](https://bundlephobia.com/package/puffvjs)

## Apa Itu PuffvJS? 

_PuffvJS Adalah Library JavaScript Yang Menyediakan Visualisasi Data Secara Gratis, Mudah, Dan Kecil. Ukuran File Hanya **18.81kb(Min)**._

## Cara menyertakan library

> File UMD/AMD/CommonJS/ESM — library ini mendefinisikan Puffv di global (UMD) dan juga module.exports untuk CommonJS.



1) Pakai `<script>` (UMD global)
```HTML
<!-- Asumsikan file puffv.js sudah di-serve -->
<script src="puffv.js"></script>
<script>
  const c = new Puffv.Chart("#output", {});
</script>
```
2) CommonJS / Node (require)
```JS
const Puffv = require('puffv'); // atau path lokal
const { Chart } = Puffv;
```
3) ESM / import (jika bundler menyertakan file UMD)
```JS
import Puffv from 'puffv'; // jika bundler/mapping tersedia
const { Chart } = Puffv;
```
> Catatan: implementasi return-nya adalah object { Chart: class }. Jadi ambil Chart dari objek Puffv.


---

## Membuat chart dasar (HTML + JS)
```HTML
<div id="chart" style="width:600px;height:360px;"></div>

<script>
  // misal Puffv sudah ter-include via <script> atau import
  const { Chart } = Puffv;

  const c = new Chart('#chart', {
    type: 'bar',                // 'bar' | 'line' | 'pie' | 'radar'
    data: [10, 20, 15, 30],
    labels: ['A','B','C','D'],
    animation: 'grow',          // 'grow' | 'fade' | 'wave' | 'explode' (tergantung tipe)
    duration: 700,              // ms
    theme: 'sunrise',           // string: 'ocean'|'sunrise'|'neon'|'retro' OR array warna
    darkMode: false,            // true|false
    legend: true,               // tampilkan legend
    tooltip: true,              // tooltip hover
    renderer: 'svg',            // 'svg' atau 'webgl'
    webgl: false,               // alias, kalau mau paksa webgl: true
    zoomPan: true,              // aktifkan zoom & pan (mouse wheel + drag)
    width: 600,
    height: 360
  });

  // update data nanti
  // c.updateData([5,6,7],[...])
</script>
```

---

## Opsi / Konfigurasi (penjelasan)

- type — 'bar' | 'line' | 'pie' | 'radar'

- data — Array<Number> data angka

- labels — Array<String> label tiap datum (optional)

### animation — animasi saat render (tipe chart menentukan dukungan):

- Bar: grow, fade

- Line: wave, fade

- Pie: explode

- Radar: (tidak punya anim khusus di kode)

### duration — durasi animasi (ms), default 800

- theme — string tema builtin: ocean, sunrise, neon, retro atau array warna ['#fff', '#000', ...]. Jika kosong => random HSL

- darkMode — boolean, kalau true background & teks diubah (internal)

- legend — boolean, tampilkan legend di bawah chart

- tooltip — boolean, tampilkan tooltip saat hover

- renderer — 'svg' atau 'webgl'. WebGL hanya untuk bar & line (kode coba inisialisasi WebGL lalu fallback ke SVG)

- webgl — alias praktis untuk renderer: 'webgl'

- zoomPan — boolean, aktifkan zoom (wheel) dan pan (drag)

- stream — object atau fungsi (lihat bagian streaming)

- width, height — override ukuran canvas/svg

---

## Metode utama (instance c)

- `c.render()` — render ulang chart

- `c.updateData(dataArray, labelsArray?)` — ganti data &/atau labels lalu render ulang

- `c.pushDatum(value, label?)` — tambahkan satu datum (jika data > 2000, akan shift() secara otomatis)

- `c.startStream()` — mulai streaming (jika opsi stream disediakan)

- `c.stopStream()` — hentikan streaming

- `c.destroy()` — bersihkan, remove event listener, stop stream, hapus DOM overlay

---

## Contoh: Update data dinamis (manual)
```JS
// ganti seluruh data
c.updateData([4,7,9,1], ['W','X','Y','Z']);

// push satu nilai
c.pushDatum(12, 'newLabel');
```

---

## Streaming data (WebSocket / SSE / function)

### stream dapat berupa:

1. { type: 'ws', url: 'wss://example', protocol?: 'subprotocol', onopen/onclose/onerror? }


2. { type: 'sse', url: 'https://example/sse' } (pakai EventSource)


3. function(chartInstance) — custom starter yang menerima instance chart (boleh return handler yang punya .close())



### Format pesan yang diharapkan (WebSocket / SSE)

JSON { "data": [1,2,3], "labels": ["a","b","c"] } → mengganti seluruh dataset

JSON { "value": 12, "label": "x" } → push satu nilai

Bisa juga mengirim plain number sebagai string (kode akan coba Number)


## Contoh WebSocket client usage
```JS
const c = new Chart('#chart', {
  type: 'line',
  data: [],
  labels: [],
  stream: {
    type: 'ws',
    url: 'wss://example.com/stream',
    onopen: ()=> console.log('ws open'),
    onclose: ()=> console.log('ws close'),
    onerror: (e)=> console.error(e)
  }
});
c.startStream(); // akan otomatis juga dipanggil di constructor jika stream diberikan
```

## Contoh SSE
```
const c = new Chart('#chart', {
  stream: { type: 'sse', url: 'https://example.com/sse' }
});
// constructor sudah memulai EventSource; gunakan c.stopStream() utk stop

Contoh custom function stream

const c = new Chart('#chart', {
  stream(chart) {
    // contohnya polling tiap 2 detik
    const id = setInterval(async () => {
      const v = await fetch('/api/latest').then(r=>r.json());
      if (Array.isArray(v.data)) chart.updateData(v.data, v.labels);
      else if (typeof v.value === 'number') chart.pushDatum(v.value, v.label);
    }, 2000);
    return {
      close() { clearInterval(id); }
    };
  }
});
```

---

## WebGL vs SVG

- renderer: 'webgl' atau webgl: true mencoba inisialisasi WebGL. Jika gagal otomatis fallback ke svg.

- WebGL rendering hanya disediakan untuk bar dan line (menyajikan performa lebih baik saat data besar).

- Tooltip & overlay tetap dibuat sebagai SVG overlay agar mudah interaksi.

---

## Perilaku tambahan / catatan teknis

- Resize: container dipantau melalui ResizeObserver bila tersedia; fallback ke window.resize.

- Jika position: static pada elemen target, constructor akan set position: relative supaya overlay/tooltip posisinya benar.

- Data > 2000: pushDatum() melakukan shift() sehingga panjang tetap <= ~2000.

- Tema builtin: ocean, sunrise, neon, retro. Kamu bisa pass array warna sendiri.

- Tooltip: muncul saat hover pada overlay SVG element; isi default: label: value.

- `destroy()` membersihkan event listener, observer, websocket/eventsource, serta DOM tooltip/legend.

---

## Contoh Kode

### Picture Preview

<img align="center" src="assets/preview.png" height="350" width="350" alt="No Image" />

---

### Quick Start
```HTML
<div id="output" style="width:800px;height:420px;"></div>
<!-- PuffvJS CDN -->
<script src="https://cdn.kyrt.my.id/libs/js/puffvjs/1.0.0/puffvjs.min.js"></script>
<!-- The Quick Start Code -->
<script>
 const Chart = { Puffv }
 const c = new Chart('#output', {
   type: 'bar', 
   data: [10, 12, 10, 32], 
   labels: ['Mon', 'Tue', 'Wen', 'Thu'], 
   theme: 'ocean', 
   renderer: 'webgl', 
 });
</script>
```

---

### Demo Link

Silakan Anda Ke [Link Ini](https://demo.kyrt.my.id/puffvjs.php) Untuk Melihat Demontrasi Nya

---

### Contoh lengkap: bar + streaming (ws) + zoomPan
```HTML
<div id="bchart" style="width:800px;height:420px;"></div>

<script>
  const { Chart } = Puffv;

  const c = new Chart('#bchart', {
    type: 'bar',
    data: [5,8,3,6],
    labels: ['Jan','Feb','Mar','Apr'],
    theme: 'ocean',
    animation: 'grow',
    renderer: 'webgl',       // paksa webgl (akan fallback jika gagal)
    zoomPan: true,
    tooltip: true,
    legend: true,
    stream: { type: 'ws', url: 'wss://example.com/data' }
  });

  // manual push
  setTimeout(()=> c.pushDatum(12, 'May'), 2000);

  // stop stream after 1 menit
  setTimeout(()=> c.stopStream(), 60_000);
</script>
```

---

## Debugging cepat

- Chart tidak muncul? pastikan selector benar, element ada di DOM saat memanggil new Chart(...).

- WebGL tidak jalan? console.warn akan mengatakan WebGL init failed — library otomatis fallback ke SVG.

- Tooltip/legend tidak muncul? cek opsi tooltip: true, legend: true.

- Data tak berubah ketika update? panggil c.render() jika menggunakan perubahan custom pada properti internal.

---

## Ringkasan singkat (cheatsheet)

- Buat: `const c = new Chart('#el', options)`

- Update seluruh: `c.updateData([..], [..])`

- Tambah satu: `c.pushDatum(val, label)`

- Stream: stream: `{type:'ws'|'sse', url: '...'}` atau stream: `function(chart) {...}`

- Hapus: `c.destroy()`

---

<footer style="
  margin-top:60px;
  padding:32px 0;
  text-align:center;
  font-size:14px;
  opacity:.85;
  line-height:1.6;
  border-top:1px solid #e2e2e2;
">
  <div style="font-weight:700; font-size:16px; margin-bottom:2px;">
    OpenDN Foundation
  </div>
  <div style="margin-bottom:10px;">
    © 2025 — PHPin
  </div>

  <div style="margin-top:8px;">
    <a href="https://opendnf.kyrt.my.id" style="color:inherit; text-decoration:none; margin:0 10px;">
      🌐 Website
    </a>
    <span style="opacity:.45;">•</span>
    <a href="https://github.com/KhairyK" style="color:inherit; text-decoration:none; margin:0 10px;">
      💻 GitHub
    </a>
  </div>
</footer>
