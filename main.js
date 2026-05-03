// --- 1. INISIALISASI DATA ---
let cart = [];
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const modalItemList = document.getElementById('modalItemList');
const modalTotal = document.getElementById('modalTotal');

// --- 2. FUNGSI UTAMA KERANJANG ---

// Update tampilan angka di navbar dan isi modal
function updateCartUI() {
    // Hitung total item
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;

    // Bersihkan list modal
    modalItemList.innerHTML = '';
    let totalPrice = 0;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        totalPrice += subtotal;

        const li = document.createElement('li');
        li.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong>${item.name}</strong>
                <span>Rp ${subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div style="margin-top:5px;">
                <button class="qty-btn btn-minus" data-index="${index}">-</button>
                <span style="margin: 0 10px;">${item.quantity}</span>
                <button class="qty-btn btn-plus" data-index="${index}">+</button>
                <button class="qty-btn btn-delete" data-index="${index}" style="background:#ff4444; margin-left:15px;">Hapus</button>
            </div>
        `;
        modalItemList.appendChild(li);
    });

    modalTotal.innerText = totalPrice.toLocaleString('id-ID');
}

// Tambah Produk
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price: parseInt(price), quantity: 1 });
    }
    updateCartUI();
}

// Manipulasi Quantity (Plus/Minus/Hapus)
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

// --- 3. EVENT LISTENERS (Keamanan A+) ---

// Listener untuk tombol "TAMBAH" di katalog
document.querySelectorAll('.btn-add').forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = button.getAttribute('data-price');
        addToCart(name, price);
    });
});

// Listener untuk tombol di dalam modal (Event Delegation)
modalItemList.addEventListener('click', handleCartAction);

// Buka/Tutup Modal
document.getElementById('cartToggle').addEventListener('click', () => {
    cartModal.classList.remove('hidden');
});

document.getElementById('closeModal').addEventListener('click', () => {
    cartModal.classList.add('hidden');
});

// Klik di luar modal untuk menutup
window.addEventListener('click', (e) => {
    if (e.target === cartModal) cartModal.classList.add('hidden');
});

// --- 4. INTEGRASI WHATSAPP ---
document.getElementById('finalOrderBtn').addEventListener('click', () => {
    const name = document.getElementById('custName').value;
    const address = document.getElementById('custAddress').value;
    const payment = document.getElementById('payMethod').value;

    if (!name || !address || cart.length === 0) {
        alert("Mohon lengkapi data diri dan pastikan keranjang tidak kosong.");
        return;
    }

    let itemDetails = cart.map(item => `- ${item.name} (${item.quantity}x)`).join('%0A');
    const total = modalTotal.innerText;

    const message = `Halo Sweet Bakes!%0A%0A*Data Pemesan:*%0ANama: ${name}%0AAlamat: ${address}%0AMetode: ${payment}%0A%0A*Pesanan:*%0A${itemDetails}%0A%0A*Total Bayar: Rp ${total}*`;
    
    window.open(`https://wa.me/6281234567890?text=${message}`, '_blank');
});
