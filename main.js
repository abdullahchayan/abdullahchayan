/**
 * Sweet Bakes - Logic Pemesanan (Full Features)
 * Mendukung: Grouping, Edit Quantity, & Metode Pembayaran
 */

document.addEventListener('DOMContentLoaded', function() {
    let cart = []; 

    const cartCountBadge = document.getElementById('cartCount');
    const modal = document.getElementById('cartModal');
    const modalItemList = document.getElementById('modalItemList');
    const modalTotal = document.getElementById('modalTotal');
    const modalCount = document.getElementById('modalCount');
    const finalOrderBtn = document.getElementById('finalOrderBtn');

    // 1. TAMBAH KE KERANJANG
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseInt(this.getAttribute('data-price'));

            // Cek jika produk sudah ada di keranjang
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name, price, quantity: 1 });
            }

            updateBadge();
            
            // Efek visual tombol
            const originalText = this.innerText;
            this.innerText = "DITAMBAHKAN ✓";
            setTimeout(() => { this.innerText = originalText; }, 800);
        });
    });

    function updateBadge() {
        const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountBadge.textContent = totalQty;
    }

    // 2. TAMPILKAN ISI KERANJANG DI MODAL
    function renderModal() {
        modalItemList.innerHTML = '';
        let totalHarga = 0;
        let totalQty = 0;

        if (cart.length === 0) {
            modalItemList.innerHTML = '<li style="justify-content: center; padding: 20px; border:none;">Keranjang kosong 🥐</li>';
        } else {
            cart.forEach((item, index) => {
                const subtotal = item.price * item.quantity;
                const li = document.createElement('li');

                li.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                        <strong>${item.name}</strong>
                        <span>Rp ${subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 5px; width: 100%;">
                        <small style="color: #666;">@Rp ${item.price.toLocaleString('id-ID')}</small>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                            <span style="font-weight:bold;">${item.quantity}</span>
                            <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                            <button onclick="removeItem(${index})" style="background:none; border:none; cursor:pointer; font-size:16px; margin-left:10px;">🗑️</button>
                        </div>
                    </div>
                `;
                modalItemList.appendChild(li);
                totalHarga += subtotal;
                totalQty += item.quantity;
            });
        }

        modalTotal.textContent = totalHarga.toLocaleString('id-ID');
        modalCount.textContent = totalQty;
    }

    // 3. FUNGSI EDIT DAN HAPUS ITEM (GLOBAL)
    window.changeQty = function(index, delta) {
        cart[index].quantity += delta;
        if (cart[index].quantity < 1) cart[index].quantity = 1;
        renderModal();
        updateBadge();
    };

    window.removeItem = function(index) {
        cart.splice(index, 1);
        renderModal();
        updateBadge();
    };

    // 4. KONTROL MODAL
    document.getElementById('cartToggle').addEventListener('click', (e) => {
        e.preventDefault();
        renderModal();
        modal.classList.remove('hidden');
    });

    document.getElementById('closeModal').addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });

    // 5. KIRIM KE WHATSAPP DENGAN METODE PEMBAYARAN
    finalOrderBtn.addEventListener('click', function() {
        const nama = document.getElementById('custName').value.trim();
        const alamat = document.getElementById('custAddress').value.trim();
        const telp = document.getElementById('custPhone').value.trim();
        const metodeBayar = document.getElementById('payMethod').value;

        // Validasi input
        if (!nama || !alamat || !telp || !metodeBayar) {
            alert("⚠️ Mohon lengkapi biodata dan pilih metode pembayaran!");
            return;
        }
        if (cart.length === 0) {
            alert("⚠️ Keranjang Anda masih kosong!");
            return;
        }

        // Format Pesan WhatsApp
        let pesan = `*PESANAN BARU - SWEET BAKES*\n`;
        pesan += `━━━━━━━━━━━━━━━━━━━\n`;
        pesan += `👤 *Nama:* ${nama}\n`;
        pesan += `📍 *Alamat:* ${alamat}\n`;
        pesan += `📱 *WhatsApp:* ${telp}\n`;
        pesan += `💳 *Pembayaran:* ${metodeBayar}\n`;
        pesan += `━━━━━━━━━━━━━━━━━━━\n\n`;
        pesan += `*DAFTAR ITEM:*\n`;

        cart.forEach((item, i) => {
            const subtotal = item.price * item.quantity;
            pesan += `${i + 1}. ${item.name} (x${item.quantity}) = Rp ${subtotal.toLocaleString('id-ID')}\n`;
        });

        pesan += `\n━━━━━━━━━━━━━━━━━━━\n`;
        pesan += `*TOTAL BAYAR: Rp ${modalTotal.textContent}*\n`;
        pesan += `━━━━━━━━━━━━━━━━━━━\n\n`;
        pesan += `_Mohon instruksi selanjutnya untuk pembayaran via ${metodeBayar}_`;

        // Masukkan nomor WhatsApp Anda di sini (awali dengan 62)
        const noWhatsAppAdmin = "628123456789"; 
        const waUrl = `https://wa.me/${+6285156215483}?text=${encodeURIComponent(pesan)}`;
        
        window.open(waUrl, '_blank');
    });
});