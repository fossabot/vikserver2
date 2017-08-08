#!/bin/bash
echo "Eliminando módulos de Node"
rm -rf node_modules
echo "Limpiando elementos inecesarios"
rm -rf lib/fontAwesome/src lib/fontAwesome/scss lib/fontAwesome/less
rm -rf lib/pace/docs lib/pace/templates lib/pace/themes/green lib/pace/themes/orange lib/pace/themes/pink lib/pace/themes/purple lib/pace/themes/red lib/pace/themes/silver lib/pace/themes/white lib/pace/themes/yellow
rm -rf lib/typedjs/docs lib/typedjs/src
rm -rf lib/vex/docs lib/vex/sass lib/vex/src lib/vex/test
rm -rf lib/socket.io/docs lib/socket.io/lib lib/socket.io/support lib/socket.io/test
rm -rf lib/js-sha256/src lib/js-sha256/tests
rm -rf lib/openpgp/src lib/openpgp/test
rm lib/openpgp/*
for i in $(ls lib/materialize |grep -v dist); do
	rm -rf lib/materialize/$i
done
echo "Creando directorio para FTP"
mkdir .travis/ftp
echo "Montando FTP con fuse"
sudo curlftpfs -o allow_other,user=$FTP_USER:$FTP_PASSWORD ftp://victor.zona.digital .travis/ftp
echo "Copiando los archivos al FTP"
#cp -rvu * .travis/ftp/public_html
mkdir /tmp/rsync
rsync -rv --delete --temp-dir=/tmp/rsync * .travis/ftp/public_html
echo "Desmontando FTP"
sudo umount .travis/ftp
echo "Copia terminada"
exit 0
