const fs = require('fs');
const prompt = require('prompt-sync')();

let users = [];
let login_benar = 0;

try {
  const data = fs.readFileSync('data_login.json', 'utf-8');
  users = JSON.parse(data);
} catch (err) {
  console.error('Gagal membaca file data_login.json:', err.message);
  process.exit(1);
}

console.log('\n..:: Aplikasi Penabung Harian Pintar Mahasiswa ::..');
console.log('.............::::::::: Login :::::::::.............\n');

while (!login_benar) {

  const inputUsername = prompt('Username: ');
  const inputPassword = prompt.hide('Password: ');

  const userFound = users.find(
    user => user.username === inputUsername && user.password === inputPassword
  );

  if (userFound) {
    console.log('\nLogin Berhasil!');
    halamanUtama(userFound);
    login_benar = 1;

  } else {
    console.log('\nLogin Gagal. Username atau password salah. Coba Lagi\n');
  }
}

function halamanUtama(user) {
  console.log('\n..:: MENU ::..');
  console.log('1. Lihat Tabungan');
  console.log('2. Tambah Tabungan');
  console.log('3. Transfer antar Rekening');
  console.log('4. Hapus Tabungan\n');

  const pilihan = prompt('Pilih menu (1-4): ');

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  });

  let user_sekarang = JSON.parse(fs.readFileSync('data_login.json', 'utf-8'));
  let user_tranfer = JSON.parse(fs.readFileSync('data_login.json', 'utf-8'));
  let case_benar = 0;
  const data_login_user = user_sekarang.findIndex (u => u.username === user.username);

  switch (pilihan) {
    case '1':
      console.log(`\nJumlah tabungan Anda saat ini: ${formatter.format(user.tabungan)}\n`);
      kembali_halamanUtama(user);
      
    case '2':
      console.log('\n.:: Selamat datang di menu hapus tabungan ::.\n');
      const tambah_tabungan = parseInt(prompt('Masukan Jumlah yang ingin ditabung (cth 1xxx) : ')); 
      user.tabungan += tambah_tabungan;

      try {
          if (data_login_user !== -1 && !isNaN(tambah_tabungan) && !(tambah_tabungan < 0)) {
            user_sekarang[data_login_user].tabungan = user.tabungan;
            fs.writeFileSync('data_login.json', JSON.stringify(user_sekarang, null, 2), 'utf-8');
            console.log ('\nTerimakasih sudah menabung!');
            console.log(`\nJumlah tabungan kamu sekarang: ${formatter.format(user.tabungan)}\n`);
            kembali_halamanUtama(user);
          }
          else {
            console.log ('\nUser tidak ditemukan\n');
        }
        
      } catch (err) {
        console.error('\nTabungan gagal di tambahkan, Coba lagi! \n');
      }

      break;

    case '3' :

      while(!case_benar) {
        console.log('\n.:: Selamat datang di menu tranfer tabungan antar sesama ::.\n');
        const input_user_transfer = prompt('Masukan Username Rekening Tujuan (cth 1024xxxx) : ');
        const transfer_tabungan = parseInt(prompt('Masukan Jumlah yang ingin di transfer (cth 1xxx) : '));
        const transfer_tabungan_tujuan = (transfer_tabungan)
        const data_login_transfer = user_tranfer.findIndex (u => u.username === input_user_transfer);
        
        try {

          if (data_login_user !== -1 && !isNaN(transfer_tabungan) && !(transfer_tabungan < 0)) {
            user.tabungan -= transfer_tabungan;
            user_sekarang[data_login_user].tabungan = user.tabungan;

            user_sekarang[data_login_transfer].tabungan += transfer_tabungan;
            fs.writeFileSync('data_login.json', JSON.stringify(user_sekarang, null, 2), 'utf-8');
            console.log ('\nTabungan berhasil di transfer!');
            console.log(`\nJumlah tabungan kamu sekarang: ${formatter.format(user.tabungan)}\n`);
            kembali_halamanUtama(user);
            case_benar = 1;
          }
          else if (data_login_user == -1) {
            console.log ('\nRekening penerima tidak ditemukan, silahkan input lagi\n');
          }
          else {
            ('\nUser Tidak ditemukan')
          }

        } catch (err) {
          console.error('\nTabungan gagal di transfer, Coba lagi! \n');
        }
      }

    case '4' :
      console.log('\n.:: Selamat datang di menu hapus tabungan ::.\n');
      const kurangi_tabungan = parseInt(prompt('Masukan Jumlah yang ingin ditarik (cth 1xxx) : '));

      user.tabungan -= kurangi_tabungan;

      try {

        if (data_login_user !== -1 && !isNaN(kurangi_tabungan) && !(kurangi_tabungan < 0)) {
          user_sekarang[data_login_user].tabungan = user.tabungan;
          fs.writeFileSync('data_login.json', JSON.stringify(user_sekarang, null, 2), 'utf-8');
          console.log ('\nTabungan sudah di tarik!');
          console.log(`\nJumlah tabungan kamu sekarang: ${formatter.format(user.tabungan)}\n`);
          kembali_halamanUtama(user);
        }
        else {
          console.log ('\nUser tidak ditemukan\n');
        }
        
      } catch (err) {
        console.error('\nTabungan gagal di tarik, Coba lagi! \n');
      }

      break;
 


    default:
      console.log('\nMenu belum tersedia.');
  }
}

function kembali_halamanUtama(user) {
  const pilihan_kembali = prompt('Apakah anda ingin transaksi lagi?(y/n) : ').toLowerCase();

  if (pilihan_kembali === 'y') {
  console.log('\nKembali ke menu utama!');
  halamanUtama(user);
  } else if (pilihan_kembali === 'n') {
    console.log('\nTerimakasih silahkan datang lagi!');
    process.exit();
  } else {
    console.log('Masukan input yang benar!');
    process.exit(1);
  }
}