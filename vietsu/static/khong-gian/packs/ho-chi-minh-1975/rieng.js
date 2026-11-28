// Chiến dịch Hồ Chí Minh 1975 · phần riêng của trận, cắm vào bộ máy 2.2.0 tại các chỗ /*@@RIENG:sN@@*/.
// Mỗi đoạn bắt đầu bằng dòng //@@ sN (đoạn rỗng: trận này không có gì ở chỗ đó). Mã chạy chung phạm vi với bộ máy.
// Bản GĐ3 (24/11/2026): thử bộ máy 2.2 — hai tầng địa hình (chiến dịch / nội đô), xe GLB chạy theo đường phố, lính lái tăng có xương.
// Mũi tên 5 hướng và lịch chạy xe ở đây là PHÁC THẢO để thử bộ máy; nội dung chốt theo nguồn ở GĐ5 (docs/HCM_1975_TU_LIEU.md).
//@@ s1
// Sa bàn Chiến dịch Hồ Chí Minh 1975 — three.js, bộ máy 2.2.0 (họ Bạch Đằng). Tái dựng mô phỏng.
//@@ s2
const progress = (f, m) => { lp.style.width = (f * 100).toFixed(0) + '%'; if (m) lm.textContent = m; };
// ------------------------------------------------------------------ helpers (như Như Nguyệt)
const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
function keys(K, t) { if (t <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const u = (t - K[i - 1][0]) / (K[i][0] - K[i - 1][0]); return lerp(K[i - 1][1], K[i][1], ease(u)); } return K[K.length - 1][1]; }
function angLerp(a, b, t) { let d = ((b - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI; return a + d * t; }
function rnd(i, k = 0) { const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return s - Math.floor(s); }
//@@ s3
const STAKE_TOP = 0.0;
const LOW = 0.3, HIGH = 0.3;      // sông, kênh Sài Gòn: mực nước cố định (bộ máy 2.x dùng cho mặt nước)
//@@ s4
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 900000);
camera.position.set(0, R * 0.9, R * 1.6);
//@@ s5
const SEC_X = 1e9;            // trận này không có mặt cắt
const secPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), SEC_X);
//@@ s6
const groundMat = fogShader({
  uniforms: { uGround: U.ground, uLight: U.light },
  fpre: 'uniform vec3 uGround; uniform float uLight;',
  fbody: `float r=length(vW.xz); float n=noise(vW.xz*${(0.0016 * 3180 / R).toFixed(7)})*0.55+noise(vW.xz*${(0.013 * 3180 / R).toFixed(7)})*0.3+noise(vW.xz*0.09)*0.15;
    vec3 c=uGround*(0.82+0.32*n)*uLight; float rim=smoothstep(${(R * 1.28).toFixed(1)},${(R * 1.02).toFixed(1)},r); c*=1.0-0.18*rim; outc=vec4(c,1.);`,
});
//@@ s7
const water = new THREE.Mesh(new THREE.CircleGeometry(R - 0.3, 360), waterMat);
water.rotation.x = -Math.PI / 2; water.renderOrder = 2; scene.add(water);
const sectionMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ visible: false }));
sectionMesh.visible = false; scene.add(sectionMesh);
progress(0.35, 'Đang dựng địa hình ' + (TANG === 'noi-do' ? 'nội đô Sài Gòn' : 'toàn chiến dịch') + '…');
//@@ s8
const LAYER = { nv: [], xe: [], nha: [] };
//@@ s9
//@@ s10
async function loadModel(name) { throw new Error('trận này không dùng mô hình .mesh.json: ' + name); }
//@@ s11
const NV_KINDS = [];
async function nvNen() {}           // chưa có nhân vật nướng sẵn (.nvz) — GĐ4
//@@ s12
//@@ s13
//@@ s14
//@@ s15
//@@ s16
// nhân vật nướng sẵn (.nvz) và lính lai chưa dùng ở bản thử này; nhân vật có xương đi qua NVX của bộ máy 2.2
function nvPut() {}
function nvBegin() {}
function nvEnd() {}
const farScale = () => EXAG;
const XL = { on: false, load: async () => {} };
const tmpE = new THREE.Euler(), tmpS = new THREE.Vector3(), tmpM = new THREE.Matrix4();
//@@ s17
const tideAt = () => 0.3;
//@@ s18
const BOAT_S = 1, BOAT_DECK = 0, BOAT_STERN = [0, 0, 0], AV_BOAT = 0;
const boats = [];
const boatInst = new THREE.InstancedMesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ visible: false }), 1); boatInst.visible = false;
//@@ s19
//@@ s20
//@@ s21
//@@ s22
// ------------------------------------------------------------------ toạ độ: kinh-vĩ → three (x Đông, z = −Bắc) của tầng đang mở
const KXm = Math.cos((META.lat0 * Math.PI) / 180) * 111320, KYm = 110574;
const LLx = (lat, lon) => (lon - META.lon0) * KXm, LLz = (lat, lon) => -(lat - META.lat0) * KYm;
const LL = (lat, lon, y = 0) => new THREE.Vector3(LLx(lat, lon), y, LLz(lat, lon));
// mốc (lấy từ OSM 24/11/2026; mốc chính chốt theo nguồn ở GĐ5)
const MOC = {
  dinh: [10.77694, 106.69534, 'Dinh Độc Lập'],
  tsn: [10.8172, 106.65651, 'Sân bay Tân Sơn Nhất'],
  thinghe: [10.79169, 106.70640, 'Cầu Thị Nghè'],
  causg: [10.79870, 106.72600, 'Cầu Sài Gòn'],
  btt: [10.80326, 106.67153, 'Bộ Tổng tham mưu'],                    // nay là Bộ Tư lệnh Quân khu 7 (OSM); trùng "Vietnam Staff Compound" trên sơ đồ 1968 (M3)
};
// đường xe 843, 390 vào Dinh (tools/sa_ban/dia_hinh/tim_duong.py trên mạng đường OSM đã bỏ đường làm sau 1975) + đoạn vào sân Dinh — PHÁC THẢO
const DUONG_DINH = (INST.duong && INST.duong.dinh) || [];
const MV = STORY.moc || {};                                                             // mốc sự kiện theo giây voice (story.json, tools/sa_ban/voice/dung_story_hcm.py)
// Các cảnh vào Dinh viết theo "giờ Dinh" cũ (xe 843 tới cổng phụ 84, 390 húc cổng chính 90, Thận tháo cờ 115, hạ cờ 131, kéo cờ 139…).
// Giờ voice → giờ Dinh: nội suy từng đoạn theo câu đọc tương ứng (bản voice 24/11/2026). Mốc 0 = xe 843 bắt đầu qua cầu Sài Gòn.
const tDinh = (() => {
  if (!MV.c11_ram) { const sc = STORY.scenes.find((c) => c.id === 'T02'); const off = sc ? sc.t0 - 40 : 0; return (t) => t - off; }
  const K = [[MV.c10_dai - 8, -40], [MV.c10_cau, 0], [MV.c10_htt, 42], [MV.c11_843, 76], [MV.c11_ram, 84], [MV.c11_cham, 90], [MV.c11_thao, 115], [MV.c11_chay, 122.5],
    [MV.c11_noc, 131], [MV.c11_keo - 1, 139], [MV.c12_dai, 158]];
  return (t) => { if (t <= K[0][0]) return K[0][1] - (K[0][0] - t);
    for (let i = 1; i < K.length; i++) if (t <= K[i][0]) return K[i - 1][1] + (t - K[i - 1][0]) / (K[i][0] - K[i - 1][0]) * (K[i][1] - K[i - 1][1]);
    return K[K.length - 1][1] + t - K[K.length - 1][0]; };
})();
// ĐÁM ĐÔNG (.nvz nướng từ nhân vật có xương bằng tools/sa_ban/nhan_vat_lai/nuong_nvz.py; ảnh màu áo: doi_mau_ao.py). Vẽ hàng loạt mỗi khung:
// DAM = các hàm (tDinh, tVoice) đặt người qua dongDat; chỉ vẽ người gần máy quay. Mẫu lính Quân Giải phóng, lính đối phương: mẫu QĐND, VNCH của
// sa bàn Thành cổ Quảng Trị (dùng lại, giảm lưới). Vị trí, số người, động tác: TÁI DỰNG MINH HOẠ.
const DAN = [], DAM = [], GHIM_SAU = [];   // GHIM_SAU: các ghim tên đặt sau khi có addLabel
const DONG_P = [], dongNap = (ten, nvz, jpg, cap = 1200, tints = [[1, 1, 1], [0.93, 0.92, 0.9], [0.85, 0.84, 0.82]]) => { const p = dongTai(ten, 'models/' + nvz + '.nvz', 'models/' + jpg + '.jpg', tints, cap).catch((e) => console.warn('đám đông', ten, e)); DONG_P.push(p); return p; };
const ganMay = (x, z, r) => { const dx = camera.position.x - x, dz = camera.position.z - z; return dx * dx + dz * dz < r * r; };
const rndS = (s) => () => (s = (s * 16807) % 2147483647) / 2147483647;
// V2.0 (anh Thắng 03:26: lính C09-B ngồi lên đầu xe): xeCapNhat đặt rotation (0, hướng, 0) rồi rotateX(độ dốc) → góc Euler đọc lại rotation.y bị lật (π − hướng) khi xe quay quá ±90°.
// Lấy hướng mũi xe từ quaternion.
const yawXe = (o) => { const q = o.quaternion; return Math.atan2(2 * (q.x * q.z + q.w * q.y), 1 - 2 * (q.x * q.x + q.y * q.y)); };
const quayXe = (o, lx, ly, lz) => { const p = o.position, y = yawXe(o), c = Math.cos(y), s = Math.sin(y); return [p.x + lx * c + lz * s, p.y + ly, p.z - lx * s + lz * c, y]; };   // điểm trên xe (mũi +z) → thế giới
// bộ binh ngồi trên thùng xe tải (hai băng ghế dọc, quay mặt vào giữa) / trên nóc xe bọc thép K-63; sc: tỉ lệ (tầng chiến dịch phóng to ×3 như xe)
// thùng xe tải (sàn cao 1,42 m): hai hàng quỳ dọc hai bên thành xe, 5 người mỗi bên (động tác QuyNghi — dáng ngồi duỗi chân cũ bị thành xe che), 3 người đứng giữa (anh Thắng 24/11: thêm người, người ngồi không bị chìm)
// V2.0 (29/11): đo lại mặt sàn bằng tia chiếu xuống các mẫu kho khí tài — thùng ZIL-157 cao 1,21 m (z −3,6…−0,4); sàn máy sau tháp T-54B 1,66 m (z −2,8…−2,0),
// chắn bùn cạnh tháp 1,62 m; sàn sau K-63 2,02–2,14 m (z −2,4…−0,8). Lính ngồi đặt thấp hơn mặt sàn 0,05 m như trước.
// V2.0 (anh Thắng 03:26): bộ binh trên xe quỳ thế thủ, ôm súng sẵn sàng (động tác 'quy'), quay mặt ra hai bên sườn xe — không ngồi duỗi như ngủ gật
const LINH_XE = { tai: [...[-3.1, -2.55, -2.0, -1.45, -0.9].flatMap((z) => [[-0.78, 1.16, z, 1, 'quy'], [0.78, 1.16, z, -1, 'quy']]), [0, 1.21, -2.8, 2, 'dung'], [0.15, 1.21, -2.0, 2, 'dung'], [-0.15, 1.21, -1.2, 2, 'dung']],
  tang: [[-0.75, 1.61, -2.25, 1, 'quy'], [0.75, 1.61, -2.25, -1, 'quy'], [-0.6, 1.61, -2.75, 1, 'quy'], [0.6, 1.61, -2.75, -1, 'quy'], [0.95, 1.62, -1.4, 2, 'dung']],
  k63: [[-0.6, 2.09, -1.75, 1, 'quy'], [0.6, 2.09, -1.75, -1, 'quy'], [-0.6, 2.0, -0.9, 1, 'quy'], [0.6, 2.0, -0.9, -1, 'quy'], [0, 2.09, -2.05, 2, 'dung']] };
const linhTrenXe = (o, loai, t, sc = 1, vi = 0) => { if (!o || !o.visible) return;
  for (const [lx, ly, lz, q, clip] of LINH_XE[loai]) { const [x, y, z, yaw] = quayXe(o, lx * sc, ly * sc, lz * sc);
    dongDat('qgp', clip, t, (lx + lz) * 0.37 % 1, x, y, z, yaw + (q === 2 ? 0 : q ? q * Math.PI / 2 : Math.PI), sc, vi++); } };
// KHÓI BỤI sau đoàn xe (anh Thắng 24/11): mỗi xe vài cụm bụi bốc lên, bay ra sau
const BUI = { pool: [], n: 0, mat: null };
const buiXe = (o, sc, t, mau = 0xb49a76) => { if (!o || !o.visible) return; const y = o.rotation.y, fx = Math.sin(y), fz = Math.cos(y);
  for (let k = 0; k < 3; k++) { let s = BUI.pool[BUI.n]; if (!s) { s = new THREE.Sprite(new THREE.SpriteMaterial({ map: NHOE_TEX, color: mau, transparent: true, depthWrite: false })); scene.add(s); BUI.pool.push(s); }
    BUI.n++; const a = (t * 0.9 + k / 3 + (o.id % 7) * 0.13) % 1, d = (3.5 + a * 14) * sc;
    s.visible = true; s.material.color.setHex(mau); s.position.set(o.position.x - fx * d + (k - 1) * 0.8 * sc, o.position.y + (0.6 + a * 3.5) * sc, o.position.z - fz * d); s.scale.setScalar((2.2 + a * 7) * sc); s.material.opacity = 0.42 * (1 - a); } };
// ------------------------------------------------------------------ KHO KHÍ TÀI DÙNG CHUNG (V2.0, anh Thắng 29/11)
// Mẫu dựng bằng Blender theo bản vẽ + số đo ở _KHO-CHUNG/khi-tai (Project › claude/kho-khi-tai-v0.md): tách bộ phận — bánh lăn (rotation.x += quãng đường / bán kính),
// xích chạy bằng khoá hình chay1/chay2 (s = (quãng đường / bước mắt xích) mod 2), cánh quạt quay liên tục; mũi xe +Z, gốc ở mặt đất giữa thân.
// Thay mẫu Tripo cũ cùng tên tệp (mã cảnh không đổi). Số hiệu 390/843 dán riêng (kho không gắn số hiệu, cờ).
const KHO_KT = { 'data/xe/xe-tang-390.glb': 't54b', 'data/xe/xe-tang-843.glb': 't54b', 'data/xe/xe-tang-m48.glb': 'm48a3', 'data/xe/xe-tang-m41.glb': 'm41a3',
  'data/xe/xe-boc-thep-m113.glb': 'm113', 'data/xe/xe-boc-thep-k63.glb': 'k63', 'data/xe/xe-tai.glb': 'zil157', 'data/phao/m-46-130mm.glb': 'm46', 'data/xe/ats59.glb': 'ats59',
  'data/may-bay/a-37.glb': 'a37b', 'data/may-bay/c-130a.glb': 'c130a', 'data/may-bay/uh-1.glb': 'uh1h', 'data/may-bay/ac-119k.glb': 'ac119k' };
const KHO = { ds: [], gop: {}, _p: new THREE.Vector3(), _f: new THREE.Vector3(), _q: new THREE.Quaternion(), _a: new THREE.Vector3() };
KHO.BGU = await import('@@ENGINE@@vendor/three/addons/utils/BufferGeometryUtils.js').catch(() => null);
{ const g0 = glbLoad; glbLoad = (u) => { const ma = KHO_KT[u]; if (!ma) return g0(u);
    return g0('data/khi-tai/' + ma + '.glb').then((g) => { if (!g.__kho) { g.__kho = ma; KHO.chuan(g, ma); } return g; }); }; }
// chuẩn bị mẫu một lần: tắt bóng, ẩn mui bạt xe tải (thùng hở cho bộ binh ngồi), gộp lưới làm mức xa (1 lần vẽ thay vì ~35), bọc clone() để mọi bản sao tự đăng ký
KHO.chuan = (g, ma) => { const sc = g.scene; sc.updateMatrixWorld(true);
  sc.traverse((o) => { if (o.isMesh) { o.castShadow = o.receiveShadow = false; } if (/^mui_bat|^khung_mui/.test(o.name) && ma !== 'ats59') o.visible = false; });
  const G = [], inv = new THREE.Matrix4().copy(sc.matrixWorld).invert(); let mat = null;
  sc.traverse((o) => { if (!o.isMesh || !o.visible || !o.geometry) return; let p = o.parent, an = false; while (p) { if (!p.visible) an = true; p = p.parent; } if (an) return;
    if (o.material && o.material.transparent) return; mat = mat || o.material;
    const gg = new THREE.BufferGeometry(), src = o.geometry; for (const k of ['position', 'normal', 'uv']) { const A = src.attributes[k]; if (!A) continue;
      const out = new Float32Array(A.count * A.itemSize); const F = [A.getX, A.getY, A.getZ, A.getW]; for (let i = 0; i < A.count; i++) for (let c = 0; c < A.itemSize; c++) out[i * A.itemSize + c] = F[c].call(A, i);
      gg.setAttribute(k, new THREE.BufferAttribute(out, A.itemSize)); }
    if (src.index) gg.setIndex(Array.from(src.index.array)); gg.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld)); if (gg.attributes.uv && gg.attributes.normal) G.push(gg); });
  if (G.length && mat && KHO.BGU) { try { const m = new THREE.Mesh(KHO.BGU.mergeGeometries(G.map((x) => (x.index ? x.toNonIndexed() : x))), mat); m.name = '__gop'; m.visible = false; KHO.gop[ma] = m; } catch (e) { console.warn('gộp lưới', ma, e); } }
  const c0 = sc.clone.bind(sc); sc.clone = (r) => { const o = c0(r); KHO.dangKy(o, ma); return o; }; };
KHO.dangKy = (o, ma) => { const B = [], X = [], Q = [], chi = [];
  for (const c of o.children) chi.push(c);
  o.traverse((n) => { const u = n.userData || {}; if (u.ban_kinh && /^banh/.test(n.name)) B.push([n, n.rotation.x, u.ban_kinh]);
    if (u.buoc && n.isMesh && n.morphTargetInfluences) X.push([n, u.buoc]); if (u.quay_lien_tuc) Q.push([n, n.quaternion.clone(), u.truc_xoay || 'Y', (u.vong_phut || 360) / 60]); });
  if (KHO.gop[ma]) { const m = KHO.gop[ma].clone(); m.material = KHO.gop[ma].material; o.add(m); o.userData.gop = m; }
  o.userData.kho = { ma, B, X, Q, chi, d: 0, p: null, gan: true }; KHO.ds.push(o); };
KHO.capNhat = (tg) => { const cam = camera.position;
  for (const o of KHO.ds) { const K = o.userData.kho; let v = o.visible, p = o.parent; while (v && p && p !== scene) { v = p.visible; p = p.parent; } if (!v) { K.p = null; continue; }
    o.getWorldPosition(KHO._p); const s = o.getWorldScale(KHO._a).x || 1;
    if (K.p) { const dx = KHO._p.x - K.p.x, dz = KHO._p.z - K.p.z, l = Math.hypot(dx, dz); if (l > 0.05 * s) K.tm = tg; if (l < 60 * s && l > 1e-5) { KHO._f.set(0, 0, 1).applyQuaternion(o.getWorldQuaternion(KHO._q)); K.d += (dx * KHO._f.x + dz * KHO._f.z) / s; } }
    K.p = (K.p || new THREE.Vector3()).copy(KHO._p);
    const gan = !o.userData.gop || cam.distanceTo(KHO._p) < 150 * s + 40;   // gần máy: mẫu đủ bộ phận chuyển động; xa: một lưới gộp
    if (gan !== K.gan) { K.gan = gan; for (const c of K.chi) c.visible = gan; if (o.userData.gop) o.userData.gop.visible = !gan; }
    if (!gan) continue;
    for (const [n, x0, r] of K.B) n.rotation.x = x0 + K.d / r;
    for (const [n, b] of K.X) { const u = ((K.d / b) % 2 + 2) % 2; n.morphTargetInfluences[0] = u < 1 ? u : 2 - u; n.morphTargetInfluences[1] = u < 1 ? 0 : u - 1; }
    const quay = o.userData.quayCanh || tg - (K.tm || -99) < 2;   // máy bay đỗ: cánh quạt đứng yên
    if (quay) K.g = (K.g || 0) + Math.min(0.1, tg - (K.tq || tg)); K.tq = tg;
    for (const [n, q0, tr, vs] of K.Q) { const g = (K.g || 0) * vs * Math.PI * 2; KHO._a.set(tr === 'X' ? 1 : 0, tr === 'Z' ? 1 : 0, tr === 'Y' ? -1 : 0);   // trục Blender → three: X→X, Z(lên)→Y, Y(dọc thân)→−Z
      n.quaternion.copy(q0).multiply(KHO._q.setFromAxisAngle(KHO._a, g)); } } };
const NHIP_QGP = { chay: 4.0 / 2.7, xung: 3.2 / 2.7, di: 1.07 / 0.97 }, NHIP_VNCH = { chay: 3.78 / 2.7, xung: 3.2 / 2.7, di: 1.07 / 0.97 };
if (true) { dongNap('qgpA', 'linh-qgp-a', 'linh-qgp-a', 300); dongNap('qgpB', 'linh-qgp-b', 'linh-qgp-b', 300); dongNap('vnch', 'linh-vnch', 'linh-vnch', 200);
  // V1.5: hai mức chi tiết — gần máy (< 45 m × tỉ lệ) dùng mẫu 4.700 tam giác (không thủng), xa dùng mẫu 1.570 tam giác (nhẹ cho card đồ hoạ)
  dongNap('qgpAx', 'linh-qgp-a-x', 'linh-qgp-a', 700); dongNap('qgpBx', 'linh-qgp-b-x', 'linh-qgp-b', 700); dongNap('vnchx', 'linh-vnch-x', 'linh-vnch', 400);
  // anh Thắng V1.2: bộ đội ta dùng hai mẫu lính Thành cổ (mũ tai bèo / đầu trần, tools/thanh_co_quang_tri/nhan-vat), lấy động tác của mẫu QĐND cùng bộ xương; 'qgp' chia đều hai mẫu
  const _dd0 = dongDat; dongDat = (ten, clip, t, ph, x, y, z, yaw, sc = 1, vi = 0) => { let n = ten === 'qgp' ? (vi % 2 ? 'qgpA' : 'qgpB') : ten;
    if (n === 'qgpA' || n === 'qgpB' || n === 'vnch') { const c = camera.position, dx = c.x - x, dy = c.y - y, dz = c.z - z, r = 45 * sc; if (dx * dx + dy * dy + dz * dz > r * r && DONG[n + 'x']) n += 'x'; }
    // V2.0 (29/11, anh Thắng: bộ binh đã nướng lại): bộ động tác Mixamo chung (gói Khe Sanh) có nhịp bước khác bộ cũ — chạy/xung 2,7 m/s, đi 0,97 m/s
    // (bộ cũ: chạy 4,0, xung 3,2, đi 1,07; VNCH chạy 3,78). Mọi tốc độ trong phim vẫn theo nhịp bước cũ → tua nhanh động tác theo tỉ lệ cho chân khớp đất.
    const NB = n.startsWith('vnch') ? NHIP_VNCH : n.startsWith('qgp') ? NHIP_QGP : null; if (NB && NB[clip]) t *= NB[clip];
    return _dd0(n, clip, t, ph, x, y, z, yaw, sc, vi); }; }
// GIAO TRANH (anh Thắng 24/11: bộ binh bắn nhau khi giữ cầu, xe tăng bắn nhau): đường đạn vạch sáng (đạn vạch phía ta xanh lục, phía đối phương đỏ — màu
// đạn vạch thông dụng của súng Liên Xô / Mỹ), chớp nòng, nổ. Mỗi trận: hai nhóm lính .nvz, thời gian, tỉ lệ (tầng chiến dịch ×3). Thế trận: MINH HOẠ.
const TRV = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }), 900);
TRV.count = 0; TRV.frustumCulled = false; TRV.setColorAt(0, new THREE.Color()); scene.add(TRV);
const _tq = new THREE.Quaternion(), _tm = new THREE.Matrix4(), _ta = new THREE.Vector3(), _tb = new THREE.Vector3(), _tz = new THREE.Vector3(0, 0, 1), _ts = new THREE.Vector3(), _tc = new THREE.Color();
const vach = (ax, ay, az, bx, by, bz, u, dai, day, mau) => {               // một viên đạn vạch đang bay ở phần u (0..1) của đường a→b
  if (TRV.count >= 900) return; _ta.set(bx - ax, by - ay, bz - az); const L = _ta.length(); if (L < 1) return; _ta.divideScalar(L);
  const k = Math.min(dai, L * 0.5), d = u * (L - k); _tb.set(ax + _ta.x * (d + k / 2), ay + _ta.y * (d + k / 2), az + _ta.z * (d + k / 2));
  _tq.setFromUnitVectors(_tz, _ta); _tm.compose(_tb, _tq, _ts.set(day, day, k)); TRV.setMatrixAt(TRV.count, _tm); TRV.setColorAt(TRV.count, _tc.set(mau)); TRV.count++; };
const NHOE_TEX = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const cx = cv.getContext('2d'), gr = cx.createRadialGradient(32, 32, 2, 32, 32, 31);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.45, 'rgba(255,255,255,0.6)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); cx.fillStyle = gr; cx.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(cv); })();
const nhoe = (mau, cong = true) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: NHOE_TEX, color: mau, transparent: true, depthWrite: false, blending: cong ? THREE.AdditiveBlending : THREE.NormalBlending })); s.visible = false; scene.add(s); return s; };
const GT = [];                                                                             // các trận bộ binh
// o = { t0, t1, voice: dùng giây voice (tầng chiến dịch) hay giờ Dinh, sc, r: bán kính vẽ, A: [[x,z,yaw,clip]…] (ta), B: (đối phương), chet: phần đối phương ngã sau trận }
const giaoTranh = (o) => { o.sc = o.sc || 1; o.r = o.r || 700; o.ph = o.A.concat(o.B).map((_, i) => (i * 0.618) % 1);
  const r = rndS(o.A.length * 31 + 7);
  for (const P of o.A.concat(o.B)) { P[4] = Math.max(hG(P[0], P[1]), CAU_Y(P[0], P[1])); let q = null; for (let n = 0; n < 8 && !q; n++) { const a = r() * 6.28, d = (4 + r() * 6) * o.sc, x = P[0] + Math.cos(a) * d, z = P[1] + Math.sin(a) * d; if (hG(x, z) > 0.4 || CAU_Y(x, z) > 0) q = [x, z]; } P[5] = q || [P[0], P[1]]; }   // chỗ nấp thứ hai (không dưới nước)
  if (o.dong) o.no = Array.from({ length: 5 }, () => nhoe(0xff9a4a));
  GT.push(o); return o; };
// V1.9 (anh Thắng: Rạch Chiếc, cầu Sài Gòn — thêm ụ bê tông, ụ đất để hai bên có chỗ ẩn nấp mà bắn): sau khi giaoTranh tính chỗ nấp (P, P[5]),
// đặt một ụ trước mỗi chỗ nấp, về phía đối phương (A nhìn theo f, B ngược lại); bỏ ụ nào đè lên chỗ đứng của người khác. Kích thước, vị trí: MINH HOẠ.
const uNap = (A, B, f, yf, sc, seed) => { const bt = [], dat = [], rr = rndS(seed);
  for (const [L, huong] of [[A, 1], [B, -1]]) L.forEach((P, i) => { for (const Q of [P, P[5]]) { if (!Q || (Q !== P && i % 2)) continue; const x = Q[0] + f.x * huong * 1.4 * sc, z = Q[1] + f.z * huong * 1.4 * sc;
    if (hG(x, z) < 0.4 && CAU_Y(x, z) <= 0) continue; if (A.concat(B).some((R) => [R, R[5]].some((S) => S && Math.hypot(S[0] - x, S[1] - z) < 1.25 * sc))) continue;
    (rr() < 0.45 ? bt : dat).push([x, Math.max(hG(x, z), CAU_Y(x, z)), z, yf + (rr() - 0.5) * 0.5]); } });
  const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), Y = new THREE.Vector3(0, 1, 0);
  const ve = (geo, mat, L, sx, sy, sz) => { const im = new THREE.InstancedMesh(geo, mat, Math.max(1, L.length)); im.count = L.length;
    L.forEach(([x, y, z, a], i) => im.setMatrixAt(i, m4.compose(new THREE.Vector3(x, y, z), q4.setFromAxisAngle(Y, a), new THREE.Vector3(sx * sc, sy * sc, sz * sc)))); im.frustumCulled = false; scene.add(im); return im; };
  ve(new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), new THREE.MeshLambertMaterial({ color: 0x8f8d86 }), bt, 2.2, 1.0, 0.6);                    // ụ bê tông (cao ~1 m: quỳ nấp, đứng bắn qua)
  ve(new THREE.SphereGeometry(1, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0x6e5236 }), dat, 1.3, 0.7, 0.75);   // ụ đất, bao cát
  return bt.length + dat.length; };
const BAN = [];                                                                            // các phát pháo xe tăng: { tu, a(), b(), no: nổ ở b, voice }
const banTao = (tu, a, b, o = {}) => { const S = { tu, a, b, sc: o.sc || 1, voice: !!o.voice, loe: nhoe(0xffd08a), no: nhoe(0xff8a3a), khoi: nhoe(0x5a524a, false) }; BAN.push(S); return S; };
DAM.push((t, tv) => {
  for (const o of GT) { const tt = o.voice ? tv : t; if (tt < o.t0 - 0.5 || tt > o.t1 + (o.sau || 25)) continue;
    const c = o.A[0]; if (!ganMay(c[0], c[1], o.r)) continue; const on = tt < o.t1, sc = o.sc;
    const nc = Math.floor(o.B.length * (o.chet || 0));
    // o.dong: lính chạy qua lại giữa hai chỗ nấp, đứng bắn, quỳ bắn, nằm bắn; bên đối phương ngã dần (anh Thắng 24/11: giao tranh ở cầu như trận Thành cổ)
    const vt = (P, i, ben, nga) => { if (!o.dong) return [P[0], P[1], P[2], on ? P[3] : 'dung'];
      if (nga) return [P[0], P[1], P[2], 'nam']; const Ti = 8 + (i % 4) * 1.3, a = tt - o.t0 + o.ph[i] * Ti, c = Math.floor(a / Ti), u = a - c * Ti, q = P[5], A0 = c % 2 ? q : P, B0 = c % 2 ? P : q;
      const chay = ben ? 'chay' : 'chay', nam = ben ? 'namban' : 'truon';
      if (!on) return [P[0], P[1], P[2], ben ? 'dung' : 'nam'];
      const tc = clamp(Math.hypot(B0[0] - A0[0], B0[1] - A0[1]) / ((ben ? 4.0 : 3.8) * sc), 0.6, 3.0);   // chạy đúng nhịp bước (4,0 / 3,8 m/s × tỉ lệ) — không trượt
      if (u < 3.2) return [A0[0], A0[1], P[2], i % 3 ? 'ban' : 'quy'];
      if (u < 3.2 + tc) { const k = (u - 3.2) / tc; return [A0[0] + (B0[0] - A0[0]) * k, A0[1] + (B0[1] - A0[1]) * k, Math.atan2(B0[0] - A0[0], B0[1] - A0[1]), chay]; }
      return [B0[0], B0[1], P[2], u < 5.6 + tc ? (i % 2 ? nam : 'quy') : 'ban']; };
    o.A.forEach((P, i) => { const [x, z, yaw, clip] = vt(P, i, true, false); P[6] = x; P[7] = z; P[8] = clip; dongDat('qgp', clip, tt, o.ph[i], x, Math.max(hG(x, z), CAU_Y(x, z)), z, yaw, sc, i); });
    o.B.forEach((P, i) => { const j = o.A.length + i, nga = o.dong && i < nc && tt > o.t0 + (o.nga0 ?? 4) + i * (o.nga ?? 1.7); if (!on && i >= nc) return;
      const [x, z, yaw, clip] = vt(P, j, false, nga); P[6] = x; P[7] = z; P[8] = clip; dongDat('vnch', on || !o.dong ? (o.dong ? clip : P[3]) : 'nam', tt, o.ph[j], x, Math.max(hG(x, z), CAU_Y(x, z)) + (clip === 'nam' ? 0.2 : 0), z, yaw, sc, i); });
    if (o.no) o.no.forEach((S, k) => { const T2 = 2.6 + k * 0.7, u = ((tt - o.t0) / T2 + k * 0.37) % 1, L_ = k % 2 ? o.B : o.A, Q = L_[(((Math.floor((tt - o.t0) / T2) * 7 + k * 5) % L_.length) + L_.length) % L_.length];   /* V1.4: chỉ số âm khi tt < t0 → lỗi 'reading 5', đứng hình Hồi 10 */
      S.visible = on && u < 0.32; if (!S.visible) return; S.position.set(Q[5][0] + (k - 2) * 3 * sc, hG(Q[5][0], Q[5][1]) + (1 + u * 5) * sc, Q[5][1] + 4 * sc); S.scale.setScalar((3 + u * 16) * sc); S.material.opacity = 0.95 * (1 - u / 0.32); });
    if (!on) continue;
    const ban = (P, Q, ph, mau) => { const u = (tt * 1.6 + ph) % 1, c = P[8] || P[3]; if (u > 0.55 || /chay|nam$|truon/.test(c)) return; const px = P[6] ?? P[0], pz = P[7] ?? P[1];
      const y0 = hG(px, pz) + (c === 'quy' ? 1.0 : c === 'namban' ? 0.35 : 1.35) * sc;
      vach(px + Math.sin(P[2]) * 0.6 * sc, y0, pz + Math.cos(P[2]) * 0.6 * sc, Q[6] ?? Q[0], Q[4] + 1.1 * sc, Q[7] ?? Q[1], u / 0.55, 2.4 * sc, 0.07 * sc, mau); };
    o.A.forEach((P, i) => { if (i % 2 === 0) ban(P, o.B[(i * 7) % o.B.length], o.ph[i], 0x9dff7a); });
    o.B.forEach((P, i) => { if (i % 2 === 1) ban(P, o.A[(i * 5) % o.A.length], o.ph[o.A.length + i], 0xff5a3c); }); }
  for (const S of BAN) { const a = (S.voice ? tv : t) - S.tu, sc = S.sc;
    S.loe.visible = a > 0 && a < 0.3; S.no.visible = a > 0.35 && a < 1.6; S.khoi.visible = a > 0.5 && a < 6;
    if (a < 0 || a > 6) continue; const A = S.a(), B = S.b(); if (!A || !B) { S.loe.visible = S.no.visible = S.khoi.visible = false; continue; }
    if (S.loe.visible) { S.loe.position.copy(A); S.loe.scale.setScalar((3 + a * 12) * sc); }
    if (a < 0.35) vach(A.x, A.y, A.z, B.x, B.y, B.z, a / 0.35, 6 * sc, 0.25 * sc, 0xffc070);
    if (S.no.visible) { const b = a - 0.35; S.no.position.set(B.x, B.y + (1 + b * 3) * sc, B.z); S.no.scale.setScalar((5 + b * 14) * sc); S.no.material.opacity = 0.95 * (1 - b / 1.25); }
    if (S.khoi.visible) { const b = (a - 0.5) / 5.5; S.khoi.position.set(B.x, B.y + (2 + b * 16) * sc, B.z); S.khoi.scale.setScalar((6 + b * 22) * sc); S.khoi.material.opacity = 0.55 * (1 - b); } }
});
// CẦU (anh Thắng 24/11: đoàn xe phải đi trên cầu Thị Nghè, cầu Chữ Y…, không lội nước): dò dọc tuyến xe chạy, chỗ nào mặt đất thấp hơn mặt nước thì
// dựng một cây cầu bê tông (mặt cầu, lan can, trụ) có dốc hai đầu; xe chạy trên mặt cầu (CAU_Y của bộ máy 2.2). Hình dáng cầu: GIẢN LƯỢC, chưa theo ảnh từng cầu.
const CAU = [], CAU_MAT = new THREE.MeshLambertMaterial({ color: 0x9c978c }), CAU_LC = new THREE.MeshLambertMaterial({ color: 0xd8d4c8 });
CAU_Y = (x, z) => { let y = -1e9; for (const C of CAU) { if (x < C.x0 || x > C.x1 || z < C.z0 || z > C.z1) continue;
  for (const S of C.S) { const dx = S.bx - S.ax, dz = S.bz - S.az, L2 = dx * dx + dz * dz || 1, k = clamp(((x - S.ax) * dx + (z - S.az) * dz) / L2, 0, 1), px = S.ax + dx * k - x, pz = S.az + dz * k - z;
    if (px * px + pz * pz < C.w2) y = Math.max(y, S.ya + (S.yb - S.ya) * k); } } return y; };
const cauGan = (x, z, d) => { for (const C of CAU) { if (x < C.x0 - d || x > C.x1 + d || z < C.z0 - d || z > C.z1 + d) continue; const w = Math.sqrt(C.w2) + d;
  for (const S of C.S) { const dx = S.bx - S.ax, dz = S.bz - S.az, L2 = dx * dx + dz * dz || 1, k = clamp(((x - S.ax) * dx + (z - S.az) * dz) / L2, -0.5, 1.5), px = S.ax + dx * k - x, pz = S.az + dz * k - z; if (px * px + pz * pz < w * w) return true; } } return false; };
const cauTao = (P, o = {}) => { if (!P || P.length < 2) return 0;
  const k = o.k || 1, rong = (o.rong || 12) * k, muc = 0.36, cao = (o.cao || 4.5) * k, D = duong(P), runs = [], buoc = 3 * k; let a = null;
  for (let d = 0; d <= D.L; d += buoc) { const p = diemTren(D, d), uot = hG(p.x, p.z) < muc; if (uot && a === null) a = d; if ((!uot || d + buoc > D.L) && a !== null) { if (d - a >= 5 * k && d - a < 1500 * k) runs.push([a, d]); a = null; } }
  for (const [a0, b0] of runs) {
    const a = Math.max(0, a0 - 16 * k), b = Math.min(D.L, b0 + 16 * k), pa = diemTren(D, a), pb = diemTren(D, b), ya = hG(pa.x, pa.z), yb = hG(pb.x, pb.z), Y = Math.max(ya, yb, muc + cao), r = Math.min(28 * k, (b - a) / 3);
    const yAt = (d) => (d < a + r ? ya + (Y - ya) * sstep(a, a + r, d) : d > b - r ? yb + (Y - yb) * (1 - sstep(b - r, b, d)) : Y);
    const C = { S: [], w2: (rong / 2 + 1) ** 2, x0: 1e9, x1: -1e9, z0: 1e9, z1: -1e9 }, g = new THREE.Group(), n = Math.max(2, Math.ceil((b - a) / (6 * k)));
    for (let i = 0; i < n; i++) { const d0 = a + (b - a) * i / n, d1 = a + (b - a) * (i + 1) / n, p0 = diemTren(D, d0), p1 = diemTren(D, d1), y0 = yAt(d0), y1 = yAt(d1);
      C.S.push({ ax: p0.x, az: p0.z, bx: p1.x, bz: p1.z, ya: y0, yb: y1 });
      const L = Math.hypot(p1.x - p0.x, p1.z - p0.z), yaw = Math.atan2(p1.x - p0.x, p1.z - p0.z), pit = -Math.atan2(y1 - y0, L), mx = (p0.x + p1.x) / 2, mz = (p0.z + p1.z) / 2, my = (y0 + y1) / 2;
      const san = new THREE.Mesh(new THREE.BoxGeometry(rong, 0.9 * k, L + 0.3 * k), CAU_MAT); san.position.set(mx, my - 0.45 * k, mz); san.rotation.set(pit, yaw, 0, 'YXZ'); g.add(san);
      for (const s of [-1, 1]) { const lc = new THREE.Mesh(new THREE.BoxGeometry(0.35 * k, 1.1 * k, L + 0.3 * k), CAU_LC); lc.position.set(mx + Math.cos(yaw) * s * (rong / 2 - 0.2 * k), my + 0.55 * k, mz - Math.sin(yaw) * s * (rong / 2 - 0.2 * k)); lc.rotation.copy(san.rotation); g.add(lc); }
      if (i % 4 === 2 && d0 > a0 && d1 < b0) { const tru = new THREE.Mesh(new THREE.BoxGeometry(rong * 0.8, my + 3, 1.6 * k), CAU_MAT); tru.position.set(mx, (my - 3) / 2, mz); tru.rotation.y = yaw; g.add(tru); }
      for (const p of [p0, p1]) { C.x0 = Math.min(C.x0, p.x - rong); C.x1 = Math.max(C.x1, p.x + rong); C.z0 = Math.min(C.z0, p.z - rong); C.z1 = Math.max(C.z1, p.z + rong); } }
    scene.add(g); CAU.push(C); }
  return runs.length; };
