// --- 1. INISIALISASI DATA ---
let cart = [];
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const modalItemList = document.getElementById('modalItemList');
const modalTotal = document.getElementById('modalTotal');

// --- 2. FUNGSI LOGIKA KERANJANG ---

// Fungsi untuk memperbarui tampilan angka di navbar dan isi dalam modal
function updateCartUI() {
    // Menghitung total jumlah item yang ada di keranjang
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;

    // Mengosongkan daftar item di modal sebelum diisi ulang
    modalItemList.innerHTML = '';
    let totalPrice = 0;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        totalPrice += subtotal;

        const li = document.createElement('li');
        // Menggunakan manipulasi DOM yang aman untuk menampilkan detail produk
        li.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 5px;">
                <strong>${item.name}</strong>
                <span>Rp ${subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
                <button class="qty-btn btn-minus" data-index="${index}">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn btn-plus" data-index="${index}">+</button>
                <button class="qty-btn btn-delete" data-index="${index}" style="background:#d9534f; margin-left:auto;">Hapus</button>
            </div>
        `;
        modalItemList.appendChild(li);
    });

    // Menampilkan total harga dengan format mata uang Indonesia
    modalTotal.innerText = totalPrice.toLocaleString('id-ID');
}

// Fungsi untuk menambah produk ke dalam array keranjang
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price: parseInt(price), quantity: 1 });
    }
    updateCartUI();
}

// Fungsi untuk menangani aksi tombol (Plus, Minus, Hapus) di dalam modal
function handleCartAction(e) {
    const index = e.target.dataset.index;
    if (index === undefined) return;

    if (e.target.classList.contains('btn-plus')) {
        cart[index].quantity += 1;
    } else if (e.target.classList.contains('btn-minus')) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
    } else if (e.target.classList.contains('btn-delete')) {
        cart.splice(index, 1);
    }
    updateCartUI();
}

// --- 3. EVENT LISTENERS (Standar Keamanan Tinggi) ---

// Menangkap klik pada semua tombol "TAMBAH" di katalog produk
document.querySelectorAll('.btn-add').forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = button.getAttribute('data-price');
        
        // Efek animasi sederhana saat tombol diklik
        button.style.opacity = '0.7';
        setTimeout(() => button.style.opacity = '1', 100);
        
        addToCart(name, price);
    });
});

// Menggunakan Event Delegation untuk tombol di dalam modal agar tetap berfungsi saat list berubah
modalItemList.addEventListener('click', handleCartAction);

// Kontrol buka/tutup modal keranjang
document.getElementById('cartToggle').addEventListener('click', () => {
    cartModal.classList.remove('hidden');
});

document.getElementById('closeModal').addEventListener('click', () => {
    cartModal.classList.add('hidden');
});

// Menutup modal jika pengguna mengklik area di luar kotak modal
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.add('hidden');
    }
});

// --- 4. PROSES KIRIM PESAN KE WHATSAPP ---
document.getElementById('finalOrderBtn').addEventListener('click', () => {
    const name = document.getElementById('custName').value.trim();
    const address = document.getElementById('custAddress').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const payment = document.getElementById('payMethod').value;

    // Validasi input sebelum mengirim
    if (!name || !address || !phone || cart.length === 0) {
        alert("Harap lengkapi biodata pengiriman dan pilih produk terlebih dahulu.");
        return;
    }

    // Menyusun format pesan WhatsApp
    let itemDetails = cart.map(item => `- ${item.name} (${item.quantity}x)`).join('%0A');
    const total = modalTotal.innerText;

    const message = `Halo Sweet Bakes!%0A%0A*DATA PEMESAN:*%0A👤 Nama: ${name}%0A📍 Alamat: ${address}%0A📞 WA: ${phone}%0A💳 Metode: ${payment}%0A%0A*DAFTAR PESANAN:*%0A${itemDetails}%0A%0A*TOTAL PEMBAYARAN: Rp ${total}*`;
    
    // Membuka WhatsApp di tab baru
    window.open(`https://wa.me/6281234567890?text=${message}`, '_blank');
});