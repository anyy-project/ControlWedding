// Control Wedding - Simple Version

// Data
let weddingInfo = {
    namaMempelai: '',
    alamat: '',
    linkMaps: '',
    linkUndangan: ''
};

let templatePesan = '';
let daftarTamu = [];

// Load data from localStorage
function loadData() {
    const savedInfo = localStorage.getItem('weddingInfo');
    const savedTemplate = localStorage.getItem('templatePesan');
    const savedTamu = localStorage.getItem('daftarTamu');

    if (savedInfo) {
        weddingInfo = JSON.parse(savedInfo);
        document.getElementById('namaMempelai').value = weddingInfo.namaMempelai || '';
        document.getElementById('alamat').value = weddingInfo.alamat || '';
        document.getElementById('linkMaps').value = weddingInfo.linkMaps || '';
        document.getElementById('linkUndangan').value = weddingInfo.linkUndangan || '';
    }

    if (savedTemplate) {
        templatePesan = savedTemplate;
        document.getElementById('templatePesan').value = templatePesan;
    } else {
        setDefaultTemplate();
    }

    if (savedTamu) {
        daftarTamu = JSON.parse(savedTamu);
        renderTamu();
    }

    updatePreview();
}

// Default Template
function setDefaultTemplate() {
    const defaultTemplate = `Assalamualaikum Wr. Wb.

Kepada Yth. [Nama Tamu]

Dengan memohon rahmat dan ridho Allah SWT, kami [Nama Mempelai] bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan kami.

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.

📍 Lokasi Acara:
[Alamat]

🗺️ Peta Lokasi:
[Link Maps]

💌 Undangan Digital:
[Link Undangan]

Terima kasih atas perhatiannya.

Wassalamualaikum Wr. Wb.`;

    templatePesan = defaultTemplate;
    document.getElementById('templatePesan').value = templatePesan;
}

function resetTemplate() {
    if (confirm('Reset template ke default?')) {
        setDefaultTemplate();
        saveTemplate();
        updatePreview();
    }
}

// Save Info
document.getElementById('formInfo').addEventListener('submit', function(e) {
    e.preventDefault();
    weddingInfo.namaMempelai = document.getElementById('namaMempelai').value;
    weddingInfo.alamat = document.getElementById('alamat').value;
    weddingInfo.linkMaps = document.getElementById('linkMaps').value;
    weddingInfo.linkUndangan = document.getElementById('linkUndangan').value;
    
    localStorage.setItem('weddingInfo', JSON.stringify(weddingInfo));
    showToast('Informasi berhasil disimpan', 'success');
    updatePreview();
});

// Save Template
function saveTemplate() {
    templatePesan = document.getElementById('templatePesan').value;
    localStorage.setItem('templatePesan', templatePesan);
    showToast('Template berhasil disimpan', 'success');
    updatePreview();
}

document.getElementById('templatePesan').addEventListener('input', function() {
    templatePesan = this.value;
    updatePreview();
});

// Update Preview
function updatePreview() {
    const namaTamu = document.getElementById('previewNamaTamu').value || '[Nama Tamu]';
    let preview = templatePesan || document.getElementById('templatePesan').value;
    
    preview = preview.replace(/\[Nama Tamu\]/g, namaTamu);
    preview = preview.replace(/\[Nama Mempelai\]/g, weddingInfo.namaMempelai || '[Nama Mempelai]');
    preview = preview.replace(/\[Alamat\]/g, weddingInfo.alamat || '[Alamat]');
    preview = preview.replace(/\[Link Maps\]/g, weddingInfo.linkMaps || '[Link Maps]');
    preview = preview.replace(/\[Link Undangan\]/g, weddingInfo.linkUndangan || '[Link Undangan]');
    
    document.getElementById('previewContent').textContent = preview;
}

document.getElementById('previewNamaTamu').addEventListener('input', updatePreview);

// Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tab = this.dataset.tab;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        this.classList.add('active');
        document.getElementById(tab).classList.add('active');
    });
});