const XEX = { x843: null, x390: null, lai843: null, ctt: null, than: null };
if (TANG === 'noi-do' && DUONG_DINH.length) {
  progress(0.4, 'Đang tải xe tăng 843, 390…');
  const L0 = (() => { let a = 0; for (let i = 1; i < DUONG_DINH.length; i++) a += Math.hypot(DUONG_DINH[i][0] - DUONG_DINH[i - 1][0], DUONG_DINH[i][1] - DUONG_DINH[i - 1][1]); return a; })();
  XEX.L = L0;
  // DINH ĐỘC LẬP (dáng trước 1975, tools/sa_ban/dinh/dung_dinh.py): gốc giữa mặt tiền O, mặt tiền nhìn phương vị 42,6° (nền nhà OSM)
  progress(0.45, 'Đang dựng Dinh Độc Lập…');
  const DO = [27.5, 21], DU = [0.7357, -0.6773], DN = [0.6773, 0.7357];
  const DL = (sd, dd) => [DO[0] + sd * DU[0] + dd * DN[0], DO[1] + sd * DU[1] + dd * DN[1]];          // (dọc mặt tiền, ra cổng) → Blender [x, y_Bắc]
  { const hs = []; for (let a = -100; a <= 100; a += 20) for (let b = -90; b <= 140; b += 23) { const [x, y] = DL(a, b); hs.push(hG(x, -y)); }
    hs.sort((p, q) => p - q); XEX.hDinh = hs[Math.floor(hs.length * 0.85)]; }
  matPhang(DO[0], -DO[1], Math.atan2(-DU[1], DU[0]), -110, 110, -100, 146, XEX.hDinh);     // trong rào: mặt sân phẳng
  { const g = await glbLoad('data/dinh/dinh-doc-lap.glb'); const o = g.scene; o.position.set(DO[0], XEX.hDinh, -DO[1]); o.rotation.y = -0.7441; scene.add(o);
    XEX.dinh = o; XEX.cong = { trai: o.getObjectByName('CongTrai'), phai: o.getObjectByName('CongPhai'), phu: o.getObjectByName('CongPhuDuong') }; LAYER.xe.push(o); }
  // đường vào: theo Lê Duẩn tới cổng chính (trục Dinh) — bỏ đoạn rẽ phải cũ của tim_duong
  const iNga = DUONG_DINH.reduce((b, p, i) => { const q = DL(2, 151), e = Math.hypot(p[0] - q[0], p[1] - q[1]); return e < b[0] ? [e, i] : b; }, [1e9, 0])[1];
  const GOC = DUONG_DINH.slice(0, iNga + 1);
  // C10 (bản voice): đoàn xe đi từ cầu Sài Gòn → ngã tư Hàng Xanh → cầu Thị Nghè (placement.json › duong.causg_thinghe, tim_duong.py) rồi theo GOC vào Dinh
  const CT = (INST.duong && INST.duong.causg_thinghe) || [GOC[0]];
  const D843 = [...CT.slice(0, -1), ...GOC.slice(0, -1), DL(6, 168), DL(13, 159), DL(13, 149.6),      // 843: lệch trái vào cổng phụ bên trái, sát cổng chính (ảnh 30/4)
                DL(13, 140)],                                                                          // húc đổ cổng phụ, chết máy, kẹt lại ở cổng (anh Thắng 24/11)
        D390 = [...CT.slice(0, -1), ...GOC.slice(0, -1), DL(0, 162), DL(0, 149.3), DL(-1.5, 138), DL(-10, 118), DL(-20, 100), DL(-19, 72), DL(-9, 42)];
  const dai = (P, k) => { let a = 0; for (let i = 1; i <= k; i++) a += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); return a; };
  const L1 = dai(CT, CT.length - 1), g843 = dai(D843, D843.length - 2), g390 = dai(D390, CT.length - 1 + GOC.length);   // L1: cầu Sài Gòn → Thị Nghè; 843 tới cổng phụ; 390 tới cổng chính
  const HX = LL(10.8013, 106.7113);                                                       // ngã tư Hàng Xanh (toạ độ OSM 2026)
  const dHX = (() => { let b = [1e9, 0], a = 0; for (let i = 1; i < CT.length; i++) { a += Math.hypot(CT[i][0] - CT[i - 1][0], CT[i][1] - CT[i - 1][1]);
    const e = Math.hypot(CT[i][0] - HX.x, -CT[i][1] - HX.z); if (e < b[0]) b = [e, a]; } return b[1]; })();
  const fD = tDinh, cat = 0.02;                                                            // f: giây voice → giờ Dinh; cat: chuyển cảnh (xe "nhảy" theo cú máy)
  // từng đoạn theo cú máy C10: đầu cầu Sài Gòn (M48) · ngã tư Hàng Xanh (390 đi đầu, bắn cháy M113) · cầu Thị Nghè · Hồng Thập Tự
  XEX.L1 = L1; XEX.dHX = dHX;
  // 843 húc cổng phụ bên trái, bị kẹt lại ở cổng phụ (TƯ LIỆU §2: S7, S8, S18; vietnamnet); xe 390 húc đổ cổng chính (S34, S33)
  const LC = MV.c10_cau ? (a, b, c, d, e) => [[-999, a], [fD(MV.c10_cau), a], [fD(MV.c10_hx) - cat, a + 160], [fD(MV.c10_hx), b], [fD(MV.c10_tn) - cat, c], [fD(MV.c10_tn), d], [42, e]] : () => [[42, L1]];
  XEX.x843 = await xeTao('data/xe/xe-tang-843.glb', { duong: D843, lich: [...LC(60, dHX - 120, dHX + 10, L1 - 210, L1 + 40), [84, g843], [85.2, g843 + 4], [999, g843 + 4]], hien: (t) => t >= -60, ten: 'Xe tăng 843' });
  XEX.x390 = await xeTao('data/xe/xe-tang-390.glb', { duong: D390, lich: [...LC(15, dHX - 60, dHX + 70, L1 - 255, L1 - 5), [90, g390], [108, dai(D390, D390.length - 1)]], hien: (t) => t >= -60, ten: 'Xe tăng 390' });
  XEX.DL = DL;
  console.log('cầu nội đô', cauTao(CT), cauTao(GOC), cauTao((INST.duong && INST.duong.chu_y) || null));
  // NHÀ CỬA SÀI GÒN 1975 — vị trí xếp sẵn bằng tools/sa_ban/nha/xep_nha.py (props/nha/xep.json), mẫu dung_nha_pho.py (props/nha/nha-pho.glb).
  // Theo ảnh anh Thắng gửi 24/11: nhà phố cũ (4 kiểu chi tiết sát lộ trình xe tăng), phố nhìn từ trên cao (nhà xa: mái ngói, mái tôn, bê tông kín lõi khối phố),
  // nhà lá trên cọc ven kênh (ảnh kênh Hàng Bàng – Chợ Lớn), xuồng, ghe. MINH HOẠ mật độ đô thị, không phải bản đồ từng căn.
  // Vẽ hàng loạt theo ô 1,5 km × kiểu (InstancedMesh), ô xa thì ẩn bớt (ẩn trước: nhà chi tiết, nhà lá, ghe).
  { const [g, X] = await Promise.all([glbLoad('data/nha/nha-pho.glb'), fetch(PU('data/nha/xep.json')).then((r) => r.json())]);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), Y1 = new THREE.Vector3(0, 1, 0), cl = new THREE.Color(), O = 1500;
    const DT = matchMedia('(pointer: coarse)').matches || Math.min(screen.width, screen.height) < 820;   // điện thoại, máy tính bảng: tỉa tiếp, nhìn gần hơn
    XEX.nha = []; let tong = 0;
    // V1.9 (anh Thắng: 11:57 giữa ngã tư Hàng Xanh có cái nhà, nhìn không hợp lý): bỏ nhà nằm trên lòng đường đoàn xe đi (cách tim đường < 12 m)
    // và mọi nhà trong vòng 55 m quanh tâm ngã tư Hàng Xanh
    const TUYEN = [CT, GOC].filter((P) => P && P.length > 1), treoDuong = (x, y) => { if (Math.hypot(x - HX.x, -y - HX.z) < 55) return true;
      for (const P of TUYEN) for (let k = 1; k < P.length; k++) { const [ax, ay] = P[k - 1], [bx, by] = P[k], dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1, u = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / l2));
        if (Math.hypot(x - ax - u * dx, y - ay - u * dy) < 12) return true; } return false; };
    for (const [kieu, A0] of Object.entries(X.kieu)) {
      const ten = kieu.replace(/[~^]/g, ''), tia = kieu.endsWith('^') || ten === 'Xuong' || ten === 'Ghe' ? 0 : !ten.startsWith('Xa') ? 0.5 : DT ? (kieu.endsWith('~') ? 0.91 : 0.86) : (kieu.endsWith('~') ? 0.85 : 0.81);   /* V1.6 (22:04): giảm thêm một nửa, cả nhà chi tiết, nhà lá; giữ nhà sát lộ trình */   // '^': sát lộ trình (không tỉa); '~': lõi khối phố — anh Thắng V1.2: bớt nhà để thêm xe
      const A = []; for (let i = 0; i < A0.length; i += 4) if ((!tia || ((((i >> 2) * 2246822519) >>> 0) / 4294967296) >= tia) && !cauGan(A0[i], -A0[i + 1], 40) && !(A0[i] > 1450 && A0[i + 1] < 900 && A0[i + 1] > -2600) && !treoDuong(A0[i], A0[i + 1])) A.push(A0[i], A0[i + 1], A0[i + 2], A0[i + 3]);   // bỏ nhà che lối lên cầu; bỏ hết nhà bán đảo Thủ Thiêm (V1.3: máy quay không nhìn sang đó)
      const src = g.scene.getObjectByName(ten); if (!src) continue; const mesh = src.isMesh ? src : src.children.find((c) => c.isMesh);
      mesh.updateWorldMatrix(true, false); const mq = mesh.matrixWorld.clone();             // ma trận giải nén toạ độ (meshopt lượng tử hoá)
      const la = ten.startsWith('La'), ghe = ten === 'Xuong' || ten === 'Ghe', xa = (la || ghe || ten.startsWith('Nha') ? 1800 : 5200) * (DT ? 0.65 : 1), o = new Map();
      for (let i = 0; i < A.length; i += 4) { const k = Math.floor(A[i] / O) + ',' + Math.floor(A[i + 1] / O); if (!o.has(k)) o.set(k, []); o.get(k).push(i); }
      for (const [k, L] of o) {
        const im = new THREE.InstancedMesh(mesh.geometry, mesh.material, L.length); let cx = 0, cz = 0;
        L.forEach((i, n) => { const x = A[i], z = -A[i + 1], h = ghe ? 0.3 : la ? Math.max(hG(x, z), 0.6) + 0.5 : hG(x, z) - 0.2, r = ((i * 2654435761) >>> 0) / 4294967296;
          m4.compose(new THREE.Vector3(x, h, z), q.setFromAxisAngle(Y1, A[i + 2] * Math.PI / 180), new THREE.Vector3(A[i + 3] / 100, 1, 1)); im.setMatrixAt(n, m4.multiply(mq));
          const c = 0.8 + r * 0.28; im.setColorAt(n, cl.setRGB(c, c * (0.96 + r * 0.05), c * (0.92 + r * 0.06))); cx += x; cz += z; });
        im.computeBoundingSphere(); im.userData.tam = new THREE.Vector3(cx / L.length, 0, cz / L.length); im.userData.xa = xa; scene.add(im); LAYER.nha.push(im); XEX.nha.push(im); tong += L.length; } }
    XEX.nhaTong = tong; }
  // TÀU HẢI QUÂN VNCH kiểu PCE (ảnh HQ-07 anh Thắng gửi) neo ở bến Bạch Đằng — Bộ Tư lệnh Hải quân, mục tiêu hướng Đông (S3, S6). Kích thước lớp PCE: S43. Số tàu, vị trí neo: MINH HOẠ.
  { const g = await glbLoad('data/tau/tau-hq-pce.glb');
    for (const [x, y] of [[1312, -215], [1316, -290]]) { const o = g.scene.clone(true); o.position.set(x, 0.3, -y); o.rotation.y = Math.atan2(0.058, -0.998) + Math.PI; scene.add(o); LAYER.xe.push(o); } }
  // CỜ MẶT TRẬN trên khí tài Quân Giải phóng (anh Thắng dặn 24/11; ảnh tư liệu 30/4: xe tăng cắm cờ trên tháp pháo; "xe nào cũng được trang bị lá cờ", S12/baophapluat).
  // Bùi Quang Thận tháo lá cờ trên tháp pháo xe 843 mang lên nóc Dinh (S37) → cờ xe 843 biến mất khi anh rời xe.
  const coXeTex = new THREE.TextureLoader().load('data/co-mtdtgp.png'); coXeTex.colorSpace = THREE.SRGBColorSpace;
  const coXe = (obj, cao = 2.0, w = 1.15) => {
    const bb = new THREE.Box3().setFromObject(obj), sz = bb.getSize(new THREE.Vector3()), g = new THREE.Group();
    const can = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, cao, 5).translate(0, cao / 2, 0), new THREE.MeshLambertMaterial({ color: 0x3a2c1c }));
    const m = new THREE.MeshLambertMaterial({ map: coXeTex, side: THREE.DoubleSide }); m.onBeforeCompile = (sh) => { sh.uniforms.uT = U.time;
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uT;').replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed.x += sin(uv.x * 6.0 - uT * 6.0) * 0.12 * uv.x;'); };
    const la = new THREE.Mesh(new THREE.PlaneGeometry(w, w * 0.66, 10, 2).translate(w / 2, cao - w * 0.33, 0).rotateY(Math.PI / 2), m);   // lá cờ bay về phía sau xe (−z)
    g.add(can, la); g.position.set(sz.x * 0.17, sz.y * 0.8, -sz.z * 0.1); obj.add(g); return g; };
  XEX.co843 = coXe(XEX.x843.obj); XEX.co390 = coXe(XEX.x390.obj); XEX.coXe = coXe;
  // V2.0: mẫu kho T-54B không gắn số hiệu (quy ước kho) → dán số 390, 843 hai bên tháp pháo (con của nút 'thap', theo tháp khi quay).
  // Chữ trắng viền tối; vị trí theo ảnh hiện vật: số trên vách tháp, hơi lùi về sau. Kiểu chữ: MINH HOẠ.
  const soHieu = (obj, so) => { const thap = obj.getObjectByName('thap'); if (!thap) return; const cv = document.createElement('canvas'); cv.width = 256; cv.height = 128;
    const c = cv.getContext('2d'); c.font = 'bold 96px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 10; c.strokeStyle = 'rgba(30,32,22,.9)'; c.strokeText(so, 128, 68); c.fillStyle = '#f2efe4'; c.fillText(so, 128, 68);
    const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4;
    const m = new THREE.MeshLambertMaterial({ map: tx, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 });
    obj.updateMatrixWorld(true); const rc = new THREE.Raycaster(), M = [], inv = new THREE.Matrix4().copy(thap.matrixWorld).invert(); thap.traverse((x) => { if (x.isMesh) M.push(x); });
    for (const sg of [1, -1]) { const o = thap.localToWorld(new THREE.Vector3(sg * 3, 0.42, -0.2)), d = thap.localToWorld(new THREE.Vector3(0, 0.42, -0.2)).sub(o).normalize();   // chiếu tia từ ngoài vào vách tháp
      rc.set(o, d); const h = rc.intersectObjects(M, false)[0]; if (!h) continue; const n = h.face.normal.clone().transformDirection(h.object.matrixWorld);
      const p = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.31), m); p.position.copy(h.point).addScaledVector(n, 0.012); p.lookAt(p.position.clone().add(n));
      p.updateMatrix(); p.applyMatrix4(inv); thap.add(p); } };
  soHieu(XEX.x843.obj, '843'); soHieu(XEX.x390.obj, '390');
  // ĐOÀN XE CHỞ BỘ BINH theo sau xe tăng (anh Thắng 24/11, mốc 12:22 — đường Hồng Thập Tự): Trung đoàn 66 đi cùng Lữ đoàn 203 trong mũi thọc sâu
  // (giaoduc.net.vn: "Trung đoàn 66 cùng với xe tăng của Lữ đoàn 203"). Số xe, thứ tự xe tải / K-63, khoảng cách: MINH HOẠ. Đoàn dừng ngoài cổng, bộ binh xuống xe vào sân.
  { const KX = ['tang', 'tai', 'tai', 'k63', 'tai', 'tang', 'tai', 'tai', 'k63', 'tai', 'tang', 'tai', 'tai', 'k63'], L390 = [...LC(15, dHX - 60, dHX + 70, L1 - 255, L1 - 5), [90, g390]];
    XEX.doan = [];
    for (let k = 0; k < KX.length; k++) {
      const lui = 34 + k * 21, ld = (d) => Math.max(0, d - lui), dung = g390 - 22 - k * 13;     // dừng thành hàng trên đại lộ Thống Nhất, trước cổng
      const X = await xeTao(KX[k] === 'tai' ? 'data/xe/xe-tai.glb' : KX[k] === 'tang' ? 'data/xe/xe-tang-390.glb' : 'data/xe/xe-boc-thep-k63.glb', { duong: D390, lich: [...L390.map(([t, d]) => [t, ld(d)]), [90 + k * 0.8, Math.min(dung, ld(g390))], [999, Math.min(dung, ld(g390))]],
        hien: (t) => t >= fD(MV.c10_tn) - 1, lech: k % 2 ? 1.6 : -1.6, ten: KX[k] === 'tai' ? 'Xe tải chở bộ binh' : KX[k] === 'tang' ? 'Xe tăng T-54' : 'Xe bọc thép K-63' });
      if (KX[k] === 'tang') X.obj.traverse((m) => { if (/^so-hieu/.test(m.name)) m.visible = false; });
      coXe(X.obj, KX[k] === 'tai' ? 2.4 : 2.0, 1.0); LAYER.xe.push(X.obj); XEX.doan.push({ X, loai: KX[k], k }); }
    DAM.push((t) => { for (const { X, loai, k } of XEX.doan) { if (!ganMay(X.obj.position.x, X.obj.position.z, 600)) continue; if (t < 93 + k * 0.6) linhTrenXe(X.obj, loai, t, 1, k * 9);
        if (t < 89.5) buiXe(X.obj, 1, t, 0x9a948a); }
      for (const X of [XEX.x843, XEX.x390]) if (X && X.obj.visible && t < 89 && ganMay(X.obj.position.x, X.obj.position.z, 600)) buiXe(X.obj, 1.2, t, 0x8a857c);
      if (XEX.x390 && XEX.x390.obj.visible && t < 89) for (const [i, P] of LINH_XE.tang.slice(0, 4).entries()) { const [x, y, z, yaw] = quayXe(XEX.x390.obj, P[0], P[1], P[2]); dongDat('qgp', 'ngoi', t, i * 0.3, x, y, z, yaw + P[3] * Math.PI / 2, 1, i); } }); }   // bộ binh ngồi trên sàn xe 390
  // XE TĂNG BẮN NHAU (anh Thắng 24/11). Đầu cầu Sài Gòn: đối phương chống trả quyết liệt (Tiền Phong 30/4/2026), M48 chặn đầu cầu (S33), hai M48 bị bắn cháy
  // (giaoduc.net.vn: ĐKZ). Cầu Thị Nghè: xe 843 bắn cháy 2 xe M41 (S26). Chớp nòng, đường đạn, nổ, cháy theo câu đọc; từng phát bắn: MINH HOẠ.
  XEX.ban = [];                                                                              // { tu, a: () => điểm nòng, b: () => điểm trúng, no: true khi trúng xe }
  // NGƯỜI DÂN SÀI GÒN 1975 cận cảnh (có xương; mẫu anh Thắng 24/11: nữ áo dài, nam sơ mi quần tây) — trước cổng Dinh, vẫy tay, vỗ tay khi xe tăng vào.
  // Vị trí, số người là TÁI DỰNG MINH HOẠ (S32: người dân đổ ra đường trưa 30/4).
  { const rnd = (() => { let a = 30475; return () => (a = (a * 16807) % 2147483647) / 2147483647; })(), CL = ['vay', 'vay2', 'vota', 'dung', 'vay'];
    for (let i = 0; i < 26; i++) {
      const sg = i % 2 ? 1 : -1, sd = sg * (17 + rnd() * 26), dd = 152 + rnd() * 22, [x, y] = DL(sd, dd), [cx, cy] = DL(sd * 0.4, 146);
      const yaw = Math.atan2(cx - x, -cy + y), clip = CL[i % CL.length], t0 = 156 + rnd() * 10, nu = i % 3 !== 0;   // ra đường sau khi cờ lên (giờ Dinh 158 = câu "tại Đài phát thanh")
      nvxTao('models/' + (nu ? 'dan-sg-nu' : 'dan-sg-nam') + '.glb', (t) => (t < t0 ? null : { x, z: -y, yaw, clip: t < t0 + 3 ? 'di' : clip, toc: 0.85 + (i % 5) * 0.07 }), { ten: 'Người dân Sài Gòn' })
        .catch((e) => console.warn('dân SG', e));
    } }
  // CẮM CỜ TRÊN NÓC DINH (cảnh T03): Đại đội trưởng Bùi Quang Thận (trưởng xe 843) tháo lá cờ Mặt trận trên tháp pháo, không mang vũ khí,
  // chạy vào Dinh (S37); trên nóc hạ lá cờ ba sọc — cờ to, vải dày nên mất nhiều phút (S37, S38); đúng 11 giờ 30 cờ được kéo lên cột cờ (S38).
  { const H = XEX.hDinh, P3 = (a, b) => { const [x, y] = DL(a, b); return { x, z: -y }; }, cot = P3(0, -4), dung = P3(1.0, -2.6), cua = P3(0, 20);   // chân bậc thềm (nền Dinh cao 2,7 m)
    const yawTo = (f, t) => Math.atan2(t.x - f.x, t.z - f.z), lerpP = (a, b, u) => ({ x: a.x + (b.x - a.x) * u, z: a.z + (b.z - a.z) * u });
    XEX.than = await nvxTao('models/linh-tang.glb', (t) => {
      if (t < 115) return null;
      const X = XEX.x843.obj.position, ben = { x: X.x + Math.cos(yawXe(XEX.x843.obj)) * 2.6, z: X.z - Math.sin(yawXe(XEX.x843.obj)) * 2.6 };
      if (t < 116.4) { const u = (t - 115) / 1.4; const p = lerpP(X, ben, u); return { ...p, y: X.y + 1.35 * (1 - u), yaw: yawTo(X, ben), clip: 'leo' }; }
      // anh Thắng 24/11: dáng chạy dứt khoát như bộ binh, tốc độ thật (~7 m/s). Quãng cổng phụ → thềm Dinh ~135 m dài hơn thời gian câu đọc → hai đoạn chạy thật,
      // nối ở chỗ chuyển cú máy (T03-A → T03-A2, câu "chạy").
      const L = Math.hypot(cua.x - ben.x, cua.z - ben.z), V = 7, TOC = 7 / 9.2,   /* nhịp bước 'chaynhanh' 9,2 m/s (đo khi nướng) → chân khớp tốc độ, không trượt */ dx = (cua.x - ben.x) / L, dz = (cua.z - ben.z) / L, yaw = yawTo(ben, cua);
      if (t < 122.5) { const d = Math.min(L, V * (t - 116.4)); return { x: ben.x + dx * d, z: ben.z + dz * d, yaw, clip: 'chaynhanh', toc: TOC }; }   // từ xe 843 kẹt ở cổng phụ chạy vào sân
      if (t < 128) { const d = Math.min(L, V * (128 - t)); return { x: cua.x - dx * d, z: cua.z - dz * d, yaw, clip: 'chaynhanh', toc: TOC }; }        // băng qua bãi cỏ tới thềm
      if (t < 129) return null;                                                                // trong Dinh, lên cầu thang
      const keo = t >= 131 && t < 146;
      return { ...dung, y: H + 27.5, yaw: t < 147 ? yawTo(dung, cot) : yawTo(dung, P3(1.0, 20)), clip: keo ? 'keo' : 'dung' };
    }, { ten: 'Bùi Quang Thận' });
    const cv = (src) => { const tx = new THREE.TextureLoader().load(src); tx.colorSpace = THREE.SRGBColorSpace; return tx; };
    const coMat = (tx) => { const m = new THREE.MeshLambertMaterial({ map: tx, side: THREE.DoubleSide }); m.onBeforeCompile = (sh) => { sh.uniforms.uT = U.time;
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uT;').replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed.z += sin(uv.x * 6.0 - uT * 5.0) * 0.16 * uv.x;'); }; return m; };
    const co = (src, w, h) => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.PlaneGeometry(w, h, 12, 3).translate(w / 2, -h / 2, 0), coMat(cv(src)));
      g.add(m); g.position.set(cot.x, H + 27.5, cot.z); g.rotation.y = -0.7441; scene.add(g); LAYER.xe.push(g); return g; };
    XEX.coVnch = co('data/co-vnch.png', 2.4, 1.6); XEX.coMt = co('data/co-mtdtgp.png', 1.8, 1.2);
    // V2.0 (anh Thắng 29/11): Bùi Quang Thận chạy vào Dinh, TAY PHẢI ÔM LÁ CỜ MẶT TRẬN tháo từ tháp pháo 843 (S37) — không chạy tay không.
    // Lá cờ cuộn lại một nửa, gắn vào xương bàn tay phải (động tác chạy vung tay thì cờ theo tay); phần chưa cuộn buông xuống, bay theo gió.
    { const tay = XEX.than.obj.getObjectByName('mixamorigRightHand'); if (tay) { XEX.than.obj.updateMatrixWorld(true); const ws = tay.getWorldScale(new THREE.Vector3()).x || 1;
        const tx = cv('data/co-mtdtgp.png'), g = new THREE.Group(), cuon = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.5, 10, 1, false), new THREE.MeshLambertMaterial({ map: tx }));
        cuon.rotation.z = Math.PI / 2; const buong = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.42, 8, 3).translate(0, -0.21, 0), coMat(tx)); buong.position.set(0, -0.03, 0.05);
        g.add(cuon, buong); g.scale.setScalar(1 / ws); g.position.set(0, 0.06 / ws, 0.04 / ws); tay.add(g); XEX.coTay = g; XEX.coTayBuong = buong; g.visible = false; } }
    XEX.coCap = (t) => {                                                                     // độ cao mép trên lá cờ so với chân cột (cột 7 m)
      const hv = t < 131 ? 6.9 : t < 137 ? 6.9 - (t - 131) / 6 * 5.6 : -1, hm = t < 139 ? -1 : 1.4 + Math.min(1, (t - 139) / 6) * 5.5;
      XEX.coVnch.visible = hv > 0; XEX.coVnch.position.y = H + 27.5 + hv; XEX.coMt.visible = hm > 0; XEX.coMt.position.y = H + 27.5 + hm;
      if (XEX.coTay) { XEX.coTay.visible = t >= 116.4 && t < 139;   // ôm cờ từ lúc xuống xe tới lúc buộc cờ lên cột
        if (XEX.coTay.visible) { const B = XEX.coTayBuong, q = new THREE.Quaternion(); XEX.coTay.updateWorldMatrix(true, false); XEX.coTay.getWorldQuaternion(q);   // phần cờ buông luôn rủ xuống đất
          B.quaternion.copy(q.invert()).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), XEX.than.obj.rotation.y + Math.PI / 2)); } }
    }; }
  // Xác M41 cháy án ngữ đầu cầu Thị Nghè: xe 387 bắn cháy một M41 và một M113 ở đây sáng 30/4 (S36).
  { const D = duong(GOC), tn = [LLx(MOC.thinghe[0], MOC.thinghe[1]), LLz(MOC.thinghe[0], MOC.thinghe[1])];
    let best = [1e9, 0]; for (let d = 0; d < D.L; d += 5) { const p = diemTren(D, d), e = Math.hypot(p.x - tn[0], p.z - tn[1]); if (e < best[0]) best = [e, d]; }
    const p = diemTren(D, best[1] + 45), g = await glbLoad('data/xe/xe-tang-m41.glb'), o = g.scene.clone(true);
    XEX.matsCua = (o) => { const M = []; o.traverse((m) => { if (m.isMesh) { if (!m.material.userData.rieng) { m.material = m.material.clone(); m.material.userData.rieng = 1; } M.push([m.material, m.material.color.clone()]); } }); return M; };   // cháy đen từ lúc trúng đạn (tu)
    const x = p.x + Math.cos(p.yaw) * 9, z = p.z - Math.sin(p.yaw) * 9; o.position.set(x, hG(x, z), z); o.rotation.set(0.04, p.yaw + 2.3, -0.06); scene.add(o);
    XEX.m41chay = o; LAYER.xe.push(o);
    const cv = document.createElement('canvas'); cv.width = cv.height = 64; const cx = cv.getContext('2d'), gr = cx.createRadialGradient(32, 32, 2, 32, 32, 31);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); cx.fillStyle = gr; cx.fillRect(0, 0, 64, 64);
    const km = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), color: 0x3a3836, transparent: true, opacity: 0.4, depthWrite: false });   // khói đen bốc lên
    const khoi = () => Array.from({ length: 10 }, (_, i) => { const sp = new THREE.Sprite(km.clone()); sp.userData.k = i / 10; scene.add(sp); LAYER.xe.push(sp); return sp; });
    XEX.chay = [{ o, khoi: khoi() }]; XEX.khoiTao = khoi;
    // xác M113 cháy cạnh M41, bên kia đường (S36: xe 387 bắn cháy M41 và M113 án ngữ cầu Thị Nghè)
    { const q = diemTren(D, best[1] + 60), g2 = await glbLoad('data/xe/xe-boc-thep-m113.glb'), o2 = g2.scene.clone(true);
      const x2 = q.x - Math.cos(q.yaw) * 8, z2 = q.z + Math.sin(q.yaw) * 8; o2.position.set(x2, hG(x2, z2), z2); o2.rotation.set(-0.03, q.yaw - 0.6, 0.05); scene.add(o2); LAYER.xe.push(o2);
      XEX.chay.push({ o: o2, khoi: khoi() }); }
    // M113 ở ngã tư Hàng Xanh: lời dẫn (S36) — xe 390 bắn cháy chiếc M113 cản đường. Vị trí trên ngã tư, hướng xe: MINH HOẠ.
    if (MV.c10_ban) { const DC = duong(CT), q = diemTren(DC, XEX.dHX + 35), g4 = await glbLoad('data/xe/xe-boc-thep-m113.glb'), o4 = g4.scene.clone(true);
      const mats = []; o4.traverse((m) => { if (m.isMesh) { m.material = m.material.clone(); mats.push([m.material, m.material.color.clone()]); } });
      const x4 = q.x + Math.cos(q.yaw) * 5, z4 = q.z - Math.sin(q.yaw) * 5; o4.position.set(x4, hG(x4, z4), z4); o4.rotation.y = q.yaw + Math.PI + 0.25; scene.add(o4); LAYER.xe.push(o4);
      const tu = tDinh(MV.c10_ban + 1.2); XEX.m113hx = o4; XEX.chay.push({ o: o4, khoi: khoi(), tu, mats });
      const spr = (col) => { const sp = new THREE.Sprite(km.clone()); sp.material.color.set(col); sp.material.opacity = 0.95; sp.visible = false; scene.add(sp); return sp; };
      XEX.loe = spr(0xffd08a); XEX.no113 = spr(0xff8a3a); XEX.tBan = tDinh(MV.c10_ban + 0.6); }
    // M48 ở đầu cầu Sài Gòn phía nội đô (S33: tại đầu cầu Sài Gòn, đơn vị xe tăng ta đối mặt xe tăng M48) — tình trạng xe không rõ trong nguồn, đặt nguyên vẹn
    { const cs = LL(MOC.causg[0], MOC.causg[1]), g3 = await glbLoad('data/xe/xe-tang-m48.glb'), o3 = g3.scene.clone(true);
      const pm = diemTren(duong(CT), 150), x3 = pm.x + Math.cos(pm.yaw) * 7, z3 = pm.z - Math.sin(pm.yaw) * 7; o3.position.set(x3, hG(x3, z3), z3); o3.rotation.y = pm.yaw + Math.PI + 0.35;  /* chặn đầu cầu phía nội đô, mũi hướng về cầu */ scene.add(o3); LAYER.xe.push(o3); XEX.m48 = o3; } }
  // GHIM TÊN ĐƯỜNG (tên năm 1975) và TÊN KHÍ TÀI (anh Thắng 24/11). Đoạn Hàng Xanh – Thị Nghè chưa chắc tên năm 1975 → chưa ghim.
  XEX.ghimND = () => { const DC = duong(CT), DG = duong(GOC), du = (D, d, ten) => { const p = diemTren(D, d); const L = addLabel(ten, p.x, p.z, 'vil duong', { maxDist: 2500 }); L.yFn = () => hG(p.x, p.z) + 14; };
    du(DC, Math.min(400, XEX.dHX * 0.5), 'Xa lộ Biên Hòa'); du(DC, XEX.dHX, 'Ngã tư Hàng Xanh'); du(DG, DG.L * 0.35, 'Đường Hồng Thập Tự'); du(DG, DG.L - 160, 'Đại lộ Thống Nhất');
    const gx = (ten, get, dy = 4.2, xa = 450) => { const L = addLabel(ten, 0, 0, 'hero ly', { grp: 'hero', maxDist: xa }); L.dyn = get; L.dy = dy; };
    const vt = (o) => () => (o.visible ? o.position : null);
    gx('Xe tăng M48 (đối phương)', vt(XEX.m48)); gx('Xe tăng M41 (đối phương)', vt(XEX.chay[0].o)); gx('Xe bọc thép M113 (đối phương)', vt(XEX.chay[1].o));
    if (XEX.m113hx) gx('Xe bọc thép M113 (đối phương)', vt(XEX.m113hx));
    const d1 = XEX.doan.find((d) => d.loai === 'tai'), d2 = XEX.doan.find((d) => d.loai === 'k63');
    if (d1) gx('Xe tải chở bộ binh (Quân Giải phóng)', vt(d1.X.obj), 4); if (d2) gx('Xe bọc thép K-63 (Quân Giải phóng)', vt(d2.X.obj), 4); };   // gọi sau khi có addLabel
  // ---- XE TĂNG BẮN NHAU, BỘ BINH GIAO TRANH Ở CẦU (anh Thắng 24/11). Phát bắn, vị trí bộ binh: MINH HOẠ theo câu đọc.
  { const V3 = (x, y, z) => new THREE.Vector3(x, y, z), tD = tDinh, nong = (X, k = 4.2) => () => { const o = X.obj || X; if (!o.visible) return null; const y = o.rotation.y; return V3(o.position.x + Math.sin(y) * k, o.position.y + 2.2, o.position.z + Math.cos(y) * k); };
    const than = (o) => () => V3(o.position.x, o.position.y + 1.4, o.position.z), canh = (o, dx, dz) => () => V3(o.position.x + dx, hG(o.position.x + dx, o.position.z + dz) + 0.5, o.position.z + dz);
    const m48 = XEX.m48, mats48 = []; m48.traverse((m) => { if (m.isMesh) { m.material = m.material.clone(); mats48.push([m.material, m.material.color.clone()]); } });
    const k48 = () => { const y = m48.rotation.y; return () => V3(m48.position.x + Math.sin(y) * 5, m48.position.y + 2.2, m48.position.z + Math.cos(y) * 5); };
    // đầu cầu Sài Gòn: M48 bắn trước (trượt, nổ cạnh xe 843), xe ta bắn trả, M48 trúng đạn bốc cháy (tiếng đại bác, nổ đã có ở mốc c10_m48 + 1,6 / 2,1)
    banTao(tD(MV.c10_m48 + 0.5), k48(), canh(XEX.x843.obj, 6, -5)); banTao(tD(MV.c10_m48 + 1.6), nong(XEX.x843), than(m48));
    banTao(tD(MV.c10_m48 + 4.2), nong(XEX.x390), than(m48));
    XEX.chay.push({ o: m48, khoi: XEX.khoiTao(), tu: tD(MV.c10_m48 + 2.0), mats: mats48 });
    // bộ binh Trung đoàn 66 (ta) bám xe tăng ở đầu cầu, đối phương chốt quanh M48 phía nội đô
    { const DC = duong(CT), r = rndS(66), A = [], B = [], p0 = diemTren(DC, 40), f = V3(m48.position.x - p0.x, 0, m48.position.z - p0.z).normalize(), n = V3(f.z, 0, -f.x), yf = Math.atan2(f.x, f.z);
      for (let i = 0; i < 22; i++) { const p = diemTren(DC, 10 + r() * 70), s = (r() < 0.5 ? -1 : 1) * (4 + r() * 7); A.push([p.x + Math.cos(p.yaw) * s, p.z - Math.sin(p.yaw) * s, yf + (r() - 0.5) * 0.4, r() < 0.5 ? 'quy' : 'ban']); }
      for (let i = 0; i < 16; i++) { const a = 8 + r() * 40, b = (r() - 0.5) * 50; B.push([m48.position.x + f.x * a + n.x * b, m48.position.z + f.z * a + n.z * b, yf + Math.PI + (r() - 0.5) * 0.4, r() < 0.4 ? 'quy' : 'ban']); }
      giaoTranh({ dong: true, t0: tD(MV.c10_cau), t1: tD(MV.c10_m48 + 5), A, B, chet: 0.4, sau: tD(MV.c10_hx) - tD(MV.c10_m48 + 5), r: 900 }); uNap(A, B, f, yf, 1, 6666); }
    // cầu Thị Nghè: M41 bắn trước, xe 843 bắn cháy M41 (S26), xe cùng đoàn bắn cháy M113 (S36: xe 387)
    const [c41, c113] = XEX.chay; c41.mats = XEX.matsCua(c41.o); c113.mats = XEX.matsCua(c113.o); c41.tu = tD(MV.c10_tn + 2.6); c113.tu = tD(MV.c10_tn + 4.6);
    const k41 = () => { const o = c41.o, y = o.rotation.y; return V3(o.position.x + Math.sin(y) * 4.5, o.position.y + 2.0, o.position.z + Math.cos(y) * 4.5); };
    banTao(tD(MV.c10_tn + 0.8), k41, canh(XEX.x843.obj, -5, 7)); banTao(tD(MV.c10_tn + 2.2), nong(XEX.x843), than(c41.o)); banTao(tD(MV.c10_tn + 4.2), nong(XEX.x390), than(c113.o)); }
  const tren = (X, dy, lui) => (t) => { if (!X.obj.visible) return null; const p = X.obj.position, y = yawXe(X.obj); return { x: p.x - Math.sin(y) * lui, z: p.z - Math.cos(y) * lui, y: p.y + dy, yaw: y, clip: 'dung' }; };   // trưởng xe đứng ở cửa tháp pháo
  const t843 = tren(XEX.x843, 1.35, 0.4);
  XEX.lai843 = await nvxTao('models/linh-tang.glb', (t) => (t < 115 ? t843(t) : null), { ten: 'Trưởng xe 843' });   // từ 1:55 Bùi Quang Thận rời xe (nhân vật riêng bên dưới)
  XEX.lai390 = await nvxTao('models/linh-tang.glb', tren(XEX.x390, 1.35, 0.4), { ten: 'Trưởng xe 390' });
  for (const X of [XEX.x843, XEX.x390]) LAYER.xe.push(X.obj);
}
if (TANG === 'noi-do' && DUONG_DINH.length) {
  // NGƯỜI DÂN SÀI GÒN đón quân giải phóng trưa 30/4 (S32; nhandan.vn: lúc xe tăng vào đường rất vắng, sau đó người dân tràn ra đường): đứng thẳng hai bên
  // đường thành hàng, quay mặt ra lòng đường, vẫy cờ Mặt trận, vẫy hoa, vỗ tay. Áo dài nhiều màu, đàn ông sơ mi; tỉ lệ các kiểu: MINH HOẠ.
  // V2.0 (anh Thắng 29/11): dân đứng thẳng VẪY TAY, VỖ TAY chào đón xe tăng — chỉ giữ các động tác đứng thẳng (vẫy, vỗ tay); bỏ mẫu áo Nam bộ (mẫu Rạch Gầm
  // dáng khom, cao đỉnh đầu 1,3–1,4 m so với 1,64 m khi đứng thẳng) và động tác 'vay2', 'dung'; số người giảm một nửa cho nhẹ. Tỉ lệ các kiểu: MINH HOẠ.
  const LOAI = [['nuco', 'dan-sg-nu-co', ['trang', 'xanh', 'vang', 'hong'], ['vay']], ['nuhoa', 'dan-sg-nu-hoa', ['trang', 'hong', 'xanh'], ['vay']],
    ['nu', 'dan-sg-nu', ['trang', 'xanh', 'hong', 'tim'], ['vota', 'vay', 'vota']], ['namco', 'dan-sg-nam-co', ['trang', 'ke'], ['vay']], ['nam', 'dan-sg-nam', ['trang', 'kem', 'xanh'], ['vota', 'vay']]];
  const TL = [0.15, 0.25, 0.25, 0.1, 0.25];
  for (const [ten, nvz, mau] of LOAI) mau.forEach((m, i) => dongNap(ten + i, nvz, (ten === 'nuhoa' ? 'dan-sg-nu-co' : nvz) + '-' + m, 500));
  const D = duong(DUONG_DINH), L0 = D.L, rnd = rndS(1975);
  const chon = () => { let r = rnd(), k = 0; while (k < TL.length - 1 && r > TL[k]) r -= TL[k++]; const L = LOAI[k]; return { ten: L[0] + Math.floor(rnd() * L[2].length), clip: L[3][Math.floor(rnd() * L[3].length)], sc: 1 }; };
  for (let d = 40; d < L0 - 200;) {                                                      // hai bên đường, hai hàng, mỗi 1,4–2 m một người; chừa khoảng trống ở ngã tư, hẻm
    if (rnd() < 0.08) { d += 18 + rnd() * 25; continue; }
    for (const s of [-1, 1]) for (const h of [0, 1]) { if (rnd() < 0.735) continue; /* V1.6: giảm một nửa; V1.9: đông lại một chút; V2.0 (29/11): giảm tiếp một nửa cho nhẹ */ const c = chon();
      DAN.push({ ...c, d: d + (h ? 0.7 : 0) + rnd() * 0.3, lech: s * (10.6 + h * 1.25 + rnd() * 0.3), quay: s, ph: rnd(), vi: DAN.length, t0: 20 + rnd() * 5 + d / L0 * 6 }); }   // anh Thắng V1.2: dân ra đứng hai bên đường cổ vũ khi đoàn xe tăng đi qua
    d += 1.4 + rnd() * 0.6;
  }
  // V2.0: bỏ người đi bộ sát mặt tiền (anh Thắng: chỉ dùng người đứng thẳng vẫy tay, vỗ tay)
  const G = (() => { const [x, y] = XEX.DL(0, 160); const p = diemTren(D, L0 - 95); return { x, z: -y, yaw: p.yaw }; })();   // ngoài cổng Dinh, đầu đại lộ Thống Nhất
  for (let i = 0; i < 65; i++) {   // V1.6: 260 → 130; V2.0: → 65                                                        // trước cổng: dân kéo tới, đứng thành từng lớp hai bên, chừa lòng đường
    const r = 8 + rnd() * 50, lat = (rnd() < 0.5 ? -1 : 1) * (12 + rnd() * 30), sy = Math.sin(G.yaw), cy = Math.cos(G.yaw), c = chon();
    DAN.push({ ...c, cong: true, x: G.x - sy * r + cy * lat, z: G.z - cy * r - sy * lat, ph: rnd(), vi: i, t0: 150 + rnd() * 10, buoc: 4 + rnd() * 8 });
  }
  XEX.DAN = DAN;   // V2.1: đoạn phố chi tiết nâng dân lên mặt vỉa hè
  const ben = (d, lech) => { const p = diemTren(D, d); return { x: p.x + Math.cos(p.yaw) * lech, z: p.z - Math.sin(p.yaw) * lech, yaw: p.yaw }; };
  for (const N of DAN) if (!N.cong && !N.di) { const p = ben(N.d, N.lech); N.x = p.x; N.z = p.z; N.y = hG(p.x, p.z) + 0.1; N.yaw = p.yaw - N.quay * Math.PI / 2 + (rnd() - 0.5) * 0.25; }   /* V2.0: trước đây dấu sai → dân quay lưng ra đường */ else if (N.di) { const p = ben(N.d, N.lech); N.x = p.x; N.z = p.z; }   // quay mặt ra đường
  DAM.push((t) => {
    const r = camera.position.y < 300 ? 420 : 900;
    for (const N of DAN) {
      if (t < N.t0 || !ganMay(N.x, N.z, r)) continue;
      if (N.cong) {                                                                       // đi về phía cổng rồi đứng lại
        const u = Math.min(1, (t - N.t0) / 9), dx = G.x - N.x, dz = G.z - N.z, l = Math.hypot(dx, dz) || 1, w = Math.min(N.buoc, l - 6) * u, px = N.x + dx / l * w, pz = N.z + dz / l * w;
        const di = u < 1 && DONG[N.ten] && DONG[N.ten].clips.di;   // V1.9: đang đi tới thì bước chân (khớp nhịp bước), không trượt
        dongDat(N.ten, di ? 'di' : u < 1 ? 'dung' : N.clip, di ? t * (N.buoc / 9) / 2.38 : t, N.ph, px, hG(px, pz) + 0.1, pz, Math.atan2(dx, dz), N.sc || 1, N.vi); continue;
      }
      if (N.di) { const d = N.d + ((N.v * (t - N.t0)) % 60 + 60) % 60 - 30, p = ben(d, N.lech); dongDat(N.ten, 'di', t * Math.abs(N.v) / 2.38, N.ph, p.x, hG(p.x, p.z) + 0.1, p.z, p.yaw + (N.v > 0 ? 0 : Math.PI), 1.0, N.vi); continue; }
      dongDat(N.ten, N.clip, t, N.ph, N.x, N.y, N.z, N.yaw, N.sc || 1, N.vi);
    }
  });
  // BỘ BINH QUÂN GIẢI PHÓNG Ở DINH (ảnh tư liệu trưa 30/4: bộ đội đứng khắp sân, trên thềm, ban công, sân thượng): sau khi xe 390 húc đổ cổng (90 s),
  // bộ binh đi theo xe tăng chạy vào sân rồi toả ra đứng gác; khoảng 118 s lên ban công, 126 s lên sân thượng, mái bằng (sau Bùi Quang Thận). MINH HOẠ.
  { const H = XEX.hDinh, CG = XEX.DL(0, 156), CT2 = XEX.DL(0, 136), L = [], r2 = rndS(304), A0 = XEX.DL(0, 0), A1 = XEX.DL(0, 10), YG = Math.atan2(A1[0] - A0[0], -(A1[1] - A0[1]));   // YG: mặt nhìn ra cổng
    const them = (n, sd0, sd1, dd0, dd1, y, t0, dt, clips) => { for (let i = 0; i < n; i++) { const sd = sd0 + r2() * (sd1 - sd0), dd = dd0 + r2() * (dd1 - dd0), [x, yb] = XEX.DL(sd, dd);
      L.push({ x, z: -yb, y: H + y, t0: t0 + r2() * dt, clip: clips[Math.floor(r2() * clips.length)], ph: r2(), vi: L.length, yaw: YG + (r2() - 0.5) * (y < 1 ? 1.6 : 0.5), chay: y < 3 }); } };
    // V1.6 (anh Thắng 22:04: "bỏ bớt lính ở Dinh, khoảng 30 lính"): 204 → 30
    them(8, -95, -30, 25, 138, 0.05, 92, 14, ['dung', 'quansat', 'quy', 'quansat']); them(8, 30, 95, 25, 138, 0.05, 92, 14, ['dung', 'quansat', 'quy', 'quansat']);   // hai bãi cỏ
    them(6, -40, 40, 4, 10.5, 2.75, 100, 12, ['dung', 'dung', 'ban']);                                                  // thềm trước sảnh
    them(2, -6.5, 6.5, 1, 3.5, 11.95, 118, 6, ['dung']);              // ban công giữa
    them(4, -44, 44, -3.5, 0.8, 18.55, 126, 12, ['dung', 'quansat', 'ban']); them(2, -18, 18, -22, -6, 27.55, 129, 8, ['quansat', 'quy']);   // sân thượng, mái bằng
    DAM.push((t) => { if (t < 90) return; const r = camera.position.y < 300 ? 500 : 900;
      for (const N of L) { if (t < N.t0 || !ganMay(N.x, N.z, r)) continue; let x = N.x, z = N.z, clip = N.clip, yaw = N.yaw;
        if (N.chay) { const u = (t - N.t0) * 4.0, l1 = Math.hypot(CT2[0] - CG[0], CT2[1] - CG[1]);   // chạy qua cổng chính (CG → CT2 trong sân) rồi tới chỗ đứng, 4 m/s = nhịp bước động tác 'chay'
          const dx = N.x - CT2[0], dz = N.z + CT2[1], l2 = Math.hypot(dx, dz);
          if (u < l1) { const k = u / l1; x = CG[0] + (CT2[0] - CG[0]) * k; z = -(CG[1] + (CT2[1] - CG[1]) * k); clip = 'chay'; yaw = Math.atan2(CT2[0] - CG[0], -(CT2[1] - CG[1])); }
          else if (u < l1 + l2) { const k = (u - l1) / l2; x = CT2[0] + dx * k; z = -CT2[1] + dz * k; clip = 'chay'; yaw = Math.atan2(dx, dz); } }
        dongDat('qgp', clip, t, N.ph, x, N.y, z, yaw, 1.0, N.vi); } });
    XEX.linhDinh = L; }
}
// ------------------------------------------------------------------ ĐOẠN PHỐ CHI TIẾT (V2.1, anh Thắng 29/11 02:53)
// Một đoạn khoảng 420 m trên đường xe tăng 843 và đoàn xe vào Dinh: mặt đường nhựa có vạch sơn, bó vỉa, vỉa hè lát gạch, hàng cây, cột đèn, cột điện có dây,
// dãy nhà phố 2–4 tầng có mái hiên, ban công, cửa xếp, bảng hiệu kiểu Sài Gòn đầu thập niên 1970 (theo ảnh phố anh Thắng gửi). Máy quay đặt thấp trên vỉa hè
// nhìn đoàn xe đi tới. Ở xa hoặc máy lên cao: đoạn chi tiết ẩn, hiện lại nhà dạng khối như cũ.
// Tên cửa hiệu, màu nhà, vị trí cây, cột: MINH HOẠ (tự đặt, không chép bảng hiệu thật).
if (TANG === 'noi-do' && DUONG_DINH.length) {
  const D = duong(DUONG_DINH), rnd = rndS(301975), PHO = { on: false }, W3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
  const gan = (x, z) => { let b = [1e18, 0]; for (let d = 0; d <= D.L; d += 4) { const p = diemTren(D, d), e = (p.x - x) ** 2 + (p.z - z) ** 2; if (e < b[0]) b = [e, d]; } return b[1]; };
  const dA = gan(360, -705), dB = Math.min(D.L - 5, dA + 420), DUONG = 7.5, VIA = 13.5;   // nửa lòng đường 7,5 m (4 làn), vỉa hè 6 m
  const ben = (d, l) => { const p = diemTren(D, d); return { x: p.x + Math.cos(p.yaw) * l, z: p.z - Math.sin(p.yaw) * l, yaw: p.yaw }; };
  const g = new THREE.Group(); g.visible = false; scene.add(g);
  const cv = (w, h, ve) => { const c = document.createElement('canvas'); c.width = w; c.height = h; ve(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  const lap = (t, a, b) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(a, b); return t; };
  // ---- mặt đất: dải lưới bám địa hình (lòng đường, vỉa hè hai bên, mặt bó vỉa)
  const dai = (l0, l1, y0, y1, tex, ru, rv) => { const N = Math.ceil((dB - dA) / 3), pos = [], uv = [], id = [];
    for (let i = 0; i <= N; i++) { const d = dA + (dB - dA) * i / N; for (const [l, y] of [[l0, y0], [l1, y1]]) { const q = ben(d, l); pos.push(q.x, hG(q.x, q.z) + y, q.z); uv.push((l - l0) / (l1 - l0) * ru, (d - dA) / rv); }
      if (i) { const a = 2 * i - 2; id.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } }
    const G = new THREE.BufferGeometry(); G.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); G.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); G.setIndex(id); G.computeVertexNormals();
    const m = new THREE.Mesh(G, new THREE.MeshLambertMaterial({ map: tex, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 })); g.add(m); return m; };
  const nhua = cv(512, 1024, (c, w, h) => { c.fillStyle = '#4a4a48'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 9000; i++) { const v = 60 + rnd() * 40 | 0; c.fillStyle = `rgba(${v},${v},${v - 4},0.35)`; c.fillRect(rnd() * w, rnd() * h, 2, 2); }   // hạt đá nhựa
    for (let i = 0; i < 14; i++) { c.fillStyle = 'rgba(30,30,28,0.25)'; c.beginPath(); c.ellipse(rnd() * w, rnd() * h, 20 + rnd() * 60, 8 + rnd() * 30, rnd() * 3, 0, 7); c.fill(); }   // vá, vết dầu
    c.fillStyle = '#d8d4c4'; for (let y = 0; y < h; y += 128) { c.fillRect(w / 2 - 4, y, 8, 70); c.fillRect(w / 4 - 3, y + 40, 6, 50); c.fillRect(w * 3 / 4 - 3, y + 40, 6, 50); }   // vạch giữa, vạch phân làn
    c.fillStyle = 'rgba(120,110,95,0.5)'; c.fillRect(0, 0, 10, h); c.fillRect(w - 10, 0, 10, h); });   // rãnh nước sát bó vỉa
  dai(-DUONG, DUONG, 0.05, 0.05, nhua, 1, 32);
  const gach = cv(256, 256, (c, w, h) => { c.fillStyle = '#9c9284'; c.fillRect(0, 0, w, h); const n = 8, s = w / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const v = 150 + rnd() * 30 | 0; c.fillStyle = `rgb(${v},${v - 8},${v - 20})`; c.fillRect(i * s + 1.5, j * s + 1.5, s - 3, s - 3); }
    for (let i = 0; i < 400; i++) { c.fillStyle = 'rgba(60,50,40,0.12)'; c.fillRect(rnd() * w, rnd() * h, 3, 3); } });
  for (const s of [-1, 1]) { const a = s * DUONG, b = s * VIA; dai(Math.min(a, b), Math.max(a, b), 0.18, 0.18, lap(gach, 1, 1), 6, 2.2);
    dai(s * (DUONG - 0.01), s * (DUONG + 0.02), 0.05, 0.18, null, 1, 1).material.color.set(0xb8b2a4);   // mặt đứng bó vỉa
    const bv = dai(Math.min(s * DUONG, s * (DUONG + 0.3)), Math.max(s * DUONG, s * (DUONG + 0.3)), 0.185, 0.185, null, 1, 1); bv.material.color.set(0xc8c2b2); }
  // ---- nhà phố: một lưới gộp, mặt tiền vẽ bằng canvas (atlas 8 × 2 ô), các mặt khác màu vữa
  const MAU = ['#e6d7b0', '#d9c48f', '#c9d3d0', '#e8e2d4', '#d8b9a8', '#b9c7b4', '#e2cfa0', '#cfd8e0'], CUA = ['#2f5d6e', '#3d6b47', '#6b4a2f', '#4a5a7a', '#7a3b2e'];
  const AT = cv(2048, 1024, (c) => { for (let k = 0; k < 16; k++) { const x0 = (k % 8) * 256, y0 = Math.floor(k / 8) * 512, tang = 2 + (k % 3), nen = MAU[k % 8], cua = CUA[k % 5];
    c.save(); c.beginPath(); c.rect(x0, y0, 256, 512); c.clip(); c.fillStyle = nen; c.fillRect(x0, y0, 256, 512);
    if (k === 15) { c.restore(); continue; }                                                                       // ô 15: vữa trơn cho hông, lưng, mái
    for (let i = 0; i < 900; i++) { c.fillStyle = `rgba(80,70,50,${rnd() * 0.06})`; c.fillRect(x0 + rnd() * 256, y0 + rnd() * 512, 4 + rnd() * 10, 2 + rnd() * 18); }   // ố mưa
    const ht = 512 / tang;   // mỗi tầng
    for (let f = 1; f < tang; f++) { const y = y0 + 512 - (f + 1) * ht;                                              // các tầng lầu: cửa sổ chớp, ban công
      const nc = k % 2 ? 2 : 3, cw = 256 / nc;
      for (let i = 0; i < nc; i++) { const x = x0 + i * cw + cw * 0.18, ww = cw * 0.64, wy = y + ht * 0.18, wh = ht * 0.6;
        c.fillStyle = '#26221d'; c.fillRect(x, wy, ww, wh); c.fillStyle = cua; c.fillRect(x, wy, ww * 0.3, wh); c.fillRect(x + ww * 0.7, wy, ww * 0.3, wh);   // cửa chớp mở hai bên
        c.strokeStyle = 'rgba(0,0,0,0.35)'; for (let j = 0; j < 9; j++) { c.beginPath(); c.moveTo(x, wy + j * wh / 9); c.lineTo(x + ww * 0.3, wy + j * wh / 9); c.moveTo(x + ww * 0.7, wy + j * wh / 9); c.lineTo(x + ww, wy + j * wh / 9); c.stroke(); } }
      if ((k + f) % 3) { c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(x0, y + ht * 0.78, 256, 6); c.strokeStyle = '#2a2a2a'; c.lineWidth = 2;   // lan can ban công sắt
        c.beginPath(); c.moveTo(x0, y + ht * 0.62); c.lineTo(x0 + 256, y + ht * 0.62); for (let x = x0; x <= x0 + 256; x += 9) { c.moveTo(x, y + ht * 0.62); c.lineTo(x, y + ht * 0.78); } c.stroke(); } }
    const yt = y0 + 512 - ht;                                                                                      // tầng trệt: cửa hiệu mở, cửa xếp sắt
    c.fillStyle = '#3b3229'; c.fillRect(x0 + 10, yt + ht * 0.2, 236, ht * 0.8); c.fillStyle = 'rgba(150,130,100,0.35)'; c.fillRect(x0 + 10, yt + ht * 0.62, 236, ht * 0.38);   // trong tiệm, quầy hàng
    for (let r = 0; r < 3; r++) { const yy = yt + ht * (0.4 + r * 0.17); c.fillStyle = '#5a4532'; c.fillRect(x0 + 12, yy + ht * 0.1, 232, 3);   // kệ gỗ, hàng hoá xếp trên kệ (màu trầm)
      for (let x = x0 + 14; x < x0 + 240;) { const w = 5 + rnd() * 12; c.fillStyle = `hsl(${rnd() * 60 + 10 | 0},${8 + rnd() * 14 | 0}%,${28 + rnd() * 20 | 0}%)`; c.fillRect(x, yy + ht * 0.1 - (4 + rnd() * ht * 0.07), w - 1.5, 4 + rnd() * ht * 0.07); x += w; } }
    c.strokeStyle = '#6b6b66'; c.lineWidth = 2; const xx = k % 4 === 0 ? 236 : k % 2 ? 0 : 40; for (let x = x0 + 10; x < x0 + 10 + xx; x += 7) { c.beginPath(); c.moveTo(x, yt + ht * 0.2); c.lineTo(x, y0 + 512); c.stroke(); }   // cửa xếp kéo một phần
    c.fillStyle = 'rgba(0,0,0,0.3)'; c.fillRect(x0, y0, 256, 14);                                                // gờ mái, lan can sân thượng
    c.restore(); } });
  const pos = [], uv = [], col = [], cl = new THREE.Color(), cell = (k, u, v) => [((k % 8) + u) / 8, 1 - (Math.floor(k / 8) + 1 - v) / 2];
  const quad = (A, B, C, Dd, k, tint, mat) => { const U = mat || [[0, 0], [1, 0], [1, 1], [0, 1]];
    for (const i of [0, 1, 2, 0, 2, 3]) { const P = [A, B, C, Dd][i]; pos.push(P.x, P.y, P.z); uv.push(...cell(k, U[i][0], U[i][1])); col.push(tint.r, tint.g, tint.b); } };
  const LO = [], BH = [];   // lô nhà (để đặt mái hiên, bảng hiệu)
  for (const s of [-1, 1]) for (let d = dA + 4; d < dB - 6;) {
    if (rnd() < 0.05) { d += 7 + rnd() * 4; continue; }                                                            // hẻm
    const w = 4 + rnd() * 3.2, tang = 2 + Math.floor(rnd() * 3), k = Math.floor(rnd() * 15), kk = (k - (k % 3)) + (tang - 2);   // ô atlas có số tầng khớp
    const H = tang * 3.5 + 0.8, sau = 14 + rnd() * 4, a = ben(d, s * VIA), b = ben(d + w, s * VIA), a2 = ben(d, s * (VIA + sau)), b2 = ben(d + w, s * (VIA + sau));
    const y = Math.min(hG(a.x, a.z), hG(b.x, b.z)) + 0.15, V = (p, h) => W3(p.x, y + h, p.z), t = cl.set(0xffffff).clone().multiplyScalar(0.88 + rnd() * 0.12);
    const k2 = Math.min(14, kk), A = V(a, 0), B = V(b, 0), A1 = V(a, H), B1 = V(b, H), C = V(a2, 0), Dd = V(b2, 0), C1 = V(a2, H), D1 = V(b2, H);
    if (s > 0) quad(A, B, B1, A1, k2, t); else quad(B, A, A1, B1, k2, t);                                         // mặt tiền quay ra đường
    quad(A, C, C1, A1, 15, t); quad(Dd, B, B1, D1, 15, t); quad(A1, B1, D1, C1, 15, t.clone().multiplyScalar(0.8));   // hông, mái bằng
    LO.push({ s, d, w, H, tang, y }); d += w + (rnd() < 0.12 ? 0.6 : 0); }
  { const G = new THREE.BufferGeometry(); G.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); G.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); G.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); G.computeVertexNormals();
    g.add(new THREE.Mesh(G, new THREE.MeshLambertMaterial({ map: AT, vertexColors: true, side: THREE.DoubleSide }))); }
  // ---- mái hiên vải sọc, bảng hiệu (tên tự đặt)
  // V2.1 (anh Thắng 03:26: "biển quảng cáo dùng font chữ như ảnh anh gửi, kiểu viết tay, màu xưa cũ"): hai kiểu chữ nhúng sẵn (cắt bớt còn bộ chữ tiếng Việt, giấy phép OFL,
  // props/phong/): Lora Bold Italic — nét nghiêng kiểu viết tay cho tên hiệu; Anton — chữ in cao, hẹp như bảng hiệu sơn tay thập niên 1970. Màu sơn đã phai, có vết ố, rỉ.
  const PHONG = [['PhoViet', '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'], ['PhoIn', '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']];
  await Promise.all(PHONG.map(([ten, b]) => new FontFace(ten, 'url(data:font/woff;base64,' + b + ')').load().then((f) => document.fonts.add(f)).catch(() => null)));
  const TEN = [['TIỆM VÀNG', 'Kim Hưng', 1], ['', 'NHÀ SÁCH TÂN VĂN', 0], ['VẢI SỢI', 'Mỹ Lệ', 1], ['', 'PHỞ HÀ THÀNH', 0], ['CÀ PHÊ', 'Hồng Phát', 1], ['', 'NHÀ THUỐC NHÂN HÒA', 0],
    ['MAY ĐO', 'Thanh Lịch', 1], ['', 'XE ĐẠP HÒA BÌNH', 0], ['HÌNH ẢNH', 'Phương Nam', 1], ['', 'RADIO ĐIỆN MÁY', 0], ['ĐỒNG HỒ', 'Vạn Thành', 1], ['', 'HỦ TIẾU NAM VANG', 0],
    ['GIÀY DÉP', 'Bình An', 1], ['', 'CƠM TÂN ĐỊNH', 0], ['TẠP HÓA', 'Phúc Lợi', 1], ['', 'KHÁCH SẠN BẾN THÀNH', 0]];
  const SON = [['#e4d8b8', '#a33a2c'], ['#3f6d68', '#efe6cf'], ['#c99a3d', '#3a2a1c'], ['#9e3b30', '#f1e4c4'], ['#2e4a66', '#f0e2b6'], ['#ddd0b0', '#1f3b5a'], ['#5b6e3f', '#f3e8c8'], ['#22292b', '#e0b65a']];
  const BIA = cv(1024, 2048, (c) => { for (let i = 0; i < 16; i++) { const y = i * 128, [nen, chu] = SON[(i * 5) % 8], [phu, ten, viet] = TEN[i];
    c.fillStyle = nen; c.fillRect(0, y, 1024, 128);
    for (let k = 0; k < 500; k++) { c.fillStyle = `rgba(${rnd() < 0.5 ? '255,245,220' : '60,45,30'},${rnd() * 0.08})`; c.fillRect(rnd() * 1024, y + rnd() * 128, 2 + rnd() * 8, 2 + rnd() * 6); }   // sơn phai, lốm đốm
    c.strokeStyle = chu; c.globalAlpha = 0.85; c.lineWidth = 5; c.strokeRect(10, y + 10, 1004, 108); c.lineWidth = 2; c.strokeRect(18, y + 18, 988, 92); c.globalAlpha = 1;   // viền kẻ đôi
    let x0 = 512; if (i % 3 === 0) { c.fillStyle = '#e8c44a'; c.fillRect(30, y + 24, 92, 80); c.fillStyle = '#2a2018'; c.font = '64px PhoIn, Impact, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(12 + ((i * 37) % 160)), 76, y + 66); x0 = 560; }   // số nhà
    c.fillStyle = chu; c.textAlign = 'center'; c.textBaseline = 'middle';
    if (viet) { if (phu) { c.font = '26px PhoIn, Impact, sans-serif'; c.fillText(phu.split('').join(String.fromCharCode(8202)), x0, y + 34); }
      c.font = '78px PhoViet, Georgia, serif'; c.save(); c.translate(x0, y + 80); c.rotate(-0.035); c.fillText(ten, 0, 0); c.restore(); }
    else { c.font = '84px PhoIn, Impact, sans-serif'; const w = c.measureText(ten).width, k = Math.min(1, 860 / w); c.save(); c.translate(x0, y + 68); c.scale(k, 1); c.fillText(ten, 0, 0); c.restore(); }
    for (let k = 0; k < 6; k++) { const x = rnd() * 1024, g = c.createLinearGradient(0, y, 0, y + 128); g.addColorStop(0, 'rgba(90,60,30,0)'); g.addColorStop(1, 'rgba(90,60,30,0.28)'); c.fillStyle = g; c.fillRect(x, y + 40 + rnd() * 40, 3 + rnd() * 5, 88); }   // vệt rỉ chảy
    const g = c.createLinearGradient(0, y, 0, y + 128); g.addColorStop(0, 'rgba(0,0,0,0.18)'); g.addColorStop(0.15, 'rgba(0,0,0,0)'); g.addColorStop(0.85, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.25)'); c.fillStyle = g; c.fillRect(0, y, 1024, 128);
    c.fillStyle = 'rgba(255,240,210,0.10)'; c.fillRect(0, y, 1024, 128); } });   // phai nắng
  const SOC = cv(64, 64, (c) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? '#f0ead8' : ['#2f6b4a', '#b8322a', '#2f4f8c'][Math.floor(rnd() * 3)]; c.fillRect(i * 8, 0, 8, 64); } });
  { const P = [], Uv = [], P2 = [], U2 = [];
    const q = (L, Lu, a, b, c2, d2, u0, v0, u1, v1) => { for (const [p, u, v] of [[a, u0, v0], [b, u1, v0], [c2, u1, v1], [a, u0, v0], [c2, u1, v1], [d2, u0, v1]]) { L.push(p.x, p.y, p.z); Lu.push(u, v); } };
    LO.forEach((N, i) => { const { s, d, w, y } = N, l = s * VIA, e = 0.15;
      if (rnd() < 0.85) { const r = (i * 7 + Math.floor(rnd() * 3)) % 16, a = ben(d + e, l - s * 0.05), b = ben(d + w - e, l - s * 0.05), hy = y + 2.95, hh = 0.9;   // bảng hiệu ngang trên cửa hiệu
        const A = W3(a.x, hy, a.z), B = W3(b.x, hy, b.z), C = W3(b.x, hy + hh, b.z), Dd = W3(a.x, hy + hh, a.z); if (s > 0) q(P, Uv, A, B, C, Dd, 0, 1 - (r + 1) / 16, 1, 1 - r / 16); else q(P, Uv, B, A, Dd, C, 0, 1 - (r + 1) / 16, 1, 1 - r / 16); }
      if (rnd() < 0.55) { const a = ben(d + e, l), b = ben(d + w - e, l), a2 = ben(d + e, l - s * 1.8), b2 = ben(d + w - e, l - s * 1.8), y0 = y + 2.85, y1 = y + 2.25;   // mái hiên vải dốc ra vỉa hè
        q(P2, U2, W3(a.x, y0, a.z), W3(b.x, y0, b.z), W3(b2.x, y1, b2.z), W3(a2.x, y1, a2.z), 0, 0, w / 1.2, 1); } });
    for (const [L, Lu, map] of [[P, Uv, BIA], [P2, U2, lap(SOC, 1, 1)]]) { const G = new THREE.BufferGeometry(); G.setAttribute('position', new THREE.Float32BufferAttribute(L, 3)); G.setAttribute('uv', new THREE.Float32BufferAttribute(Lu, 2)); G.computeVertexNormals();
      g.add(new THREE.Mesh(G, new THREE.MeshLambertMaterial({ map, side: THREE.DoubleSide }))); } }
  // ---- hàng cây (dầu, me): thân + ba chùm lá, cột đèn cần cong, cột điện bê tông có xà và dây võng
  const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), S = W3(1, 1, 1), Pp = W3();
  const inst = (geo, mat, L) => { const im = new THREE.InstancedMesh(geo, mat, L.length); L.forEach((m, i) => im.setMatrixAt(i, m)); im.computeBoundingSphere(); g.add(im); return im; };
  const mt = (x, y, z, sx, sy, sz, ry = 0, rx = 0) => M4.compose(Pp.set(x, y, z), Q.setFromEuler(E.set(rx, ry, 0, 'YXZ')), S.set(sx, sy, sz)).clone();
  const TH = [], LA = [], DEN = [], CAN = [], BONG = [], COT = [], XA = [], DAY = [];
  for (const s of [-1, 1]) {
    for (let d = dA + 6 + rnd() * 4; d < dB - 4; d += 11 + rnd() * 5) { if (s > 0 && Math.abs(d - (dB - 40)) < 9) continue; const p = ben(d, s * (DUONG + 1.1)), y = hG(p.x, p.z) + 0.18, h = 7 + rnd() * 5, r = 0.22 + rnd() * 0.12;
      TH.push(mt(p.x, y + h / 2, p.z, r, h, r, 0, (rnd() - 0.5) * 0.08));
      for (let j = 0; j < 3; j++) { const a = rnd() * 6.3, o = 1 + rnd() * 1.8, R = 2.4 + rnd() * 1.6; LA.push(mt(p.x + Math.cos(a) * o, y + h + (j - 0.5) * 1.1, p.z + Math.sin(a) * o, R, R * 0.72, R, rnd() * 6)); } }
    for (let d = dA + 18; d < dB - 4; d += 32) { if (s > 0 && Math.abs(d - (dB - 40)) < 5) continue; const p = ben(d, s * (DUONG + 0.55)), y = hG(p.x, p.z) + 0.18, ry = p.yaw + (s > 0 ? -Math.PI / 2 : Math.PI / 2);   // cột đèn, cần vươn ra lòng đường
      DEN.push(mt(p.x, y + 4.5, p.z, 0.09, 9, 0.09)); const q = ben(d, s * (DUONG - 0.8)); CAN.push(mt((p.x + q.x) / 2, y + 9.0, (p.z + q.z) / 2, 0.06, 0.06, 1.5, ry)); BONG.push(mt(q.x, y + 8.85, q.z, 0.28, 0.14, 0.55, ry)); }
    let tr = null; for (let d = dA + 9; d < dB; d += 38) { const p = ben(d, s * (VIA - 0.6)), y = hG(p.x, p.z) + 0.18;   // cột điện
      COT.push(mt(p.x, y + 5.5, p.z, 0.16, 11, 0.16)); XA.push(mt(p.x, y + 10.3, p.z, 0.1, 0.12, 2.0, p.yaw + Math.PI / 2));
      if (tr) for (const o of [-0.85, -0.3, 0.3, 0.85]) { const r = W3(Math.cos(p.yaw), 0, -Math.sin(p.yaw)).multiplyScalar(o), a = tr.clone().add(r), b = W3(p.x, y + 10.35, p.z).add(r);   // dây điện võng
        for (let k = 0; k < 8; k++) { const u0 = k / 8, u1 = (k + 1) / 8, v = (u) => a.clone().lerp(b, u).add(W3(0, -0.9 * 4 * u * (1 - u), 0)); DAY.push(v(u0), v(u1)); } }
      tr = W3(p.x, y + 10.35, p.z); } }
  const bt = new THREE.MeshLambertMaterial({ color: 0x8f8a80 }), sat = new THREE.MeshLambertMaterial({ color: 0x3a3d3c });
  inst(new THREE.CylinderGeometry(0.7, 1, 1, 7), new THREE.MeshLambertMaterial({ color: 0x5b4a3a }), TH);
  inst(new THREE.IcosahedronGeometry(1, 1), new THREE.MeshLambertMaterial({ color: 0x3f6b33, flatShading: true }), LA);
  inst(new THREE.CylinderGeometry(0.7, 1, 1, 6), sat, DEN); inst(new THREE.BoxGeometry(1, 1, 1), sat, CAN); inst(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({ color: 0xd8d6c8 }), BONG);
  inst(new THREE.CylinderGeometry(0.75, 1, 1, 6), bt, COT); inst(new THREE.BoxGeometry(1, 1, 1), bt, XA);
  g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(DAY), new THREE.LineBasicMaterial({ color: 0x1c1c1c })));
  // ---- nhà dạng khối trong hành lang đoạn phố: ẩn khi đoạn chi tiết hiện
  const AN = [], m0 = new THREE.Matrix4(), v0 = W3(), Z = new THREE.Matrix4().makeScale(0, 0, 0);
  for (const im of XEX.nha || []) for (let i = 0; i < im.count; i++) { im.getMatrixAt(i, m0); v0.setFromMatrixPosition(m0);
    const d = gan(v0.x, v0.z); if (d < dA - 8 || d > dB + 8) continue; const p = diemTren(D, d); if (Math.hypot(p.x - v0.x, p.z - v0.z) < VIA + 26) AN.push([im, i, m0.clone()]); }
  // dân đứng trên vỉa hè (cao hơn mặt đường 0,18 m)
  for (const N of XEX.DAN || []) if (!N.cong && N.d > dA && N.d < dB) N.y = hG(N.x, N.z) + 0.2;
  const tam = diemTren(D, (dA + dB) / 2);
  PHO.dat = (on) => { if (on === PHO.on) return; PHO.on = on; g.visible = on; const ims = new Set(); for (const [im, i, m] of AN) { im.setMatrixAt(i, on ? Z : m); ims.add(im); } for (const im of ims) im.instanceMatrix.needsUpdate = true; };
  DAM.push(() => { const c = camera.position, h = c.y - hG(c.x, c.z), r = Math.hypot(c.x - tam.x, c.z - tam.z); PHO.dat(h < 160 && r < 650 + (PHO.on ? 60 : 0)); });
  // ---- máy quay "một góc": đứng thấp trên vỉa hè đầu đoạn phố (phía Dinh), nhìn dọc phố về phía đoàn xe đang tới, lia theo xe đi qua
  const dC = dB - 40, CAM = ben(dC, DUONG - 1.2), yC = hG(CAM.x, CAM.z) + 1.7;   // người quay đứng sát mép bó vỉa (bỏ cây, cột đèn sát máy), hàng cây không che dọc phố
  const dXe = (o) => { const p = o.position; let b = [1e18, 0]; for (let d = dA - 300; d <= dB + 60; d += 3) { const q = diemTren(D, d), e = (q.x - p.x) ** 2 + (q.z - p.z) ** 2; if (e < b[0]) b = [e, d]; } return b[1]; };
  XEX.camPho = (t) => { const L = [XEX.x843, XEX.x390].filter((X) => X && X.obj.visible); let dt = dA + 60;
    for (const X of L) { const d = dXe(X.obj); if (d < dC - 12) { dt = Math.max(dA - 200, d); break; } }
    PHO.dt = PHO.dt === undefined ? dt : PHO.dt + (dt - PHO.dt) * 0.08; const q = ben(PHO.dt, -1);
    return [W3(CAM.x, yC, CAM.z), W3(q.x, hG(q.x, q.z) + 2.0, q.z), 46]; };
  XEX.pho = PHO; PHO.g = g; PHO.dA = dA; PHO.dB = dB; PHO.ben = ben;
}
// ------------------------------------------------------------------ C04 · PHI ĐỘI QUYẾT THẮNG (28/4/1975)
// 16h15 năm A-37 thu được xuất kích từ Phan Rang (S29), ném bom khu đỗ máy bay Tân Sơn Nhất; 18h15 hạ cánh Thành Sơn (S17).
// Vị trí khu đỗ, nhà chứa máy bay của không quân VNCH ("Vietnamese Hangars") theo sơ đồ sân bay 1968 (M3) khớp affine vào bản đồ:
// 2 đầu đường băng (OSM) + "Vietnam Staff Compound" = Bộ Tổng tham mưu (nay Bộ Tư lệnh Quân khu 7, OSM). Sai số vài trăm m — sơ đồ vẽ phỏng.
// Số máy bay đỗ, thứ tự bom rơi là TÁI DỰNG MINH HOẠ (các nguồn ghi số máy bay bị phá khác nhau).
const C04 = {};
if (TANG === 'noi-do') {
  const SD = (px, py) => [12.6712604 * px + 6.28036399 * py - 9247.06099, -1.468 * px - 11.5504249 * py + 7007.62698];   // px sơ đồ 1968 → Blender [x, y_Bắc]
  const P3 = (b, y = 0) => V3(b[0], (y === null ? hG(b[0], -b[1]) : y), -b[1]);
  // Sơ đồ 1968: dãy "Vietnamese Hangars" nằm phía Nam, song song đường băng, ở nửa phía Tây. Khớp affine đặt dãy này lệch Nam ~400 m (sơ đồ vẽ
  // phỏng) → đặt khu đỗ song song đường băng 07R/25L (OSM, hướng 20,9°), phía Bắc "Nhà ga Quân sự Tân Sơn Nhất" ngày nay (OSM, −5003; 3703).
  const RW = [Math.cos(0.3648), Math.sin(0.3648)], NB = [-RW[1], RW[0]], apC = [-5050, 3880];
  const ap0 = [apC[0] - RW[0] * 350, apC[1] - RW[1] * 350], ap1 = [apC[0] + RW[0] * 350, apC[1] + RW[1] * 350];
  const apY = (u, k) => [ap0[0] + (ap1[0] - ap0[0]) * u + NB[0] * k, ap0[1] + (ap1[1] - ap0[1]) * u + NB[1] * k];   // dọc khu đỗ; k: lùi về phía đường băng (m)
  const yaw0 = Math.atan2(ap1[0] - ap0[0], -(ap1[1] - ap0[1]));
  // mặt đường băng, khu đỗ (để nhận ra sân bay): hai đường băng song song theo OSM; đầu Đông 07R/25L cắt ngang đầu Đông 07L (sơ đồ 1968 vẽ hai
  // đường băng dài gần bằng nhau; đoạn kéo dài sau này chưa rõ năm) — GIẢN LƯỢC
  { const mat = new THREE.MeshLambertMaterial({ color: 0x8b8a84, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    const dai = (A, B, rong) => {                                                       // dải phẳng bám mặt đất (lưới 20 m)
      const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy), n = Math.max(2, Math.ceil(L / 20)), m = Math.max(1, Math.ceil(rong / 20)), ux = dx / L, uy = dy / L;
      const g = new THREE.PlaneGeometry(1, 1, m, n), P = g.attributes.position;
      for (let i = 0; i < P.count; i++) { const a = P.getX(i) * rong, b = (P.getY(i) + 0.5) * L, x = A[0] + ux * b - uy * a, y = A[1] + uy * b + ux * a; P.setXYZ(i, x, hG(x, -y) + 0.35, -y); }
      g.index.array.reverse(); g.computeVertexNormals(); const o = new THREE.Mesh(g, mat); o.frustumCulled = false; scene.add(o); LAYER.xe.push(o); };
    dai([-6361, 4204], [-3514, 5291], 46); dai([-6394, 3800], [-3499, 4905], 46);
    dai(apY(-0.05, 35), apY(1.05, 35), 150);                                                // khu đỗ (giữa hai hàng máy bay và đường lăn)
  }
  C04.do = []; C04.no = [];
  const [ga, gc, gu] = await Promise.all(['data/may-bay/a-37.glb', 'data/may-bay/c-130a.glb', 'data/may-bay/uh-1.glb'].map((f) => glbLoad(f)));
  const dat = (g, b, yaw, sc = 1) => { const o = g.scene.clone(true); const h = hG(b[0], -b[1]) + 0.4; o.position.set(b[0], h, -b[1]); o.rotation.y = yaw; o.scale.setScalar(sc); scene.add(o); LAYER.xe.push(o);
    o.traverse((m) => { if (m.isMesh) m.material = m.material.clone(); }); return o; };
  for (let i = 0; i < 14; i++) C04.do.push({ o: dat(ga, apY(0.08 + i * 0.065, (i % 2) * 22), yaw0 + Math.PI / 2 + 0.05 * (i % 3)), loai: 'A-37' });   // A-37 VNCH đỗ hai hàng
  C04.do.push({ o: dat(gc, apY(0.2, 75), yaw0 + Math.PI / 2), loai: 'C-130A' }, { o: dat(gc, apY(0.62, 75), yaw0 + Math.PI / 2), loai: 'C-130A' });
  for (const [px, py] of [[188, 316], [194, 322], [184, 322]]) C04.do.push({ o: dat(gu, SD(px, py), 0.6), loai: 'UH-1' });
  // trúng bom: A-37 hàng trước, theo thứ tự lượt bay
  const trung = [1, 3, 4, 6, 8, 9, 11, 14];
  // phi đội: 5 chiếc, bay vào từ hướng Đông Bắc (phía Phan Rang), bổ nhào qua dãy đỗ rồi vòng ra Tây Nam
  const tam = apY(0.5, 11), vao = [tam[0] + 1300, tam[1] + 1150], ra = [tam[0] + 700, tam[1] - 2300];   // V1.5: vào từ Đông Bắc, ra về phía Nam — cả đường bay nằm trong sa bàn (bán kính 6,8 km)
  C04.bay = [];
  for (let k = 0; k < 5; k++) { const o = ga.scene.clone(true); o.visible = false; scene.add(o); LAYER.xe.push(o); C04.bay.push({ o, k }); }
  const sprTex = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const c = cv.getContext('2d'), g = c.createRadialGradient(32, 32, 2, 32, 32, 31);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.5, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(cv); })();
  const sprite = (col, op) => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sprTex, color: col, transparent: true, opacity: op, depthWrite: false })); sp.visible = false; scene.add(sp); return sp; };
  trung.forEach((i, n) => { const D = C04.do[i]; C04.no.push({ D, t0: 0, lua: sprite(0xffa040, 0.9), chay: [sprite(0xff7a20, 0.9), sprite(0xffb040, 0.8), sprite(0xff5a10, 0.85)],
    khoi: Array.from({ length: 9 }, (_, j) => Object.assign(sprite(0x2e2b29, 0.4), { k: j / 9 })) }); });   // anh Thắng 24/11: bom trúng thì có lửa cháy, khói bốc cao
  const T0 = STORY.scenes.find((c) => c.id === 'C04'), t0 = T0 ? T0.t0 : 40, BAY0 = MV.c04_bom ? MV.c04_bom - 6.2 : t0 + 9, BAY1 = BAY0 + 14;   // bom rơi đúng câu "những quả bom được thả xuống"
  C04.no.forEach((N, n) => { N.t0 = BAY0 + 6.2 + n * 0.55; });
  const CAT = MV.c04_catcanh || BAY0 - 11, vao2 = [vao[0] + 850, vao[1] + 750];                // vào từ hướng Đông Bắc (phía Phan Rang), ~220 m/s
  C04.camBay = () => { const V = C04.bay.filter((B) => B.o.visible); if (!V.length) return null; const c = V3(); V.forEach((B) => c.add(B.o.position)); c.divideScalar(V.length);
    const y = V[0].o.rotation.y, f = V3(Math.sin(y), 0, Math.cos(y)), r = V3(f.z, 0, -f.x);
    const L = V[0].o.position, k = clamp((T - (MV.c04_catcanh || 0)) / 9, 0, 1);              // anh Thắng V1.2: đầu đoạn cận một chiếc (thấy rõ kiểu A-37), sau lùi ra thấy cả biên đội
    const near = [L.clone().addScaledVector(f, -16).addScaledVector(r, 9).add(V3(0, 3.5, 0)), L.clone().addScaledVector(f, 6)], far = [c.clone().addScaledVector(f, -95).addScaledVector(r, 55).add(V3(0, 16, 0)), c.clone().addScaledVector(f, 220).add(V3(0, -30, 0))];
    const e = k < 0.6 ? 0 : sstep(0.6, 1, k); return [near[0].lerp(far[0], e), near[1].lerp(far[1], e), 50]; };
  // ghim tên khí tài (anh Thắng 24/11: để người xem học các loại vũ khí của hai bên)
  GHIM_SAU.push(() => { const gx = (ten, get, dy, xa = 900) => { const L = addLabel(ten, 0, 0, 'hero ly', { grp: 'hero', maxDist: xa }); L.dyn = get; L.dy = dy; };
    gx('Cường kích A-37 · Phi đội Quyết Thắng (ta, máy bay thu được)', () => (C04.bay[0].o.visible ? C04.bay[0].o.position : null), 6, 2500);
    const loai = { 'A-37': 'Cường kích A-37 (không quân VNCH)', 'C-130A': 'Vận tải C-130A (không quân VNCH)', 'UH-1': 'Trực thăng UH-1 (không quân VNCH)' }, da = {};
    for (const D of C04.do) { const k = D.loai + (D.loai === 'A-37' ? Math.floor(C04.do.indexOf(D) / 5) : ''); if (da[k]) continue; da[k] = 1;   // mỗi loại một ghim (A-37 ba ghim theo dãy)
      gx(loai[D.loai] || D.loai, () => (D.o.visible ? D.o.position : null), D.loai === 'C-130A' ? 13 : D.loai === 'UH-1' ? 6 : 5, 3500); } });
  // V2.0 (anh Thắng 29/11: "nhiều cảnh cận máy bay"): sau toàn cảnh, máy hạ thấp lướt dọc hai chiếc C-130A rồi vòng sát cụm trực thăng UH-1 đỗ trên sân (mẫu kho khí tài)
  { const C = C04.do.filter((D) => D.loai === 'C-130A').map((D) => D.o), H = C04.do.filter((D) => D.loai === 'UH-1').map((D) => D.o), u1 = 0.3, u2 = 0.48, u3 = 0.663;
    let op = null;
    C04.canTau = (u) => { op = op || orbit(V3(tam[0], 0, -tam[1]), 950, 380, 2.2, 1.7, 45);
      if (u < u2) { const k = sstep(u1, u2, u), A = C[0].position, y = C[0].rotation.y, a = y + 0.5 + k * 1.3;   // vòng sát chiếc C-130A thứ nhất: từ phía mũi chếch sang sườn
        const cam = A.clone().add(V3(Math.sin(a) * 48, 9 - k * 3, Math.cos(a) * 48)), tg = A.clone().add(V3(0, 4, 0));
        const e = 1 - sstep(u1, u1 + 0.07, u); if (e > 0) { const o = op(u1); return [cam.lerp(o[0], e), tg.lerp(o[1], e), 45]; } return [cam, tg, 48]; }
      const c = (H[0] || C[0]).position, a = H[0].rotation.y + 0.7 + (u - u2) / (u3 - u2) * 1.4; return [c.clone().add(V3(Math.sin(a) * 19, 4.5, Math.cos(a) * 19)), c.clone().add(V3(0, 1.8, 0)), 50]; }; }   // cuối: vòng sát một trực thăng UH-1
  C04.tam = tam; C04.h = hG(tam[0], -tam[1]); C04.t0 = t0; C04.t1 = T0 ? T0.t1 : 75; C04.apY = apY; C04.sprite = sprite;
  C04.cap = (t, dt) => {
    const on = t >= C04.t0 - 0.5 && t < C04.t1 + 0.5;
    for (const B of C04.bay) {
      const u = (t - BAY0 - B.k * 0.45) / (BAY1 - BAY0), tr = (t - CAT) / (BAY0 + B.k * 0.45 - CAT);
      if (on && u <= 0 && tr > 0 && tr <= 1) {                                          // từ câu "cất cánh": cả biên đội bay về Sài Gòn (anh Thắng 24/11), máy quay bám theo
        const lech = [(B.k - 2) * 45, -(B.k) * 25], x = vao2[0] + (vao[0] - vao2[0]) * tr + lech[0], yb = vao2[1] + (vao[1] - vao2[1]) * tr + lech[1];
        B.o.visible = true; B.o.position.set(x, C04.h + 820 - 170 * tr + Math.sin(t * 1.3 + B.k) * 3, -yb); B.o.rotation.set(0.04, Math.atan2(vao[0] - vao2[0], -(vao[1] - vao2[1])), Math.sin(t * 0.9 + B.k) * 0.04, 'YXZ'); continue; }
      const vis = on && u > 0 && u < 1; B.o.visible = vis; if (!vis) continue;
      const lech = [(B.k - 2) * 45, -(B.k) * 25], uu = u < 0.5 ? u * 2 : (u - 0.5) * 2;
      const A = u < 0.5 ? vao : tam, Bp = u < 0.5 ? tam : ra, y = u < 0.5 ? 650 - 470 * uu : 180 + 520 * uu * uu;
      const x = A[0] + (Bp[0] - A[0]) * uu + lech[0], yb = A[1] + (Bp[1] - A[1]) * uu + lech[1];
      B.o.position.set(x, y + C04.h, -yb); B.o.rotation.set(u < 0.5 ? 0.25 : -0.3, Math.atan2(Bp[0] - A[0], -(Bp[1] - A[1])), 0, 'YXZ');   // mũi máy bay +z three
    }
    for (const N of C04.no) {
      const a = t - N.t0, p = N.D.o.position, chay = a > 0 && t >= C04.t0 - 0.5;
      N.D.o.traverse((m) => { if (m.isMesh) m.material.color.setScalar(chay ? 0.25 : 1); });
      N.lua.visible = chay && a < 1.6; if (N.lua.visible) { N.lua.position.set(p.x, p.y + 3 + a * 6, p.z); N.lua.scale.setScalar(6 + a * 22); N.lua.material.opacity = 0.95 * (1 - a / 1.6); }
      const khoi = chay && t < C04.t1 + 0.5;                                              // 28/4: khói lửa; các cảnh sau (30/4) chỉ còn xác cháy đen
      N.chay.forEach((F, j) => { F.visible = khoi && a > 0.6; if (!F.visible) return; const f = Math.sin(U.time.value * (11 + j * 3) + j * 2) * 0.5 + 0.5;
        F.position.set(p.x + (j - 1) * 2.2, p.y + 1.6 + f * 1.5 + j * 0.6, p.z + (j % 2) * 1.5); F.scale.setScalar(4.5 + f * 3 + j); F.material.opacity = 0.75 + f * 0.2; });
      for (const K of N.khoi) { K.visible = khoi; if (!khoi) continue; const v = (K.k + U.time.value * 0.05) % 1; K.position.set(p.x + v * 16, p.y + 3 + v * 110, p.z - v * 9); K.scale.setScalar(6 + v * 40); K.material.opacity = 0.5 * (1 - v) * Math.min(1, a / 2); }
    }
  };
}
// ------------------------------------------------------------------ C07 · TÂN SƠN NHẤT 30/4 (S27, S1): 5h30 Sư đoàn 10 cùng hai đại đội xe tăng Trung đoàn 273
// tiến công sân bay; 9h45 Trung đoàn 24 tiếp tục tiến công; 11h30 làm chủ sân bay. Đội hình xe (xe bọc thép K-63, xe tải cắm cờ Mặt trận) và
// đường đi trên sân bay, các điểm nổ: MINH HOẠ (chưa có mẫu xe tăng không số hiệu → không đặt xe tăng ở cảnh này).
const C07 = {}, C89 = {};
if (TANG === 'noi-do' && C04.apY && MV.c07_tc) {
  const A = C04.apY, P = [A(-0.05, 125), A(0.02, 92), A(0.1, 45), A(0.3, 44)], fD = tDinh;   // V2.0 (anh Thắng 03:26: xe tăng đâm xuyên máy bay): đi theo làn trống giữa dãy A-37 (lệch 0–27 m) và dãy C-130A (60–90 m)   // V1.5: đường đi nằm trong sa bàn (khu đỗ ở sát mép), xe chạy ~8 m/s   // đường ngắn lại để xe chạy chậm như thật (anh Thắng 24/11)
  const [gk, gt] = await Promise.all([glbLoad('data/xe/xe-boc-thep-k63.glb'), glbLoad('data/xe/xe-tai.glb')]).catch(() => [null, null]);
  C07.xe = [];
  if (gk && gt) for (let k = 0; k < 4; k++) {
    const D = duong(P), L = D.L, f0 = fD(MV.c07_tc + k * 1.5), f1 = fD(MV.c07_chu - 6 + k * 1.5);
    const X = await xeTao(k % 2 ? 'data/xe/xe-tai.glb' : 'data/xe/xe-boc-thep-k63.glb', { duong: P, lich: [[-1e4, 0], [f0, 0], [f1, L - 30 - k * 28], [1e4, L - 30 - k * 28]], hien: (t) => t >= f0 - 2, ten: k % 2 ? 'Xe tải (minh hoạ)' : 'Xe bọc thép K-63 (minh hoạ)' });
    if (XEX.coXe) XEX.coXe(X.obj, 2.2, 1.1); LAYER.xe.push(X.obj); X.loai = k % 2 ? 'tai' : 'k63'; C07.xe.push(X); }
  DAM.push((t) => { for (const X of C07.xe) if (X.obj.visible && ganMay(X.obj.position.x, X.obj.position.z, 700)) linhTrenXe(X.obj, X.loai, t, 1, 3); });   // bộ binh trên xe (Sư đoàn 10)
  // XE TĂNG TRUNG ĐOÀN 273 dẫn đầu (S27: Sư đoàn 10 cùng hai đại đội xe tăng Trung đoàn 273 tiến công sân bay; mẫu T-54 = xe 390 ẩn số hiệu), bắn cháy máy bay trên
  // khu đỗ, bộ binh chạy theo xe vừa chạy vừa bắn (anh Thắng 24/11, mốc 8:11). Số xe, máy bay trúng đạn, thứ tự phát bắn: MINH HOẠ.
  C07.tang = []; GHIM_SAU.push(() => { const L = addLabel('Xe tăng T-54 · Trung đoàn 273', 0, 0, 'hero ly', { grp: 'hero', maxDist: 600 }); L.dyn = () => (C07.tang[0] && C07.tang[0].obj.visible ? C07.tang[0].obj.position : null); L.dy = 4.2; });
  { const PT = [...P, A(0.6, 44)], DT = duong(PT), LT = DT.L;
    for (let j = 0; j < 2; j++) { const f0 = fD(MV.c07_tc - 3 + j * 1.2), f1 = fD(MV.c07_chu - 7 + j * 1.2);
      const X = await xeTao('data/xe/xe-tang-390.glb', { duong: PT, lich: [[-1e4, 0], [f0, 0], [f1, LT - 6 - j * 24], [1e4, LT - 6 - j * 24]], hien: (t) => t >= f0 - 2, lech: j ? 4 : -2, ten: 'Xe tăng T-54' });
      X.obj.traverse((m) => { if (/^so-hieu/.test(m.name)) m.visible = false; }); if (XEX.coXe) XEX.coXe(X.obj, 2.2, 1.1); LAYER.xe.push(X.obj); C07.tang.push(X); }
    const nong = (X) => () => { const o = X.obj; if (!o.visible) return null; const y = o.rotation.y; return V3(o.position.x + Math.sin(y) * 5, o.position.y + 2.2, o.position.z + Math.cos(y) * 5); };
    C07.chay = [];
    [[0, 5, 0], [2, 9, 1], [15, 13, 0], [5, 17.5, 1], [7, 22, 0], [10, 26, 1]].forEach(([i, dt, j]) => { const D = C04.do[i]; if (!D) return;
      const tu = MV.c07_tc + dt; banTao(tu, nong(C07.tang[j]), () => V3(D.o.position.x, D.o.position.y + 1.5, D.o.position.z), { voice: true });
      C07.chay.push({ D, tu: tu + 0.4, lua: [C04.sprite(0xff7a20, 0.9), C04.sprite(0xffb040, 0.8)], khoi: Array.from({ length: 6 }, (_, k) => Object.assign(C04.sprite(0x2e2b29, 0.4), { k: k / 6 })) }); });
    // bộ binh Sư đoàn 10 bám sau xe tăng: chạy theo, khi xe dừng thì quỳ / đứng bắn
    // bộ binh chạy theo sau xe (4 m/s = nhịp bước 'chay'; xe tăng nhanh hơn nên bộ binh tụt dần phía sau, tới nơi thì quỳ, đứng bắn)
    DAM.push((t, tv) => { for (const [j, X] of C07.tang.entries()) { const t0 = MV.c07_tc - 1 + j * 1.2, dd = DT.L - 30 - j * 24;
      for (let i = 0; i < 9; i++) { const d = Math.min(dd - 6 - Math.floor(i / 2) * 4.5, Math.max(0, (tv - t0 - i * 0.25) * 4.0)), p = diemTren(DT, d), toi = d >= dd - 6 - Math.floor(i / 2) * 4.5 - 0.01;
        if (tv < t0 || !ganMay(p.x, p.z, 500)) continue; const l = (i % 2 ? 1 : -1) * (3.5 + (i % 3) * 2.2) + (j ? 4 : -2), x = p.x + Math.cos(p.yaw) * l, z = p.z - Math.sin(p.yaw) * l;
        dongDat('qgp', toi ? (i % 3 ? 'ban' : 'quy') : (i % 4 === 3 ? 'xung' : 'chay'), tv, (i * 0.31 + j * 0.5) % 1, x, hG(x, z), z, p.yaw, 1, i + j * 9); } } }); }
  C07.no = Array.from({ length: 6 }, (_, k) => ({ sp: C04.sprite(0xff9a4a, 0.9), p: A(-0.6 + k * 0.28, 20 + (k % 3) * 35), ph: k * 0.43 }));
  C07.cap = (t) => { const on = t > MV.c07_tc && t < MV.c07_chu;
    for (const N of C07.no) { const u = ((t - MV.c07_tc + N.ph * 2.4) / 2.4) % 1, v = on && u < 0.45; N.sp.visible = v;
      if (v) { const h = hG(N.p[0], -N.p[1]); N.sp.position.set(N.p[0], h + 6 + u * 30, -N.p[1]); N.sp.scale.setScalar(14 + u * 70); N.sp.material.opacity = 0.9 * (1 - u / 0.45); } }
    for (const C of C07.chay) { const a = t - C.tu, chay = a > 0, p = C.D.o.position; if (C.da !== chay) { C.da = chay; C.D.o.traverse((m) => { if (m.isMesh) m.material.color.setScalar(chay ? 0.25 : 1); }); }   // máy bay trúng đạn cháy đen
      const lua = chay && t < MV.c07_chu + 30; C.lua.forEach((F, j) => { F.visible = lua; if (!lua) return; const f = Math.sin(U.time.value * (12 + j * 4) + j) * 0.5 + 0.5; F.position.set(p.x + (j - 0.5) * 3, p.y + 2 + f * 2, p.z); F.scale.setScalar(6 + f * 4 + j * 2); });
      for (const K of C.khoi) { K.visible = lua; if (!lua) continue; const v = (K.k + U.time.value * 0.05) % 1; K.position.set(p.x + v * 14, p.y + 3 + v * 90, p.z - v * 8); K.scale.setScalar(6 + v * 34); K.material.opacity = 0.5 * (1 - v) * Math.min(1, a / 2); } } };
}
//@@ s23
const ARROW_N = 1;
function updateSmoke() {}
//@@ s24
//@@ s25
const FIRE_N = 1;
//@@ s26
//@@ s27
//@@ s28
//@@ s29
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
// ------------------------------------------------------------------ 5 hướng tiến công (PHÁC THẢO theo bản đồ Quyết tâm, S3 — chốt ở GĐ5)
const HUONG = TANG === 'chien-dich' ? [
  ['Hướng Bắc · Quân đoàn 1', [[11.16, 106.60], [10.98, 106.67], [10.86, 106.68], [10.80, 106.665]]],
  ['Hướng Tây Bắc · Quân đoàn 3', [[11.00, 106.47], [10.92, 106.55], [10.86, 106.62], [10.82, 106.655]]],
  ['Hướng Đông · Quân đoàn 4', [[10.96, 107.02], [10.94, 106.86], [10.85, 106.76], [10.78, 106.71]]],
  ['Hướng Đông Nam · Quân đoàn 2', [[10.76, 107.00], [10.78, 106.86], [10.80, 106.75], [10.78, 106.70]]],
  ['Hướng Tây – Tây Nam · Đoàn 232', [[10.66, 106.43], [10.72, 106.55], [10.77, 106.63], [10.775, 106.685]]],
] : [];
const MUITEN = HUONG.map(([ten, pts], k) => ({ ten, m: muiTen(pts.map(([la, lo]) => LL(la, lo, 900)), 0xd2442b, 420), k }));   // có đầu nhọn chỉ hướng đến
for (const M of MUITEN) muiTenDat(M.m, false);
//@@ s30
const FOGK = 3180 / R;          // sương theo cỡ sa bàn (bảng màu trời gốc làm cho vòng 3,18 km)
const SKY = {
  'Sáng trong': { top: '#3f78b0', hor: '#c7d8e0', low: '#8d9a8a', ground: '#77765a', fog: 0.00003, el: 32, az: 135, sun: '#fff1d8', si: 2.6, hs: '#bcd3e6', hg: '#5f5a44', hi: 0.9, cover: 0.3, cc: '#ffffff', cs: '#a3b0bd', exp: 0.92, size: 900, glow: 1 },
  'Ngày nhiều mây': { top: '#56789a', hor: '#c3c9c6', low: '#7d8072', ground: '#6f6d55', fog: 0.00004, el: 38, az: 170, sun: '#fff4e4', si: 2.0, hs: '#b9c6cf', hg: '#575343', hi: 1.0, cover: 0.58, cc: '#f2f1ec', cs: '#7f8892', exp: 0.95, size: 800, glow: 0.8 },
  'Trưa nắng': { top: '#3a70a8', hor: '#d2dbe0', low: '#8d9a8a', ground: '#7a7858', fog: 0.000028, el: 70, az: 160, sun: '#fff6e8', si: 2.8, hs: '#c4d6e6', hg: '#5f5a44', hi: 1.0, cover: 0.25, cc: '#ffffff', cs: '#a8b4c0', exp: 0.9, size: 900, glow: 0.9 },
};
const SKYKEYS = [[0, 'Ngày nhiều mây'], [MV.c04_catcanh || 40, 'Sáng trong'], [(MV.c11_toi || 80) - 4, 'Trưa nắng']];   // 28/4 chiều · sáng 29–30/4 · trưa 30/4
//@@ s31
function applySky(t, forced) {
  let A, B, u;
  if (forced) { A = B = SKY[forced]; u = 0; }
  else {
    let i = 0; while (i < SKYKEYS.length - 1 && t >= SKYKEYS[i + 1][0]) i++;
    A = SKY[SKYKEYS[i][1]];
    if (i > 0 && t - SKYKEYS[i][0] < 7) { B = A; A = SKY[SKYKEYS[i - 1][1]]; u = sstep(0, 7, t - SKYKEYS[i][0]); }
    else { B = A; u = 0; }
  }
  mixHex(A.top, B.top, u, U.top.value); mixHex(A.hor, B.hor, u, U.hor.value); mixHex(A.low, B.low, u, U.low.value);
  mixHex(A.ground, B.ground, u, U.ground.value); mixHex(A.cc, B.cc, u, U.cloudCol.value); mixHex(A.cs, B.cs, u, U.cloudShade.value);
  mixHex(A.sun, B.sun, u, sun.color); U.sunCol.value.copy(sun.color).multiplyScalar(lerp(A.si, B.si, u) * 0.5);
  sun.intensity = lerp(A.si, B.si, u);
  mixHex(A.hs, B.hs, u, hemi.color); mixHex(A.hg, B.hg, u, hemi.groundColor); hemi.intensity = lerp(A.hi, B.hi, u) * 1.35; amb.color.copy(hemi.color);
  U.cover.value = lerp(A.cover, B.cover, u); U.sunSize.value = lerp(A.size, B.size, u); U.glow.value = lerp(A.glow, B.glow, u);
  const el = THREE.MathUtils.degToRad(lerp(A.el, B.el, u)), az = THREE.MathUtils.degToRad(lerp(A.az, B.az, u));
  U.sunDir.value.set(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el));
  sun.position.copy(U.sunDir.value).multiplyScalar(5000); sun.target.position.set(0, 0, 0);
  scene.fog.color.copy(U.hor.value); scene.fog.density = lerp(A.fog, B.fog, u) * FOGK;
  renderer.toneMappingExposure = lerp(A.exp, B.exp, u);
  U.light.value = 0.45 + 0.55 * Math.min(1, sun.intensity / 2.2) * 0.8 + hemi.intensity * 0.12;
  U.deep.value.copy(U.hor.value).multiplyScalar(0.25).lerp(new THREE.Color(0x2e3a3c), 0.6);
  U.shallow.value.copy(U.hor.value).multiplyScalar(0.45).lerp(new THREE.Color(0x5a6a5a), 0.55);
}
//@@ s32
let tideNow = 0.3;
//@@ s33
//@@ s34
// ------------------------------------------------------------------ góc máy theo cảnh (bản thử)
const SG = LL(10.785, 106.69, 0);
const xeCam = (X, back, up, ahead, fov = 40) => (u) => {
  if (!X || !X.obj.visible) { const c = LL(MOC.dinh[0], MOC.dinh[1], 0); return [c.clone().add(V3(260, 160, 260)), c, 40]; }
  const p = X.obj.position, y = yawXe(X.obj), f = V3(Math.sin(y), 0, Math.cos(y));
  return [p.clone().addScaledVector(f, -back).add(V3(0, up, 0)), p.clone().addScaledVector(f, ahead).add(V3(0, 2, 0)), fov];
};
// V2.0 (anh Thắng 29/11): máy thấp bám sát sườn xe (thấy bánh xe, xích quay — mẫu kho khí tài); dọc thân xe từ f0 tới f1 (m, dương = phía mũi)
const xeCanh = (X, lat, f0, f1, h = 1.7, fov = 50) => (u) => {
  if (!X || !X.obj.visible) return xeCam(X, 40, 16, 30, 42)(u);
  const p = X.obj.position, y = yawXe(X.obj), f = V3(Math.sin(y), 0, Math.cos(y)), r = V3(f.z, 0, -f.x), c = p.clone().addScaledVector(r, lat).addScaledVector(f, f0 + (f1 - f0) * sstep(0, 1, u));
  c.y = Math.max(p.y + h, hG(c.x, c.z) + h); return [c, p.clone().addScaledVector(f, 1.2).add(V3(0, 1.1, 0)), fov]; };
