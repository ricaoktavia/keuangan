Skenario 1: Proses E-Planning (Input Anggaran)
Aktor: Pegawai Pemerintah (Admin/Eksekutif)

Login: User masuk ke dashboard menggunakan akun instansi.

Input Program: User memilih kategori (misal: Infrastruktur) dan menginput nama program "Pembangunan Jembatan Madura".

Cek Duplikasi: Sistem secara otomatis mengecek apakah kode rekening program tersebut sudah terdaftar di tahun anggaran yang sama (Mencegah Anggaran Ganda).

Detail Item: User memasukkan rincian (Semen, Besi, Tenaga Kerja) dengan harga satuan. Jika harga satuan melebihi standar harga daerah, sistem memberikan warning.

Submit for Approval: Data dikirim ke status "Diajukan".

Skenario 2: Proses E-Controlling (Validasi DPRD)
Aktor: Anggota DPRD

Review: DPRD melihat daftar pengajuan anggaran yang masuk.

Approval: DPRD memberikan status "Approved" pada program yang masuk akal.

Locking Data: Setelah disetujui, pagu anggaran terkunci. Tidak ada user yang bisa menaikkan anggaran secara sepihak tanpa melalui revisi resmi (Mencegah Penyalahgunaan Wewenang).

Skenario 3: Realisasi & Upload Bukti (Anti-Fiktif)
Aktor: Pelaksana Lapangan

Input Realisasi: Pelaksana menginput penggunaan dana (misal: Beli Semen Rp50jt).

Upload Bukti: Sistem mewajibkan upload file PDF/Foto kwitansi dan koordinat lokasi proyek.

Validation: Jika jumlah yang diinput melebihi sisa pagu di perencanaan, sistem akan menolak transaksi (Mencegah Markup).

Skenario 4: Transparansi Publik (Dashboard Masyarakat)
Aktor: Masyarakat Umum

Tanpa Login: Masyarakat membuka URL publik web E-Keuangan.

Visualisasi Data: Masyarakat melihat grafik "Anggaran vs Realisasi".

Download Laporan: Masyarakat bisa mengklik salah satu proyek dan melihat detail pengeluaran serta foto bukti fisiknya.

Fitur Aduan: Jika masyarakat melihat di web anggaran jembatan sudah cair 100% tapi di lapangan jembatannya belum jadi, masyarakat bisa klik tombol "Laporkan Kejanggalan".

Skenario 5: Audit Trail (Keamanan)
Aktor: Auditor/Sistem

Tracking: Setiap ada perubahan data (misal: perubahan nominal), sistem mencatat: Siapa, Kapan, Data Sebelum, Data Sesudah.

Immutable Logs: Data di tabel audit_logs tidak bisa diubah atau dihapus oleh siapapun, termasuk admin utama.