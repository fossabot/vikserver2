#!/bin/bash
echo "Eliminando módulos de Node"
rm -rf node_modules
echo "Limpiando elementos inecesarios"
rm -rf lib/typedjs/docs lib/typedjs/src
rm -rf lib/vex/docs lib/vex/sass lib/vex/src lib/vex/test
rm -rf lib/socket.io/docs lib/socket.io/lib lib/socket.io/support lib/socket.io/test
rm -rf lib/js-sha256/src lib/js-sha256/tests
rm -rf lib/openpgp/src lib/openpgp/test
rm lib/openpgp/*
echo "Creando directorio para FTP"
mkdir .travis/ftp
echo "Montando FTP con fuse"
sudo curlftpfs -o allow_other,user=$FTP_USER:$FTP_PASSWORD ftp://victor.zona.digital .travis/ftp
echo "Copiando los archivos al FTP"
mkdir /tmp/rsync
rsync -rv --delete --temp-dir=/tmp/rsync * .travis/ftp/public_html
echo "Desmontando FTP"
sudo umount .travis/ftp
echo "Copia terminada"
exit 0