const ghep = (A, B, u0, u1) => (u, t) => { if (u <= u0) return A(u / u0, t); const b = B(u, t); if (u >= u1) return b; const a = A(1, t), e = sstep(u0, u1, u); return [a[0].clone().lerp(b[0], e), a[1].clone().lerp(b[1], e), a[2] + (b[2] - a[2]) * e]; };
const SHOTS = TANG === 'chien-dich' ? {
  'T01-A': fly(V3(0, R * 0.85, R * 1.25), V3(SG.x + R * 0.1, R * 0.55, SG.z + R * 0.75), V3(0, 0, 0), SG.clone(), 45),
  'T01-B': orbit(SG, R * 0.62, R * 0.5, 0.15, -1.45, 45),   // V1.9 (anh Thắng): vòng tròn bung toả ở Sài Gòn — máy bay vòng nhanh hơn (1,6 rad / 44 s)
  'T02-A': fly(V3(SG.x + R * 0.1, R * 0.55, SG.z + R * 0.75), V3(SG.x + 800, 2500, SG.z + 3000), SG.clone(), SG.clone(), 45),
  'C01-A': (u) => orbit(C01.xl, 22000, 12000, 2.2, 2.9, 42)(u),                                         // Xuân Lộc
  'C01-B': (u) => { const bh = META.places.find((p) => p[1] === 'Biên Hòa'), M = V3((C01.xl.x + bh[2]) / 2, 0, (C01.xl.z - bh[3]) / 2);
    return fly(V3(M.x + 2000, 30000, M.z + 36000), V3(M.x - 2000, 26000, M.z + 30000), M.clone(), M.clone(), 45)(u); },   // cửa phía Đông mở về Biên Hòa
  'C03-A': (u) => orbit(C03.lt, 20000, 11000, 1.4, 2.1, 42)(u),                                         // Long Thành, Nước Trong
  'C05-A': (u) => orbit(C05.dd, 15000, 8500, 2.6, 3.3, 42)(u),                                         // Đồng Dù: pháo bắn chuẩn bị, cắm cờ
  'C05-B': (u) => { const bt = LL(10.80326, 106.67153), M = V3((C05.dd.x + bt.x) / 2, 0, (C05.dd.z + bt.z) / 2);   // mũi tên Đồng Dù → Bộ Tổng tham mưu
    const d = V3(bt.x - C05.dd.x, 0, bt.z - C05.dd.z).normalize(), n = V3(-d.z, 0, d.x);   // nhìn ngang mũi tên
    return fly(M.clone().addScaledVector(n, 30000).setY(24000), M.clone().addScaledVector(n, 24000).setY(19000), M.clone(), M.clone(), 45)(u); },
  'C05-C': (u, t) => (KT.camRC ? KT.camRC(u, t) : orbit(C05.rc, 12000, 7000, 3.6, 4.2, 42)(u)),             // cầu Rạch Chiếc: sau công sự đặc công nhìn về phía đối phương phản kích
  'C02-A': fly(V3(0, R * 0.85, R * 1.25), V3(SG.x + R * 0.1, R * 0.55, SG.z + R * 0.75), V3(0, 0, 0), SG.clone(), 45),
  'C01-L1': (u, t) => KT.camCot(KT.c01a)(u, t), 'C01-L2': (u, t) => KT.camVai(KT.c01b)(u, t), 'C01-L3': (u, t) => KT.camCot(KT.c01c)(u, t),
  'C01-D': (u) => KT.camDon(KT.don.xl, 0.6, 2.2)(u), 'C01-D2': (u) => KT.camDon(KT.don.xl, 3.4, 4.4)(u), 'C01-P': (u) => KT.camTD(KT.td1)(u),
  'C02-L1': (u, t) => KT.camCot(KT.c02a)(u, t), 'C02-L2': (u, t) => KT.camCot(KT.c02b)(u, t),
  'C03-P': (u) => KT.camTD(KT.td3)(u), 'C03-D': (u) => KT.camDon(KT.don.lt, 1.0, 2.6)(u), 'C03-L': (u, t) => KT.camVai(KT.c03)(u, t),
  'C05-A0': (u) => orbit(C05.dd, 15000, 8500, 2.2, 2.6, 42)(u), 'C05-P': (u) => KT.camTD(KT.td5)(u), 'C05-D': (u) => KT.camDon(KT.don.dd, 4.0, 5.6)(u),
  'C05-L': (u, t) => KT.camCot(KT.c05)(u, t), 'C05-L2': (u, t) => KT.camVai(KT.c05b)(u, t), 'C05-C2': (u) => orbit(C05.rc, 9000, 5000, 4.2, 4.6, 42)(u),
  'C06-A0': orbit(SG, R * 0.55, R * 0.45, 0.4, 0.1, 45), 'C06-L1': (u, t) => KT.camCot(KT.c06a)(u, t), 'C06-L2': (u, t) => KT.camVai(KT.c06b)(u, t), 'C06-P': (u) => KT.camTD(KT.td6)(u),
  'C02-C': orbit(SG, R * 0.85, R * 0.72, -0.35, -0.7, 45),                                                     // vòng vây năm hướng
  'C03-B': orbit(SG, R * 0.7, R * 0.6, 0.5, 0.9, 45),
  'C06-A': orbit(SG, R * 0.75, R * 0.62, -0.7, -0.2, 45),                                                     // năm cánh quân đồng loạt
  'C06-B': (u) => orbit(C06.muc, 16000, 9000, 0.4, 0.9, 42)(u),                                         // Tân Sơn Nhất, Bộ Tổng tham mưu
  'C06-C': (u, t) => (KT.camTang && KT.c06rc ? KT.camTang(KT.c06rc)(u, t) : orbit(C05.rc, 11000, 6500, 4.2, 4.8, 42)(u)),                                          // cầu Rạch Chiếc → cầu Sài Gòn
} : {
  'T01-A': orbit(V3(0, 0, 0), R * 1.1, R * 0.9, 0, 0.2, 45),
  'T01-B': orbit(V3(0, 0, 0), R * 1.1, R * 0.9, 0.2, 0.4, 45),
  'T02-A': (u, t) => (XEX.camPho && t >= 767.5 ? XEX.camPho(t) : ghep(xeCanh(XEX.x843, -8, 7, -5), (v) => xeCam(XEX.x843, 40, 16, 30, 42)(v), 0.5, 0.75)(Math.min(1, u / 0.33), t)),   // V2.1: từ 767,5 s máy đứng một góc trên vỉa hè đoạn phố chi tiết nhìn đoàn xe tới   // V2.0: cận sườn 843 giữa hai hàng dân vẫy chào, rồi lùi lên cao
  'T02-B': (u) => xeCam(XEX.x390, 22, 7, 40, 45)(u),
  'C04-A': (u, t) => { const b = t >= MV.c04_catcanh && C04.camBay && C04.camBay(); if (b) return b; const c = V3(C04.tam[0], 0, -C04.tam[1]); if (u < 0.3 || !C04.canTau) return orbit(c, 950, 380, 2.2, 1.7, 45)(Math.min(u, 0.3)); return C04.canTau(u); },   // từ câu "cất cánh": bám theo 5 chiếc A-37             // toàn cảnh Tân Sơn Nhất, khu đỗ máy bay
  'C04-B': (u) => { const L = C04.bay[0].o; if (!L.visible) { const c = V3(C04.tam[0], 0, -C04.tam[1]); return [c.clone().add(V3(900, 520, -700)), c, 45]; }
    const p = L.position, y = L.rotation.y, e = sstep(0.35, 0.7, u), f = V3(Math.sin(y), 0, Math.cos(y)), r = V3(f.z, 0, -f.x);   // V2.0: nửa đầu máy sát phía trước chếch sườn chiếc dẫn đầu (thấy rõ A-37), rồi lùi xa thấy bom rơi
    const gn = [p.clone().addScaledVector(f, 24).addScaledVector(r, 10).add(V3(0, 3, 0)), p.clone().addScaledVector(f, -25).add(V3(0, -3, 0))], xa = [V3(p.x + Math.sin(y) * 160, p.y + 50, p.z + Math.cos(y) * 160), V3(p.x - Math.sin(y) * 300, p.y - 120, p.z - Math.cos(y) * 300)];
    return [gn[0].lerp(xa[0], e), gn[1].lerp(xa[1], e), 50]; },   // bám sau chiếc dẫn đầu
  'C04-C': (u) => { const c = V3(C04.tam[0], 0, -C04.tam[1]); return orbit(c, 520, 210, 1.0, 1.6, 48)(u); },              // khói lửa trên khu đỗ
  'T03-A': (u) => { const o = XEX.than.obj, v = o.visible ? o.position : XEX.x843.obj.position, [x, z] = XEX.DL(20 - u * 6, 180 - u * 8), h = XEX.hDinh || 0;   // ngoài cổng nhìn vào: Thận rời 843 ở cổng phụ
    return [V3(x, h + 8, -z), V3(v.x, v.y + 1.5, v.z), 42]; },
  'T03-A2b': (u) => { const o = XEX.than.obj, p = o.position, y = o.rotation.y;          // bám sau khi băng qua bãi cỏ
    return [V3(p.x - Math.sin(y) * 10, p.y + 5, p.z - Math.cos(y) * 10), V3(p.x + Math.sin(y) * 8, p.y + 1.4, p.z + Math.cos(y) * 8), 50]; },
  'T03-A2': (u) => SHOTS['T03-A2b'](u),
  'T03-B': (u, t) => { const [x, z] = XEX.DL(0, -4), h = XEX.hDinh || 0, c = V3(x, h + 31, -z);                 // nóc Dinh, nhìn lá cờ
    if (t >= MV.c11_keo - 1.5) { const k = sstep(MV.c11_keo - 1.5, MV.c11_keo + 14, t), a = 2.2 + k * 0.7;              // kéo cờ: máy hạ thấp sát mặt sân thượng, nhìn từ dưới lên lá cờ (anh Thắng 24/11)
      return [V3(x + Math.sin(a) * 6.5, h + 27.5 + 0.7, -z + Math.cos(a) * 6.5), V3(x, h + 27.5 + 3.4 + 3.6 * k, -z), 62]; }
    return orbit(c, 17, 1.5, 1.95, 2.75, 48, 4)(u); },
  'C07-A': (u, t) => { const X = C07.tang && C07.tang[0];                                   // 8:11 (anh Thắng 24/11): cận cảnh xe tăng lao vào khu đỗ, bộ binh chạy theo
    if (X && X.obj.visible && t > MV.c07_tc + 1) { const p = X.obj.position, y = yawXe(X.obj), f = V3(Math.sin(y), 0, Math.cos(y)), r = V3(f.z, 0, -f.x), k = sstep(MV.c07_tc + 1, MV.c07_24, t);
      return [p.clone().addScaledVector(f, -16 + k * 6).addScaledVector(r, -9 + k * 3).add(V3(0, 3.2 + k * 2, 0)), p.clone().addScaledVector(f, 45).add(V3(0, 1.5, 0)), 50]; }
    const c = V3(C04.tam[0], C04.h || 0, -C04.tam[1]); return orbit(c, 1700, 760, 2.6, 2.0, 45)(u); },                  // Tân Sơn Nhất sáng 30/4
  'C07-B': (u) => { const X = C07.xe && C07.xe[0]; if (X && X.obj.visible) return xeCam(X, 70, 32, 60, 46)(u); const c = V3(C04.tam[0], C04.h || 0, -C04.tam[1]); return orbit(c, 600, 240, 1.0, 1.6, 48)(u); },
  'C07-C': (u) => { const c = V3(C04.tam[0], C04.h || 0, -C04.tam[1]); return orbit(c, 1150, 620, 1.6, 2.2, 45)(u); },
  'C08-A': (u) => orbit(C89.btt, 1400, 760, 3.5, 4.1, 45)(u),                                          // Bộ Tổng tham mưu, hai mũi tiến công
  'C08-B': (u) => orbit(C89.btt, 900, 430, 4.1, 4.7, 46)(u),
  'C09-A': (u) => orbit(LL(10.7880, 106.6600, 0), 2800, 1650, -0.95, -0.55, 45)(u),                      // Bà Quẹo – Bảy Hiền – Lê Văn Duyệt
  'C09-B': (u) => { const X = C89.xeCY && C89.xeCY[1]; if (X && X.obj.visible) { const p = X.obj.position, y = yawXe(X.obj), f = V3(Math.sin(y), 0, Math.cos(y)), r = V3(f.z, 0, -f.x);   // cầu Chữ Y: bám đoàn xe vượt cầu
      return [p.clone().addScaledVector(f, 26 - u * 40).addScaledVector(r, 34).add(V3(0, 14, 0)), p.clone().addScaledVector(f, 10), 46]; } return orbit(LL(10.7509, 106.6874, 0), 330, 120, -0.45, 0.15, 45)(u); },                         // cầu Chữ Y
  'C09-C': orbit(V3(600, 0, -1100), 6400, 4300, -0.35, 0.25, 45),                                          // năm cánh quân hội tụ giữa nội đô
  // V1.9 (anh Thắng: cảnh 11:30 cho máy di chuyển từ đằng xa lại): bắt đầu xa 900 m, cao 320 m, bay dần vào đầu cầu (170 m, cao 60 m) đúng lúc M48 chặn đường
  'C10-A': (u) => { const X = XEX.x843, p = diemTren(X.D, 60), c = V3(p.x, hG(p.x, p.z), p.z), k = sstep(0, 0.85, u); return orbit(c, 900 + (170 - 900) * k, 320 + (60 - 320) * k, p.yaw + 1.6, p.yaw + 2.5, 45)(u); },   // đầu cầu Sài Gòn, M48
  'C10-B': (u, t) => ghep(xeCanh(XEX.x843, 7.5, 13, 3, 1.5, 48), (v) => xeCam(XEX.x843, 32, 13, 32, 42)(v), 0.55, 0.8)(u, t),   // V2.0: máy thấp phía trước chếch sườn — xe tăng 843 lăn xích tới
  'C10-C': (u) => { const X = XEX.x843, m = XEX.m113hx ? XEX.m113hx.position : diemTren(X.D, XEX.dHX), q = diemTren(X.D, XEX.dHX + 100);   // ngã tư Hàng Xanh
    const c = V3(q.x + Math.cos(q.yaw) * 4, hG(q.x, q.z) + 11 + u * 3, q.z - Math.sin(q.yaw) * 4); return [c, V3(m.x, m.y + 2, m.z), 44]; },
  'C10-D': (u) => { const X = XEX.x843, q = diemTren(X.D, XEX.L1 - 40), w = diemTren(X.D, XEX.L1 - 170 + u * 120);   // cầu Thị Nghè: 843 bắn cháy M41 →
    const o = XEX.x390 && XEX.x390.obj;
    const xm = XEX.doan && (XEX.doan.find((d) => d.k === 4) || XEX.doan[1]), om = xm && xm.X.obj.visible ? xm.X.obj : o;   // V1.3: ngồi trên xe tải giữa đoàn — nhìn thấy cả đoàn xe phía trước
    if (u > 0.4 && u < 0.78 && om && om.visible) { const [x, y, z] = om === o ? quayXe(o, -0.7, 2.95, -1.7) : quayXe(om, 0.05, 3.05, -0.3), [lx, ly, lz] = quayXe(om, 0, 2.2, 40); return [V3(x, y, z), V3(lx, ly, lz), 66]; }   // → mắt bộ binh ngồi trên xe qua cầu
    if (u >= 0.78 && XEX.doan) { const L = XEX.doan.filter((d) => d.X.obj.visible), b = L[L.length - 1]; if (b && o) { const p = b.X.obj.position, y = yawXe(b.X.obj);   // → phía sau nhìn đoàn xe qua cầu
      return [V3(p.x - Math.sin(y) * 28, p.y + 9, p.z - Math.cos(y) * 28), V3(o.position.x, o.position.y + 2, o.position.z), 48]; } }
    return [V3(q.x - Math.cos(q.yaw) * 5, hG(q.x, q.z) + 14, q.z + Math.sin(q.yaw) * 5), V3(w.x, hG(w.x, w.z) + 2, w.z), 46]; },
  'C10-E': (u) => xeCam(XEX.x390, -40 + u * 10, 13, -70, 45)(u),                         // đi lùi trước mũi 390, nhìn về sau: xe tăng và đoàn xe chở bộ binh theo sau
  'C12-A': (u) => { const [x, z] = XEX.DL(0, 30), c = V3(x, (XEX.hDinh || 0) + 12, -z); return orbit(c, 250, 90, 2.15, 2.65, 45)(u); },   // Dinh, lá cờ trên nóc
  'C12-B': (u) => { const DL = XEX.DL, h = XEX.hDinh || 0, P = (a, b, y) => { const [x, z] = DL(a, b); return V3(x, h + y, -z); };   // người dân trước cổng Dinh
    return fly(P(4, 238, 9), P(-4, 226, 8), P(-6, 150, 2), P(6, 156, 2), 48)(u); },
  'C12-C': (u) => { const DL = XEX.DL, h = XEX.hDinh || 0, P = (a, b, y) => { const [x, z] = DL(a, b); return V3(x, h + y, -z); };   // Sài Gòn từ trên cao
    return fly(P(0, 175, 26), P(-300, 1500, 1500), P(0, 0, 18), P(200, -300, 0), 50)(u); },
  'T02-C': (u) => { const DL = XEX.DL, h = XEX.hDinh || 0, P = (a, b, y) => { const [x, z] = DL(a, b); return V3(x, h + y, -z); };   // cổng Dinh: nhìn từ ngoài vào
    if (u < 0.72) return fly(P(-22, 192, 8), P(-15, 178, 7), P(6, 146, 2.5), P(4, 140, 2.5), 46)(u / 0.72);          // ngoài cổng, góc ảnh tư liệu: cổng phụ trái (843) và cổng chính (390)
    return fly(P(4, 3, 23), P(0, 6, 25), P(-4, 120, 0), P(0, 100, 0), 52)((u - 0.72) / 0.28); },                    // từ sân thượng Dinh nhìn ra (góc ảnh tư liệu 30/4)
};
//@@ s35
function sceneAt(t) { for (const s of STORY.scenes) if (t >= s.t0 && t < s.t1) return s; return STORY.scenes[STORY.scenes.length - 1]; }
//@@ s36
const SECTION_SHOTS_X = new Set();
const CARDS = [];
const LABEL_SHOTS = {};
//@@ s37
//@@ s38
// mốc: thị xã, thị trấn (tên năm 1975, terrain/meta.json) + mốc nội đô
const ANCH = TANG === 'chien-dich'
  ? META.places.map(([typ, ten, x, y], k) => ['p' + k, ten, x, -y, typ === 'city' ? 'Thành phố, thị xã (tên năm 1975)' : 'Thị trấn (tên năm 1975)', typ === 'city'])
  : Object.entries(MOC).map(([k, [la, lo, ten]]) => [k, ten, LLx(la, lo), LLz(la, lo), 'Mốc nội đô (toạ độ OSM 2026, chốt theo nguồn ở GĐ5)', k === 'dinh']);
