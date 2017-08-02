#!/bin/bash
echo "Eliminando módulos de Node"
rm -rf node_modules
echo "Limpiando elementos inecesarios"
rm -rf lib/fontAwesome/src lib/fontAwesome/scss lib/fontAwesome/less
rm -rf lib/pace/docs lib/pace/templates
rm -rf lib/typedjs/docs lib/typedjs/src
rm -rf lib/vex/docs lib/vex/sass lib/vex/src lib/vex/test
echo "Limpiando enlaces simbólicos"
unlink fonts
echo "Creando directorio para FTP"
mkdir .travis/ftp
echo "Montando FTP con fuse"
sudo curlftpfs -o allow_other,user=$FTP_USER:$FTP_PASSWORD ftp://victor.zona.digital .travis/ftp
echo "Moviendo elementos al FTP"
mv -v lib/fontAwesome/fonts .travis/ftp/public_html
echo "Copiando los archivos al FTP"
cp -rv * .travis/ftp/public_html
echo "Desmontando FTP"
sudo umount .travis/ftp
echo "Copia terminada"
exit 0
