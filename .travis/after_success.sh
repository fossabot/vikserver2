#!/bin/bash
echo "Creando directorio para FTP"
mkdir .travis/ftp
echo "Montando FTP con fuse"
sudo curlftpfs -o allow_other,user=$FTP_USER:$FTP_PASSWORD ftp://victor.zona.digital .travis/ftp
echo "Copiando los archivos al FTP"
cp -urv * .travis/ftp/public_html
#cp -urv * .travis/ftp/public_shtml # Creo que no hará falta copiar a este directorio
echo "Desmontando FTP"
sudo umount .travis/ftp
echo "Copia terminada"
exit 0