//@@ s39
{ const st = document.createElement('style'); st.textContent = '.lbl.hero.dich b{border-color:#fff;background:rgba(60,59,110,.92);color:#fff}.lbl.hero.dich i{background:linear-gradient(#fff,transparent)}'; document.head.append(st); }
function addLabel(text, x, z, cls, opts = {}) {
  const el = document.createElement('div'); el.className = 'lbl ' + (cls || '') + (/hero/.test(cls || '') && /đối phương|VNCH|\(địch\)/i.test(text) ? ' dich' : '');   // V1.9: ghim khí tài đối phương nền xanh cờ Mỹ, chữ trắng
  const b = document.createElement('b'); b.textContent = text; const i = document.createElement('i'); el.append(b, i); $('labels').appendChild(el);
  const L = { el, b, x, z, cls, grp: opts.grp || 'anc', maxDist: opts.maxDist || Infinity, yFn: opts.yFn || null, show: opts.show || null };
  if (opts.onClick) b.addEventListener('click', (e) => { e.stopPropagation(); if (!dragging) opts.onClick(); });
  if (opts.drag) b.addEventListener('pointerdown', (e) => { if (uiMode === 'drag' && canWrite !== false) { e.preventDefault(); e.stopPropagation(); startDrag(opts.drag, e); } });
  labels.push(L); return L;
}
for (const [name, text, x, z, desc, big] of ANCH) {
  const A = { name, text, x0: x, z0: z, x, z, desc, big };
  A.label = addLabel(text, x, z, big ? 'big' : '', { grp: 'key', onClick: () => { showCard(name); flyTo(A.x, A.z, TANG === 'noi-do' ? 500 : 9000); }, drag: { kind: 'anchor', name } });
  anchors.set(name, A);
}
// TƯỚNG CHỈ HUY từng cánh quân (anh Thắng 24/11): nhandan.vn (QĐ1: Nguyễn Hòa – Hoàng Minh Thi; QĐ4: Hoàng Cầm – Hoàng Thế Thiện), sggp.org.vn (QĐ2: Nguyễn Hữu An –
// Lê Linh), baophapluat.vn (QĐ3: Vũ Lăng – Đặng Vũ Hiệp, khi thành lập 27/3/1975), vtcnews.vn (cánh Tây – Tây Nam do Trung tướng Lê Đức Anh, Phó Tư lệnh chiến dịch, chỉ huy)
const TUONG = ['Tư lệnh: Thiếu tướng Nguyễn Hòa · Chính ủy: Thiếu tướng Hoàng Minh Thi', 'Tư lệnh: Thiếu tướng Vũ Lăng · Chính ủy: Đại tá Đặng Vũ Hiệp',
  'Tư lệnh: Thiếu tướng Hoàng Cầm · Chính ủy: Thiếu tướng Hoàng Thế Thiện', 'Tư lệnh: Thiếu tướng Nguyễn Hữu An · Chính ủy: Thiếu tướng Lê Linh', 'Chỉ huy cánh quân: Trung tướng Lê Đức Anh (Phó Tư lệnh chiến dịch)'];