// Tambah Tamu
document.getElementById('formTamu').addEventListener('submit', function(e) {
    e.preventDefault();
    const nama = document.getElementById('tamuNama').value.trim();
    const phone = document.getElementById('tamuPhone').value.replace(/\D/g, '');
    
    if (!nama || !phone) {
        showToast('Nama dan nomor wajib diisi', 'error');
        return;
    }
    
    if (phone.length < 10) {
        showToast('Nomor WhatsApp tidak valid', 'error');
        return;
    }
    
    daftarTamu.push({
        id: Date.now(),
        nama: nama,
        phone: phone,
        status: 'pending'
    });
    
    saveTamu();
    renderTamu();
    document.getElementById('formTamu').reset();
    showToast('Tamu berhasil ditambahkan', 'success');
});

// Render Tamu
function renderTamu() {
    const list = document.getElementById('listTamu');
    const total = document.getElementById('totalTamu');
    const actionButtons = document.getElementById('actionButtons');
    
    total.textContent = daftarTamu.length;
    
    if (daftarTamu.length === 0) {
        list.innerHTML = '<div class="empty-state">Belum ada tamu. Tambahkan tamu terlebih dahulu.</div>';
        actionButtons.style.display = 'none';
        return;
    }
    
    actionButtons.style.display = 'flex';
    
    list.innerHTML = daftarTamu.map(tamu => `
        <div class="tamu-item">
            <div class="tamu-info">
                <div class="tamu-name">${tamu.nama}</div>
                <div class="tamu-phone">${formatPhone(tamu.phone)}</div>
            </div>
            <div class="tamu-actions">
                <button class="btn-icon btn-send" onclick="sendToTamu(${tamu.id})">Kirim</button>
                <button class="btn-icon btn-delete" onclick="deleteTamu(${tamu.id})">Hapus</button>
            </div>
        </div>
    `).join('');
}

function formatPhone(phone) {
    if (phone.startsWith('62')) {
        return phone.replace(/^62/, '0');
    }
    return phone;
}

function saveTamu() {
    localStorage.setItem('daftarTamu', JSON.stringify(daftarTamu));
}

function deleteTamu(id) {
    if (confirm('Hapus tamu ini?')) {
        daftarTamu = daftarTamu.filter(t => t.id !== id);
        saveTamu();
        renderTamu();
        showToast('Tamu berhasil dihapus', 'success');
    }
}

// Broadcast
function sendToTamu(id) {
    const tamu = daftarTamu.find(t => t.id === id);
    if (!tamu) return;
    
    let pesan = templatePesan || document.getElementById('templatePesan').value;
    pesan = pesan.replace(/\[Nama Tamu\]/g, tamu.nama);
    pesan = pesan.replace(/\[Nama Mempelai\]/g, weddingInfo.namaMempelai || '');
    pesan = pesan.replace(/\[Alamat\]/g, weddingInfo.alamat || '');
    pesan = pesan.replace(/\[Link Maps\]/g, weddingInfo.linkMaps || '');
    pesan = pesan.replace(/\[Link Undangan\]/g, weddingInfo.linkUndangan || '');
    
    const phone = tamu.phone.startsWith('62') ? tamu.phone : '62' + tamu.phone.replace(/^0/, '');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(pesan)}`;
    
    window.open(url, '_blank');
    
    tamu.status = 'sent';
    saveTamu();
    showToast(`Pesan terkirim ke ${tamu.nama}`, 'success');
}

function broadcastAll() {
    if (daftarTamu.length === 0) {
        showToast('Belum ada tamu', 'error');
        return;
    }
    
    if (!confirm(`Kirim ke semua ${daftarTamu.length} tamu?`)) return;
    
    daftarTamu.forEach((tamu, index) => {
        setTimeout(() => {
            sendToTamu(tamu.id);
        }, index * 1000);
    });
    
    showToast(`Mengirim ke ${daftarTamu.length} tamu...`, 'info');
}

function clearAll() {
    if (confirm('Hapus semua tamu? Tindakan ini tidak bisa dibatalkan.')) {
        daftarTamu = [];
        saveTamu();
        renderTamu();
        showToast('Semua tamu berhasil dihapus', 'success');
    }
}

// Toast Notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    
    // Add CSS for toast animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
        @keyframes slideUp {
            from {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            to {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
        }
    `;
    document.head.appendChild(style);
});
