const admin = require("firebase-admin");
const moment = require('moment-timezone');
moment.locale('pt-BR')

module.exports = () => {
    const serviceAccount = {"type": "service_account",
  "project_id": `${process.env.PRIVATE_ID}`,
  "private_key_id": `${process.env.PRIVATE_KEY_ID}`,
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDvuuK3AdP3i+o4\nBDQ+GfFm6Vo8sEv+34mxPY3kuOdjiddahgdqXOotrs/NR2RsKgjAN//2Gbi/t1dI\nOusLNP5jsx4MCytB+uIwoAXTPD/2uostV65xT3iJyPwwgv/Sb9BAhhIsLyg3qUyJ\nVwET8ZFaraIOYubVyGdCLevb8IMV0ayV9RBsR/2Mtr5PSrBhZqwx811D2l5YubGp\nu/UuDTum04P1xBMR+j4GLttk3PCAZhsO2umVkgNQpk34tfmCFiTuHekKKadA6FPZ\nr75f9CI9MTtUCvJsFatIvwgJLqZzK5fYCFFeGXDLqXq7ckET/hQ9z4zWLiUIaf9/\ngdWj8n/tAgMBAAECggEAAMqIgn6Q0bhYt9DQCzjVNXMLPMHUmQqNgeeyLRSSucmz\n7IVmtqib5FBlTIz6M3rs2l2LGZp8Lcejmm9K1Fyc8tI0vL5PQb/lkZxIC+wICA9Q\nq40MPqnlX/dxgLJAcLNSbpgu+7vVPDjDwm+N6oKZmr2/slGI4Tr3PBE3MOWF0DL/\nsZzgUkenRsziBJhnpULsjrGVPg1bAX6jQOuCDyia5ZqNIijwzoX6I5C1iTcnhVnl\nhcl0iZ49z6gfGe5B2YHXhw33GPnhds3qsP6gQHKAiYQgvWBpS3PK6kyggln36Pt3\nDlZ2tIqKfVSDYZ5GxjyIJpbws+G9B3V5ZQn3p3F9LQKBgQD527UOvd3uPyFbohbD\nfI4zn7AXm9COwiLLsCN70TgBn4TWPvbzwIV+NQBohpkEjMcpfX+UD7dGhmxGqc+p\nu+S4k5eXegPwkt7As7NqufCp/NirHr8G3YZUqfoxDjpDAd0gZNlgI5U9ubtGMZ8X\nWKp01fuym4Kk5XAcPS7v0hqsBwKBgQD1n3G0zX3q5IGR2cWPz86ErZfuthxoReLz\nAK0TavqNRgaTQc5vvfgrOF5ICwDL8PjOjfvdQEgBGzgCJc6BGSPJEr2ttq/Uha09\novwYiBOale8hBEEzftON7hF8r11keN/ywGKL8h0vu328n2n94FMiT91uTcD44I1B\n29wEWdpfawKBgFdud2QKMp/M/YpIJPkRG92aso8AWjGqY2ytXS1Vn+iJfn1OGTJg\nmxX3zAXHm8II1SSCouMXwMVwAnGTuHQnqLiiBPjfnINRkZsTBuSA3mNNdDAlGSl4\n2SnFNSR3WxHZlBxizeIjcXThClRcxtPvle4+ds4gNs4m710iV8tZ1TV/AoGAa3wN\nnyg5jPvX84JP4QH4BrmMfgq1XbAPg3VtR80NvZrCL9ihRObl3cv5/h7Kh3R4/LLH\nX+fMWqeVl+MBfh8JOOl5lbYXNbIVwJ49IWMS6RfpoBIjkixS2Y4vmteGz/vRTIKB\n3Wni+ctbV5qPIGj1GFPIu4dNBdwGFKbongLP++cCgYB3Na+emWtF9ZmSJhGYVJXW\neY/Y7CtG0Y6AgcXtrn9YFakXq3JH9TkfNazpHRZpEExLJtMlnL/wykS/dOkYnnS8\nfrmbD5kaxC2FNURe82/ranOGTMAVKTDjQsFEuKehAa4860/2/XJB7au3Y4mN8/a9\nk94ruPVrjItnQYMMLvaw/g==\n-----END PRIVATE KEY-----\n",
  "client_email": `${process.env.CLIENT_EMAIL}`,
  "client_id": `${process.env.CLIENT_ID}`,
  "auth_uri": `${process.env.AUTH_URI}`,
  "token_uri": `${process.env.TOKEN_URI}`,
  "auth_provider_x509_cert_url": `${process.env.AUTH_PROVIDER_X509_CERT_URL}`,
  "client_x509_cert_url": `${process.env.CLIENT_X509_CERT_URL}`
}


  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `${process.env.DATABASE_URL}`
    })
    console.log(`[${moment().tz("America/Sao_Paulo").calendar()}] Firebase Realtime Database foi Conectado com Sucesso!`);
    return admin.database();
  } catch (error) {    
console.log(`[${moment().tz("America/Sao_Paulo").calendar()}] Ocorreu um Erro ao Conectar ao Firebase Realtime Database:\n${error}`);
    return null
  };
}