for (const M of MUITEN) { const p = HUONG[M.k][1][0]; const L = addLabel(M.ten, LLx(p[0], p[1]), LLz(p[0], p[1]), 'hero tong', { grp: 'muiten', yFn: () => 2500, show: () => M.m.visible });
  if (TUONG[M.k]) addLabel(TUONG[M.k], LLx(p[0], p[1]), LLz(p[0], p[1]), 'vil tuong', { grp: 'muiten', yFn: () => 1350, show: () => M.m.visible }); }
if (MUITEN.length) addLabel('Bộ Tư lệnh chiến dịch: Đại tướng Văn Tiến Dũng (Tư lệnh) · Phạm Hùng (Chính ủy)', SG.x, SG.z, 'hero', { grp: 'muiten', yFn: () => 4200, show: () => MUITEN.some((M) => M.m.visible) });   // nhandan.vn, vietnamnet.vn
// ------------------------------------------------------------------ C05 · PHÁ TUYẾN NGOÀI (29/4/1975) — tầng chiến dịch
// 5h30 29/4 pháo bắn chuẩn bị vào căn cứ Đồng Dù (Sư đoàn 25 VNCH); 10h30 Sư đoàn 320A (Quân đoàn 3) cắm cờ trên sở chỉ huy sư đoàn;
// 23h Quân đoàn 3 nhận nhiệm vụ đánh Bộ Tổng tham mưu (S5). Lữ đoàn đặc công – biệt động 316 đánh chiếm, giữ cầu Rạch Chiếc 27–30/4 (S19, S40).
// Toạ độ: căn cứ Đồng Dù 10,9875 B · 106,5125 Đ (S41, Wikipedia "Củ Chi Base Camp"); cầu Rạch Chiếc 10,8133 B · 106,7569 Đ (S42).
// Vị trí trận địa pháo, đường bay đạn là MINH HOẠ.
const C05 = {}, C01 = {}, C03 = {}, C06 = {}, KT = { cot: [], td: [], don: {} };
if (TANG === 'chien-dich') {
  const sc = STORY.scenes.find((c) => c.id === 'C05'); C05.t0 = sc ? sc.t0 : 1e9; C05.t1 = sc ? sc.t1 : 1e9; const T0 = C05.t0;
  const DD = [10.9875, 106.5125], RC = [10.8133, 106.7569], BT = [10.80326, 106.67153];
  const dd = LL(DD[0], DD[1]), rc = LL(RC[0], RC[1]); dd.y = hG(dd.x, dd.z); rc.y = hG(rc.x, rc.z); C05.dd = dd; C05.rc = rc;
  const tex = (src) => { const t = new THREE.TextureLoader().load(src); t.colorSpace = THREE.SRGBColorSpace; return t; };
  const coTx = tex('data/co-mtdtgp.png');
  const ghim = (p, h, w) => {                                                            // cờ ghim trên sa bàn (kiểu sa bàn thật): cán + lá cờ bay
    const g = new THREE.Group(), can = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.035, w * 0.035, h, 6).translate(0, h / 2, 0), new THREE.MeshLambertMaterial({ color: 0x3a2c1c }));
    const m = new THREE.MeshLambertMaterial({ map: coTx, side: THREE.DoubleSide }); m.onBeforeCompile = (sh) => { sh.uniforms.uT = U.time;
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uT;').replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed.z += sin(uv.x * 5.0 - uT * 3.0) * 0.08 * ' + w.toFixed(1) + ' * uv.x;'); };
    const la = new THREE.Mesh(new THREE.PlaneGeometry(w, w * 0.66, 10, 2).translate(w / 2, h - w * 0.33, 0), m);
    g.add(can, la); g.position.copy(p); g.scale.setScalar(0.001); g.visible = false; scene.add(g); return g; };
  C05.coDD = ghim(dd, 2600, 1500); C05.coRC = ghim(rc, 2200, 1300);
  const vongMat = new THREE.MeshBasicMaterial({ color: 0xffd36a, transparent: true, opacity: 0.8, depthWrite: false, depthTest: false, side: THREE.DoubleSide });   // không bị núi che (anh Thắng 24/11)
  const vong = (p) => { const m = new THREE.Mesh(new THREE.RingGeometry(0.86, 1, 64).rotateX(-Math.PI / 2), vongMat.clone()); m.position.copy(p).y += 450; m.renderOrder = 6; m.visible = false; scene.add(m); return m; };
  C05.vDD = vong(dd); C05.vRC = vong(rc);
  // pháo bắn chuẩn bị: 6 trận địa minh hoạ ở phía Bắc – Tây Bắc căn cứ, đạn bay theo đường cong
  const sprTex = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const c = cv.getContext('2d'), g = c.createRadialGradient(32, 32, 2, 32, 32, 31);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.5, 'rgba(255,255,255,.5)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(cv); })();
  const spr = (col, s) => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sprTex, color: col, transparent: true, depthWrite: false })); sp.scale.setScalar(s); sp.visible = false; scene.add(sp); return sp; };
  const phaoTao = (p, huong, n = 6) => Array.from({ length: n }, (_, k) => {               // trận địa pháo MINH HOẠ quanh hướng `huong` (rad, 0 = Bắc), bắn vào p
    const a = huong - 0.45 + k * 0.9 / (n - 1), r = 9000 + (k % 3) * 1800, src = V3(p.x + Math.sin(a) * r, 0, p.z - Math.cos(a) * r); src.y = hG(src.x, src.z);
    const dich = V3(p.x + (k - n / 2) * 500, p.y, p.z + ((k * 37) % 5 - 2) * 400);
    return { src, dich, dan: spr(0xffe0a0, 700), no: spr(0xff8a3a, 2600), ph: k * 0.37 }; });
  const phaoCap = (L, on, u0, u1, u) => { for (const P of L) {                             // đạn bay theo đường cong, nổ ở đích
    const ph = ((u - u0 + P.ph) / 2.4) % 1, ban = on && u > u0 && u < u1;
    P.dan.visible = ban && ph < 0.8; P.no.visible = ban && ph >= 0.8;
    if (P.dan.visible) { const k = ph / 0.8; P.dan.position.lerpVectors(P.src, P.dich, k).y += Math.sin(Math.PI * k) * 4500; }
    if (P.no.visible) { const k = (ph - 0.8) / 0.2; P.no.position.copy(P.dich).y += 600; P.no.scale.setScalar(1500 + k * 3000); P.no.material.opacity = 1 - k; } } };
  C05.phao = phaoTao(dd, -0.4);
  C05.ten = [addLabel('Căn cứ Đồng Dù (Sư đoàn 25)', dd.x, dd.z, 'hero', { grp: 'muiten', yFn: () => 3600, show: () => C05.vDD.visible }),
             addLabel('Cầu Rạch Chiếc — đặc công 316 giữ cầu', rc.x, rc.z, 'hero', { grp: 'muiten', yFn: () => 3200, show: () => C05.vRC.visible })];
  // ---- C01 · Cánh cửa phía Đông: Xuân Lộc 9–21/4 (S21). Toạ độ thị xã theo terrain/meta.json (OSM). Mũi tên theo đường số 1 về Biên Hòa: MINH HOẠ ý "cửa mở".
  const noi = (ten) => { const q = META.places.find((p) => p[1].startsWith(ten)); const v = V3(q[2], 0, -q[3]); v.y = hG(v.x, v.z); return v; };
  { const sc1 = STORY.scenes.find((c) => c.id === 'C01'); C01.t0 = sc1 ? sc1.t0 : 1e9; C01.t1 = sc1 ? sc1.t1 : 1e9;
    C01.xl = noi('Xuân Lộc'); C01.v = vong(C01.xl); C01.phao = phaoTao(C01.xl, 0.3, 5);
    C01.ten = addLabel('Xuân Lộc — trận đánh 9–21/4', C01.xl.x, C01.xl.z, 'hero', { grp: 'muiten', yFn: () => 3600, show: () => C01.v.visible });
    const dg = noi('Dầu Giây'), bh = noi('Biên Hòa');
    C01.mt = muiTen([C01.xl, dg, bh].map((v) => V3(v.x, 900, v.z)), 0xd2442b, 420); muiTenDat(C01.mt, false);
    C01.cap = (t) => { const on = t >= C01.t0 - 0.5 && t < C01.t1 + 0.5, u = t - C01.t0;
      C01.v.visible = on; if (on) { const k = (u * 0.5) % 1; C01.v.scale.setScalar(2500 + k * 4000); C01.v.material.opacity = 0.8 * (1 - k); }
      phaoCap(C01.phao, on, MV.c01_phao0 - C01.t0, MV.c01_phao1 - C01.t0, u); muiTenDat(C01.mt, on && t >= MV.c01_mt, sstep(MV.c01_mt, MV.c01_mt + 9, t)); }; }
  // ---- C03 · Nổ súng mở màn 17h 26/4 (S2, S26): pháo binh Quân đoàn 2 nổ súng hướng Đông, Đông Nam, chi viện đánh Nước Trong, Long Thành (S39).
  { const sc3 = STORY.scenes.find((c) => c.id === 'C03'); C03.t0 = sc3 ? sc3.t0 : 1e9; C03.t1 = sc3 ? sc3.t1 : 1e9;
    C03.lt = noi('Long Thành'); C03.v = vong(C03.lt); C03.phao = phaoTao(C03.lt, 1.3, 8);
    C03.ten = addLabel('Long Thành, Nước Trong — 17 giờ 26/4', C03.lt.x, C03.lt.z, 'hero', { grp: 'muiten', yFn: () => 3600, show: () => C03.v.visible });
    C03.cap = (t) => { const on = t >= C03.t0 - 0.5 && t < C03.t1 + 0.5, u = t - C03.t0;
      C03.v.visible = on; if (on) { const k = (u * 0.5) % 1; C03.v.scale.setScalar(2500 + k * 4000); C03.v.material.opacity = 0.8 * (1 - k); }
      phaoCap(C03.phao, on, MV.c03_phao0 - C03.t0, MV.c03_phao1 - C03.t0, u); }; }
  // ---- C06 · Rạng sáng 30/4 (S1, S19): năm cánh quân đồng loạt tổng công kích; 7h15 pháo cối bắn vào Tân Sơn Nhất và Bộ Tổng tham mưu;
  // 7h30 xe tăng đầu tiên của Lữ đoàn 203 qua cầu Rạch Chiếc. Trận địa cối, đường đạn, mũi tên qua cầu: MINH HOẠ.
  { const sc6 = STORY.scenes.find((c) => c.id === 'C06'); C06.t0 = sc6 ? sc6.t0 : 1e9; C06.t1 = sc6 ? sc6.t1 : 1e9;
    const tsn = LL(MOC.tsn[0], MOC.tsn[1]), btt = LL(BT[0], BT[1]); tsn.y = hG(tsn.x, tsn.z); btt.y = hG(btt.x, btt.z); C06.muc = V3((tsn.x + btt.x) / 2, 0, (tsn.z + btt.z) / 2);
    C06.phao = [...phaoTao(tsn, -0.9, 4), ...phaoTao(btt, -0.2, 4)]; C06.vT = vong(tsn); C06.vB = vong(btt);
    const cs = LL(MOC.causg[0], MOC.causg[1]);
    C06.mt = muiTen([rc, LL(10.807, 106.742), cs].map((v) => V3(v.x, 700, v.z)), 0xd2442b, 260); muiTenDat(C06.mt, false);
    C06.ten = [addLabel('7 giờ 30 · xe tăng Lữ đoàn 203 qua cầu', rc.x, rc.z, 'hero', { grp: 'muiten', yFn: () => 2600, show: () => C06.mt.visible }),
               addLabel('7 giờ 15 · pháo cối vào Tân Sơn Nhất, Bộ Tổng tham mưu', C06.muc.x, C06.muc.z, 'hero', { grp: 'muiten', yFn: () => 3200, show: () => C06.vT.visible })];
    C06.cap = (t) => { const on = t >= C06.t0 - 0.5 && t < C06.t1 + 0.5, u = t - C06.t0;
      C06.vT.visible = C06.vB.visible = on && t >= MV.c06_phao - 1 && t < MV.c06_rc + 2;
      for (const v of [C06.vT, C06.vB]) if (v.visible) { const k = (u * 0.5) % 1; v.scale.setScalar(1200 + k * 2000); v.material.opacity = 0.8 * (1 - k); }
      phaoCap(C06.phao, on, MV.c06_phao - C06.t0, MV.c06_rc + 3 - C06.t0, u);
      muiTenDat(C06.mt, on && t >= MV.c06_rc + 2, sstep(MV.c06_rc + 2, MV.c06_rc + 12, t)); }; }
  // ---- KHÍ TÀI MINH HOẠ TRÊN TẦNG CHIẾN DỊCH (anh Thắng 24/11): lời dẫn nói về đối phương → máy bay vòng cung quanh đồn lũy; nói về
  // Quân Giải phóng → máy lướt sát trên đầu đoàn quân đang tiến về Sài Gòn; nói về pháo → cận cảnh, trung cảnh trận địa pháo ta đang bắn.
  // Mẫu xe, pháo phóng to ×3 (kiểu quân cờ trên sa bàn) để thấy được ở tầm chiến dịch. Vị trí đồn, trận địa, đội hình đoàn xe: MINH HOẠ.
  { const KS = 3, tx = (src) => { const t = new THREE.TextureLoader().load(PU(src)); t.colorSpace = THREE.SRGBColorSpace; return t; }, txM = tx('data/co-mtdtgp.png'), txV = tx('data/co-vnch.png');
    const [gK, gT, gP, g41, g113, gTK, gA] = await Promise.all(['data/xe/xe-boc-thep-k63.glb', 'data/xe/xe-tai.glb', 'data/phao/m-46-130mm.glb', 'data/xe/xe-tang-m41.glb', 'data/xe/xe-boc-thep-m113.glb', 'data/xe/xe-tang-390.glb', 'data/xe/ats59.glb'].map((f) => glbLoad(f).catch(() => null)));
    const coMat = (t) => { const m = new THREE.MeshLambertMaterial({ map: t, side: THREE.DoubleSide }); m.onBeforeCompile = (sh) => { sh.uniforms.uT = U.time;
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uT;').replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed.z += sin(uv.x * 6.0 - uT * 5.0) * 0.12 * uv.x * 6.0;'); }; return m; };
    const mMT = coMat(txM), mVN = coMat(txV), mCan = new THREE.MeshLambertMaterial({ color: 0x3a2c1c });
    const co = (cao, w, mat) => { const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.CylinderGeometry(w * 0.03, w * 0.03, cao, 5).translate(0, cao / 2, 0), mCan),
      new THREE.Mesh(new THREE.PlaneGeometry(w, w * 0.66, 8, 1).translate(w / 2, cao - w * 0.33, 0), mat)); return g; };
    const moi = (g, s = KS) => { const o = g.scene.clone(true); o.scale.setScalar(s); return o; };
    const huong = (a, b) => Math.atan2(b.x - a.x, b.z - a.z);                              // mũi xe theo +z
    // ĐỒN LŨY ĐỐI PHƯƠNG (anh Thắng 24/11): thành vuông như thành trì — tường đất, hai cổng ra vào, bốn lô cốt góc, hàng rào dây thép gai, dãy nhà lính,
    // xe tăng M41, xe bọc thép M113, cờ ba sọc, lính đối phương trên tường và trong đồn. Trong lúc pháo ta bắn: nổ trong đồn; sau khi đồn mất (tDo): tường sụt,
    // nhà sập, xe cháy, lính tử trận, cờ Mặt trận trên cột cờ, bộ đội ta trong đồn. Kích thước (cạnh 360 m), bố trí: MINH HOẠ kiểu "quân cờ" trên sa bàn.
    const mat = (c) => new THREE.MeshLambertMaterial({ color: c }), cua = (o) => { const M = []; o.traverse((m) => { if (m.isMesh) { m.material = m.material.clone(); M.push([m.material, m.material.color.clone()]); } }); return M; };
    const don = (p, tTC, tDo, chet = 0.35, quay = 0.3) => { const g = new THREE.Group(), S = 180, dat = mat(0x7b6040), bt = mat(0x5d6150), mai = mat(0x8d918a), soi = mat(0xa39272);
      const D = { g, tTC, tDo, chet, tuong: [], nha: [], xe: [], lua: [], no: [], A: [], B: [], hu: null };
      const hop = (w, h, d, m, x, y, z, ry = 0) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.rotation.y = ry; g.add(b); return b; };
      hop(2 * S - 10, 1, 2 * S - 10, soi, 0, 0.4, 0);                                               // nền đồn
      for (const [sx, sz, ngang, cong] of [[0, S, 1, 1], [0, -S, 1, 1], [S, 0, 0, 0], [-S, 0, 0, 0]])  // tường đất từng đoạn 60 m; hai cạnh trước, sau chừa cổng 36 m
        for (let k = 0; k < 6; k++) { let a = -S + k * 60, b = a + 60; const doan = cong && a < 18 && b > -18 ? [[a, -18], [18, b]] : [[a, b]];
          for (const [a1, b1] of doan) { const m = (a1 + b1) / 2, L = b1 - a1; const w = hop(ngang ? L : 14, 7, ngang ? 14 : L, dat, ngang ? m : sx, 3.5, ngang ? sz : m); D.tuong.push(w);
            for (let j = 0; j < 2; j++) { const u = (j + 0.5) / 2, q = a1 + L * u, x = ngang ? q : sx, z = ngang ? sz : q; D.B.push([x, z, Math.atan2(ngang ? 0 : sx, ngang ? sz : 0), 7.2, 'tuong']); } } }
      for (const sz of [S, -S]) for (const sx of [-24, 24]) hop(12, 13, 16, bt, sx, 6.5, sz);      // tháp hai bên cổng
      for (const sx of [-S, S]) for (const sz of [-S, S]) { hop(20, 16, 20, bt, sx, 8, sz); hop(24, 2, 24, mai, sx, 17, sz); }   // lô cốt bốn góc
      for (const [w, d, x, z] of [[2 * S + 80, 1.6, 0, S + 40], [2 * S + 80, 1.6, 0, -S - 40], [1.6, 2 * S + 80, S + 40, 0], [1.6, 2 * S + 80, -S - 40, 0]]) hop(w, 2.4, d, mat(0x2b2b28), x, 1.2, z);   // rào thép gai
      for (const [x, z] of [[-95, -100], [95, -100], [-95, 15], [95, 15], [-95, 110]]) D.nha.push(hop(80, 9, 18, mai, x, 4.5, z));   // dãy nhà lính mái tôn
      const cv = co(70, 34, mVN); cv.position.set(0, 0, -40); g.add(cv); D.coV = cv; const cm = co(70, 34, mMT); cm.position.set(0, 0, -40); cm.visible = false; g.add(cm); D.coM = cm;
      [[g41, 40, 60, 0.5], [g41, -30, 90, 2.0], [g113, 60, -40, 3.6], [g113, -50, -50, 1.2], [g113, 20, 120, 0.2]].forEach(([gg, x, z, y]) => { if (!gg) return; const o = moi(gg); o.position.set(x, 1, z); o.rotation.y = y; g.add(o); D.xe.push({ o, mats: cua(o), ten: gg === g41 ? 'Xe tăng M41 (đối phương)' : 'Xe bọc thép M113 (đối phương)' }); });
      const r = rndS(Math.round(p.x) % 9999 + 7); for (let i = 0; i < 22; i++) D.B.push([(r() - 0.5) * 260, (r() - 0.5) * 260, r() * 6.28, 1, r() < 0.4 ? 'nup' : r() < 0.5 ? 'di' : 'dung']);
      for (let i = 0; i < 24; i++) D.A.push([(r() - 0.5) * 240, (r() - 0.5) * 240, r() * 6.28, 1, 'dung']);   // bộ đội ta trong đồn sau trận
      for (let i = 0; i < 7; i++) { D.lua.push(nhoe(0xff7a2a)); D.no.push(nhoe(0x58504a, false)); }
      g.position.set(p.x, hG(p.x, p.z), p.z); g.rotation.y = quay; scene.add(g); g.updateMatrixWorld(true);
      const W = (P) => { const v = g.localToWorld(V3(P[0], P[3], P[1])); return [v.x, v.y, v.z, P[2] + quay, P[4]]; };
      D.Bw = D.B.map(W); D.Aw = D.A.map(W); D.ph = D.B.map((_, i) => (i * 0.61) % 1);
      // V1.9 (anh Thắng: pháo ta bắn vào cứ điểm thì xe tăng, xe bọc thép, lính địch trong đồn phải chạy toán loạn, tháo chạy): mỗi người, mỗi xe có một
      // đường tháo chạy — chạy loạn trong đồn rồi ra cổng phía Sài Gòn, chạy xa ra ngoài. Lính trong đồn chạy ngay khi pháo bắt đầu, lính trên tường bắn trả
      // nửa đầu trận rồi mới bỏ chạy. Khi đồn mất: người bị trúng đạn nằm lại chỗ đang chạy, xe cháy tại chỗ. Đường chạy, thời điểm: MINH HOẠ.
      { const rf = rndS(Math.round(p.x * 7) % 9999 + 11), cg = [g.localToWorld(V3(0, 0, S)), g.localToWorld(V3(0, 0, -S))], gi = cg[0].distanceToSquared(SG) < cg[1].distanceToSquared(SG) ? 0 : 1;
        const CG = cg[gi], vin = g.localToWorld(V3(0, 0, gi ? -S + 30 : S - 30)), dir = V3(SG.x - CG.x, 0, SG.z - CG.z).normalize(), ng = V3(dir.z, 0, -dir.x);
        const tuyen = (P) => { const L = [0]; for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i].x - P[i - 1].x, P[i].z - P[i - 1].z)); return { P, L }; };
        D.chayBo = D.Bw.map((B, i) => { const tuong = B[4] === 'tuong', q = g.localToWorld(V3((rf() - 0.5) * 260, 0, (rf() - 0.5) * 260)), xa = 300 + rf() * 420, ngang = (rf() - 0.5) * 360;
          const E = V3(CG.x + dir.x * xa + ng.x * ngang, 0, CG.z + dir.z * xa + ng.z * ngang);
          return { ts: tuong ? tTC + (tDo - tTC) * 0.45 + rf() * 5 : tTC + 0.3 + rf() * 2.5, T: tuyen(tuong ? [V3(B[0], 0, B[2]), vin, CG, E] : [V3(B[0], 0, B[2]), q, vin, CG, E]) }; });
        D.chayXe = D.xe.map((X, i) => { const w = g.localToWorld(X.o.position.clone()), xa = 650 + rf() * 400, ngang = (i - 2) * 140 + (rf() - 0.5) * 80, E = V3(CG.x + dir.x * xa + ng.x * ngang, 0, CG.z + dir.z * xa + ng.z * ngang);
          return { ts: tTC + 1 + i * 1.6, p0: X.o.position.clone(), y0: X.o.rotation.y, T: tuyen([w, g.localToWorld(V3((rf() - 0.5) * 200, 0, (rf() - 0.5) * 200)), vin, CG, V3(CG.x + dir.x * 120, 0, CG.z + dir.z * 120), E]) }; });   // vòng loạn trong đồn rồi mới ra cổng
        D.diem = (T, s) => { const L = T.L; s = Math.min(Math.max(0, s), L[L.length - 1] - 0.01); let k = 1; while (k < L.length - 1 && L[k] < s) k++;
          const A = T.P[k - 1], B = T.P[k], u = (s - L[k - 1]) / Math.max(1e-6, L[k] - L[k - 1]); return [A.x + (B.x - A.x) * u, A.z + (B.z - A.z) * u, Math.atan2(B.x - A.x, B.z - A.z), s >= L[L.length - 1] - 0.02]; }; }
      D.hong = D.tuong.filter((_, i) => (i * 7) % 5 < 2);                                         // các đoạn tường bị phá
      D.cap = (t) => { const hu = t >= tDo; if (hu !== D.hu) { D.hu = hu;
          for (const w of D.hong) { w.position.y = hu ? 1.2 : 3.5; w.rotation.z = hu ? 0.22 : 0; w.scale.y = hu ? 0.45 : 1; }
          for (const n of D.nha) { n.scale.y = hu ? 0.3 : 1; n.position.y = hu ? 1.4 : 4.5; n.material = hu ? mat(0x3a3532) : mai; }
          for (const X of D.xe) if (X.mats) for (const [m, c0] of X.mats) m.color.copy(c0).multiplyScalar(hu ? 0.28 : 1);
          D.coV.visible = !hu; D.coM.visible = hu; }
        const danh = t >= tTC && t < tDo, chay = hu && t < tDo + 40;
        D.lua.forEach((s, i) => { const P = i < D.xe.length ? D.xe[i].o.position : D.nha[i % D.nha.length].position, w = g.localToWorld(V3(P.x, 2, P.z));
          if (danh) { const u = (t * 0.55 + i * 0.37) % 1; s.visible = u < 0.4; if (s.visible) { const q = g.localToWorld(V3(((i * 53) % 300) - 150, 2, ((i * 97) % 300) - 150)); s.position.set(q.x, q.y + 6 + u * 40, q.z); s.scale.setScalar(25 + u * 120); s.material.opacity = 0.95 * (1 - u / 0.4); } }
          else if (chay) { s.visible = true; s.position.set(w.x, w.y + 6 + (Math.sin(t * 9 + i) + 1) * 2, w.z); s.scale.setScalar(16 + Math.sin(t * 13 + i * 2) * 4); s.material.opacity = 0.85; }
          else s.visible = false;
          const k = D.no[i]; k.visible = danh || chay; if (k.visible) { const u = (t * 0.12 + i / 7) % 1; k.position.set(w.x + u * 40, w.y + 10 + u * 160, w.z - u * 25); k.scale.setScalar(30 + u * 120); k.material.opacity = 0.5 * (1 - u); } }); };
      KT.dons.push(D); return D; };
    KT.dons = [];
    KT.don.xl = don(C01.xl, MV.c01_phao0, MV.c01_rut, 0.2, 0.4); KT.don.lt = don(C03.lt, MV.c03_phao0, MV.c03_phao1 + 4, 0.35, 1.1); KT.don.dd = don(C05.dd, MV.c05_phao0, MV.c05_co, 0.35, -0.2);
    for (const k of ['xl', 'lt', 'dd']) KT.don[k] = Object.assign(KT.don[k].g, { D: KT.don[k] });
    DAM.push((t, tv) => { for (const D of KT.dons) { const p = D.g.position; if (!ganMay(p.x, p.z, 2600)) continue; D.cap(tv); const hu = tv >= D.tDo, nc = Math.floor(D.Bw.length * D.chet);
      const tc = Math.min(tv, D.tDo);
      D.Bw.forEach((P, i) => { if (hu && i >= nc) return; const C = D.chayBo[i];
        if (tc > C.ts) { const [x, z, yaw, het] = D.diem(C.T, (tc - C.ts) * 4.0 * KS); if (het && !hu) return;   // 4 m/s × KS: khớp nhịp bước động tác 'chay'
          dongDat('vnch', hu ? 'nam' : 'chay', tv, D.ph[i], x, hG(x, z) + (hu ? 0.3 : 0), z, yaw, KS, i); return; }
        const clip = hu ? 'nam' : P[4] === 'tuong' ? (tv >= D.tTC ? 'ban' : 'dung') : P[4]; dongDat('vnch', clip, tv, D.ph[i], P[0], P[1] + (hu ? 0.3 : 0), P[2], P[3], KS, i); });
      D.xe.forEach((X, i) => { const C = D.chayXe[i]; if (tc <= C.ts) { X.o.position.copy(C.p0); X.o.rotation.y = C.y0; return; }
        const [x, z, yaw] = D.diem(C.T, (tc - C.ts) * 8 * KS), l = D.g.worldToLocal(V3(x, hG(x, z) + 1, z)); X.o.position.copy(l); X.o.rotation.y = yaw - D.g.rotation.y; });
      if (hu) D.Aw.forEach((P, i) => dongDat('qgp', 'dung', tv, D.ph[i % D.ph.length], P[0], P[1], P[2], P[3], KS, i)); }
      for (const D of KT.dons) if (!ganMay(D.g.position.x, D.g.position.z, 2600)) D.cap(tv); });
    // trận địa pháo ta: 4 khẩu M-46 130 mm (cắm cờ Mặt trận), chớp lửa đầu nòng, khói — đặt ở điểm xuất phát đường đạn phaoTao
    const tranDia = (P, t0, t1) => { const f = V3().subVectors(P.dich, P.src).setY(0).normalize(), r = V3(f.z, 0, -f.x), yaw = Math.atan2(f.x, f.z), S = [];
      for (let k = 0; k < 4; k++) { if (!gP) break; const o = moi(gP, 2.6), x = P.src.x + r.x * (k - 1.5) * 42, z = P.src.z + r.z * (k - 1.5) * 42;
        o.position.set(x, hG(x, z), z); { const L = 5.7 * 2.6, ex = x - Math.sin(yaw) * L, ez = z - Math.cos(yaw) * L; o.rotation.set(Math.max(-0.35, Math.min(0.35, Math.atan2(hG(ex, ez) - hG(x, z), L))), yaw, 0, 'YXZ'); }   // V2.0: nghiêng pháo theo dốc để càng không lút vào đất
        scene.add(o); { const n = o.getObjectByName('nong'); if (n) n.rotation.x = -0.5; /* V2.0 (anh Thắng 03:10): pháo ở trận địa nâng nòng ~29° hướng lên trời */ }
        const c = co(11, 5, mMT); c.position.set(x - f.x * 14, hG(x, z), z - f.z * 14); scene.add(c);
        const lua = spr(0xffc070, 40), khoi = spr(0xbab4a8, 60); S.push({ x, z, y: hG(x, z), lua, khoi, ph: k * 0.29 }); }
      const N = [], rr = rndS(Math.round(P.src.x) % 9999 + 3);                                        // pháo thủ (3 người mỗi khẩu) + bộ binh bảo vệ trận địa đứng bắn (anh Thắng 24/11)
      // V1.9 (anh Thắng): 3 pháo thủ đứng sát khoá nòng điều khiển pháo; bộ binh còn lại chạy qua chạy lại rồi dừng bắn
      for (const G of S) for (const [lr, lf, yq, cl] of [[-6, -3, 0.9, 'quy'], [6, -3, -0.9, 'quansat'], [0, -10, 0, 'dung']]) { const x = G.x + r.x * lr + f.x * lf, z = G.z + r.z * lr + f.z * lf; N.push([x, hG(x, z), z, yaw + yq, cl]); }
      for (let j = 0; j < 12; j++) { const a = 70 + rr() * 30, b = (j - 5.5) * 13, x = P.src.x + f.x * a + r.x * b, z = P.src.z + f.z * a + r.z * b;
        N.push([x, hG(x, z), z, yaw + (rr() - 0.5) * 0.3, rr() < 0.65 ? 'ban' : 'namban', { ph: rr(), chieu: rr() < 0.5 ? 1 : -1 }]); }
      const T = { P, f, r, S, t0, t1, N }; KT.td.push(T); return T; };
    KT.td1 = tranDia(C01.phao[0], MV.c01_phao0, MV.c01_phao1); KT.td3 = tranDia(C03.phao[0], MV.c03_phao0, MV.c03_phao1);
    KT.td5 = tranDia(C05.phao[0], MV.c05_phao0, MV.c05_phao1); KT.td6 = tranDia(C06.phao[0], MV.c06_phao, MV.c06_rc + 3);
    // đoàn quân ta: xe bọc thép K-63, xe tải chở bộ binh, xe kéo pháo M-46 (cắm cờ), chạy theo đường tiến về Sài Gòn trong khung giờ của cú máy
    const VAN = 9, CACH = 55;                                                             // tốc độ (m/s), khoảng cách xe — anh Thắng 24/11: chạy chậm như xe thật, không "tua nhanh"
    const RT = (k) => { const P = (INST.duong && INST.duong['cot_' + k]) || [], i = P.findIndex(([x, y]) => Math.hypot(x, y) < R - 1500); return i > 0 ? P.slice(i) : P; };   // V1.5: bỏ đoạn đường nằm ngoài sa bàn (đường Xuân Lộc bắt đầu cách tâm 69 km > bán kính 56,5 km → xe, máy quay rơi xuống dưới đất)
    console.log('cầu chiến dịch', ['xl', 'bac', 'tb', 'dong', 'dn', 'dd', 'tn'].map((k) => cauTao(RT(k), { k: 2.2, rong: 13 })));                          // tuyến theo đường bộ OSM (tools/sa_ban/dia_hinh/tuyen_cot.py), không xuyên sông hồ
    const MAU = { xl: 0xd2442b, dong: 0xd2442b, bac: 0xe58a1f, tb: 0xc0408c, dd: 0xc0408c, dn: 0x2f7fd6, lt: 0x2f7fd6, tn: 0x2fa35a };
    let VET_N = 0;   // V1.4: mỗi dải màu một thứ tự vẽ và độ cao riêng — dải chồng nhau (gần Sài Gòn) không còn tranh nhau nhấp nháy
    const vet = (P, mau, rong = 16) => { const D = duong(P), n = Math.max(2, Math.floor(D.L / 40)), pos = new Float32Array(n * 2 * 3), idx = [], dy = 6 + (VET_N % 8) * 1.2, ro = 2 + (VET_N++ % 8);
      for (let i = 0; i < n; i++) { const d = i / (n - 1) * D.L, a = diemTren(D, d), b = diemTren(D, Math.min(D.L, d + 5)), dx = b.x - a.x, dz = b.z - a.z, l = Math.hypot(dx, dz) || 1, nx = -dz / l * rong, nz = dx / l * rong;
        pos.set([a.x + nx, hG(a.x + nx, a.z + nz) + dy, a.z + nz, a.x - nx, hG(a.x - nx, a.z - nz) + dy, a.z - nz], i * 6); if (i) idx.push(2 * i - 2, 2 * i - 1, 2 * i, 2 * i - 1, 2 * i + 1, 2 * i); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setIndex(idx);
      const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: mau, transparent: true, opacity: 0.8, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -4 }));
      m.renderOrder = ro; m.visible = false; m.userData = { n, L: D.L }; scene.add(m); return m; };
    KT.vetDat = (m, d) => { const k = Math.max(0, Math.min(m.userData.n - 1, Math.floor(d / m.userData.L * (m.userData.n - 1)))); m.geometry.setDrawRange(0, k * 6); };
    // V2.0 (anh Thắng 03:03: "càng pháo chưa khớp vào xe kéo"): mắt kéo đầu càng M-46 (nút tai_keo) móc đúng vào móc kéo sau đuôi ATS-59 (nút moc_keo);
    // pháo đặt theo hướng từ bánh pháo tới móc, ngóc nhẹ đầu càng lên cho bằng độ cao móc
    KT.mocPhao = (X, D, d, y) => { const o = X.o, g = X.keo;
      if (!X.moc) { const tim = (r, ten, dd) => { let n = null; r.traverse((m) => { if (!n && m.name === ten) n = m; }); if (!n) return dd; const v = V3(); r.updateMatrixWorld(true); n.getWorldPosition(v); return r.worldToLocal(v); };
        X.moc = tim(o, 'moc_keo', V3(0, 0.95, -3.3)); X.tai = tim(g, 'tai_keo', V3(0, 0.27, -5.7)); }
      o.updateMatrixWorld(true); const H = o.localToWorld(X.moc.clone()), s0 = g.scale.x, b = diemTren(D, d - (Math.abs(X.moc.z) + Math.abs(X.tai.z)) * s0 / o.scale.x * o.scale.x);
      const gy = Math.max(hG(b.x, b.z) + 0.5, CAU_Y(b.x, b.z)), yaw = Math.atan2(-(H.x - b.x), -(H.z - b.z)), L = Math.hypot(X.tai.y, X.tai.z);
      const p = Math.max(-0.3, Math.min(0.3, Math.asin(Math.max(-1, Math.min(1, ((H.y - gy) / s0) / L))) - Math.atan2(X.tai.y, -X.tai.z)));
      g.rotation.set(p, yaw, 0, 'YXZ'); { const n = X.nong || (X.nong = g.getObjectByName('nong')); if (n) n.rotation.x = -(p + 0.14); }   // anh Thắng 03:10: nòng hướng lên trời (bù góc ngóc càng + 8°)
      g.updateMatrixWorld(true); const T = X.tai.clone().multiplyScalar(s0).applyEuler(g.rotation); g.position.set(H.x - T.x, H.y - T.y, H.z - T.z); };
    const cot = (k, t0, t1, f1) => { const P = RT(k), D = duong(P), X = [];
      ['TK', 'TK', 'TK', 'K', 'T', 'T', 'TP', 'TK', 'K', 'T', 'T', 'TP', 'T', 'TK', 'K', 'T', 'T', 'TP', 'T', 'TK', 'K', 'T', 'T', 'TP', 'T', 'T', 'K', 'T'].forEach((k, i) => {   /* anh Thắng V1.2: đoàn dài hơn, nhiều xe tăng, xe chở quân, xe kéo pháo */ const g = k === 'K' ? gK : k === 'TK' ? gTK : k === 'TP' ? gA || gT : gT; if (!g) return;   // V2.0: TP = xe kéo pháo bánh xích ATS-59 kéo lựu pháo M-46 (kho khí tài)   // TK: xe tăng T-54 (mẫu 390, ẩn số hiệu)
        const o = moi(g); o.visible = false; scene.add(o); const c = co(3.6, 1.8, mMT); c.position.set(0, k === 'TK' ? 2.9 : 2.4, -2.2); o.add(c);
        if (k === 'TK') o.traverse((m) => { if (/^so-hieu/.test(m.name)) m.visible = false; });
        let keo = null; if (k === 'TP' && gP) { keo = moi(gP, KS); keo.visible = false; scene.add(keo); } X.push({ o, keo, i, k, off: X.length ? X[X.length - 1].off + CACH + (X[X.length - 1].k === 'TP' ? 32 : 0) : 0 }); });   // V2.0: sau xe kéo pháo chừa thêm 32 m (pháo M-46 dài 35 m ở tỉ lệ ×3)
      const d1 = f1 * D.L, d0 = Math.max(0, d1 - VAN * (t1 - t0)); const C = { D, X, t0, t1, d0, d1, k, vet: vet(P, MAU[k] || 0xd2442b) }; KT.cot.push(C); return C; };
    KT.c01a = cot('xl', MV.c01_l1 - 1, MV.c01_d + 1, 0.55); KT.c01b = cot('xl', MV.c01_l2 - 1, MV.c01_p + 1, 0.82); KT.c01c = cot('xl', MV.c01_l3 - 1, MV.c01_rut, 0.95);
    KT.c02a = cot('bac', MV.c02_l1 - 1, MV.c02_l2 + 1, 0.75); KT.c02b = cot('tb', MV.c02_l2 - 1, MV.c02_vay + 1, 0.8);
    KT.c03 = cot('lt', MV.c03_l - 1, MV.c03_phao1 + 1, 0.92); KT.c05 = cot('dd', MV.c05_l - 1, MV.c05_phao1 + 1, 0.94);
    KT.c05b = cot('dn', MV.c05_l2 - 1, MV.c05_l2e + 1, 0.93); KT.c06a = cot('dong', MV.c06_l1 - 1, MV.c06_tc + 1, 0.9); KT.c06b = cot('bac', MV.c06_l2 - 1, MV.c06_phao + 1, 0.93);
    // 7h30 30/4 chiếc xe tăng đầu tiên của Lữ đoàn 203 qua cầu Rạch Chiếc (VOH): đoàn xe tăng đi đầu tới cầu đúng câu đọc (c06_rc + 3 s)
    { const P = RT('dong'), D = duong(P); let bd = [1e18, 0]; for (let d = 0; d < D.L; d += 20) { const q = diemTren(D, d), e = (q.x - C05.rc.x) ** 2 + (q.z - C05.rc.z) ** 2; if (e < bd[0]) bd = [e, d]; }
      const t0 = MV.c06_rc - 1, t1 = C06.t1 || MV.c06_rc + 30, d1 = Math.min(D.L - 5, bd[1] + VAN * (t1 - MV.c06_rc - 3)); KT.c06rc = cot('dong', t0, t1, d1 / D.L); KT.c06rc.dCau = bd[1]; }
    // cận cảnh xe tăng đi đầu: máy thấp bên mũi xe nhìn về phía sau (đoàn quân đang tiến lên) → vòng ra sau xe nhìn con đường vào nội đô → cẩu lên cao
    KT.camTang = (C) => (u, t) => { const X = C.X[0]; if (!X || !X.o.visible) return orbit(C05.rc, 11000, 6500, 4.2, 4.8, 42)(u);
      const p = X.o.position, y = X.o.rotation.y, f = V3(Math.sin(y), 0, Math.cos(y)), r = V3(f.z, 0, -f.x), e = (a, b, k) => a + (b - a) * sstep(0, 1, k);
      if (u < 0.42) { const k = u / 0.42; return [p.clone().addScaledVector(f, 9 * KS - k * 3 * KS).addScaledVector(r, 4.5 * KS).add(V3(0, 1.4 * KS, 0)), p.clone().addScaledVector(f, -14 * KS).add(V3(0, 1.2 * KS, 0)), 48]; }
      if (u < 0.66) { const k = (u - 0.42) / 0.24, a = e(0, Math.PI, k), c = V3(Math.cos(a) * 9 * KS, 0, 0); const pos = p.clone().addScaledVector(f, Math.cos(a) * 9 * KS).addScaledVector(r, Math.sin(a) * 6 * KS + 4.5 * KS * (1 - k)).add(V3(0, (1.4 + k * 0.8) * KS, 0));
        return [pos, p.clone().addScaledVector(f, e(-14, 60, k) * KS).add(V3(0, 1.2 * KS, 0)), 48]; }
      const k = (u - 0.66) / 0.34; return [p.clone().addScaledVector(f, -12 * KS - k * 300).add(V3(0, 2.2 * KS + e(0, 900, k), 0)), p.clone().addScaledVector(f, 120 + k * 1800), 48 - k * 6]; };
    // hồi 6: vệt năm cánh quân vẽ dần trên đường bộ về Sài Gòn
    KT.vet6 = ['bac', 'tb', 'dong', 'dn', 'tn'].map((k) => vet(RT(k), MAU[k], 240));
    // Sài Gòn: vòng tròn bung tỏa khi các cánh quân áp sát, tiến công vào Sài Gòn (như Long Thành)
    KT.vSG = vong(V3(SG.x, hG(SG.x, SG.z), SG.z));
    const S2 = STORY.scenes.find((c) => c.id === 'C02'), S3 = STORY.scenes.find((c) => c.id === 'C03'), VONG = () => [C01.v, C03.v, C05.vDD, C05.vRC, C06.vT, C06.vB, KT.vSG];
    KT.cap = (t) => {
      { const on6 = t >= C06.t0 && t < C06.t1; for (const m of KT.vet6) { m.visible = on6; if (on6) KT.vetDat(m, m.userData.L * sstep(C06.t0, MV.c06_tc + 4, t)); } }
      for (const C of KT.cot) { const on = t >= C.t0 && t < C.t1, dh = C.d0 + (C.d1 - C.d0) * clamp((t - C.t0) / (C.t1 - C.t0), 0, 1);
        C.vet.visible = on; if (on) KT.vetDat(C.vet, dh - (C.X.length ? C.X[C.X.length - 1].off + CACH : 0));
        for (const X of C.X) { X.o.visible = on; if (X.keo) X.keo.visible = on; if (!on) continue;
          const d = dh - X.off, p = diemTren(C.D, d), q = diemTren(C.D, d + 8), y = huong(p, q);
          X.o.position.set(p.x, Math.max(hG(p.x, p.z) + 0.5, CAU_Y(p.x, p.z)), p.z); X.o.rotation.y = y;
          if (X.keo) KT.mocPhao(X, C.D, d, y); } }
      for (const T of KT.td) { const on = t >= T.t0 && t < T.t1; T.on = on;
        for (const G of T.S) { const ph = ((t - T.t0) / 2.4 + G.ph) % 1, ban = on && ph < 0.09;
          G.lua.visible = ban; if (ban) { G.lua.position.set(G.x + T.f.x * 40, G.y + 9, G.z + T.f.z * 40); G.lua.scale.setScalar(30 + ph * 300); }
          G.khoi.visible = on && ph < 0.7; if (G.khoi.visible) { G.khoi.position.set(G.x + T.f.x * (44 + ph * 30), G.y + 10 + ph * 40, G.z + T.f.z * (44 + ph * 30)); G.khoi.scale.setScalar(40 + ph * 160); G.khoi.material.opacity = 0.55 * (1 - ph / 0.7); } } }
      const sg = (t >= MV.c02_vay && t < S2.t1) || (t >= MV.c03_phao1 && t < S3.t1) || (t >= C06.t0 && t < C06.t1);
      KT.vSG.visible = sg; if (sg) { const k = (t * 0.5) % 1; KT.vSG.scale.setScalar(3000 + k * 6000); KT.vSG.material.opacity = 0.8 * (1 - k); }
      if (camera.position.y < 2500) for (const v of [...VONG(), C05.coDD, C05.coRC]) if (v) v.visible = false;
      if (camera.position.y - hG(camera.position.x, camera.position.z) < 60) { for (const m of KT.vet6) m.visible = false; for (const C of KT.cot) C.vet.visible = false; } };   // cảnh cận: ẩn dải màu đường tiến quân (máy ở dưới dải → cả khung đỏ)   // cảnh cận (đoàn quân, trận địa, đồn): ẩn vòng tròn (vòng nằm trên cao, không bị núi che)
    // máy quay: lướt trên đoàn quân (từ cuối đoàn lên đầu, sát trên nóc xe); vòng cung quanh đồn; trung cảnh trận địa pháo
    // V1.6 (anh Thắng 22:09: "đoạn đầu cũng mất xe, thay góc camera khác"): bỏ cú máy thấp sau đuôi đoàn; nay máy bay song song bên sườn đoàn xe,
    // cao ~75 m, cách đường ~140 m, nhìn chéo xuống giữa đoàn — thấy cả hàng xe, cờ, lính trên xe, không bị đồi hay mặt đất che.
    KT.camCot = (C) => (u, t) => { const dh = C.d0 + (C.d1 - C.d0) * clamp((t - C.t0) / (C.t1 - C.t0), 0, 1);
      // V1.9 (anh Thắng: máy trên cao đừng lấy K-63 làm tâm mãi): mỗi cú máy chọn một xe làm tâm (xe tăng, xe tải chở bộ binh, xe kéo pháo, K-63…) theo thứ tự trong đoàn,
      // trong cú máy lia dần sang xe kế tiếp; cú máy chẵn, lẻ bay ở hai bên sườn đoàn
      const ks = Math.abs(Math.floor(C.t0 * 13)), sel = [1, 4, 6, 3, 0, 5, 8, 2][ks % 8], dm = dh - ((C.X[sel] ? C.X[sel].off : sel * CACH) + u * 1.4 * CACH), ben = ks % 2 ? -1 : 1;
      const m = diemTren(C.D, Math.max(0, dm)), a = diemTren(C.D, Math.max(0, dm - 100)), b = diemTren(C.D, Math.max(0, dm + 100));
      const n = V3(b.z - a.z, 0, a.x - b.x); if (n.lengthSq() < 1e-6) n.set(1, 0, 0); n.normalize().multiplyScalar(140 * ben);
      const cx = a.x + n.x, cz = a.z + n.z, hc = Math.max(hG(cx, cz), hG(a.x, a.z), hG(m.x, m.z));
      const cao = [V3(cx, hc + 75, cz), V3(m.x, hG(m.x, m.z) + 3, m.z), 40];
      // V2.0 (anh Thắng 29/11: "cho nhiều cảnh cận đoàn xe tăng"): nửa đầu cú máy bám sát sườn một xe — xe tăng, xe kéo pháo ATS-59 + M-46, K-63, xe tải —
      // thấy bánh xe, xích xe chuyển động (mẫu kho khí tài); sau đó cẩu máy lên cao như cũ để thấy cả đoàn
      if (u >= 0.75) return cao;
      const loai = ['TK', 'TP', 'K', 'TK', 'T', 'TP'][ks % 6], X = C.X.find((x) => x.k === loai && x.o.visible) || C.X[0]; if (!X || !X.o.visible) return cao;
      const p = X.keo ? X.o.position.clone().lerp(X.keo.position, 0.45) : X.o.position.clone(), yw = X.o.rotation.y, f = V3(Math.sin(yw), 0, Math.cos(yw)), r = V3(f.z, 0, -f.x), k = Math.min(1, u / 0.5);
      const gn = p.clone().addScaledVector(r, ben * (X.keo ? 13 : 9) * KS).addScaledVector(f, (X.keo ? 4 - k * 6 : 3.5 - k * 6) * KS); gn.y = Math.max(p.y + 1.5 * KS, hG(gn.x, gn.z) + 1.6 * KS);
      const tg = p.clone().addScaledVector(f, 0.8 * KS).add(V3(0, 0.9 * KS, 0));
      if (u < 0.5) return [gn, tg, 46];
      const e = sstep(0.5, 0.75, u); return [gn.lerp(cao[0], e), tg.lerp(cao[1], e), 46 - 6 * e]; };
    // CÚ MÁY QUA VAI BỘ BINH (anh Thắng 24/11): một tổ bộ binh đứng ven đường phía trước đoàn xe, máy đặt sau vai một chiến sĩ nhìn đoàn xe đang tiến về Sài Gòn
    KT.camVai = (C) => (u, t) => {
      if (!C.vai) { const dA = Math.min(C.D.L - 20, C.d1 + 70), p = diemTren(C.D, dA), px = p.x + Math.cos(p.yaw) * 24, pz = p.z - Math.sin(p.yaw) * 24, q = diemTren(C.D, dA - 260), yaw = Math.atan2(q.x - px, q.z - pz), f = [Math.sin(yaw), Math.cos(yaw)], r = [f[1], -f[0]];
        const N = [[0, 0, 'dung'], [5, -3.5, 'ban'], [-4.5, 2.5, 'quy'], [9, 1.5, 'dung'], [-8.5, -4, 'dung'], [3, 7, 'di']].map(([a, b, c], i) => { const x = px + r[0] * a * KS / 3 + f[0] * b * KS / 3, z = pz + r[1] * a * KS / 3 + f[1] * b * KS / 3; return [x, hG(x, z), z, yaw + (i ? (i % 3 - 1) * 0.25 : 0), c]; });
        C.vai = { N, f, r, yaw, on: -1 }; KT.vai.push(C.vai); }
      const V = C.vai, S = V.N[0]; V.on = t; const dh = C.d0 + (C.d1 - C.d0) * clamp((t - C.t0) / (C.t1 - C.t0), 0, 1), h = diemTren(C.D, Math.max(0, dh - 2 * CACH));
      const cam = V3(S[0] - V.f[0] * 1.7 * KS + V.r[0] * 0.55 * KS, S[1] + 1.62 * KS, S[2] - V.f[1] * 1.7 * KS + V.r[1] * 0.55 * KS);
      return [cam, V3(h.x, hG(h.x, h.z) + 2 * KS, h.z), 44 - u * 6]; };
    KT.vai = []; KT.vaiT = -99; KT.vaiNV = [];
    // V1.9 (anh Thắng: cảnh cận 0:50, 3:40 lính bị thủng): tổ lính cạnh máy quay dùng mẫu Thành cổ ĐỦ LƯỚI có xương (21 nghìn tam giác, units/linh-qgp-*-gan.glb,
    // tools/sa_ban/nhan_vat_lai/lam_linh_gan.py) thay cho đám đông .nvz đã giảm còn 4,7 nghìn tam giác (nhìn gần rách ở mũ, ba lô)
    KT.vaiVT = (i) => { const V = KT.vai.find((v) => Math.abs(v.on - KT.vaiT) < 0.6); if (!V) return null; const P = V.N[i]; return { x: P[0], y: P[1], z: P[2], yaw: P[3], clip: P[4] }; };
    { const p = Promise.all([0, 1, 2, 3, 4, 5].map((i) => nvxTao('models/linh-qgp-' + (i % 2 ? 'b' : 'a') + '-gan.glb', () => KT.vaiVT(i), { sc: KS, ten: 'Bộ binh (cận cảnh)' })))
        .then((L) => { KT.vaiNV = L; }).catch((e) => console.warn('lính cận cảnh', e)); DONG_P.push(p); }
    DAM.push((t, tv) => { KT.vaiT = tv; if (KT.vaiNV.length) return; for (const V of KT.vai) if (Math.abs(V.on - tv) < 0.6) V.N.forEach((P, i) => dongDat('qgp', P[4], tv, (i * 0.29) % 1, P[0], P[1], P[2], P[3], KS, i)); });
    KT.camDon = (g, a0, a1) => (u) => orbit(g.position, 700, 260, a0, a1, 42, 200)(u);
    KT.camTD = (T) => (u) => { const c = V3(T.P.src.x, hG(T.P.src.x, T.P.src.z), T.P.src.z), f = T.f, r = T.r, w = -1 + u * 0.6;
      return [V3(c.x - f.x * 150 + r.x * 150 * w, c.y + 38, c.z - f.z * 150 + r.z * 150 * w), V3(c.x + f.x * 160, c.y + 30, c.z + f.z * 160), 44]; };
    // người trên khí tài: bộ binh ngồi trên xe tải, trên nóc K-63; trưởng xe đứng ở cửa tháp pháo xe tăng; pháo thủ, bộ binh ở trận địa pháo (×3 như xe)
    DAM.push((t, tv) => {
      for (const C of KT.cot) { if (tv < C.t0 || tv >= C.t1) continue;
        for (const X of C.X) { const p = X.o.position; if (!X.o.visible || !ganMay(p.x, p.z, 1500)) continue;
          buiXe(X.o, KS, tv); if (X.keo) buiXe(X.keo, KS * 0.6, tv + 0.3);
          if (X.k === 'T' || (X.k === 'TP' && !gA)) linhTrenXe(X.o, 'tai', tv, KS, X.i * 7); else if (X.k === 'TP') { /* ATS-59: pháo thủ ngồi trong thùng có mui */ } else if (X.k === 'K') linhTrenXe(X.o, 'k63', tv, KS, X.i * 7);
          else linhTrenXe(X.o, 'tang', tv, KS, X.i * 7); } }
      for (const T of KT.td) { if (tv < T.t0 - 2 || tv > T.t1 + 2 || !ganMay(T.P.src.x, T.P.src.z, 2200)) continue;
        T.N.forEach((P, i) => { const M = P[5]; if (!M) { dongDat('qgp', P[4], tv, (i * 0.37) % 1, P[0], P[1], P[2], P[3], 2.6, i); return; }
          // chu kỳ 9 s: chạy 4 s (4 m/s × 2,6 — khớp nhịp bước), dừng bắn 5 s; lượt sau chạy ngược lại
          const u = (tv - T.t0) / 9 + M.ph, c = Math.floor(u), k = u - c, L = 41.6, di = (c % 2 ? -1 : 1) * M.chieu, chay = k < 4 / 9;
          const o = (c % 2 ? L : 0) * M.chieu + (chay ? di * L * k * 9 / 4 : (c % 2 ? -L : L) * M.chieu), x = P[0] + T.r.x * o, z = P[2] + T.r.z * o;
          if (chay) dongDat('qgp', 'chay', tv, M.ph, x, hG(x, z), z, Math.atan2(T.r.x * di, T.r.z * di), 2.6, i);
          else dongDat('qgp', P[4], tv, M.ph, x, hG(x, z), z, P[3], 2.6, i); }); } });
    // CẦU RẠCH CHIẾC (VOH: rạng sáng 28/4 đối phương phản công chiếm lại cầu; 29/4 ta đánh chiếm lại, giữ cầu cho đại quân): đặc công giữ hai đầu cầu,
    // đối phương phản kích từ phía nội đô — đấu súng bộ binh, đạn vạch. Vị trí từng người: MINH HOẠ.
    { const P = RT('dong'), D = duong(P); let bd = [1e18, 0]; for (let d = 0; d < D.L; d += 20) { const q = diemTren(D, d), e = (q.x - C05.rc.x) ** 2 + (q.z - C05.rc.z) ** 2; if (e < bd[0]) bd = [e, d]; }
      const d0 = bd[1], r = rndS(316), A = [], B = [], o = diemTren(D, d0), q = diemTren(D, d0 + 40), f = V3(q.x - o.x, 0, q.z - o.z).normalize(), yf = Math.atan2(f.x, f.z);
      const ben0 = (d, lech) => { const p = diemTren(D, d); return [p.x + Math.cos(p.yaw) * lech, p.z - Math.sin(p.yaw) * lech]; };
      const ben = (d, lech) => { for (let n = 0; n < 12; n++) { const q = ben0(d, lech); if (hG(q[0], q[1]) > 0.4 || CAU_Y(q[0], q[1]) > 0) return q; lech *= 0.6; d += (n % 2 ? 1 : -1) * 18 * (n + 1); } return ben0(d, 0); };   // không đứng dưới nước
      for (let i = 0; i < 26; i++) { const [x, z] = ben(d0 + (i < 13 ? -40 - r() * 50 : 20 + r() * 50), (r() < 0.5 ? -1 : 1) * (8 + r() * 30)); A.push([x, z, yf + (r() - 0.5) * 0.4, r() < 0.6 ? 'quy' : 'ban']); }
      for (let i = 0; i < 22; i++) { const [x, z] = ben(d0 + 200 + r() * 220, (r() < 0.5 ? -1 : 1) * (6 + r() * 60)); B.push([x, z, yf + Math.PI + (r() - 0.5) * 0.4, r() < 0.5 ? 'ban' : r() < 0.6 ? 'quy' : 'chay']); }
      // V1.9 (anh Thắng): cuối trận nhiều lính đối phương bị bắn hạ — 16/22 người ngã dần trong cú máy cận (C05-C, 12 s)
      KT.rc = giaoTranh({ dong: true, voice: true, t0: MV.c05_rc - 1, t1: (STORY.scenes.find((c) => c.id === 'C05') || {}).t1 || MV.c05_rc + 25, A, B, sc: KS, chet: 0.75, nga0: 5, nga: 0.5, sau: 60, r: 3000 });
      uNap(A, B, f, yf, KS, 4242);   // V1.9: ụ bê tông, ụ đất cho hai bên nấp
      const cA = V3(...ben(d0 - 150, -40).flatMap((v, i) => (i ? [0, v] : [v]))), cB = V3(...ben(d0 + 300, 0).flatMap((v, i) => (i ? [0, v] : [v])));
      // máy quay hạ thấp sát mặt đất giữa tổ đặc công ở đầu cầu (như các cảnh Thành cổ): rung nhẹ, tiến chậm về phía trước, nhìn về phía đối phương
      const fa = A.slice(13), ca = fa.reduce((v, P) => v.add(V3(P[0], 0, P[1])), V3()).divideScalar(fa.length), cb = B.reduce((v, P) => v.add(V3(P[0], 0, P[1])), V3()).divideScalar(B.length);
      KT.camRC = (u, t) => { const x = ca.x - f.x * (34 - u * 14) + f.z * 7, z = ca.z - f.z * (34 - u * 14) - f.x * 7, n = Math.sin(t * 7.3) * 0.25 + Math.sin(t * 3.1) * 0.35;
        return [V3(x, Math.max(hG(x, z), CAU_Y(x, z), 0.3) + 4.2 + n * 0.4, z), V3(cb.x + n * 2, Math.max(hG(cb.x, cb.z), CAU_Y(cb.x, cb.z)) + 4, cb.z), 46]; }; }
    // GHIM TÊN (anh Thắng 24/11): tên đường năm 1975 dọc tuyến tiến quân (tools/sa_ban/dia_hinh/tuyen_cot.py › duong.ten_cot), tên khí tài khi máy quay ở gần.
    for (const [x, y, ten, k] of (INST.duong && INST.duong.ten_cot) || []) { const L = addLabel(ten, x, -y, 'vil duong', { grp: 'muiten', maxDist: 60000, show: () => KT.cot.some((C) => C.vet.visible && C.k === k) || KT.vet6.some((m) => m.visible) }); L.yFn = () => hG(x, -y) + 300; }
    const ghimXe = (ten, get, dy, xa = 900) => { const L = addLabel(ten, 0, 0, 'hero ly', { grp: 'hero', maxDist: xa }); L.dyn = get; L.dy = dy; };
    const dau = (k) => () => { for (const C of KT.cot) for (const X of C.X) if (X.k === k && X.o.visible) return X.o.position; return null; };
    ghimXe('Xe tăng T-54 (Quân Giải phóng)', dau('TK'), 11); ghimXe('Xe bọc thép K-63 (Quân Giải phóng)', dau('K'), 10); ghimXe('Xe tải chở bộ binh (Quân Giải phóng)', dau('T'), 10);
    ghimXe('Xe tăng đi đầu Lữ đoàn 203 · qua cầu Rạch Chiếc 7 giờ 30', () => (KT.c06rc && KT.c06rc.X[0] && KT.c06rc.X[0].o.visible ? KT.c06rc.X[0].o.position : null), 17, 2500); ghimXe('Pháo M-46 130 mm (Quân Giải phóng, xe kéo)', () => { for (const C of KT.cot) for (const X of C.X) if (X.keo && X.keo.visible) return X.keo.position; return null; }, 9);
    ghimXe('Pháo M-46 130 mm (Quân Giải phóng)', () => { for (const T of KT.td) if (T.on && T.S[0]) return V3(T.S[0].x, T.S[0].y, T.S[0].z); return null; }, 12, 2200);
    for (const D of KT.dons) { const X41 = D.xe.find((X) => /M41/.test(X.ten)), X113 = D.xe.find((X) => /M113/.test(X.ten)), w = (X) => () => X.o.getWorldPosition(V3());
      if (X41) ghimXe('Xe tăng M41 (đối phương)', w(X41), 10, 1400); if (X113) ghimXe('Xe bọc thép M113 (đối phương)', w(X113), 9, 1400); }
  }
  // 23h 29/4: Quân đoàn 3 nhận nhiệm vụ đánh Bộ Tổng tham mưu
  { const bt = LL(BT[0], BT[1]); C05.ten.push(addLabel('Bộ Tổng tham mưu', bt.x, bt.z, 'hero', { grp: 'muiten', yFn: () => 3000, show: () => C05.mt.visible })); }
  C05.mt = muiTen([dd, LL((DD[0] + BT[0]) / 2 + 0.02, (DD[1] + BT[1]) / 2 - 0.02), LL(BT[0], BT[1])].map((v) => V3(v.x, 900, v.z)), 0xd2442b, 380); muiTenDat(C05.mt, false);
  C05.cap = (t) => {
    const on = t >= T0 - 0.5 && t < C05.t1 + 0.5, u = t - T0;
    const on6 = C06.t0 !== undefined && t >= C06.t0 - 0.5 && t < C06.t1 + 0.5;            // C06: cầu Rạch Chiếc vẫn giữ, xe tăng qua cầu 7h30
    C05.vDD.visible = on && t < MV.c05_rc; C05.vRC.visible = (on && t >= MV.c05_rc) || (on6 && t >= MV.c06_rc);
    for (const [v, a] of [[C05.vDD, u], [C05.vRC, t - MV.c05_rc]]) if (v.visible) { const k = (a * 0.5) % 1; v.scale.setScalar(1500 + k * 2500); v.material.opacity = 0.8 * (1 - k); }
    phaoCap(C05.phao, on, MV.c05_phao0 - T0, MV.c05_phao1 - T0, u);                     // 5h30: bắn chuẩn bị
    const cm = (g, a, o = on) => { g.visible = o && a > 0; if (g.visible) g.scale.setScalar(Math.min(1, a / 1.2)); };
    cm(C05.coDD, t - MV.c05_co); cm(C05.coRC, on6 ? 9 : t - MV.c05_rc - 3, on || on6);       // 10h30 cắm cờ Đồng Dù; cờ ở cầu Rạch Chiếc
    muiTenDat(C05.mt, on && t >= MV.c05_btt, sstep(MV.c05_btt, MV.c05_btt + 8, t));         // 23h: nhiệm vụ mới → Bộ Tổng tham mưu
  };
}
// ------------------------------------------------------------------ C08 · BỘ TỔNG THAM MƯU (S1, S5) và C09 · HƯỚNG TÂY – TÂY NAM (S1) — tầng nội đô
// C08: tiến công từ hai phía — Sư đoàn 10 cổng số 1, Trung đoàn 48 cổng số 2, Trung đoàn 28 có xe tăng dẫn đầu vào cổng chính; 11h30 làm chủ.
//      Vị trí từng cổng chưa có nguồn → chỉ vẽ hai mũi tên từ hai phía (phía sân bay, phía Tây Bắc) và cờ ghim lúc 11h30: PHÁC THẢO.
// C09: Trung đoàn 1 Sư đoàn 9 qua Bà Quẹo, Bảy Hiền, theo đường Lê Văn Duyệt hướng Bộ Tư lệnh Biệt khu Thủ đô; một trung đoàn vượt cầu Chữ Y,
//      10h30 đánh chiếm Bộ Tư lệnh Cảnh sát quốc gia. Toạ độ Bà Quẹo, Bảy Hiền, cầu Chữ Y: OSM 2026 (gần đúng); đường mũi tên: PHÁC THẢO.
if (TANG === 'noi-do' && MV.c08_tc) {
  const P = (la, lo, dy = 45) => { const v = LL(la, lo); v.y = hG(v.x, v.z) + dy; return v; }, BT = P(MOC.btt[0], MOC.btt[1], 0);
  const mt = (pts, r = 14) => { const m = muiTen(pts.map(([la, lo]) => P(la, lo)), 0xd2442b, r); muiTenDat(m, false); return m; };
  C89.btt = BT;
  C89.m8 = [mt([[10.8098, 106.6560], [10.8062, 106.6630], [MOC.btt[0], MOC.btt[1]]]), mt([[10.8170, 106.6440], [10.8110, 106.6600], [10.8060, 106.6690], [MOC.btt[0] + 0.0004, MOC.btt[1] - 0.0006]])];
  C89.mTay = mt([[10.7915, 106.6380], [10.7932, 106.6532], [10.7870, 106.6640], [10.7805, 106.6780]], 20);
  C89.mNam = mt([[10.7420, 106.6850], [10.7509, 106.6874], [10.7600, 106.6890]], 16);
  const DE = [...((INST.duong && INST.duong.causg_thinghe) || []), ...DUONG_DINH].filter((_, i, a) => i % 6 === 0 || i === a.length - 1);
  C89.mDong = DE.length > 2 ? muiTen(DE.map(([x, y]) => new THREE.Vector3(x, hG(x, -y) + 45, -y)), 0xd2442b, 22) : null; if (C89.mDong) muiTenDat(C89.mDong, false);
  const ten = (s, la, lo, h, fn) => { const v = LL(la, lo); return addLabel(s, v.x, v.z, 'hero', { grp: 'muiten', yFn: () => h, show: fn }); };
  const in9 = () => T >= STORY.scenes.find((c) => c.id === 'C09').t0 && T < STORY.scenes.find((c) => c.id === 'C09').t1;
  ten('Bà Quẹo', 10.7915, 106.6380, 160, in9); ten('Bảy Hiền', 10.7932, 106.6532, 160, in9); ten('Cầu Chữ Y', 10.7509, 106.6874, 140, in9);
  ten('Trung đoàn 1, Sư đoàn 9 · theo đường Lê Văn Duyệt', 10.7840, 106.6720, 260, () => C89.mTay.visible);
  ten('10 giờ 30 · hướng Bộ Tư lệnh Cảnh sát quốc gia', 10.7600, 106.6890, 220, () => C89.mNam.visible);
  ten('Sư đoàn 10 · cổng số 1', 10.8090, 106.6580, 200, () => C89.m8[0].visible); ten('Trung đoàn 48, 28 · từ phía Tây Bắc', 10.8160, 106.6460, 200, () => C89.m8[1].visible);
  // ĐOÀN XE VƯỢT CẦU CHỮ Y (S…: "một trung đoàn vượt cầu Chữ Y" — lời dẫn C09; anh Thắng 24/11: xe đi trên cầu, không lội nước). Tuyến: tim_duong.py trên mạng đường OSM
  // (placement.json › duong.chu_y). Số xe, loại xe: MINH HOẠ.
  { const P = (INST.duong && INST.duong.chu_y) || []; C89.xeCY = [];
    if (P.length > 2 && MV.c09_cy) { const D = duong(P), cy = LL(10.7509, 106.6874); let bd = [1e18, 0]; for (let d = 0; d < D.L; d += 10) { const q = diemTren(D, d), e = (q.x - cy.x) ** 2 + (q.z - cy.z) ** 2; if (e < bd[0]) bd = [e, d]; }
      const tb = tDinh(MV.c09_cy + 4), dB = bd[1];
      for (let k = 0; k < 6; k++) { const lui = k * 24, loai = k % 3 === 0 ? 'k63' : 'tai';
        const X = await xeTao(loai === 'tai' ? 'data/xe/xe-tai.glb' : 'data/xe/xe-boc-thep-k63.glb', { duong: P, lich: [[tb - 60, Math.max(0, dB - 540 - lui)], [tb + 60, Math.min(D.L - 5, dB + 540 - lui)]],
          hien: (t) => T >= S9.t0 && T < S9.t1, ten: loai === 'tai' ? 'Xe tải chở bộ binh' : 'Xe bọc thép K-63' });
        if (XEX.coXe) XEX.coXe(X.obj, 2.2, 1.0); LAYER.xe.push(X.obj); X.loai = loai; C89.xeCY.push(X); }
      DAM.push((t) => { for (const X of C89.xeCY) if (X.obj.visible && ganMay(X.obj.position.x, X.obj.position.z, 900)) { linhTrenXe(X.obj, X.loai, t, 1, 5); buiXe(X.obj, 1, t, 0x9a948a); } }); } }
  // cờ ghim trên Bộ Tổng tham mưu lúc 11h30
  { const tx = new THREE.TextureLoader().load(PU('data/co-mtdtgp.png')); tx.colorSpace = THREE.SRGBColorSpace; const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 60, 6).translate(0, 30, 0), new THREE.MeshLambertMaterial({ color: 0x3a2c1c })),
          new THREE.Mesh(new THREE.PlaneGeometry(30, 20).translate(15, 50, 0), new THREE.MeshLambertMaterial({ map: tx, side: THREE.DoubleSide })));
    g.position.copy(BT); g.visible = false; scene.add(g); C89.co = g; }
  const S8 = STORY.scenes.find((c) => c.id === 'C08'), S9 = STORY.scenes.find((c) => c.id === 'C09');
  C89.cap = (t) => { const on8 = t >= S8.t0 && t < S8.t1, on9 = t >= S9.t0 && t < S9.t1, hoi = on9 && t >= MV.c09_hoi;
    muiTenDat(C89.m8[0], (on8 && t >= MV.c08_tc - 1) || hoi, hoi ? 1 : sstep(MV.c08_tc - 1, MV.c08_tc + 5, t));
    muiTenDat(C89.m8[1], (on8 && t >= MV.c08_tc + 2) || hoi, hoi ? 1 : sstep(MV.c08_tc + 2, MV.c08_tc + 9, t));
    muiTenDat(C89.mTay, on9 && t >= MV.c09_tay - 1, sstep(MV.c09_tay - 1, MV.c09_lvd + 4, t));
    muiTenDat(C89.mNam, on9 && t >= MV.c09_cy - 2 && camera.position.y > 220, sstep(MV.c09_cy - 2, MV.c09_cs + 2, t));   // cảnh cận cầu Chữ Y: ẩn mũi tên để thấy đoàn xe
    if (C89.mDong) muiTenDat(C89.mDong, hoi, sstep(MV.c09_hoi, MV.c09_hoi + 8, t));
    C89.co.visible = (on8 && t >= MV.c08_chu) || (t >= S8.t1 && t < S9.t1); if (C89.co.visible) C89.co.scale.setScalar(Math.min(1, (t - MV.c08_chu) / 1.5) || 1); };
}
const HERO_PINS = TANG === 'noi-do' ? [['Xe tăng 843 · T-54B', () => (XEX.x843 && XEX.x843.obj.visible ? XEX.x843.obj.position : null)], ['Xe tăng 390 · T-59', () => (XEX.x390 && XEX.x390.obj.visible ? XEX.x390.obj.position : null)],
  ['Đại đội trưởng Bùi Quang Thận', () => (XEX.than && XEX.than.obj.visible ? XEX.than.obj.position : null), 2.3]] : [];
if (XEX.ghimND) XEX.ghimND(); for (const f of GHIM_SAU) f();
for (const [text, get, dy] of HERO_PINS) { const L = addLabel(text, 0, 0, 'hero ly', { grp: 'hero', maxDist: 1200 }); L.dyn = get; L.dy = dy || 3.4; }
DAN.dat = (t) => { dongXoa(); TRV.count = 0; BUI.n = 0; if ($('ly-nv').checked) for (const f of DAM) { try { f(t, T); } catch (e) { if (!f.loi) { f.loi = 1; console.error('Lỗi đám đông', e); } } } for (let i = BUI.n; i < BUI.pool.length; i++) BUI.pool[i].visible = false; TRV.instanceMatrix.needsUpdate = true; if (TRV.instanceColor) TRV.instanceColor.needsUpdate = true; dongXong($('ly-nv').checked); };   // mọi đám đông vẽ chung một lượt
//@@ s40

function updateLabels() {
  const w = innerWidth, h = innerHeight, showA = $('ly-lbl').checked, showP = $('ly-pin').checked;
  for (const L of labels) {
    let on = L.cls === 'pin' || L.cls === 'pin done' ? showP : showA;
    if (on && L.show && !L.show()) on = false;
    if (on && L.dyn) { const p = L.dyn(); if (!p) on = false; else { L.x = p.x; L.z = p.z; L.hy = p.y + L.dy; } }
    if (on) {
      const y = L.dyn ? L.hy : L.yFn ? L.yFn() : Math.max(hG(L.x, L.z), tideNow) + 2;
      v3.set(L.x, y, L.z);
      if (v3.distanceTo(camera.position) > L.maxDist) on = false;
      v3.project(camera);
      if (v3.z > 1 || Math.abs(v3.x) > 1.1 || Math.abs(v3.y) > 1.1) on = false;
      if (on) { L.el.style.left = ((v3.x + 1) / 2) * w + 'px'; L.el.style.top = ((1 - v3.y) / 2) * h - 2 + 'px'; }
    }
    L.el.style.display = on ? '' : 'none';
  }
}
//@@ s41
const VIEWS = (() => {
  const v = (k, d, az, el) => { const [la, lo] = MOC[k]; return [LLx(la, lo), LLz(la, lo), d, az, el]; };
  if (TANG === 'chien-dich') return { all: [0, 0, R * 1.9, 180, 40], saigon: [SG.x, SG.z, 26000, 190, 38], dinh: v('dinh', 9000, 200, 35), tsn: v('tsn', 9000, 200, 35), thinghe: v('thinghe', 9000, 200, 35), causg: v('causg', 9000, 200, 35) };
  return { all: [0, 0, R * 1.9, 180, 40], saigon: [SG.x, SG.z, 6000, 190, 38], dinh: v('dinh', 420, 210, 24), tsn: v('tsn', 2600, 200, 32), thinghe: v('thinghe', 500, 200, 26), causg: v('causg', 700, 200, 26) };
})();
{ // 2.2: nút đổi tầng địa hình (tải lại trang ở cùng thời điểm phim)
  const b = document.createElement('button'); b.className = 'tang'; b.textContent = TANG === 'noi-do' ? '⇄ Toàn chiến dịch' : '⇄ Nội đô Sài Gòn';
  b.title = 'Đổi tầng địa hình (tải lại sa bàn tại cùng thời điểm)'; b.onclick = () => doiTang(TANG === 'noi-do' ? 'chien-dich' : 'noi-do', T, playing);
  const vw = $('views'); if (vw) vw.prepend(b);
}
//@@ s42
function drawMinimap() {
  if ($('minimap').hidden || getComputedStyle($('minimap')).display === 'none') return;
  const w = 300, iw = mmImg.width, ih = mmImg.height, s0 = ((HALF - R) / (2 * HALF)), s1 = (2 * R) / (2 * HALF);
  mmx.clearRect(0, 0, w, w); mmx.save(); mmx.beginPath(); mmx.arc(w / 2, w / 2, w / 2 - 1, 0, 7); mmx.clip();
  mmx.drawImage(mmImg, s0 * iw, s0 * ih, s1 * iw, s1 * ih, 0, 0, w, w);
  for (const A of anchors.values()) { const [px, py] = mmPx(A.x, A.z); mmx.fillStyle = A.big ? '#d8705a' : 'rgba(226,183,104,.9)'; mmx.fillRect(px - 2.5, py - 2.5, 5, 5); }
  for (const P of pins.values()) { const [px, py] = mmPx(P.x, P.z); mmx.fillStyle = '#d8705a'; mmx.beginPath(); mmx.arc(px, py, 3.5, 0, 7); mmx.fill(); }
  for (const X of XE) if (X.obj.visible) { const [px, py] = mmPx(X.obj.position.x, X.obj.position.z); mmx.fillStyle = '#c0392b'; mmx.fillRect(px - 3, py - 3, 6, 6); }
  const tg = appMode === 'film' && !userCam ? camLook : controls.target;
  const [tx, ty] = mmPx(tg.x, tg.z), [cx, cy] = mmPx(camera.position.x, camera.position.z);
  mmx.strokeStyle = 'rgba(255,240,210,.9)'; mmx.lineWidth = 2; mmx.beginPath(); mmx.moveTo(cx, cy); mmx.lineTo(tx, ty); mmx.stroke();
  mmx.fillStyle = '#e2b768'; mmx.beginPath(); mmx.arc(tx, ty, 5, 0, 7); mmx.fill(); mmx.strokeStyle = '#23190d'; mmx.lineWidth = 1.5; mmx.stroke();
  mmx.restore(); mmx.strokeStyle = 'rgba(222,180,110,.6)'; mmx.lineWidth = 2; mmx.beginPath(); mmx.arc(w / 2, w / 2, w / 2 - 1, 0, 7); mmx.stroke();
  mmx.fillStyle = '#e2b768'; mmx.font = 'bold 18px sans-serif'; mmx.textAlign = 'center'; mmx.fillText('B', w / 2, 22);
}
mm.addEventListener('click', (e) => {
  const r = mm.getBoundingClientRect(), u = (e.clientX - r.left) / r.width, v = (e.clientY - r.top) / r.height;
  const x = -R + u * 2 * R, z = -R + v * 2 * R; if (Math.hypot(x, z) > R) return;
  flyTo(x, z, clamp(camera.position.distanceTo(controls.target), R * 0.05, R * 1.5));
});
$('mmLeg').textContent = TANG === 'noi-do' ? 'Bấm để bay tới · ô đỏ: xe tăng · ô vàng: mốc' : 'Bấm để bay tới · ô vàng: thị xã, thị trấn (tên 1975)';
//@@ s43
function renderList() {
  $('n-pins').textContent = pins.size; $('n-moves').textContent = moves.size; $('n-all').textContent = pins.size + moves.size;
  const list = $('list'); list.replaceChildren(); const who = (id) => (id && id === myId ? 'Anh' : names[id] || 'Ai đó');
  if (tab === 'pins') {
    const arr = [...pins.entries()].sort((a, b) => (a[1].doc.status === 'xong') - (b[1].doc.status === 'xong') || String(b[1].doc.created).localeCompare(String(a[1].doc.created)));
    if (!arr.length) { const e = document.createElement('div'); e.className = 'empty'; e.textContent = 'Chưa có ghi chú. Chọn “＋ Ghi chú” rồi bấm lên sa bàn tại chỗ cần góp ý: hướng tiến công, vị trí mục tiêu, đường xe, sai lệch sử liệu…'; list.append(e); }
    for (const [id, P] of arr) {
      const d = P.doc, it = document.createElement('div'); it.className = 'item' + (d.status === 'xong' ? ' done' : '');
      const h = document.createElement('h3'); h.textContent = d.title; const m = document.createElement('div'); m.className = 'meta';
      const chip = document.createElement('span'); chip.className = 'chiplet c-' + d.cat; chip.textContent = CAT[d.cat] || d.cat;
      const sp = document.createElement('span'); sp.textContent = `${who(d.author)} · ${fmtTime(d.updated || d.created)}${d.canh ? ' · ' + d.canh : ''}`;
      m.append(chip, sp); it.append(h, m);
      if (d.text) { const p = document.createElement('p'); p.textContent = d.text; it.append(p); }
      const acts = document.createElement('div'); acts.className = 'acts'; acts.append(btn('Bay tới', () => flyTo(P.x, P.z, 500)), btn('Sửa', () => openDialog(id)), btn(d.status === 'xong' ? 'Mở lại' : 'Đã xử lý', () => toggleDone(id)));
      it.append(acts); list.append(it);
    }
    resolveNames(arr.map(([, P]) => P.doc.author));
  } else {
    const arr = [...moves.values()].sort((a, b) => String(b.updated).localeCompare(String(a.updated)));
    if (!arr.length) { const e = document.createElement('div'); e.className = 'empty'; e.textContent = 'Chưa dời mốc nào. Chọn “✋ Kéo mốc” rồi kéo các mốc vàng tới vị trí đúng.'; list.append(e); }
    for (const d of arr) {
      const it = document.createElement('div'); it.className = 'item mv'; const h = document.createElement('h3'); h.textContent = d.label;
      const m = document.createElement('div'); m.className = 'meta'; m.textContent = `Dời ${Math.round(Math.hypot(d.x - d.from_x, d.z - d.from_z))} m · ${who(d.author)} · ${fmtTime(d.updated)}`;
      const acts = document.createElement('div'); acts.className = 'acts'; acts.append(btn('Bay tới', () => flyTo(d.x, d.z, 500)), btn('Trả về vị trí cũ', () => undoMove(d.name)));
      it.append(h, m, acts); list.append(it);
    }
    resolveNames(arr.map((d) => d.author));
  }
}
$('export').onclick = async () => {
  const out = { du_an: 'Sa bàn Chiến dịch Hồ Chí Minh 1975', tang: TANG, xuat_luc: nowIso(), goc_toa_do: [META.lat0, META.lon0],
    ghi_chu: [...pins.values()].map((P) => ({ loai: CAT[P.doc.cat], tieu_de: P.doc.title, noi_dung: P.doc.text, trang_thai: P.doc.status, canh: P.doc.canh, lat: P.doc.lat, lon: P.doc.lon, x: P.doc.x, z: P.doc.z })),
    moc_da_doi: [...moves.values()].map((d) => ({ moc: d.name, ten: d.label, tu: [d.from_lat, d.from_lon], den: [d.lat, d.lon], do_dich_m: Math.round(Math.hypot(d.x - d.from_x, d.z - d.from_z)) })) };
  const txt = JSON.stringify(out, null, 1);
  try { await navigator.clipboard.writeText(txt); $('export').textContent = 'Đã sao chép ✓'; setTimeout(() => ($('export').textContent = 'Sao chép dữ liệu review (JSON)'), 2000); }
  catch (e) { const ta = document.createElement('textarea'); ta.id = 'copybox'; ta.value = txt; ta.readOnly = true; $('list').prepend(ta); ta.focus(); ta.select(); }
};
$('revbtn').onclick = () => { const open = $('review').hidden; $('review').hidden = !open; $('revbtn').setAttribute('aria-pressed', open); if (open) $('info').hidden = true; };
$('revx').onclick = () => { $('review').hidden = true; $('revbtn').setAttribute('aria-pressed', 'false'); };
//@@ s44
// ĐI BỘ TRÊN SA BÀN (anh Thắng V1.2): người xem xuống đi bộ trong vai một chiến sĩ Quân Giải phóng (mẫu lính Thành cổ), phím W A S D / cần ảo, Shift để chạy
function setWalk(on) {
  W.on = on; document.body.classList.toggle('walking', on);
  $('bwalk').classList.toggle('on', on); $('bwalk').textContent = on ? '🚶 Đang đi bộ · thoát' : '🚶 Xuống đi bộ';
  $('joy').hidden = !on; $('runbtn').hidden = !on; $('walkhelp').hidden = !on; const hp = document.querySelector('#explorebar .help'); if (hp) hp.hidden = on;
  if (on) {
    setUiMode('view'); flyA = null; setAuto(false); controls.enablePan = false;
    let x = controls.target.x, z = controls.target.z;
    if (camera.position.distanceTo(controls.target) > 3000 || Math.hypot(x, z) > R - 30) { if (XEX.DL) { const [a, b] = XEX.DL(0, 175); x = a; z = -b; } else { x = SG.x; z = SG.z; } }
    W.boat = false;
    const dx = camera.position.x - controls.target.x, dz = camera.position.z - controls.target.z; W.yaw = Math.atan2(-dx, -dz);
    placeAvatarAt(x, z); controls.target.copy(W.pos).add(V3(0, 2.4, 0));
    camera.position.copy(controls.target).add(V3(-Math.sin(W.yaw) * 9, 2.2, -Math.cos(W.yaw) * 9)); setPovWalk();
  } else { W.keys = {}; W.joy.x = W.joy.y = 0; controls.enablePan = true; controls.minDistance = 4; controls.maxDistance = 40000; controls.minPolarAngle = 0; controls.maxPolarAngle = Math.PI * 0.47; flyTo(W.pos.x, W.pos.z, TANG === 'noi-do' ? 400 : 6000); }
}
DAM.push(() => { if (!W.on || W.fp) return; const tt = performance.now() / 1000; W.boat = false;   // nhân vật đi bộ (vẽ cùng đám đông)
  dongDat('qgpA', W.moving ? (W.runNow ? 'chay' : 'di') : 'dung', W.moving ? tt * (W.runNow ? 7 / 4.0 : 2 / 1.07) : tt, 0, W.pos.x, Math.max(W.pos.y, CAU_Y(W.pos.x, W.pos.z)), W.pos.z, W.yaw, 1, 0); });
//@@ s45
function drawAvatar() {}
// V1.6 (Khe Sanh: "nhân vật chạy đi lại trong bảo tàng"): bản nền HCM thiếu bộ nghe phím W A S D / mũi tên và cần ảo cho chế độ đi bộ — chép từ gói Như Nguyệt
addEventListener('keydown', (e) => { if (W.on && !(e.target.closest && e.target.closest('input, select, textarea'))) { W.keys[e.code] = true; if (e.code.startsWith('Arrow')) e.preventDefault(); } });
addEventListener('keyup', (e) => { W.keys[e.code] = false; });
{
  const jb = $('joy'), jk = jb.querySelector('span'); let id = null;
  const move = (e) => { if (e.pointerId !== id) return; const r = jb.getBoundingClientRect(); let x = (e.clientX - r.left - r.width / 2) / (r.width / 2), y = (e.clientY - r.top - r.height / 2) / (r.height / 2); const l = Math.hypot(x, y); if (l > 1) { x /= l; y /= l; } W.joy.x = x; W.joy.y = y; jk.style.transform = `translate(${x * 38}px,${y * 38}px)`; };
  jb.addEventListener('pointerdown', (e) => { id = e.pointerId; jb.setPointerCapture(id); e.preventDefault(); move(e); });
  jb.addEventListener('pointermove', move);
  const end = () => { id = null; W.joy.x = W.joy.y = 0; jk.style.transform = ''; }; jb.addEventListener('pointerup', end); jb.addEventListener('pointercancel', end);
}
//@@ s46
// GÓC NHÌN NHÂN VẬT (anh Thắng V1.2): nhìn qua mắt nhân vật đang có trong cảnh, hoặc đứng xem tại một địa điểm; kéo màn hình để quay đầu, phim vẫn chạy
const mat3 = (o, dx, dy, dz) => { if (!o || !o.visible) return null; const y = o.rotation.y, c = Math.cos(y), s = Math.sin(y); return { p: V3(o.position.x + dx * c + dz * s, o.position.y + dy, o.position.z - dx * s + dz * c), yaw: y }; };
const POV_VAI = TANG === 'noi-do' ? [
  ['Trưởng xe tăng 843 (trên tháp pháo)', () => (XEX.x843 && XEX.tDinh < 115 ? mat3(XEX.x843.obj, 0.35, 3.25, -0.2) : null)],
  ['Trưởng xe tăng 390 (trên tháp pháo)', () => (XEX.x390 ? mat3(XEX.x390.obj, 0.35, 3.25, -0.2) : null)],
  ['Bộ binh ngồi trên xe tăng 390', () => (XEX.x390 && XEX.tDinh < 89 ? mat3(XEX.x390.obj, -0.7, 2.95, -1.7) : null)],
  ['Bộ binh ngồi trên xe tải giữa đoàn xe', () => { const d = XEX.doan && XEX.doan.find((d) => d.k >= 4 && d.loai === 'tai' && d.X.obj.visible); return d && XEX.tDinh < 93 ? mat3(d.X.obj, 0.05, 3.05, -0.3) : null; }],
  ['Đại đội trưởng Bùi Quang Thận', () => (XEX.than && XEX.than.obj.visible ? { p: XEX.than.obj.position.clone().add(V3(0, 1.62, 0)), yaw: XEX.than.obj.rotation.y } : null)],
  ['Phi công A-37 dẫn đầu (Phi đội Quyết Thắng)', () => (C04.bay && C04.bay[0].o.visible ? mat3(C04.bay[0].o, 0, 1.4, 1.5) : null)],
  ['Trưởng xe tăng T-54 tiến vào Tân Sơn Nhất', () => (C07.tang && C07.tang[0] ? mat3(C07.tang[0].obj, 0.35, 3.25, -0.2) : null)],
] : [
  ['Trưởng xe tăng đi đầu Lữ đoàn 203 (cầu Rạch Chiếc)', () => (KT.c06rc && KT.c06rc.X[0] ? mat3(KT.c06rc.X[0].o, 0.45 * 3, 3.3 * 3, -0.2 * 3) : null)],
  ['Bộ binh ngồi trên xe tải trong đoàn quân', () => { for (const C of KT.cot) for (const X of C.X) if (X.k === 'T' && X.o.visible) return mat3(X.o, 0.78 * 3, 2.6 * 3, -1.4 * 3); return null; }],
  ['Pháo thủ trận địa M-46', () => { const Tt = KT.td.find((x) => x.on); if (!Tt) return null; const P = Tt.N[1]; return { p: V3(P[0], P[1] + 1.6 * 2.6, P[2]), yaw: P[3] }; }],
  ['Đặc công giữ cầu Rạch Chiếc', () => { const o = KT.rc; if (!o || T < o.t0 - 0.5 || T > o.t1 + 20) return null; const P = o.A[16]; const x = P[6] ?? P[0], z = P[7] ?? P[1]; return { p: V3(x, Math.max(hG(x, z), CAU_Y(x, z)) + 1.5 * 3, z), yaw: P[2] }; }],
];
const POV_DD = TANG === 'noi-do' ? (() => { const D = XEX.DL || ((a, b) => [0, 0]), h = XEX.hDinh || 0, P = (a, b) => { const [x, y] = D(a, b); return [x, -y]; };
  const tn = LL(MOC.thinghe[0], MOC.thinghe[1]), cs = LL(MOC.causg[0], MOC.causg[1]), dinh = P(0, 0);
  return [['Trước cổng Dinh Độc Lập', ...P(6, 185), 1.6, dinh], ['Trên nóc Dinh Độc Lập', ...P(3, -1), 27.5 + 1.6, P(0, 160)], ['Đầu cầu Thị Nghè', tn.x + 30, tn.z + 30, 1.6, [cs.x, cs.z]],
    ['Khu đỗ máy bay Tân Sơn Nhất', ...(C04.tam ? [C04.tam[0] + 60, -C04.tam[1] + 40] : [0, 0]), 1.6, C04.tam ? [C04.tam[0], -C04.tam[1]] : [0, 0]]]; })()
  : [['Đầu cầu Rạch Chiếc', C05.rc.x + 120, C05.rc.z + 80, 4, [C05.rc.x, C05.rc.z]], ['Trên đồi nhìn về Sài Gòn', SG.x + 9000, SG.z - 6000, 60, [SG.x, SG.z]]];
//@@ s47
function povTick() {
  let E = null;
  if (POV.dd >= 0) { const [, x, z, h, M] = POV_DD[POV.dd]; const y = (h > 20 && TANG === 'noi-do' ? (XEX.hDinh || 0) : Math.max(hG(x, z), CAU_Y(x, z), tideNow)) + h; E = { p: V3(x, y, z), yaw: Math.atan2(M[0] - x, M[1] - z) }; }
  else E = POV_VAI[POV.sel] ? POV_VAI[POV.sel][1]() : null;
  $('povmsg').textContent = E ? 'Kéo màn hình để quay đầu nhìn quanh · phim vẫn chạy theo lời dẫn' : 'Nhân vật này không có trong cảnh hiện tại · đang xem góc máy của phim';
  if (!E) { POV.has = false; return false; }
  if (POV.has) POV.eye.lerp(E.p, 0.35); else POV.eye.copy(E.p); POV.has = true;
  const yw = E.yaw + POV.yaw, cp = Math.cos(POV.pitch);
  camera.position.copy(POV.eye); camLook.set(POV.eye.x + Math.sin(yw) * cp * 5, POV.eye.y + Math.sin(POV.pitch) * 5, POV.eye.z + Math.cos(yw) * cp * 5);
  camera.lookAt(camLook); if (camera.fov !== 60) { camera.fov = 60; camera.updateProjectionMatrix(); }
  return true;
}
//@@ s48
const SCENE_FACTS = {};
async function fillDocs() {
  const el = $('docsbody'); if (el.dataset.ok) return; el.dataset.ok = '1';
  try {
    const S = await (await fetch('sources.json')).json();
    el.innerHTML = '<p><b>Tái dựng mô phỏng.</b> ' + S.reconstruction.replace(/</g, '&lt;') + '</p><ol>' + S.sources.map((s) => `<li><b>${s.id}</b> · ${s.title.replace(/</g, '&lt;')} <small>(${s.type})</small>${s.url ? ` · <a href="${s.url}" target="_blank" rel="noopener">mở nguồn</a>` : ''}<br><small>${(s.used_for || '').replace(/</g, '&lt;')}</small></li>`).join('') + '</ol>';
  } catch (e) { el.textContent = 'Chưa tải được danh sách nguồn.'; }
}
//@@ s49
// âm thanh nền, hiệu ứng (kho _KHO-CHUNG/nhac-nen: tiengdong.com; Epidemic Sound; tiếng pháo "daibac" dùng lại của gói Ngọc Hồi – Đống Đa)
const HCM_BED = ['xetang', 'gio', 'reoho', 'ak47', 'maybay', 'oto'], HCM_ONE = ['no', 'daibac', 'lua', 'vut', 'coi', 'votay', 'dang'];
// bản Artifact: AudioContext, bộ đệm tiếng, vòng lặp nền, hai thẻ nhạc nằm ở trang khung ngoài → nhạc, hiệu ứng chạy liền khi đổi tầng (iframe thay mới)
const KHUNG = (() => { try { return window.parent !== window && window.parent.__voxA ? window.parent : null; } catch (e) { return null; } })();
// bản Artifact: tầng địa hình kế tiếp được nạp sẵn trong một khung ẩn (#cho=1) ~35 s trước khi đổi tầng → đổi tầng không còn màn tải (anh Thắng 24/11)
const CHO = { on: QS.get('cho') === '1' };
const MAY_MANH = false;   // V1.5 (sửa dứt điểm lỗi đơ hình khi đổi tầng, anh Thắng 25/11 qua Khe Sanh): bỏ nạp sẵn tầng kế tiếp trong khung ẩn — hai ngữ cảnh WebGL cùng lúc làm card đồ hoạ quá tải, khung hiện ra đứng hình. Cũ:   // V1.5: chỉ máy ≥ 8 GB mới nạp sẵn tầng kế tiếp (hai sa bàn cùng lúc dễ tràn bộ nhớ đồ hoạ)
window.__amChung = () => { if (!KHUNG) return null;
  if (!KHUNG.__AMS) { const ctx = new (KHUNG.AudioContext || KHUNG.webkitAudioContext)(), out = ctx.createGain(), sfx = ctx.createGain(); out.gain.value = 0.9; out.connect(ctx.destination); sfx.connect(out);
    KHUNG.__AMS = { K: KHUNG, ctx, out, sfx, buf: {}, beds: {}, ready: false, deck: null, cur: 0 }; }
  return KHUNG.__AMS; };
function amPlan(i, u) {                                                                    // mức âm nền theo hồi và mốc câu đọc
  const id = SC[i] && SC[i].id, t = T;
  const gan = (() => { const X = XEX.x843; if (!X || !X.obj.visible) return 0; return clamp(1 - camera.position.distanceTo(X.obj.position) / 260, 0, 1); })();
  switch (id) {
    case 'C01': return { gio: 0.32 };
    case 'C02': return { gio: 0.28 };
    case 'C03': return { gio: 0.18, ak47: t > MV.c03_phao0 ? 0.1 : 0 };
    case 'C04': return { gio: 0.14 };
    case 'C05': return { gio: 0.18, ak47: t > MV.c05_rc - 1 ? 0.42 : t > MV.c05_phao0 && t < MV.c05_co ? 0.14 : 0 };
    case 'C06': return { gio: 0.16, xetang: t > MV.c06_tc ? 0.22 : 0 };
    case 'C07': return { ak47: 0.26, xetang: 0.22 };
    case 'C08': return { ak47: 0.26, xetang: t > MV.c08_xt ? 0.3 : 0.08 };
    case 'C09': return { ak47: 0.16, gio: 0.12 };
    case 'C10': return { xetang: 0.22 + gan * 0.55, ak47: t > MV.c10_cau && t < MV.c10_hx ? 0.3 : t > MV.c10_tn && t < MV.c10_tn + 6 ? 0.15 : 0, reoho: t > MV.c10_tn + 6 ? 0.32 : 0 };   // dân reo hò hai bên đường
    case 'C11': return { xetang: t < MV.c11_thao ? 0.22 + gan * 0.55 : 0.1, reoho: t > MV.c11_keo + 1 ? 0.3 : t < MV.c11_843 ? 0.22 : 0 };
    case 'C12': return { reoho: t > MV.c12_dan - 2 ? 0.45 : 0.2, gio: t > MV.c12_ket ? 0.16 : 0 };
  }
  return {};
}
// tiếng pháo, tiếng nổ lặp lại trong khoảng mốc: [mốc đầu, mốc cuối, tệp, âm lượng, cách tối thiểu, ngẫu nhiên thêm]
const AM_LAP = () => [[MV.c01_phao0, MV.c01_phao1, 'daibac', 0.32, 1.1, 1.6], [MV.c03_phao0, MV.c03_phao1, 'daibac', 0.36, 0.9, 1.4], [MV.c05_phao0, MV.c05_phao1, 'daibac', 0.36, 0.9, 1.4],
  [MV.c06_phao, MV.c06_rc + 3, 'no', 0.32, 0.8, 1.2], [MV.c07_tc, MV.c07_chu, 'no', 0.3, 1.2, 2.2], [MV.c08_tc, MV.c08_chu, 'no', 0.26, 1.6, 2.4], [MV.c09_tay, MV.c09_cs, 'no', 0.2, 2.0, 3.0], [MV.c05_rc, MV.c05_rc + 16, 'no', 0.45, 1.6, 1.4], [MV.c10_cau, MV.c10_m48 + 5, 'no', 0.3, 1.8, 1.6]];
// tiếng theo đúng câu đọc: [giây voice, tệp, âm lượng]
const AM_MOC = () => [[MV.c04_bom - 5, 'vut', 0.7], ...Array.from({ length: 8 }, (_, n) => [MV.c04_bom + n * 0.55, 'no', 0.75]), [MV.c10_m48 + 0.5, 'daibac', 0.5], [MV.c10_m48 + 1.6, 'daibac', 0.6], [MV.c10_m48 + 2.1, 'no', 0.55], [MV.c10_m48 + 4.2, 'daibac', 0.5], [MV.c10_m48 + 4.6, 'no', 0.5], [MV.c10_tn + 0.8, 'daibac', 0.5], [MV.c10_tn + 2.2, 'daibac', 0.6], [MV.c10_tn + 2.6, 'no', 0.6], [MV.c10_tn + 4.2, 'daibac', 0.5], [MV.c10_tn + 4.6, 'no', 0.55],
  ...[5, 9, 13, 17.5, 22, 26].flatMap((d) => [[MV.c07_tc + d, 'daibac', 0.6], [MV.c07_tc + d + 0.4, 'no', 0.7]]), [MV.c10_ban + 0.6, 'daibac', 0.85], [MV.c10_ban + 1.1, 'no', 0.9], [MV.c10_ban + 1.3, 'lua', 0.5], [MV.c10_tn + 2, 'daibac', 0.55], [MV.c11_ram, 'no', 0.85], [MV.c11_ram + 0.1, 'lua', 0.35],
  [MV.c11_cham, 'no', 0.95], [MV.c11_cham + 0.15, 'lua', 0.45], [MV.c11_keo - 9, 'dang', 0.35], [MV.c11_keo + 0.5, 'votay', 0.6], [MV.c12_dan + 3, 'coi', 0.25], [MV.c12_dan + 9, 'coi', 0.2], [MV.c12_dan, 'votay', 0.55]];
// TIẾNG TỔNG HỢP (không tải tệp): tiếng phản lực A-37 và tiếng động cơ xe tải — tạo bằng nhiễu lọc, vòng lặp liền
const AM_TONG = {
  maybay: (ctx) => { const sr = ctx.sampleRate, n = sr * 4, b = ctx.createBuffer(1, n, sr), d = b.getChannelData(0); let l1 = 0, l2 = 0;
    for (let i = 0; i < n; i++) { const w = Math.random() * 2 - 1; l1 += 0.06 * (w - l1); l2 += 0.5 * (w - l2); const t = i / sr;
      d[i] = (l1 * 2.6 + (w - l2) * 0.35 + Math.sin(2 * Math.PI * (2900 + 40 * Math.sin(t * 3)) * t) * 0.05) * 0.8; }
    for (let i = 0; i < 2000; i++) { const k = i / 2000; d[i] = d[i] * k + d[n - 2000 + i] * (1 - k); } return b; },
  oto: (ctx) => { const sr = ctx.sampleRate, n = sr * 3, b = ctx.createBuffer(1, n, sr), d = b.getChannelData(0); let br = 0, lp = 0;
    for (let i = 0; i < n; i++) { const t = i / sr, w = Math.random() * 2 - 1; br = (br + 0.02 * w) * 0.995; const f = 36, ph = (t * f) % 1;
      const x = (ph * 2 - 1) * 0.5 + Math.sin(2 * Math.PI * f * 2 * t) * 0.3 + br * 6; lp += 0.08 * (x - lp); d[i] = lp * (0.75 + 0.25 * Math.sin(2 * Math.PI * 9 * t)) * 0.9; }
    return b; } };
async function amLoad() {
  const S = window.__amChung(); if (S && S.ready) { AM.ready = true; return; }
  for (const n of Object.keys(AM_TONG)) AM.buf[n] = AM_TONG[n](AM.ctx);
  await Promise.all([...HCM_BED, ...HCM_ONE].filter((n) => !AM_TONG[n]).map(async (n) => { try { const r = await fetch(PU('am/' + n + '.mp3')); AM.buf[n] = await AM.ctx.decodeAudioData(await r.arrayBuffer()); } catch (e) { console.warn('âm thanh', n, e); } }));
  for (const n of HCM_BED) { if (!AM.buf[n]) continue; const s = AM.ctx.createBufferSource(); s.buffer = AM.buf[n]; s.loop = true; const g = AM.ctx.createGain(); g.gain.value = 0; s.connect(g).connect(AM.sfx); s.start(0, Math.random() * AM.buf[n].duration); AM.beds[n] = g; }
  AM.ready = true; if (S) S.ready = true;
}
async function amPrefetch() {}
const THE_EL = () => THE_EL.el || (THE_EL.el = (() => { const d = document.createElement('div'); d.style.cssText = 'position:fixed;left:0;right:0;top:30%;z-index:20;text-align:center;pointer-events:none;color:#f4e6c4;text-shadow:0 2px 14px #000c,0 0 2px #000';
  d.innerHTML = '<div style="font:600 clamp(16px,2.2vw,26px)/1.2 system-ui;letter-spacing:.18em;color:#e9b44c"></div><div style="font:800 clamp(26px,4.4vw,58px)/1.12 system-ui;margin-top:.25em;padding:0 6vw"></div>'; d.style.display = 'none'; document.body.append(d); return d; })());
//@@ s50
const amThem = (p) => { p = { ...p }; const cp = camera.position;                          // tiếng máy bay, tiếng đoàn xe theo khoảng cách máy quay
  if (C04.bay) { let g = 0; for (const B of C04.bay) if (B.o.visible) g = Math.max(g, 1 - cp.distanceTo(B.o.position) / 1800); p.maybay = Math.max(p.maybay || 0, 0.6 * clamp(g, 0, 1)); }
  let xe = 0; const gan = (o, r) => { if (o && o.visible) xe = Math.max(xe, 1 - cp.distanceTo(o.position) / r); };
  if (KT.cot) for (const C of KT.cot) if (T >= C.t0 && T < C.t1) for (const X of C.X) gan(X.o, 1500);
  if (XEX.doan) for (const d of XEX.doan) gan(d.X.obj, 450); for (const L of [C07.xe, C07.tang, C89.xeCY]) if (L) for (const X of L) gan(X.obj, 450);
  if (XEX.tDinh < 90) for (const X of [XEX.x843, XEX.x390]) if (X) gan(X.obj, 450);                // xe tăng 843, 390 đang chạy
  xe = clamp(xe, 0, 1); p.oto = Math.max(p.oto || 0, 0.85 * xe); p.xetang = Math.max(p.xetang || 0, 0.7 * xe); return p; };   // anh Thắng V1.2: có xe chạy là có tiếng nổ máy
function amTick(dt) {
  if (!AM.ready || !AM.on) { AM.prevT = T; return; }
  const live = (appMode === 'film' && playing) || appMode === 'explore', i = sceneIdx(T), sc = SC[i], u = clamp((T - sc.t0) / (sc.t1 - sc.t0), 0, 1);
  const plan = amThem(amPlan(i, u)), k = live ? 1 : 0.15, now = AM.ctx.currentTime, duck = voxNoi() ? 0.75 : 1;
  for (const n in AM.beds) AM.beds[n].gain.setTargetAtTime((plan[n] || 0) * k * duck, now, 0.6);
  if (live && appMode === 'film' && T > AM.prevT && T - AM.prevT < 1) {
    for (const [tc, n, v] of AM_MOC()) if (tc > AM.prevT && tc <= T) amShot(n, v);
    const tt = performance.now() / 1000;
    AM_LAP().forEach(([a, b, n, v, g, r], j) => { if (!(T >= a && T <= b)) return; if (!(j in AM.next)) AM.next[j] = tt + Math.random() * g; if (tt >= AM.next[j]) { amShot(n, v * (0.7 + Math.random() * 0.3)); AM.next[j] = tt + g + Math.random() * r; } });
  }
  AM.prevT = T;
}
// ------------------------------------------------------------------ nhạc nền theo hồi (Epidemic Sound, kho chung _KHO-CHUNG/nhac-nen; bản nén dùng lại của gói Bạch Đằng)
// V1.9: 'hiep-si' 35 s đầu rất nhỏ (−25…−35 dB) → đầu Hồi 2 (1:41–2:12) gần như chỉ có voice; Hồi 2 vào nhạc từ giây 50 (đoạn đầy)
const NHAC = { C01: ['thuc-day', 0, 0.34], C02: ['hiep-si', 50, 0.42], C03: ['giua-tran', 0, 0.34], C04: ['quyet-chien', 0, 0.34], C05: ['ke-thu', 0, 0.34], C06: ['giua-tran', 40, 0.36],
  C07: ['quyet-chien', 20, 0.32], C08: ['ke-thu', 50, 0.32], C09: ['thuc-day', 30, 0.32], C10: ['quyet-chien', 0, 0.38], C11: ['hiep-si', 100, 0.4], C12: ['vi-thanh', 0, 0.46] };
// V1.9 (anh Thắng): khi voice đọc tới mốc ngày giờ, hiện chữ ngày giờ ở bên phải màn hình (cỡ chữ co theo màn hình, điện thoại vẫn cân đối).
// Mốc lấy đúng giây câu đọc (story.json › subs); dòng nhỏ tóm tắt câu đọc đó.
const MOC_NGAY = { L: [
  [11.31, 'Tháng 4 · 1975', 'Miền Nam'], [48.23, '9.4.1975', 'Quân đoàn 4 tiến công Xuân Lộc'], [75.71, '21.4.1975', 'Quân đội Sài Gòn rút khỏi Xuân Lộc'],
  [100.28, '14.4.1975', 'Bộ Chính trị đặt tên chiến dịch'], [192.73, '17 giờ · 26.4.1975', 'Chiến dịch Hồ Chí Minh bắt đầu'],
  [252.35, 'Chiều 28.4.1975', 'Sân bay Phan Rang'], [267.87, '16 giờ 15 · 28.4', 'Phi đội Quyết Thắng cất cánh'], [297.44, '18 giờ 15 · 28.4', 'Hạ cánh an toàn xuống sân bay Thành Sơn'],
  [322.36, '5 giờ 30 · 29.4.1975', 'Pháo binh Quân Giải phóng bắn vào căn cứ Đồng Dù'], [344.61, '10 giờ 30 · 29.4', 'Căn cứ Đồng Dù bị đánh chiếm'], [362.5, '23 giờ · 29.4', 'Quân đoàn 3 nhận nhiệm vụ tiến vào Sài Gòn'],
  [405.83, 'Rạng sáng 30.4.1975', 'Các tuyến đường dẫn vào Sài Gòn'], [435.7, '7 giờ 15 · 30.4', 'Pháo cối bắn Tân Sơn Nhất, Bộ Tổng tham mưu'], [441.72, '7 giờ 30 · 30.4', 'Cầu Rạch Chiếc'],
  [473.73, '5 giờ 30 · 30.4', 'Sân bay Tân Sơn Nhất'], [499.01, '9 giờ 45 · 30.4', 'Trung đoàn 24 tiếp tục tiến công'], [518.82, '11 giờ 30 · 30.4', 'Trung đoàn 24 làm chủ sân bay Tân Sơn Nhất'],
  [581.73, '11 giờ 30 · 30.4', 'Bộ Tổng tham mưu bị đánh chiếm'], [640.65, '10 giờ 30 · 30.4', 'Bộ Tư lệnh Cảnh sát quốc gia bị đánh chiếm'],
  [677.74, '9 giờ 30 · 30.4', 'Dương Văn Minh lên Đài phát thanh Sài Gòn'], [763.18, 'Gần trưa 30.4.1975', 'Đoàn xe tăng Đại đội 4 tiến về Dinh Độc Lập'],
  [847.71, '11 giờ 30 · 30.4.1975', 'Cờ Mặt trận tung bay trên nóc Dinh Độc Lập'], [879.7, 'Trưa 30.4.1975', 'Đài phát thanh Sài Gòn'], [916.23, '30.4.1975', 'Chiến dịch Hồ Chí Minh toàn thắng']],
  el: null, cur: -1,
  tick() { if (!this.el) { const st = document.createElement('style');
      st.textContent = '#mocNgay{position:fixed;right:max(16px,2.2vw);top:34%;transform:translateY(-50%);max-width:min(46vw,380px);text-align:right;pointer-events:none;z-index:30;opacity:0;transition:opacity .8s;color:#fff4dc;text-shadow:0 2px 10px rgba(0,0,0,.75),0 0 2px rgba(0,0,0,.9)}#mocNgay.on{opacity:1}#mocNgay u{display:block;text-decoration:none;font-size:clamp(15px,1.9vw,24px);font-weight:700;color:#f0c040;white-space:nowrap}#mocNgay b{display:block;font-size:clamp(22px,3.2vw,42px);font-weight:800;letter-spacing:.02em;line-height:1.1;white-space:nowrap}#mocNgay i{display:block;margin-top:6px;padding-top:6px;border-top:2px solid #f0c040;font-style:normal;font-size:clamp(12px,1.35vw,17px);line-height:1.3;color:#f6e7c4}@media (max-width:700px){#mocNgay{top:auto;bottom:44%;transform:none;max-width:72vw;background:rgba(24,19,14,.62);padding:8px 12px;border-radius:12px}}';
      document.head.append(st); this.el = document.createElement('div'); this.el.id = 'mocNgay'; this.el.innerHTML = '<u></u><b></b><i></i>'; document.body.append(this.el); }
    let k = -1; if (appMode === 'film') for (let i = 0; i < this.L.length; i++) if (T >= this.L[i][0] - 0.2 && T < this.L[i][0] + 6.5) k = i;
    if (k !== this.cur) { this.cur = k; if (k >= 0) { const [g, d] = this.L[k][1].includes(' · ') ? this.L[k][1].split(' · ') : ['', this.L[k][1]]; this.el.querySelector('u').textContent = g; this.el.querySelector('b').textContent = d; this.el.querySelector('i').textContent = this.L[k][2]; } this.el.classList.toggle('on', k >= 0); } } };
const NHAC_DUR = { 'hiep-si': 231.2, 'ke-thu': 130.2, 'thuc-day': 118.5, 'tro-ve': 105.1, 'giua-tran': 146.4, 'quyet-chien': 97, 'vi-thanh': 114.7 };
const nhacCua = (i) => NHAC[SC[i].id] || ['thuc-day', 0, 0.3];
const MU = {
  deck: [], cur: 0,
  init() {
    const S = window.__amChung(); this.S = S; if (S && S.deck) { this.deck = S.deck; this.cur = S.cur || 0; return; }
    for (let k = 0; k < 2; k++) {
      const el = S ? new S.K.Audio() : new Audio(); el.preload = 'auto'; el.loop = true; el.crossOrigin = 'anonymous';
      const g = AM.ctx.createGain(); g.gain.value = 0;
      try { AM.ctx.createMediaElementSource(el).connect(g); g.connect(AM.out); } catch (e) { el.volume = 0; }
      this.deck.push({ el, g, ch: -1, f: '', seek: null });
    }
    if (S) S.deck = this.deck;
  },
  pos(i) { const [f, off] = nhacCua(i), d = NHAC_DUR[f]; return (off + Math.max(0, T - SC[i].t0)) % d; },
  tick() {
    if (!this.deck.length) return;
    const now = AM.ctx.currentTime, film = appMode === 'film', on = !$('ly-nhac') || $('ly-nhac').checked;
    const live = AM.on && on && ((film && playing) || appMode === 'explore');
    const i = sceneIdx(T), [f, , vol] = nhacCua(i);
    let D = this.deck[this.cur];
    if (D.ch !== i) {                                                                      // đổi hồi → chuyển nhạc mượt
      if (D.f === f && Math.abs((D.el.currentTime || 0) - this.pos(i)) < 3) D.ch = i;
      else { D.g.gain.setTargetAtTime(0, now, 0.7); this.cur = 1 - this.cur; D = this.deck[this.cur];
        if (D.f !== f) { D.f = f; D.el.src = new URL(PU('nhac/' + f + '.mp3'), location.href).href; } D.ch = i; D.seek = this.pos(i); D.g.gain.setValueAtTime(0, now); }
      if (this.S) this.S.cur = this.cur;
    }
    const other = this.deck[1 - this.cur];
    if (other.g.gain.value < 0.01 && !other.el.paused) other.el.pause();
    if (D.seek !== null && D.el.readyState >= 1) { try { D.el.currentTime = D.seek; } catch (e) {} D.seek = null; }
    if (live) {
      if (D.el.paused) D.el.play().catch(() => {});
      D.el.playbackRate = film ? clamp(speed, 0.5, 2) : 1;
      const p = this.pos(i); if (D.seek === null && D.el.readyState >= 1 && Math.abs(D.el.currentTime - p) > 3) D.el.currentTime = p;
      D.g.gain.setTargetAtTime(Math.min(0.75, vol * 1.45) * (voxNoi() ? 0.72 : 1), now, 0.8);
    } else { D.g.gain.setTargetAtTime(0, now, 0.25); if (D.g.gain.value < 0.01 && !D.el.paused) D.el.pause(); }
  },
};
// ------------------------------------------------------------------ VOICE THU ÂM là đồng hồ chính của phim (quy trình gắn voice, docs dự án)
// Một tệp voice chạy suốt phim; đang phát thì giây phim bám theo giây voice; voice chưa tải / bị chặn / tắt lời bình thì phim tự đếm giờ.
// Trình duyệt chặn tiếng khi trang vừa mở (cả lúc tải lại để đổi tầng địa hình) → dừng phim, hiện nút "Tiếp tục cùng lời dẫn".
const VOX = { a: null, ok: false, fail: false, cho: false };
function voxNoi() { const a = VOX.a; return !!(a && !a.paused && !a.ended); }
function voxInit() {
  if (!STORY.voice || VOX.a || location.hash === '#still' || QS.get('voice') === '0') return;
  // bản Artifact: trang khung ngoài giữ một thẻ voice chạy suốt, kể cả lúc đổi tầng địa hình (trang trong nạp lại) → voice không ngắt
  const K = (() => { try { return window.parent !== window && window.parent.__voxA ? window.parent : null; } catch (e) { return null; } })();
  if (K) { const a = K.__voxA; VOX.a = a; VOX.ok = a.readyState >= 2; a.addEventListener('canplay', () => { VOX.ok = true; }); a.addEventListener('error', () => { VOX.fail = true; });
    VOX.tiep = !a.paused && QS.get('phat') === '1'; return; }                              // đang phát dở: phim nhảy tới giây voice khi tải xong
  const a = new Audio(); a.preload = 'auto'; VOX.a = a;
  a.addEventListener('canplay', () => { VOX.ok = true; }); a.addEventListener('error', () => { VOX.fail = true; });
  fetch(PU('am/voice.mp3')).then((r) => (r.ok ? r.blob() : Promise.reject(r.status))).then((b) => { a.src = URL.createObjectURL(b); a.load(); })
    .catch(() => { a.src = PU('am/voice.mp3'); a.load(); });
}
function voxChan() {
  setPlaying(false); if (document.getElementById('vox-mo')) return;
  const b = document.createElement('button'); b.id = 'vox-mo'; b.textContent = '▶ Tiếp tục cùng lời dẫn';
  b.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:60;padding:14px 26px;border-radius:24px;border:0;background:#e9b44c;color:#2a2116;font:600 17px system-ui;box-shadow:0 6px 24px #0007;cursor:pointer';
  b.onclick = () => { b.remove(); voUnlock(); if (!AM.on) amEnable(true); const a = VOX.a; try { a.currentTime = T; } catch (e) {} a.play().catch(() => {}); setPlaying(true); };
  document.body.append(b);
}
function voxTick() {                                                                        // true: giây phim vừa lấy theo voice
  const a = VOX.a; if (!a || VOX.fail || CHO.on) return false;                             // khung chờ không đụng tới voice đang phát
  if (VOX.nghi) { if (playing && appMode === 'film' && performance.now() < VOX.nghi) { if (!a.paused) a.pause(); T = VOX.nghiT; return true; }   // nghỉ đầu hồi
    VOX.nghi = 0; VOX.tiep = false; try { a.currentTime = T; } catch (e) {} }
  if (VOX.tiep) { if (!(playing && appMode === 'film')) return false; VOX.tiep = false; if (!a.paused) { T = a.currentTime; return true; } }
  const want = VO.on && playing && appMode === 'film' && !seeking;
  if (!want) { if (!a.paused) a.pause(); return false; }
  if (!VOX.ok || a.readyState < 2 || T >= a.duration - 0.05) return false;
  a.playbackRate = clamp(speed, 0.5, 2);
  if (a.paused) { if (Math.abs(a.currentTime - T) > 0.25) try { a.currentTime = T; } catch (e) {}
    if (!VOX.cho) { VOX.cho = true; a.play().then(() => { VOX.cho = false; }).catch((e) => { VOX.cho = false; if (e && e.name === 'NotAllowedError') voxChan(); }); }
    return false; }
  if (a.seeking) return true;
  if (Math.abs(a.currentTime - T) > 0.8) { try { a.currentTime = T; } catch (e) {} VOX.tc = T; return true; }     // người xem tua / chọn cảnh: voice nhảy theo
  const tc = VOX.tc === undefined ? T : VOX.tc; T = a.currentTime; VOX.tc = T;
  // (bỏ nghỉ đầu hồi theo anh Thắng V1.2: dừng voice làm ngắt tiếng, ngắt hình)
  return true;
}
const VOX_NGHI = 2600;
voxInit();
//@@ s51
function updSub(force) {
  const el = $('sub'), sc = SC[sceneIdx(T)]; let txt = '', key = '';
  if (appMode === 'film') (sc.subs || []).forEach((s, k) => { if (T >= s[0] && T < s[1]) { txt = s[2]; key = sc.id + ':' + k; } });
  if (key && key !== lastLine) { lastLine = key; if (!STORY.voice) speak(txt); }        // có voice thu âm thì không dùng giọng máy
  const on = appMode === 'film' && $('ly-sub').checked;
  if (!on) { el.hidden = true; return; }
  if (el.textContent !== txt || force) el.textContent = txt; el.hidden = !txt;
}
//@@ s52
function update(dt) {
  if (appMode === 'film' && playing) { const dv = voxTick(); if (!dv) T += dt * speed; if (T >= DUR) { T = DUR - 0.01; setPlaying(false); } } else voxTick();
  if (appMode === 'explore') { const sc = SC[exploreI]; T += dt; if (T >= sc.t1 || T < sc.t0) T = sc.t0 + 0.01; }
  const t = T;
  U.time.value += dt;
  if (W.on) walkTick(dt);
  const i = sceneIdx(t), scn = SC[i], shot = shotAt(t);
  // 2.2: cảnh thuộc tầng khác → đổi tầng (tải lại ở cùng thời điểm)
  if (KHUNG && KHUNG.__chuanBi && MAY_MANH && appMode === 'film' && playing && !CHO.on && !update.cb) {    // nạp trước tầng kế tiếp (bản Artifact)
    const nx = SC.find((c) => c.t0 > T && c.t0 - T < 35); if (nx && nx.tang && nx.tang !== TANG) { update.cb = 1; const q = new URLSearchParams(QS); q.delete('cho'); q.delete('chuong'); q.delete('chan-doan');
      q.set('tang', nx.tang); q.set('t', (nx.t0 + 0.05).toFixed(2)); q.set('phat', '1'); KHUNG.__chuanBi(q.toString()); } }
  if (appMode === 'film' && scn.tang && scn.tang !== TANG && !update.doi) { update.doi = true; $('sub').hidden = false; $('sub').textContent = 'Đang chuyển sang ' + (scn.tang === 'noi-do' ? 'nội đô Sài Gòn' : 'toàn chiến dịch') + '…'; doiTang(scn.tang, Math.max(t, scn.t0 + 0.05), playing); return; }   // t làm tròn có thể rơi về cảnh trước (tầng cũ) → đổi tầng qua lại mãi
  tideNow = 0.3; U.level.value = tideNow; water.position.y = tideNow; U.wetTop.value = tideNow + 0.4;
  applySky(t, appMode === 'explore' ? forcedSky : '');
  scene.fog.density /= 1 + Math.max(0, camera.position.y - R * 0.2) / (R * 0.3);
  if (C04.cap) C04.cap(t, dt);                                                          // cảnh C04 Phi đội Quyết Thắng: dùng giây phim gốc
  { const t = tDinh(T); XEX.tDinh = t;                                                    // các cảnh vào Dinh viết theo mốc cũ (T02 bắt đầu 40 s) → dời theo story
  xeCapNhat(t);
  nvxCapNhat(t, dt);
  DAN.dat(t);
  if (XEX.coCap) XEX.coCap(t);
  if (XEX.co843) XEX.co843.visible = t < 115;                                         // cờ xe 843 đã được tháo mang lên nóc Dinh
  if (XEX.loe) { const a = t - XEX.tBan, X = XEX.x390.obj, y = X.rotation.y;              // Hàng Xanh: chớp nòng pháo 390, nổ ở M113
    XEX.loe.visible = a > 0 && a < 0.35; if (XEX.loe.visible) { XEX.loe.position.set(X.position.x + Math.sin(y) * 7, X.position.y + 2.3, X.position.z + Math.cos(y) * 7); XEX.loe.scale.setScalar(5 + a * 20); }
    const b = a - 0.45; XEX.no113.visible = b > 0 && b < 1.4; if (XEX.no113.visible) { const q = XEX.m113hx.position; XEX.no113.position.set(q.x, q.y + 2 + b * 4, q.z); XEX.no113.scale.setScalar(6 + b * 16); XEX.no113.material.opacity = 0.95 * (1 - b / 1.4); } }
  if (XEX.chay) for (const C of XEX.chay) { const p = C.o.position, chay = !C.tu || t >= C.tu;
    if (C.mats && C.mats.chay !== chay) { C.mats.chay = chay; for (const [m, c0] of C.mats) m.color.copy(c0).multiplyScalar(chay ? 0.3 : 1); }
    if (!chay) { for (const sp of C.khoi) sp.visible = false; continue; }
    for (const sp of C.khoi) { sp.visible = true; const u = (sp.userData.k + U.time.value * 0.06) % 1;
    sp.position.set(p.x + u * 6, p.y + 2 + u * 28, p.z - u * 4); sp.scale.setScalar(2.5 + u * 10); sp.material.opacity = 0.45 * (1 - u); } }
  if (XEX.cong && XEX.cong.phai) {                                                       // 843 húc đổ cổng phụ (84 s) rồi kẹt lại; 390 húc đổ cổng chính (90 s)
    const rung = t > 84 && t < 86.5 ? 0.08 * Math.sin((t - 84) * 20) * (1 - (t - 84) / 2.5) : 0, k1 = sstep(90, 90.7, t), k2 = sstep(90.45, 91.6, t);
    // V1.9 (anh Thắng: 390 húc cổng thì cánh cổng vỡ thành 2 cánh, rơi ra 2 bên xuống đất): hai cánh bật tung vào trong, rồi đổ nghiêng ra HAI BÊN lối vào
    // (trước đây đổ vào giữa, nằm chắn ngang lối như một tấm phẳng). Cánh đổ hơi vặn — gãy khỏi bản lề.
    // Gốc toạ độ mỗi cánh ở TÂM cánh (không phải bản lề); trục Dinh: cổng ở z ≈ −146, sân là phía +z. Cánh bị húc bật vào sân, gãy khỏi trụ,
    // rồi đổ nằm phẳng trên bãi cỏ HAI BÊN lối vào (tâm cách trục 4,1 m, vào sân 3 m), xe 390 đi giữa. Vị trí cuối: MINH HOẠ.
    const Cg = XEX.cong; if (!Cg.p0) Cg.p0 = [Cg.trai.position.clone(), Cg.phai.position.clone()];
    [[Cg.trai, Cg.p0[0], -1], [Cg.phai, Cg.p0[1], 1]].forEach(([o, p, sg]) => { const v = Math.sin(k2 * Math.PI) * 1.2;   // v: cánh văng lên một chút giữa chừng
      o.position.set(p.x + (sg * 4.1 - p.x) * k2, p.y + (0.12 - p.y) * k2 + v, p.z + 0.6 * k1 + 2.4 * k2);
      o.rotation.set(0.28 * k1 * (1 - k2) + k2 * Math.PI / 2, sg * k2 * Math.PI / 2, sg * 0.1 * k2, 'YXZ'); });
    if (XEX.cong.phu) XEX.cong.phu.rotation.x = rung + sstep(84, 84.9, t) * 1.25;          // 843 húc đổ cổng phụ, cánh cổng đổ đè dưới xích xe (xe chết máy, kẹt lại)
  }
  }
  { const on = !$('ly-nha') || $('ly-nha').checked, c = camera.position; for (const m of LAYER.nha) m.visible = on && Math.hypot(m.userData.tam.x - c.x, m.userData.tam.z - c.z) < (m.userData.xa + Math.max(0, c.y) * 2) * (m.visible ? 1.12 : 1); }   // có trễ: ô nhà không bật tắt liên tục (nháy) khi máy quay ở sát ngưỡng
  const xeOn = $('ly-nv').checked; for (const m of LAYER.xe) m.visible = m.visible && xeOn; for (const N of NVX) N.obj.visible = N.obj.visible && xeOn;
  const arrOn = $('ly-arr').checked && $('ly-muiten').checked, ex = appMode === 'explore';
  { const c2 = STORY.scenes.find((c) => c.id === 'C02') || STORY.scenes[0], c6 = STORY.scenes.find((c) => c.id === 'C06');   // năm hướng: C02 lần lượt theo câu đọc; C06 đủ năm hướng
    for (const M of MUITEN) { const t0 = MV.c02_m ? MV.c02_m[M.k] : c2.t0 + 14 + M.k * 9, in6 = c6 && (MV.c06_tc ? t >= MV.c06_tc && t < MV.c06_l2 : t >= c6.t0 && t < c6.t1), gan = MV.c02_l1 && t >= MV.c02_l1 && t < MV.c02_vay;   // C06: đủ năm hướng (cú máy toàn); ẩn khi máy lướt sát đoàn quân
      const on = arrOn && (ex || (t >= t0 && t < c2.t1 && !gan) || in6); muiTenDat(M.m, on, ex || in6 ? 1 : sstep(t0, t0 + 6, t)); } }
  if (C05.cap) C05.cap(t); if (C01.cap) C01.cap(t); if (C03.cap) C03.cap(t); if (C06.cap) C06.cap(t); if (KT.cap) KT.cap(t); if (C07.cap) C07.cap(t, dt); if (C89.cap) C89.cap(t);
  // máy quay
  let povDone = false; if (appMode === 'film' && povOn) povDone = povTick();
  if (appMode === 'film' && !userCam && !povDone) {
    const fn = SHOTS[shot.id], u = clamp((t - shot.t0) / (shot.t1 - shot.t0), 0, 1);
    if (fn) {
      const [p, l, fov] = fn(u, t);
      if (blend) { const k = Math.min((performance.now() - blend.t0) / 1200, 1), e = k * k * (3 - 2 * k); p.lerpVectors(blend.p0, p, e); l.lerpVectors(blend.q0, l, e); if (k >= 1) blend = null; }
      camera.position.copy(p); camLook.copy(l); camera.lookAt(l); if (camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix(); }
      controls.target.copy(l);
    }
  } else if (!povDone) {
    if (held) orbitCam(held[0], held[1], held[2]);
    if (flyA) { const k = Math.min((performance.now() - flyA.t0) / flyA.dur, 1), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; camera.position.lerpVectors(flyA.p0, flyA.p1, e); controls.target.lerpVectors(flyA.q0, flyA.q1, e); if (k >= 1) flyA = null; }
    controls.update(); camLook.copy(controls.target);
    if (camera.fov !== 45) { camera.fov = 45; camera.updateProjectionMatrix(); }
  }
  const gh = hAt(camera.position.x, camera.position.z), inR = Math.hypot(camera.position.x, camera.position.z) < R;
  const ghm = inR ? Math.max(gh, hG(camera.position.x, camera.position.z)) : gh;
  if (camera.position.y < ghm + 1.2) { camera.position.y = ghm + 1.2; if (appMode === 'film' && !userCam) camera.lookAt(camLook); }   // V1.5: chặn máy dưới đất ở mọi nơi (cả ngoài vòng sa bàn)
  const above = Math.max(1, camera.position.y - Math.max(gh, tideNow));
  camera.near = clamp(Math.min(above * 0.05, camera.position.distanceTo(camLook) * 0.2), 0.15, R * 0.01);   // máy bám sát vật ở trên cao (A-37): không cắt mất vật
  // V1.6 (nháy đen từ trên cao; máy thấp mất xe, chỉ thấy mặt nền): trước đây lời chú thích ở dòng trên nuốt mất lệnh cập nhật — mặt cắt gần chỉ được áp
  // khi đổi góc rộng (fov) hoặc đổi cỡ cửa sổ, nên có lúc còn giữ giá trị của cảnh cao (≈ 565 m) khi máy đã hạ thấp → cắt mất đất và xe trước mặt.
  camera.far = Math.max(R * 4, 110000); camera.updateProjectionMatrix();
  sky.position.copy(camera.position); fill.position.copy(camera.position); fill.intensity = 2.2;
  $('underwater').style.opacity = 0;
  if (appMode === 'film' && playing && !userCam) { const ds = Math.min(t - scn.t0, scn.t1 - t); veil.style.opacity = ds < 0.45 ? 1 - ds / 0.45 : 0; } else veil.style.opacity = 0;
  if (scn.id !== lastScene) { lastScene = scn.id; $('stitle').textContent = `${scn.id} · ${scn.title}`; if (appMode === 'film') $('sdate').textContent = `Cảnh ${i + 1}/${NSC} · ${scn.title}`; $('slist').querySelectorAll('button').forEach((b, k) => b.classList.toggle('on', k === i)); }
  if (shot.id !== lastShot) { lastShot = shot.id; $('snote').textContent = `${shot.id} · ${shot.size} · ${shot.desc}`; $('snote').hidden = false; }
  $('stime').textContent = `${fmtT(t)} / ${fmtT(DUR)}`; if (!seeking) $('seek').value = Math.round((t / DUR) * 1000);
  updSub();
  { const el = THE_EL(); let c = null; if (appMode === 'film') for (const x of STORY.the || []) if (t >= x[0] && t < x[1]) c = x;   // thẻ hồi
    if (c) { const k = Math.min(1, (t - c[0]) / 0.6, (c[1] - t) / 0.8); if (el.dataset.k !== c[0] + '') { el.dataset.k = c[0] + ''; el.children[0].textContent = c[2]; el.children[1].textContent = c[3]; } el.style.opacity = k; el.style.display = ''; }
    else el.style.display = 'none'; }
  updateLabels(); amTick(dt); MU.tick(); MOC_NGAY.tick(); try { KHO.capNhat(performance.now() / 1000); } catch (e) { if (!KHO.loi) { KHO.loi = 1; console.error('Lỗi khí tài', e); } }
  fpsN++; const nw = performance.now(); if (nw - fpsT > 1000) { $('fps').textContent = Math.round((fpsN * 1000) / (nw - fpsT)) + ' fps'; fpsN = 0; fpsT = nw; drawMinimap(); }
  else if ((fpsN & 7) === 0) drawMinimap();
}
progress(0.97, 'Đang chuẩn bị hình ảnh…');
//@@ s53
function frame() { if (CHO.on) { clock.getDelta(); return setTimeout(frame, 500); } requestAnimationFrame(frame);   // V1.4: hẹn khung sau TRƯỚC — một lỗi trong khung này không làm đứng cả phim
  const dt = Math.min(clock.getDelta(), 0.1); try { update(first ? 0 : dt); } catch (e) { if (!frame.loi) { frame.loi = 1; console.error('Lỗi khung hình', e); } } first = false; renderer.render(scene, camera); }   // khung chờ: không vẽ, đỡ tốn máy
setAppMode('film');
{ const t0 = parseFloat(QS.get('t')); T = Number.isFinite(t0) ? clamp(t0, 0, DUR - 0.01) : (SC.find((s) => s.tang === TANG) || SC[0]).t0; }
// V1.3 (Hồi 10 đứng hình): dựng sẵn mọi chương trình đồ hoạ lúc tải — trước đây vật nào ẩn tới cảnh sau (đám đông, xe, đạn vạch…) mới dựng khi lần đầu hiện,
// trên Windows (ANGLE/D3D) mỗi lần dựng tốn hàng trăm ms → nhiều thứ cùng hiện ở Hồi 10 làm đứng hình.
await Promise.race([Promise.all(DONG_P), new Promise((r) => setTimeout(r, 20000))]);
{ const an = [], tam = [], mx = new THREE.Matrix4().makeTranslation(0, -9999, 0);
  scene.traverse((o) => { if (!o.visible) { an.push(o); o.visible = true; } });
  for (const K of Object.values(DONG)) { const C = Object.values(K.clips)[0]; if (!C || !C.frames[0]) continue; const im = new THREE.InstancedMesh(C.frames[0], K.mat, 1); im.setMatrixAt(0, mx); im.setColorAt(0, new THREE.Color(1, 1, 1)); im.frustumCulled = false; scene.add(im); tam.push(im); }
  TRV.count = 1; try { renderer.compile(scene, camera); } catch (e) { console.warn('dựng sẵn', e); }
  const daTx = new Set(); scene.traverse((o) => { const M = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []; for (const m of M) for (const k of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'aoMap']) { const t = m[k]; if (t && t.isTexture && !daTx.has(t)) { daTx.add(t); try { renderer.initTexture(t); } catch (e) {} } } });   // nạp sẵn ảnh màu lên GPU
  // V1.5: compile() chỉ dựng chương trình, KHÔNG nạp hình khối — vật ẩn tới cảnh sau (xe ở Dinh, cờ, đạn…) vẫn nạp khi lần đầu hiện (đo: ~90 hình khối, 1,5–10 s ở 13:44).
  // Vẽ cả cảnh một lần (bỏ cắt khung nhìn) vào khung 1×1 điểm ảnh để nạp hết lên GPU trong lúc còn màn hình tải.
  { const rt = new THREE.WebGLRenderTarget(1, 1), fc = []; scene.traverse((o) => { if (o.frustumCulled) { fc.push(o); o.frustumCulled = false; } });
    try { const cu = renderer.getRenderTarget(); renderer.setRenderTarget(rt); renderer.render(scene, camera); renderer.setRenderTarget(cu); } catch (e) { console.warn('nạp sẵn cảnh', e); }
    for (const o of fc) o.frustumCulled = true; rt.dispose(); }
  for (const o of an) o.visible = false; for (const im of tam) { scene.remove(im); im.dispose(); } TRV.count = 0;
  // V1.5 (giật ~1–10 s ở 13:44, Hồi 10): mỗi khung hình của mỗi động tác đám đông là một lưới riêng (~980 lưới, ~53 MB) và chỉ được đưa lên GPU khi lần đầu
  // xuất hiện → cảnh nào nhiều người đổi động tác cùng lúc thì đứng hình. Nay vẽ thử một lần mọi lưới vào khung 1×1 điểm ảnh lúc tải để nạp sẵn hết.
  { const sc = new THREE.Scene(), rt = new THREE.WebGLRenderTarget(1, 1), ims = [], mx2 = new THREE.Matrix4().makeTranslation(0, -9999, 0), mau = new THREE.Color(1, 1, 1);
    for (const K of Object.values(DONG)) for (const C of Object.values(K.clips)) for (const g of C.frames) { if (!g) continue; const im = new THREE.InstancedMesh(g, K.mat, 1); im.setMatrixAt(0, mx2); im.setColorAt(0, mau); im.frustumCulled = false; sc.add(im); ims.push(im); }
    try { const cu = renderer.getRenderTarget(); renderer.setRenderTarget(rt); renderer.render(sc, camera); renderer.setRenderTarget(cu); } catch (e) { console.warn('nạp sẵn đám đông', e); }
    for (const im of ims) im.dispose(); rt.dispose(); window.__napSan = ims.length; } }
update(0); renderer.compile(scene, camera); renderer.render(scene, camera);
renderList(); connectStore();
const STILL = location.hash === '#still';
window.__kiem = () => { const c = camera.position, out = []; if (c.y < Math.max(hG(c.x, c.z), hAt(c.x, c.z)) + 0.5) out.push('máy dưới đất'); if (camera.near > camera.position.distanceTo(camLook) * 0.5 || Math.abs(camera.projectionMatrix.elements[14] + 2 * camera.far * camera.near / (camera.far - camera.near)) > 1e-3 * Math.abs(camera.projectionMatrix.elements[14])) out.push('mặt cắt gần sai');   // V1.6   // V1.5: kiểm tra tự động (tools: quét cả phim)
  let ng = 0; for (const X of XE) if (X.obj.visible && Math.hypot(X.obj.position.x, X.obj.position.z) > R - 50) ng++; for (const C of KT.cot || []) for (const X of C.X) if (X.o.visible && Math.hypot(X.o.position.x, X.o.position.z) > R - 50) ng++;
  if (ng) out.push(ng + ' xe ngoài sa bàn'); if (Math.hypot(c.x, c.z) > R * 1.02 && c.y < 3000) out.push('máy ngoài sa bàn, thấp'); return out; };
window.__sa = { DAM, get dongDat() { return dongDat; }, renderer, scene, THREE, KT, C89, C07, C04, DAN, DONG, get NHA() { return XEX.nhaTong; }, get VOX() { return VOX; }, XE, NVX, XEX, TANG, camera, controls, seek: (t) => { T = clamp(t, 0, DUR - 0.01); }, setPlaying, setAppMode, goView, get T() { return T; }, get DUR() { return DUR; }, render: () => { update(0); renderer.render(scene, camera); }, ve: () => renderer.render(scene, camera), tinh: () => update(0), buoc: (dt) => { update(dt); renderer.render(scene, camera); } };
// V1.5: card đồ hoạ mất ngữ cảnh (máy yếu, tràn bộ nhớ) → tự dựng lại sa bàn ở đúng giây đang xem, thay vì để màn hình đen
renderer.domElement.addEventListener('webglcontextlost', (e) => { e.preventDefault(); if (update.mat) return; update.mat = 1; console.warn('mất ngữ cảnh WebGL — dựng lại');
  if (CHO.on) { window.__sanSang = false; return; }   // V1.6: khung nạp sẵn mất ngữ cảnh → bỏ, khi tới hồi đó sẽ tải bình thường
  // V1.6: chống vòng tải lại vô hạn (máy treo) — quá 2 lần trong 2 phút thì dừng, báo anh chị đóng bớt thẻ trình duyệt
  let L = []; try { L = JSON.parse(sessionStorage.getItem('sb-mat') || '[]').filter((x) => Date.now() - x < 120000); L.push(Date.now()); sessionStorage.setItem('sb-mat', JSON.stringify(L)); } catch (er) {}
  $('sub').hidden = false;
  if (L.length > 2) { $('sub').textContent = 'Máy đồ hoạ quá tải. Hãy đóng bớt thẻ trình duyệt rồi tải lại trang.'; return; }
  $('sub').textContent = 'Máy đồ hoạ quá tải — đang dựng lại sa bàn…'; setTimeout(() => doiTang(TANG, T, playing), 600); });
window.__dong = () => { update.mat = 1; CHO.on = true; try { renderer.dispose(); renderer.forceContextLoss(); } catch (e) {} };   // V1.6: khung bị thay — trả bộ nhớ đồ hoạ ngay
function closeLoad() { $('load').classList.add('done'); setTimeout(() => $('load').remove(), 700); }
if (STILL) { document.body.classList.add('ready'); closeLoad(); }
else {
  progress(1, 'Đã tải xong sa bàn');
  document.body.classList.add('ready');
  $('ldtrack').hidden = true; $('ldgo').hidden = false; $('bstart').focus();
  $('bstart').onclick = () => { voUnlock(); if (!AM.on) amEnable(true); closeLoad(); setPlaying(true); };   // Play bật cả nhạc, hiệu ứng
  $('bexplore').onclick = () => { voUnlock(); closeLoad(); setAppMode('explore'); };
  if (CHO.on) {                                                                            // khung chờ: nạp xong thì đứng yên, khung ngoài gọi __tiep khi tới giờ đổi tầng
    window.__tiep = (t, phat) => { CHO.on = false; T = clamp(+t || T, 0, DUR - 0.01); closeLoad(); if (KHUNG && KHUNG.__AMS && !AM.on) amEnable(true);
      VOX.tiep = !!(VOX.a && !VOX.a.paused); VOX.tc = T;
      setAppMode('film'); setPlaying(phat !== false); update(0); renderer.render(scene, camera); };
    window.__sanSang = true;
  } else if (QS.get('phat') === '1') { closeLoad(); if (KHUNG && KHUNG.__AMS && !AM.on) amEnable(true); setPlaying(true); }
  requestAnimationFrame(frame);
}
